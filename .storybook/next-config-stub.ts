/**
 * `next/config` のスタブ。
 *
 * Storybook のフレームワークパッケージがこのモジュールを静的 import するが、
 * 使用中の Next.js には存在せず、そのままでは Storybook のビルドと Vitest の
 * 依存最適化が解決エラーで落ちる。このプロジェクトは Runtime Configuration を
 * 使っていないため、値を保持するだけの実装で足りる。
 *
 * 背景と削除条件は AGENTS.md の「Storybook と Next.js 16 の互換パッチ」を参照。
 */
type RuntimeConfig = Record<string, unknown>;

let runtimeConfig: RuntimeConfig = {};

export function setConfig(config: RuntimeConfig | undefined): void {
  runtimeConfig = config ?? {};
}

export default function getConfig(): RuntimeConfig {
  return runtimeConfig;
}
