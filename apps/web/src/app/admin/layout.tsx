"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Sparkles } from "lucide-react";
import {
  AppShell,
  Breadcrumb,
  HeaderIconButton,
  Logo,
  SearchPlaceholder,
  SidebarFooter,
  UserMenu,
} from "@emr/ui";
import { getMockSession } from "../../lib/mock-session";
import { getAdminNavGroups } from "../../lib/nav-config/admin";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const session = getMockSession("admin");
  const navGroups = getAdminNavGroups();

  return (
    <AppShell
      variant="sidebar-dense"
      logo={<Logo variant="full" size="sm" />}
      logoCollapsed={<Logo variant="mark" size="sm" />}
      navGroups={navGroups}
      activePath={pathname}
      linkAs={Link}
      contentMaxWidth="1440"
      headerLeft={<Breadcrumb items={[{ label: "Painel administrativo" }]} />}
      headerSearch={
        <SearchPlaceholder
          placeholder="Buscar"
          onClick={() => console.log("busca: fora de escopo desta issue")}
        />
      }
      headerActions={
        <>
          <HeaderIconButton
            icon={Sparkles}
            label="Copilot"
            onClick={() => console.log("copilot: fora de escopo desta issue")}
          />
          <HeaderIconButton
            icon={Bell}
            label="Notificações"
            badge
            onClick={() => console.log("notificações: fora de escopo desta issue")}
          />
        </>
      }
      userMenu={
        <UserMenu
          name={session.name}
          avatarSrc={session.avatarSrc}
          linkAs={Link}
          items={[
            { label: "Minha conta", href: "/admin/conta" },
            { label: "Configurações", href: "/admin/configuracoes" },
            {
              label: "Sair",
              destructive: true,
              onSelect: () => console.log("logout: fora de escopo desta issue"),
            },
          ]}
        />
      }
      sidebarFooter={(collapsed) => (
        <SidebarFooter name={session.name} avatarSrc={session.avatarSrc} collapsed={collapsed} />
      )}
    >
      {children}
    </AppShell>
  );
}
