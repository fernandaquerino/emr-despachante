"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { buttonVariants, cn, Logo } from "@emr/ui";
import { Container } from "./Container";
import { MobileMenu } from "./MobileMenu";
import { useScrolled } from "./lib/use-scrolled";
import { getPublicNavConfig } from "./public-nav";

/**
 * Header das páginas públicas (`/`, `/parceiros`). Layout e conteúdo de
 * marketing são específicos o bastante para não reaproveitar o `Header` de
 * `@emr/ui` (que exige `userMenu` e é pensado para o app shell autenticado)
 * — mas reusa `Logo`, `buttonVariants` e o `Drawer` por trás do
 * `MobileMenu` para não duplicar tokens/overlay. Compartilhado por
 * `layout.tsx`; o conteúdo (links/CTAs) varia por rota via `usePathname`.
 */
export function PublicHeader() {
  const pathname = usePathname();
  const { navLinks, secondaryCta, primaryCta } = getPublicNavConfig(pathname);
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-header border-b transition-colors duration-normal ease-standard",
        scrolled
          ? "border-border-subtle bg-surface-header shadow-elev1 backdrop-blur-sm"
          : "border-transparent bg-surface",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="shrink-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
        >
          <Logo variant="full" size="sm" label="EMR Despachantes" />
        </Link>

        <nav aria-label="Navegação principal" className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              /* `py-2`: sem padding vertical o link tem 21px de altura e
                 reprova o mínimo de 24px da WCAG 2.2 AA (Target Size). Não é
                 link inline no meio de um texto, então a exceção não vale. */
              className="rounded-sm px-1 py-2 text-body-public text-text-secondary-strong transition-colors duration-fast ease-standard hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href={secondaryCta.href}
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            {secondaryCta.label}
          </Link>
          <Link
            href={primaryCta.href}
            className={buttonVariants({ variant: "primary", size: "sm" })}
          >
            {primaryCta.label}
          </Link>
        </div>

        <button
          type="button"
          aria-label="Abrir menu"
          onClick={() => setMenuOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus lg:hidden"
        >
          <Menu aria-hidden="true" className="h-5 w-5" />
        </button>
      </Container>

      <MobileMenu
        open={menuOpen}
        onOpenChange={setMenuOpen}
        navLinks={navLinks}
        onNavigate={() => setMenuOpen(false)}
        secondaryCta={secondaryCta}
        primaryCta={primaryCta}
      />
    </header>
  );
}
