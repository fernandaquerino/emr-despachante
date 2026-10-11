import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import HomePage from "./page";
import PartnersPage from "./parceiros/page";
import { getPublicNavConfig } from "./_components/public-nav";

/**
 * Guarda de regressão para âncora morta.
 *
 * O header e o rodapé públicos são compartilhados por `layout.tsx` e montam
 * os links a partir de `public-nav.ts`, enquanto os `id` das seções vivem nas
 * páginas. Nada liga os dois: renomear a seção deixa o link apontando para o
 * nada, e isso não quebra build, type-check nem nenhum teste de render —
 * aconteceu de fato ao reestruturar `/parceiros` (`#proposta` virou órfão).
 */
const pages = [
  { name: "/", pathname: "/", Page: HomePage },
  { name: "/parceiros", pathname: "/parceiros", Page: PartnersPage },
];

describe.each(pages)("âncoras de navegação em $name", ({ pathname, Page }) => {
  it("todo link de hash aponta para um id que existe na página", () => {
    const { container } = render(<Page />);
    const hashLinks = getPublicNavConfig(pathname)
      .navLinks.filter((link) => link.href.startsWith("#"))
      .map((link) => link.href.slice(1));

    expect(hashLinks.length).toBeGreaterThan(0);

    const missing = hashLinks.filter((id) => container.querySelector(`#${id}`) === null);
    expect(missing).toEqual([]);
  });
});
