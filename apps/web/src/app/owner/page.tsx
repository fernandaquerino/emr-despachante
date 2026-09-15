import Link from "next/link";
import { ArrowRight, Car, FileText, FolderClosed, Receipt } from "lucide-react";
import { PageHeader } from "@emr/ui";
import { getMockSession } from "../../lib/mock-session";

/**
 * Home de /owner. Server Component — sem interação/hooks, só leitura de
 * sessão e navegação (CLAUDE.md §8). Os atalhos abaixo espelham as rotas já
 * existentes em `nav-config/owner.ts` (nenhuma tela nova é prometida aqui);
 * conteúdo funcional de cada uma (dados reais de veículos, solicitações
 * etc.) segue fora do escopo desta issue de casca/navegação.
 */
const quickLinks = [
  {
    label: "Meus veículos",
    description: "Situação, multas e licenciamento.",
    href: "/owner/veiculos",
    icon: FolderClosed,
  },
  {
    label: "Solicitações",
    description: "Acompanhe os pedidos em andamento.",
    href: "/owner/solicitacoes",
    icon: FileText,
  },
  {
    label: "Documentos",
    description: "Comprovantes, CRLV e recibos.",
    href: "/owner/documentos",
    icon: FileText,
  },
  {
    label: "Pagamentos",
    description: "Cobranças e status de pagamento.",
    href: "/owner/pagamentos",
    icon: Receipt,
  },
];

export default function OwnerHomePage() {
  const session = getMockSession("owner");
  const firstName = session.name.split(" ")[0];

  return (
    <>
      <PageHeader
        title={`Olá, ${firstName}`}
        description="Aqui está um resumo rápido da sua área."
      />

      {/* Faixa de boas-vindas — tinta sutil de marca (surface-selected,
          cobalt-50) em vez de branco puro, sem gradiente chamativo
          (CLAUDE.md §19). Ícone decorativo watermark, aria-hidden. */}
      <section className="relative mb-8 overflow-hidden rounded-xl border border-border bg-surface-selected px-6 py-5">
        <Car
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-4 -right-4 h-28 w-28 text-action-accent/10"
          strokeWidth={1.25}
        />
        <p className="relative max-w-md text-body text-text-secondary">
          Cadastre seus veículos para acompanhar multas, licenciamento e solicitações em um só
          lugar.
        </p>
      </section>

      <h2 className="mb-3 text-h3 text-text">Acesso rápido</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map(({ label, description, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 shadow-elev1 transition-colors duration-normal ease-standard hover:border-action-accent hover:bg-surface-selected focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-action-accent/10 text-action-accent">
              <Icon aria-hidden="true" className="h-5 w-5" />
            </span>
            <span className="flex flex-col gap-1">
              <span className="flex items-center gap-1 text-h4 text-text">
                {label}
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 text-text-muted transition-transform duration-normal ease-standard group-hover:translate-x-0.5 group-hover:text-action-accent"
                />
              </span>
              <span className="text-body-sm text-text-secondary">{description}</span>
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
