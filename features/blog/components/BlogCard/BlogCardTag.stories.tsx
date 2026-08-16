import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import BlogCardTag from "./BlogCardTag";

const meta: Meta<typeof BlogCardTag> = {
  title: "blog/components/BlogCardTag",
  component: BlogCardTag,
};

export default meta;

type Story = StoryObj<typeof BlogCardTag>;

export const Default: Story = {
  args: {
    tag: "react",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const link = canvas.getByRole("link", { name: /react/ });

    await expect(link).toHaveAttribute("href", "/blog?tag=react");
  },
};
