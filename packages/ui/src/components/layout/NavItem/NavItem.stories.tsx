import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileText, LayoutDashboard, Users } from "lucide-react";
import { Badge } from "../../base/Badge";
import { NavItem } from "./NavItem";

const meta: Meta<typeof NavItem> = {
  title: "Layout/NavItem",
  component: NavItem,
  args: {
    label: "Solicitações",
    href: "/admin/solicitacoes",
    icon: FileText,
  },
};
export default meta;

type Story = StoryObj<typeof NavItem>;

export const Default: Story = {};
export const Active: Story = { args: { isActive: true } };
export const WithBadge: Story = {
  args: { icon: Users, label: "Casos", badge: <Badge tone="error">3</Badge> },
};
export const Collapsed: Story = { args: { collapsed: true, icon: LayoutDashboard } };
export const CollapsedActive: Story = {
  args: { collapsed: true, isActive: true, icon: LayoutDashboard },
};
