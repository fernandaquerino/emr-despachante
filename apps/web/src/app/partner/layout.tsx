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
import { getPartnerNavGroups } from "../../lib/nav-config/partner";

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const session = getMockSession("partner");
  const navGroups = getPartnerNavGroups(session);

  return (
    <AppShell
      variant="sidebar"
      logo={<Logo variant="full" size="sm" />}
      logoCollapsed={<Logo variant="mark" size="sm" />}
      navGroups={navGroups}
      activePath={pathname}
      linkAs={Link}
      contentMaxWidth="1440"
      headerLeft={<Breadcrumb items={[{ label: "Painel do parceiro" }]} />}
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
            { label: "Minha conta", href: "/partner/conta" },
            { label: "Configurações", href: "/partner/configuracoes" },
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
