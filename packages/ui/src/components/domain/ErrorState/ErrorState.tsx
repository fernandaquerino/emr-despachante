import { AlertTriangle } from "lucide-react";
import { Button } from "../../base/Button";
import { cn } from "../../../lib/cn";

/**
 * Anatomia: docs/design-system/COMPONENTS.md §Data → ErrorState.
 * Ícone AlertTriangle + título "Não conseguimos carregar {contexto}" +
 * descrição + "Tentar novamente". Nunca "Algo deu errado" (UX_RULES.md §9).
 */
export interface ErrorStateProps {
  /** Ex.: "os casos", "os dados deste veículo". */
  context: string;
  description?: string;
  onRetry: () => void;
  retrying?: boolean;
  className?: string;
}

export function ErrorState({
  context,
  description,
  onRetry,
  retrying,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn("flex flex-col items-center gap-1 py-8 text-center", className)}
    >
      <AlertTriangle aria-hidden="true" className="h-8 w-8 text-status-error" />
      <h3 className="mt-2 text-h4 text-text">Não conseguimos carregar {context}</h3>
      {description ? <p className="text-body-sm text-text-secondary">{description}</p> : null}
      <Button variant="secondary" size="sm" className="mt-2" onClick={onRetry} loading={retrying}>
        Tentar novamente
      </Button>
    </div>
  );
}
