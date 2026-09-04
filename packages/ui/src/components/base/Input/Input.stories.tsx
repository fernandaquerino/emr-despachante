import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "Base/Input",
  component: Input,
  args: { label: "Placa do veículo", placeholder: "ABC1D23" },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const WithHint: Story = {
  args: { hint: "Formato Mercosul ou antigo, sem espaços." },
};

export const WithError: Story = {
  args: { error: "Placa inválida.", defaultValue: "AAA-000" },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "ABC1D23" },
};

export const HiddenLabel: Story = {
  args: { hideLabel: true },
};
