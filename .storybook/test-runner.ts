import type { TestRunnerConfig } from "@storybook/test-runner";

const config: TestRunnerConfig = {
  async postVisit(page, _context) {
    // the #storybook-root element wraps the story. In Storybook 6.x, the selector is #root
    const elementHandler = await page.$("#storybook-root");

    if (elementHandler === null) {
      throw new Error("Unable to find the #storybook-root element");
    }

    const cleanedHTML = await elementHandler.evaluate((root) => {
      const clone = root.cloneNode(true) as HTMLElement;
      clone.querySelectorAll("script").forEach((script) => script.remove());
      return clone.innerHTML;
    });

    // @ts-expect-error jest-dom matcher is provided by the test runner runtime
    expect(cleanedHTML).toMatchSnapshot();
  },
};

export default config;
