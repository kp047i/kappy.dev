import { expect, test } from "@playwright/test";

test.describe("テーマの初期化", () => {
  test("システム設定に合わせたテーマクラスを付与する", async ({
    page,
  }, testInfo) => {
    await page.goto("/");
    const html = page.locator("html");
    const expected = testInfo.project.name.includes("dark") ? /dark/ : /light/;
    await expect(html).toHaveClass(expected);

    const colorScheme = await page.evaluate(
      () => document.documentElement.style.colorScheme
    );
    expect(colorScheme).toBe(
      testInfo.project.name.includes("dark") ? "dark" : "light"
    );
  });
});

test.describe("テーマトグル", () => {
  test("ライトモードからダークモードへの切り替えを記憶する", async ({
    page,
  }, testInfo) => {
    if (!testInfo.project.name.includes("light")) {
      test.skip();
    }

    await page.addInitScript(() => {
      window.localStorage.removeItem("theme");
    });

    await page.goto("/");

    const darkButton = page.getByRole("button", {
      name: "ダークモードに切り替える",
    });
    await darkButton.click();

    await expect(page.locator("html")).toHaveClass(/dark/);

    const storedTheme = await page.evaluate(() =>
      window.localStorage.getItem("theme")
    );
    expect(storedTheme).toBe("dark");

    await page.reload();
    await expect(page.locator("html")).toHaveClass(/dark/);

    const colorScheme = await page.evaluate(
      () => document.documentElement.style.colorScheme
    );
    expect(colorScheme).toBe("dark");
  });
});

test.describe("ハイドレーション安定性", () => {
  test("ブログ記事でコンソールエラーが発生しない", async ({ page }) => {
    const errorMessages: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") {
        errorMessages.push(message.text());
      }
    });

    await page.goto("/blog/explore-theme-trip");
    expect(errorMessages).toEqual([]);
  });
});
