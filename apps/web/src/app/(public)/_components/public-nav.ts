export interface PublicNavLink {
  label: string;
  href: string;
}

export interface PublicNavConfig {
  navLinks: PublicNavLink[];
  secondaryCta: PublicNavLink;
  primaryCta: PublicNavLink;
}

const homeConfig: PublicNavConfig = {
  navLinks: [
    { label: "Garagem", href: "#garagem" },
    { label: "Serviços", href: "#servicos" },
    { label: "Pagamento", href: "#pagamento" },
    { label: "FAQ", href: "#faq" },
  ],
  secondaryCta: { label: "Entrar", href: "/login" },
  primaryCta: { label: "Para empresas", href: "/parceiros" },
};

const partnersConfig: PublicNavConfig = {
  navLinks: [
    { label: "Por quê", href: "#por-que" },
    { label: "O portal", href: "#portal" },
    { label: "Como começar", href: "#como-funciona" },
    { label: "FAQ", href: "#faq" },
  ],
  secondaryCta: { label: "Pessoa física", href: "/" },
  primaryCta: { label: "Já sou parceiro", href: "/login" },
};

/** Header/footer são compartilhados por `layout.tsx` — o conteúdo varia por rota via `usePathname()`. */
export function getPublicNavConfig(pathname: string): PublicNavConfig {
  return pathname.startsWith("/parceiros") ? partnersConfig : homeConfig;
}
