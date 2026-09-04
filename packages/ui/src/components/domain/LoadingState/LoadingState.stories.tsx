import type { Meta, StoryObj } from "@storybook/react-vite";
import { LoadingState } from "./LoadingState";

const meta: Meta<typeof LoadingState> = {
  title: "Domain/LoadingState",
  component: LoadingState,
};

export default meta;
type Story = StoryObj<typeof LoadingState>;

export const List: Story = {
  args: { variant: "list", count: 3 },
};

export const Card: Story = {
  args: { variant: "card", count: 4 },
};

export const TableRows: Story = {
  args: { variant: "table", count: 5 },
};

export const Text: Story = {
  args: { variant: "text" },
};
