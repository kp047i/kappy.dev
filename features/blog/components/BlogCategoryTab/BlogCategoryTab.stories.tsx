import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import { BlogCategoryTab } from "./BlogCategoryTab";

const meta: Meta<typeof BlogCategoryTab> = {
  component: BlogCategoryTab,
};

export default meta;
type Story = StoryObj<typeof BlogCategoryTab>;

const defaultArgs = {
  selectedCategory: "tech",
  selectedTag: "",
};

export const Default: Story = {
  args: defaultArgs,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const allLink = canvas.getByText("All");
    expect(allLink).toHaveAttribute("href", "/blog");

    const techLink = canvas.getByText("Tech");
    expect(techLink).toHaveAttribute("href", "/blog?category=tech");

    const lifeLink = canvas.getByText("Life");
    expect(lifeLink).toHaveAttribute("href", "/blog?category=life");

    const otherLink = canvas.getByText("Other");
    expect(otherLink).toHaveAttribute("href", "/blog?category=other");
  },
};

export const WithSelectedTag: Story = {
  args: {
    selectedCategory: "tech",
    selectedTag: "react",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const allLink = canvas.getByText("All");
    expect(allLink).toHaveAttribute("href", "/blog?tag=react");

    const techLink = canvas.getByText("Tech");
    expect(techLink).toHaveAttribute("href", "/blog?category=tech&tag=react");
  },
};
