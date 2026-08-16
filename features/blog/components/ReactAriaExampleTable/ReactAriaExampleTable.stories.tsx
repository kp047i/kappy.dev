import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";

import { ReactAriaExampleTable } from "./ReactAriaExampleTable";

const meta: Meta<typeof ReactAriaExampleTable> = {
  title: "blog/components/ReactAriaExampleTable",
  component: ReactAriaExampleTable,
};

export default meta;

type Story = StoryObj<typeof ReactAriaExampleTable>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByRole("grid", {
        name: "SelectionとPaginationの挙動を確認するテーブル",
      })
    ).toBeVisible();

    // 初期状態では何も選択されておらず、前ページへは戻れない
    await expect(canvas.getByText(/選択中: 0 \//)).toBeVisible();
    await expect(canvas.getByRole("button", { name: "前へ" })).toBeDisabled();
  },
};

export const Paginated: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const next = canvas.getByRole("button", { name: "次へ" });
    await userEvent.click(next);

    // 2 ページ目に進むと「前へ」が押せるようになる
    await expect(canvas.getByRole("button", { name: "前へ" })).toBeEnabled();
  },
};
