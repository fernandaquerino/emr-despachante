import type {
  HTMLAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";
import { cn } from "../../../lib/cn";

/**
 * Primitivos de tabela. Anatomia/densidade/estados de linha:
 * docs/design-system/COMPONENTS.md §Data → Table. Ordenação, bulk actions,
 * filtros e paginação ficam a cargo de quem compõe a tabela — este é o
 * primitivo visual, não um `DataTable` completo.
 */
export function Table({ className, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className={cn("w-full border-collapse text-body-sm", className)} {...props} />
    </div>
  );
}

export function TableHeader(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className="border-b border-border-strong bg-bg-subtle" {...props} />;
}

export function TableBody(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props} />;
}

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
}

export function TableRow({ className, selected, ...props }: TableRowProps) {
  return (
    <tr
      className={cn(
        "border-b border-border-subtle last:border-b-0 hover:bg-bg-subtle transition-colors duration-fast ease-standard",
        selected && "border-l-2 border-l-action-accent bg-surface-selected",
        className,
      )}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      scope="col"
      className={cn(
        "px-3 py-2 text-left text-label font-semibold uppercase tracking-wide text-text-secondary",
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("px-3 py-2 text-text", className)} {...props} />;
}
