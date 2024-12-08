import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: [
    "../app/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)",
    "../components/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)",
    "../features/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  staticDirs: ["../public"],
};
export default config;
