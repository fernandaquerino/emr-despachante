import type { ReactNode } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, type LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/cn";

/**
 * Anatomia: docs/design-system/COMPONENTS.md §Feedback → Alert (inline).
 * Ícone + título curto + descrição opcional + ação opcional, com
 * border-left 4px na cor semântica sobre o fundo da variante.
 *
 * Alert é inline e persistente — não é Toast. Erro crítico nunca é
 * fechável (COMPONENTS.md: "Nunca fechável em erros críticos"), por isso
 * este componente não expõe `onDismiss`: quem precisa de algo dispensável
 * usa Toast.
 */
const alertVariants = cva("flex gap-3 rounded-sm border-l-4 p-4", {
  variants: {
    tone: {
      info: "border-l-status-info bg-status-info-bg text-status-info-fg",
      success: "border-l-status-success bg-status-success-bg text-status-success-fg",
      warning: "border-l-status-warning bg-status-warning-bg text-status-warning-fg",
      error: "border-l-status-error bg-status-error-bg text-status-error-fg",
    },
  },
  defaultVariants: {
    tone: "info",
  },
});

const toneIcons: Record<NonNullable<AlertProps["tone"]>, LucideIcon> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertCircle,
  error: AlertTriangle,
};

export interface AlertProps extends VariantProps<typeof alertVariants> {
  title: string;
  description?: ReactNode;
  /** Ex.: um `Button variant="link"`. */
  action?: ReactNode;
  /** Override do ícone padrão da variante. */
  icon?: LucideIcon;
  className?: string;
}

export function Alert({ tone = "info", title, description, action, icon, className }: AlertProps) {
  const Icon = icon ?? toneIcons[tone ?? "info"];

  return (
    <div
      // `alert` interrompe o leitor de tela: só em erro. O resto é `status`
      // (polite), para não atropelar o que a pessoa está fazendo.
      role={tone === "error" ? "alert" : "status"}
      className={cn(alertVariants({ tone }), className)}
    >
      <Icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="flex flex-col gap-1">
        <p className="text-body font-medium">{title}</p>
        {description ? <div className="text-body-sm opacity-90">{description}</div> : null}
        {action ? <div className="mt-1">{action}</div> : null}
      </div>
    </div>
  );
}
