import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import { Footer } from "./Footer";

const meta: Meta<typeof Footer> = {
  title: "Components/Footer",
  component: Footer,
};

export default meta;

type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText(/2024 kappy/)).toBeVisible();
  },
};
