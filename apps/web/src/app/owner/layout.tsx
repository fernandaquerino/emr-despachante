"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { AppShell, HeaderIconButton, Logo, SearchPlaceholder, UserMenu } from "@emr/ui";
import { getMockSession } from "../../lib/mock-session";
import { getOwnerNavGroups } from "../../lib/nav-config/owner";

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const session = getMockSession("owner");
  const navGroups = getOwnerNavGroups();

  return (
    <AppShell
      variant="minimal"
      logo={<Logo variant="full" size="sm" />}
      navGroups={navGroups}
      activePath={pathname}
      linkAs={Link}
      contentMaxWidth="1024"
      headerLeft={<span className="text-h4 text-text">Minha área</span>}
      headerSearch={
        <SearchPlaceholder
          placeholder="Consultar veículo"
          onClick={() => console.log("busca: fora de escopo desta issue")}
        />
      }
      headerActions={
        <HeaderIconButton
          icon={Sparkles}
          label="Copilot"
          onClick={() => console.log("copilot: fora de escopo desta issue")}
        />
      }
      userMenu={
        <UserMenu
          name={session.name}
          avatarSrc={session.avatarSrc}
          linkAs={Link}
          items={[
            { label: "Minha conta", href: "/owner/conta" },
            { label: "Configurações", href: "/owner/configuracoes" },
            {
              label: "Sair",
              destructive: true,
              onSelect: () => console.log("logout: fora de escopo desta issue"),
            },
          ]}
        />
      }
    >
      {children}
    </AppShell>
  );
}
