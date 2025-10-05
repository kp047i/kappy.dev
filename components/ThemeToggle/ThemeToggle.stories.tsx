import { Meta, StoryObj } from "@storybook/nextjs";
import { expect, within } from "storybook/test";

import { ThemeToggle } from "./ThemeToggle";

const meta: Meta<typeof ThemeToggle> = {
  title: "Components/ThemeToggle",
  component: ThemeToggle,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof ThemeToggle>;

export const LightMode: Story = {
  render: () => <ThemeToggle />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const lightButton = await canvas.findByRole("button", {
      name: "ライトモードに切り替える",
    });

    await expect(lightButton).toHaveAttribute("aria-pressed", "true");
  },
};

export const DarkMode: Story = {
  render: () => <ThemeToggle />,
  globals: {
    theme: "dark",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const darkButton = await canvas.findByRole("button", {
      name: "ダークモードに切り替える",
    });
    await expect(darkButton).toHaveAttribute("aria-pressed", "true");
  },
};
