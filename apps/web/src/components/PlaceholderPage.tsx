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
  breadcrumb: BreadcrumbItem[];
  description?: string;
}

export function PlaceholderPage({ title, breadcrumb, description }: PlaceholderPageProps) {
  return (
    <>
      <PageHeader title={title} breadcrumb={breadcrumb} linkAs={Link} description={description} />
      <EmptyState
        title="Tela em construção"
        description="O conteúdo desta tela será implementado em uma issue futura."
      />
    </>
  );
}
