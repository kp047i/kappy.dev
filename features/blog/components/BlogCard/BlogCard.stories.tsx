import { Meta, StoryObj } from "@storybook/nextjs";
import { within, expect } from "storybook/test";

import { BlogCard, BlogCardProps } from "./BlogCard";

const meta: Meta<typeof BlogCard> = {
  component: BlogCard,
};

export default meta;
type Story = StoryObj<typeof BlogCard>;

const defaultArgs: BlogCardProps = {
  metadata: {
    title: "Title",
    description: "Description",
    emoji: "📝",
    publishedAt: "2022-01-01",
    category: "tech",
    tags: ["react"],
    slug: "slug",
  },
};

export const Default: Story = {
  args: defaultArgs,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText(defaultArgs.metadata.title)).toBeVisible();
    await expect(canvas.getByText(defaultArgs.metadata.description)).toBeVisible();
    if (defaultArgs.metadata.emoji) {
      await expect(canvas.getByText(defaultArgs.metadata.emoji)).toBeVisible();
    }
    await expect(canvas.getByText(defaultArgs.metadata.publishedAt)).toBeVisible();

    const link = canvas.getByText("続きを読む");
    expect(link).toHaveAttribute("href", `/blog/${defaultArgs.metadata.slug}`);
  },
};
