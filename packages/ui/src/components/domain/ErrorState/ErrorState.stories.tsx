import type { Meta, StoryObj } from "@storybook/react-vite";
import { ErrorState } from "./ErrorState";

const meta: Meta<typeof ErrorState> = {
  title: "Domain/ErrorState",
  component: ErrorState,
  args: {
    context: "os dados deste veículo",
    onRetry: () => console.log("retry"),
  },
};

export default meta;
type Story = StoryObj<typeof ErrorState>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: { description: "O serviço do DETRAN não respondeu a tempo." },
};

export const Retrying: Story = {
  args: { retrying: true },
};
