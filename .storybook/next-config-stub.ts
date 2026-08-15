/**
 * Next.js 16 で削除された `next/config` (Runtime Configuration) の代替スタブ。
 *
 * `@storybook/nextjs-vite` は Next.js 16 対応を謳っているものの、内部の
 * preview モジュールが `import { setConfig } from "next/config"` を静的に
 * 残しているため、そのままだと Storybook のビルドと Vitest の依存最適化が
 * 解決エラーで落ちる (10.6.0-alpha 時点でも未修正)。
 *
 * このプロジェクトは App Router のみで Runtime Configuration を使っていないため、
 * 値を保持するだけの最小実装で十分。上流が修正されたらエイリアスごと削除できる。
 */
type RuntimeConfig = Record<string, unknown>;

let runtimeConfig: RuntimeConfig = {};

export function setConfig(config: RuntimeConfig | undefined): void {
  runtimeConfig = config ?? {};
}

export default function getConfig(): RuntimeConfig {
  return runtimeConfig;
}
