import { Meta, StoryObj } from "@storybook/nextjs";
import { expect, within } from "storybook/test";

import { BlogCategory } from "./BlogCategory";

const meta: Meta<typeof BlogCategory> = {
  component: BlogCategory,
};

export default meta;
type Story = StoryObj<typeof BlogCategory>;

const defaultArgs = {
  category: "tech",
};

export const Default: Story = {
  args: defaultArgs,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Tech")).toBeVisible();

    const link = canvas.getByText("Tech");
    const parent = link.parentElement;
    expect(parent).toHaveAttribute("href", "/blog?category=tech");
  },
};
