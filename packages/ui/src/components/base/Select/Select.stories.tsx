import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select } from "./Select";

const options = [
  { value: "open", label: "Em aberto" },
  { value: "in_progress", label: "Em andamento" },
  { value: "resolved", label: "Resolvido" },
];

const meta: Meta<typeof Select> = {
  title: "Base/Select",
  component: Select,
  args: {
    label: "Status do case",
    placeholder: "Selecione um status",
    options,
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { defaultValue: "in_progress" },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "open" },
};

export const HiddenLabel: Story = {
  args: { hideLabel: true },
};
