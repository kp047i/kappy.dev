import { Meta, StoryObj } from "@storybook/nextjs";
import { expect, within } from "storybook/test";

import { BlogCategoryTab } from "./BlogCategoryTab";

const meta: Meta<typeof BlogCategoryTab> = {
  component: BlogCategoryTab,
};

export default meta;
type Story = StoryObj<typeof BlogCategoryTab>;

const defaultArgs = {
  selectedCategory: "tech",
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
