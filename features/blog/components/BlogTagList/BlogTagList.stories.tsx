import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import { BlogTagList } from "./BlogTagList";

const meta: Meta<typeof BlogTagList> = {
  title: "blog/components/BlogTagList",
  component: BlogTagList,
};

export default meta;

type Story = StoryObj<typeof BlogTagList>;

export const NoTagSelected: Story = {
  args: {
    selectedTag: "",
    selectedCategory: "",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 条件が空のときはクエリなしの /blog に戻る
    await expect(
      canvas.getByRole("link", { name: "すべてのタグ" })
    ).toHaveAttribute("href", "/blog");
    await expect(
      canvas.getByRole("link", { name: "#Next.js" })
    ).toHaveAttribute("href", "/blog?tag=nextjs");
  },
};

export const TagSelectedWithCategory: Story = {
  args: {
    selectedTag: "nextjs",
    selectedCategory: "tech",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // タグを外すリンクはカテゴリだけを残す
    await expect(
      canvas.getByRole("link", { name: "すべてのタグ" })
    ).toHaveAttribute("href", "/blog?category=tech");
    // 各タグのリンクはカテゴリを保ったままタグを差し替える
    await expect(canvas.getByRole("link", { name: "#MDX" })).toHaveAttribute(
      "href",
      "/blog?category=tech&tag=mdx"
    );
  },
};
