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
  test("ブログ記事でコンソールエラーが発生しない", async ({ page, baseURL }) => {
    const origin = new URL(baseURL ?? "http://127.0.0.1:3000").origin;
    const errorMessages: string[] = [];

    page.on("console", (message) => {
      if (message.type() !== "error") {
        return;
      }

      // 記事ページは Prism の CSS や Cloudinary の画像、Vercel Analytics など
      // 外部オリジンのリソースを読み込む。これらの取得失敗はハイドレーションとは
      // 無関係なので検証対象から外し、外部通信ができない環境でも結果を安定させる。
      const source = message.location().url;
      if (source && !source.startsWith(origin)) {
        return;
      }

      errorMessages.push(message.text());
    });

    await page.goto("/blog/explore-theme-trip");
    expect(errorMessages).toEqual([]);
  });
});
