#!/usr/bin/env node
import { spawn } from 'node:child_process';
import process from 'node:process';
import { setTimeout as delay } from 'node:timers/promises';

const PNPM_CMD = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const DEFAULT_URL = 'http://127.0.0.1:6006';

const rawArgs = process.argv.slice(2);

function parseRunnerArgs(args) {
  const parsed = [];
  let url = DEFAULT_URL;
  let hasCustomUrl = false;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--url' || arg === '-u') {
      hasCustomUrl = true;
      parsed.push(arg);
      const value = args[index + 1];
      if (value === undefined) {
        throw new Error(`引数 ${arg} には URL を指定してください。`);
      }
      url = value;
      parsed.push(value);
      index += 1;
      continue;
    }
    if (arg.startsWith('--url=')) {
      hasCustomUrl = true;
      const [, candidate] = arg.split(/=(.+)/);
      if (!candidate) {
        throw new Error('引数 --url= には URL を指定してください。');
      }
      url = candidate;
      parsed.push(arg);
      continue;
    }
    parsed.push(arg);
  }

  if (!hasCustomUrl) {
    parsed.push('--url', url);
  }

  if (!parsed.some((value) => value === '--disable-telemetry')) {
    parsed.push('--disable-telemetry');
  }

  return { args: parsed, url };
}

function runPnpm(commandArgs, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(PNPM_CMD, commandArgs, {
      stdio: 'inherit',
      env: { ...process.env, ...options.env },
    });

    child.on('error', reject);
    child.on('exit', (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }
      const reason = signal ? `シグナル ${signal}` : `終了コード ${code}`;
      reject(new Error(`コマンド \"pnpm ${commandArgs.join(' ')}\" が ${reason} で終了しました。`));
    });
  });
}

async function isServerReady(url) {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'manual',
      signal: AbortSignal.timeout(1500),
    });
    return response.ok || (response.status >= 200 && response.status < 400);
  } catch (error) {
    return false;
  }
}

async function waitForServer(url, timeoutMs = 60000, intervalMs = 500) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (await isServerReady(url)) {
      return;
    }
    await delay(intervalMs);
  }
  throw new Error(`Storybook サーバー (${url}) の起動を ${timeoutMs}ms 以内に確認できませんでした。`);
}

async function startStorybook(url) {
  return new Promise((resolve, reject) => {
    const child = spawn(PNPM_CMD, ['run', 'storybook:ci'], {
      stdio: 'inherit',
      env: process.env,
    });

    let resolved = false;

    const handleExit = (code, signal) => {
      if (resolved) {
        return;
      }
      const reason = signal ? `シグナル ${signal}` : `終了コード ${code}`;
      reject(new Error(`Storybook サーバーが ${reason} で終了しました。`));
    };

    child.once('exit', handleExit);
    child.once('error', reject);

    waitForServer(url)
      .then(() => {
        resolved = true;
        child.removeListener('exit', handleExit);
        resolve(child);
      })
      .catch((error) => {
        child.removeListener('exit', handleExit);
        child.kill('SIGTERM');
        reject(error);
      });
  });
}

async function stopProcess(child) {
  if (!child) {
    return;
  }
  child.kill('SIGTERM');
  await delay(500);
  if (!child.killed) {
    child.kill('SIGKILL');
  }
}

async function main() {
  const { args: runnerArgs, url } = parseRunnerArgs(rawArgs);

  await runPnpm(['run', 'build-storybook', '--quiet']);

  let serverProcess;
  const reuseExisting = await isServerReady(url);

  if (reuseExisting) {
    console.log(`既存の Storybook インスタンス (${url}) を検出したため再利用します。`);
  } else {
    serverProcess = await startStorybook(url);
  }

  try {
    await runPnpm(['exec', 'test-storybook', ...runnerArgs]);
  } finally {
    await stopProcess(serverProcess);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
