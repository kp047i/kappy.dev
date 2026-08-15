import type { StorybookConfig } from "@storybook/nextjs-vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// Next.js 16 で削除された `next/config` を @storybook/nextjs-vite が
// 静的 import しているため、スタブに差し替える (next-config-stub.ts を参照)。
const nextConfigAlias = {
  find: /^next\/config$/,
  replacement: path.join(dirname, "next-config-stub.ts"),
};

const config: StorybookConfig = {
  stories: [
    "../app/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)",
    "../components/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)",
    "../features/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@chromatic-com/storybook",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-vitest",
  ],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
  staticDirs: ["../public"],
  viteFinal: (viteConfig) => {
    // フレームワークが設定済みのエイリアスを壊さないよう、配列形式に揃えて先頭に足す。
    const existing = viteConfig.resolve?.alias;
    const normalized = Array.isArray(existing)
      ? existing
      : existing
        ? Object.entries(existing).map(([find, replacement]) => ({
            find,
            replacement: replacement as string,
          }))
        : [];

    return {
      ...viteConfig,
      resolve: {
        ...viteConfig.resolve,
        alias: [nextConfigAlias, ...normalized],
      },
    };
  },
};

export default config;
