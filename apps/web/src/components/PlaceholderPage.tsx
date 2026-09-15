import Link from "next/link";
import { EmptyState, PageHeader, type BreadcrumbItem } from "@emr/ui";

/**
 * Placeholder de rota para telas ainda não implementadas — reusa
 * `PageHeader`/`EmptyState` do design system em vez de criar um
 * "ComingSoon" novo (CLAUDE.md §15/§4). Conteúdo funcional de cada tela é
 * fora do escopo da issue de casca/navegação.
 */
export interface PlaceholderPageProps {
  title: string;
  /** Omitir em rotas raiz (ex.: "Visão geral"), onde o único item duplicaria o título. */
  breadcrumb?: BreadcrumbItem[];
  description?: string;
}

export function PlaceholderPage({ title, breadcrumb, description }: PlaceholderPageProps) {
  return (
    <>
      <PageHeader title={title} breadcrumb={breadcrumb} linkAs={Link} description={description} />
      {/* Contido em uma faixa compacta e alinhado à mesma grade do
          PageHeader — evita o empty state genérico solto no centro de uma
          área vazia enorme (SCREEN_SPECS.md §Estados vazios). */}
      <div className="max-w-md rounded-lg border border-dashed border-border px-6">
        <EmptyState
          title="Tela em construção"
          description="O conteúdo desta tela será implementado em uma issue futura."
        />
      </div>
    </>
  );
}
