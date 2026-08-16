import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import { SpeakerDeck } from "./SpeakerDeck";

const meta: Meta<typeof SpeakerDeck> = {
  title: "blog/components/SpeakerDeck",
  component: SpeakerDeck,
};

export default meta;

type Story = StoryObj<typeof SpeakerDeck>;

export const Default: Story = {
  args: {
    dataId: "cab61282b00a43ed8c3e995a28ea0717",
    title: "越境体験がどう成長につながるか",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // title は iframe のアクセシブルネームになる
    const frame = canvas.getByTitle("越境体験がどう成長につながるか");

    await expect(frame).toHaveAttribute(
      "src",
      "https://speakerdeck.com/player/cab61282b00a43ed8c3e995a28ea0717"
    );
  },
};

export const DefaultTitle: Story = {
  args: {
    dataId: "cab61282b00a43ed8c3e995a28ea0717",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // title を渡さなくてもアクセシブルネームが空にならない
    await expect(canvas.getByTitle("SpeakerDeck Embed")).toBeVisible();
  },
};
