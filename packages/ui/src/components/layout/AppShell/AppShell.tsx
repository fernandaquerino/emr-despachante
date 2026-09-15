"use client";

import { useState, type ElementType, type ReactNode } from "react";
import { Menu } from "lucide-react";
import { cn } from "../../../lib/cn";
import { Sidebar, type SidebarGroup } from "../Sidebar";
import { MobileNav } from "../MobileNav";
import { Header } from "../Header";
import { HeaderIconButton } from "../HeaderIconButton";

/**
 * Anatomia: docs/design-system/COMPONENTS.md §AppShell.
 * Container raiz: Sidebar + Header + Content (+ MobileNav no lugar da
 * Sidebar abaixo de 1024px). `variant="minimal"` é o layout do OWNER (sem
 * sidebar, header 64px — DESIGN_SYSTEM.md §14); `sidebar`/`sidebar-dense`
 * cobrem PARTNER/ADMIN.
 */
export interface AppShellProps {
  variant: "sidebar" | "sidebar-dense" | "minimal";
  logo: ReactNode;
  /** Renderizado na Sidebar quando colapsada (ex.: `Logo` variant="mark"). Cai de volta em `logo` se omitido. */
  logoCollapsed?: ReactNode;
  navGroups?: SidebarGroup[];
  activePath: string;
  linkAs?: ElementType;
  headerLeft: ReactNode;
  headerSearch?: ReactNode;
  headerActions?: ReactNode;
  userMenu: ReactNode;
  /** Perfil compacto + toggle de tema no rodapé da Sidebar/MobileNav (COMPONENTS.md §Sidebar). */
  sidebarFooter?: ReactNode | ((collapsed: boolean) => ReactNode);
  contentMaxWidth?: "1024" | "1440";
  children: ReactNode;
}

const maxWidthClasses = {
  "1024": "max-w-[1024px]",
  "1440": "max-w-[1440px]",
} as const;

export function AppShell({
  variant,
  logo,
  logoCollapsed,
  navGroups = [],
  activePath,
  linkAs,
  headerLeft,
  headerSearch,
  headerActions,
  userMenu,
  sidebarFooter,
  contentMaxWidth,
  children,
}: AppShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const hasSidebar = variant !== "minimal";
  const density = variant === "sidebar-dense" ? "dense" : "default";
  const resolvedMaxWidth = contentMaxWidth ?? (variant === "minimal" ? "1024" : "1440");

  return (
    <div className="flex min-h-screen bg-bg">
      {hasSidebar ? (
        <>
          <Sidebar
            logo={logo}
            logoCollapsed={logoCollapsed}
            groups={navGroups}
            activePath={activePath}
            linkAs={linkAs}
            footer={sidebarFooter}
            density={density}
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed((value) => !value)}
          />
          <MobileNav
            open={mobileNavOpen}
            onOpenChange={setMobileNavOpen}
            logo={logo}
            groups={navGroups}
            activePath={activePath}
            linkAs={linkAs}
            footer={sidebarFooter}
          />
        </>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          height={variant === "minimal" ? "tall" : "default"}
          left={
            hasSidebar ? (
              headerLeft
            ) : (
              // `variant="minimal"` não renderiza Sidebar, então a marca
              // não tem onde aparecer — sem isso o `logo` recebido fica
              // sem uso e a área OWNER perde toda identidade visual.
              <div className="flex min-w-0 items-center gap-3">
                {logo}
                <div className="h-5 w-px shrink-0 bg-border-subtle" aria-hidden="true" />
                {headerLeft}
              </div>
            )
          }
          searchSlot={headerSearch}
          actionsSlot={headerActions}
          userMenu={userMenu}
          mobileNavTrigger={
            hasSidebar ? (
              <HeaderIconButton
                icon={Menu}
                label="Abrir menu"
                onClick={() => setMobileNavOpen(true)}
              />
            ) : undefined
          }
        />
        <main className="flex-1 px-5 py-7 md:px-8">
          <div className={cn("mx-auto w-full", maxWidthClasses[resolvedMaxWidth])}>{children}</div>
        </main>
      </div>
    </div>
  );
}
