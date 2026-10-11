"use client";

import Link from "next/link";
import { buttonVariants, DrawerContent, DrawerRoot, Logo } from "@emr/ui";
import type { PublicNavLink } from "./public-nav";

export interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  navLinks: PublicNavLink[];
  onNavigate: () => void;
  secondaryCta: { label: string; href: string };
  primaryCta: { label: string; href: string };
}

/**
 * Menu mobile das páginas públicas. Reusa `Drawer` (@emr/ui) — mesmo
 * focus-trap/`Esc`/aria do overlay do app autenticado — em vez de duplicar
 * essa lógica; o conteúdo (links de marketing) é específico o suficiente
 * para não caber no `MobileNav` do app-shell, que espera `SidebarGroup`.
 */
export function MobileMenu({
  open,
  onOpenChange,
  navLinks,
  onNavigate,
  secondaryCta,
  primaryCta,
}: MobileMenuProps) {
  return (
    <DrawerRoot open={open} onOpenChange={onOpenChange}>
      <DrawerContent title="Menu" side="right" width="sm">
        <div className="mb-6">
          <Logo variant="full" size="sm" />
        </div>
        <nav aria-label="Navegação principal" className="flex flex-col gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className="rounded-sm px-2 py-2.5 text-body-lg text-text hover:bg-bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="mt-6 flex flex-col gap-2 border-t border-border pt-6">
          <Link
            href={secondaryCta.href}
            onClick={onNavigate}
            className={buttonVariants({ variant: "secondary" })}
          >
            {secondaryCta.label}
          </Link>
          <Link
            href={primaryCta.href}
            onClick={onNavigate}
            className={buttonVariants({ variant: "primary" })}
          >
            {primaryCta.label}
          </Link>
        </div>
      </DrawerContent>
    </DrawerRoot>
  );
}
