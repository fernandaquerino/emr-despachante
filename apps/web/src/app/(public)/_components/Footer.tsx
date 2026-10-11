"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@emr/ui";
import { Container } from "./Container";
import { getPublicNavConfig } from "./public-nav";

/**
 * Footer institucional enxuto — sem CNPJ, endereço, telefone ou redes
 * sociais, porque nenhum desses dados está confirmado no repositório
 * (issue FE-PUB-001 §Footer). Só links que já existem de fato, organizados
 * em colunas (marca / navegação / acesso) em vez de uma única lista corrida.
 * Mesmo sistema visual nas duas páginas; o conteúdo acompanha a rota via
 * `usePathname` (mesma fonte do `PublicHeader`).
 */
export function Footer() {
  const pathname = usePathname();
  const { navLinks, secondaryCta, primaryCta } = getPublicNavConfig(pathname);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border-subtle bg-bg-subtle">
      <Container className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr]">
        <div className="flex flex-col gap-3">
          <Logo variant="full" size="sm" />
          <p className="max-w-xs text-body-public text-text-secondary-strong">
            Operação veicular, pagamentos e documentação em um só lugar.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-label font-medium uppercase tracking-wide text-text-secondary-strong">
            Navegação
          </span>
          <nav aria-label="Navegação do rodapé" className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="w-fit rounded-sm text-body-public text-text-secondary-strong hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-label font-medium uppercase tracking-wide text-text-secondary-strong">
            Acesso
          </span>
          <div className="flex flex-col gap-2">
            <Link
              href={primaryCta.href}
              className="w-fit rounded-sm text-body-public text-text-secondary-strong hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
            >
              {primaryCta.label}
            </Link>
            <Link
              href={secondaryCta.href}
              className="w-fit rounded-sm text-body-public text-text-secondary-strong hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
            >
              {secondaryCta.label}
            </Link>
          </div>
        </div>
      </Container>

      <Container className="border-t border-border-subtle py-6">
        <p className="text-body text-text-secondary-strong">© {year} EMR Despachantes.</p>
      </Container>
    </footer>
  );
}
