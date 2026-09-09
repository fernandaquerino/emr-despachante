import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileText, LayoutDashboard, Users } from "lucide-react";
import { Badge } from "../../base/Badge";
import { NavGroup } from "./NavGroup";

const meta: Meta<typeof NavGroup> = {
  title: "Layout/NavGroup",
  component: NavGroup,
  args: {
    title: "Operação",
    activePath: "/admin/solicitacoes",
    items: [
      { label: "Visão geral", href: "/admin", icon: LayoutDashboard },
      { label: "Solicitações", href: "/admin/solicitacoes", icon: FileText },
      { label: "Casos", href: "/admin/casos", icon: Users, badge: <Badge tone="error">3</Badge> },
    ],
  },
};
export default meta;

type Story = StoryObj<typeof NavGroup>;

export const Default: Story = {};

export const WithHiddenItem: Story = {
  args: {
    items: [
      { label: "Visão geral", href: "/admin", icon: LayoutDashboard },
      { label: "Solicitações", href: "/admin/solicitacoes", icon: FileText },
      { label: "Faturamento B2B", href: "/admin/financeiro/faturas", icon: FileText, hidden: true },
    ],
  },
};

export const Collapsed: Story = { args: { collapsed: true } };

export const WithoutTitle: Story = { args: { title: undefined } };
