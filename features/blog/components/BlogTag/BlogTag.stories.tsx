import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import { BlogTag } from "./BlogTag";

const meta: Meta<typeof BlogTag> = {
  title: "blog/components/BlogTag",
  component: BlogTag,
};

export default meta;

type Story = StoryObj<typeof BlogTag>;

export const Default: Story = {
  args: {
    tag: "nextjs",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // key ではなく TAGS に定義された label が表示される
    const link = canvas.getByRole("link", { name: "#Next.js" });

    await expect(link).toHaveAttribute("href", "/blog?tag=nextjs");
  },
};

export const MediumSize: Story = {
  args: {
    tag: "typescript",
    size: "md",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByRole("link", { name: "#TypeScript" })
    ).toBeVisible();
  },
};

export const UnknownTag: Story = {
  args: {
    tag: "not-a-defined-tag",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // TAGS に無いタグは key をそのまま表示する
    await expect(
      canvas.getByRole("link", { name: "#not-a-defined-tag" })
    ).toBeVisible();
  },
};
