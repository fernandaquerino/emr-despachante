import type { ElementType } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "../../../lib/cn";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  linkAs?: ElementType;
  className?: string;
}

export function Breadcrumb({ items, linkAs: Link = "a", className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1", className)}>
      <ol className="flex items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {index > 0 && <ChevronRight aria-hidden="true" className="w-3 h-3 text-text-muted" />}

              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  title={item.label}
                  className="min-w-0 max-w-[160px] truncate text-body-sm text-text"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  title={item.label}
                  className="min-w-0 max-w-[160px] truncate text-body-sm text-text-muted hover:text-text-link"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
