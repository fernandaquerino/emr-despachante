import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell, Sparkles } from "lucide-react";
import { HeaderIconButton } from "./HeaderIconButton";

const meta: Meta<typeof HeaderIconButton> = {
  title: "Layout/HeaderIconButton",
  component: HeaderIconButton,
  args: { icon: Bell, label: "Notificações" },
};
export default meta;

type Story = StoryObj<typeof HeaderIconButton>;

export const Default: Story = {};
export const WithBadge: Story = { args: { badge: true } };
export const Copilot: Story = { args: { icon: Sparkles, label: "Copilot", badge: false } };
