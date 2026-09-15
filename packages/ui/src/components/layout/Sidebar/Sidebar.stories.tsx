import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileText, FolderClosed, LayoutDashboard, Receipt, Users } from "lucide-react";
import { Badge } from "../../base/Badge";
import { Logo } from "../Logo";
import { SidebarFooter } from "../SidebarFooter";
import { Sidebar } from "./Sidebar";

const meta: Meta<typeof Sidebar> = {
  title: "Layout/Sidebar",
  component: Sidebar,
  args: {
    logo: <Logo variant="full" size="sm" />,
    logoCollapsed: <Logo variant="mark" size="sm" />,
    activePath: "/admin/solicitacoes",
    groups: [
      {
        title: "Operação",
        items: [
          { label: "Visão geral", href: "/admin", icon: LayoutDashboard },
          { label: "Solicitações", href: "/admin/solicitacoes", icon: FileText },
          {
            label: "Casos",
            href: "/admin/casos",
            icon: Users,
            badge: <Badge tone="error">3</Badge>,
          },
        ],
      },
      {
        title: "Financeiro",
        items: [
          { label: "Pedidos", href: "/admin/financeiro/pedidos", icon: Receipt },
          { label: "Pagamentos", href: "/admin/financeiro/pagamentos", icon: Receipt },
        ],
      },
    ],
    footer: (collapsed: boolean) => <SidebarFooter name="Fernanda Querino" collapsed={collapsed} />,
    onToggleCollapse: () => {},
  },
  decorators: [
    (Story) => (
      <div className="h-[600px]">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Sidebar>;

export const Expanded: Story = {};

export const Collapsed: Story = {
  args: { collapsed: true },
};

export const WithToggle: Story = {
  args: { onToggleCollapse: () => {} },
};

export const Dense: Story = {
  args: { density: "dense" },
};

export const SingleGroupNoTitle: Story = {
  args: {
    groups: [
      {
        items: [
          { label: "Minha área", href: "/owner", icon: LayoutDashboard },
          { label: "Documentos", href: "/owner/documentos", icon: FolderClosed },
        ],
      },
    ],
  },
};
