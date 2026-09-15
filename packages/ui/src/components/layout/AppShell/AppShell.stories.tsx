import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell, FileText, FolderClosed, LayoutDashboard, Sparkles, Users } from "lucide-react";
import { Badge } from "../../base/Badge";
import { Breadcrumb } from "../Breadcrumb";
import { HeaderIconButton } from "../HeaderIconButton";
import { Logo } from "../Logo";
import { SearchPlaceholder } from "../SearchPlaceholder";
import { SidebarFooter } from "../SidebarFooter";
import { UserMenu } from "../UserMenu";
import { AppShell } from "./AppShell";

const meta: Meta<typeof AppShell> = {
  title: "Layout/AppShell",
  component: AppShell,
  args: {
    logo: <Logo variant="full" size="sm" />,
    logoCollapsed: <Logo variant="mark" size="sm" />,
    sidebarFooter: (collapsed: boolean) => (
      <SidebarFooter name="Fernanda Querino" collapsed={collapsed} />
    ),
    activePath: "/admin/solicitacoes",
    headerLeft: (
      <Breadcrumb items={[{ label: "Visão geral", href: "/admin" }, { label: "Solicitações" }]} />
    ),
    userMenu: <UserMenu name="Fernanda Querino" items={[{ label: "Sair", onSelect: () => {} }]} />,
    children: <p className="text-body text-text">Conteúdo da página.</p>,
  },
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof AppShell>;

export const AdminDense: Story = {
  args: {
    variant: "sidebar-dense",
    navGroups: [
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
    ],
    headerSearch: <SearchPlaceholder placeholder="Buscar (Ctrl+K)" />,
    headerActions: (
      <>
        <HeaderIconButton icon={Sparkles} label="Copilot" />
        <HeaderIconButton icon={Bell} label="Notificações" badge />
      </>
    ),
  },
};

export const PartnerWithSidebar: Story = {
  args: {
    variant: "sidebar",
    activePath: "/partner",
    navGroups: [
      {
        items: [
          { label: "Visão geral", href: "/partner", icon: LayoutDashboard },
          { label: "Solicitações", href: "/partner/solicitacoes", icon: FileText },
          { label: "Documentos", href: "/partner/documentos", icon: FolderClosed },
        ],
      },
    ],
    headerLeft: <Breadcrumb items={[{ label: "Visão geral" }]} />,
  },
};

export const OwnerMinimal: Story = {
  args: {
    variant: "minimal",
    activePath: "/owner",
    headerLeft: <Breadcrumb items={[{ label: "Minha área" }]} />,
  },
};
