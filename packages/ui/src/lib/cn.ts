import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * `tailwind-merge` só reconhece a escala de `fontSize` default do Tailwind
 * (xs/sm/base/lg/...). Sem isso, nomes customizados do preset
 * (`text-body`, `text-h1`, `text-kpi` etc. — ver tailwind-preset.ts) caem
 * no grupo genérico de cor e colidem com classes de cor de texto reais
 * (`text-text-on-primary`, `text-text-secondary`...), descartando uma das
 * duas silenciosamente. Foi assim que `Button` variant="primary" perdeu a
 * cor do texto (`text-text-on-primary` some ao mergear com `text-body`).
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display",
            "h1",
            "h2",
            "h3",
            "h4",
            "body",
            "body-lg",
            "body-sm",
            "label",
            "caption",
            "kpi",
          ],
        },
      ],
    },
  },
});

/**
 * Combina classnames condicionais (clsx) e resolve conflitos do Tailwind
 * (tailwind-merge) — última classe conflitante vence. Usado por todo
 * componente que aceita `className` externo.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
