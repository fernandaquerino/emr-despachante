import type { Meta, StoryObj } from "@storybook/react-vite";
import { StaleDataBanner } from "./StaleDataBanner";

const meta: Meta<typeof StaleDataBanner> = {
  title: "Domain/StaleDataBanner",
  component: StaleDataBanner,
  args: {
    lastUpdatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    onRefresh: () => console.log("refresh"),
  },
};

export default meta;
type Story = StoryObj<typeof StaleDataBanner>;

export const Default: Story = {};

export const Refreshing: Story = {
  args: { refreshing: true },
};
