import type { TestRunnerConfig } from "@storybook/test-runner";

const config: TestRunnerConfig = {
  async postVisit(page, context) {
    // the #storybook-root element wraps the story. In Storybook 6.x, the selector is #root
    const elementHandler = await page.$("#storybook-root");

    if (elementHandler === null) {
      throw new Error("Unable to find the #storybook-root element");
    }

    const innerHTML = await elementHandler.innerHTML();

    // Remove theme-related scripts to make snapshots more stable across environments
    const cleanedHTML = innerHTML.replace(
      /<script nonce>[\s\S]*?<\/script>/g,
      "<script nonce><!-- theme script removed for stable snapshots --></script>"
    );

    // @ts-ignore
    expect(cleanedHTML).toMatchSnapshot();
  },
};

export default config;
