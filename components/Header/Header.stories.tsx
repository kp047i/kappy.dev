import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import { Header } from "./Header";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";

const meta: Meta<typeof Header> = {
  title: "Components/Header",
  component: Header,
};

export default meta;

type Story = StoryObj<typeof Header>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByRole("link", { name: /kappy\.dev/ })
    ).toHaveAttribute("href", "/");
    await expect(canvas.getByRole("link", { name: "Blog" })).toHaveAttribute(
      "href",
      "/blog"
    );
    await expect(canvas.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/about"
    );
  },
};

export const WithActionSlot: Story = {
  args: {
    actionSlot: <ThemeToggle />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // actionSlot に渡した要素がナビゲーションの一部として描画される
    await expect(
      await canvas.findByRole("button", { name: "ライトモードに切り替える" })
    ).toBeVisible();
  },
};
