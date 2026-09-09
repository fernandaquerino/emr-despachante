import type { ElementType, ReactNode } from "react";
import { Breadcrumb, type BreadcrumbItem } from "../Breadcrumb";
import { cn } from "../../../lib/cn";

/**
 * Cabeçalho de página (título + breadcrumb + ações), distinto do `Header`
 * global do shell (sticky). Usado dentro do `<main>` de cada rota —
 * breadcrumb obrigatório em rotas profundas (UX_RULES.md §11).
 */
export interface PageHeaderProps {
  breadcrumb?: BreadcrumbItem[];
  linkAs?: ElementType;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  breadcrumb,
  linkAs,
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-3 pb-6", className)}>
      {breadcrumb && breadcrumb.length > 0 ? (
        <Breadcrumb items={breadcrumb} linkAs={linkAs} />
      ) : null}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="text-h1 text-text">{title}</h1>
          {description ? <p className="text-body text-text-secondary">{description}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
