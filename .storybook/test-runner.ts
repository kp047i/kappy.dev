import type { TestRunnerConfig } from "@storybook/test-runner";

const config: TestRunnerConfig = {
  async postVisit(page, context) {
    // the #storybook-root element wraps the story. In Storybook 6.x, the selector is #root
    const elementHandler = await page.$("#storybook-root");

    if (elementHandler === null) {
      throw new Error("Unable to find the #storybook-root element");
    }

    const innerHTML = await elementHandler.innerHTML();
    // @ts-ignore
    expect(innerHTML).toMatchSnapshot();
  },
};

export default config;
