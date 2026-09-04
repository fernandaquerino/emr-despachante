import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina classnames condicionais (clsx) e resolve conflitos do Tailwind
 * (tailwind-merge) — última classe conflitante vence. Usado por todo
 * componente que aceita `className` externo.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
