import type { ReactNode } from "react";
import { cn } from "@emr/ui";

/** Largura de conteúdo consistente entre as seções das páginas públicas — evita repetir o mesmo `max-w`/padding em cada seção. */
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("mx-auto w-full max-w-[1120px] px-5 lg:px-8", className)}>{children}</div>
  );
}
