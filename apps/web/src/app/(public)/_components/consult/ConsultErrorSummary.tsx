"use client";

import { forwardRef } from "react";
import { AlertCircle } from "lucide-react";
import type { ConsultFieldErrors } from "./use-vehicle-consult";

/**
 * Resumo de erros focável no topo do formulário, exigido por `UX_RULES.md` §5
 * ("Após submit inválido, foco vai para `Focusable Error Summary` no topo do
 * form, `role="alert" tabindex="-1"`").
 *
 * Existe porque o erro inline, sozinho, não é anunciado para quem submeteu com
 * o foco no botão: o leitor de tela fica num controle e a mensagem aparece
 * acima dele, sem relação programática.
 *
 * Não usa `Alert` de propósito — e esta é a única exceção aqui ao reuso do DS
 * (CLAUDE.md §15). `Alert` com `tone="error"` já aplica `role="alert"` no
 * próprio nó, e o alvo do foco precisa ser o elemento que carrega esse role.
 * Envolver o `Alert` aninharia `role="alert"` dentro de `role="alert"`, que é
 * bug de acessibilidade, não detalhe de estilo.
 *
 * Lista os **campos**, não as mensagens: a mensagem específica já está inline,
 * ligada ao input por `aria-describedby`. Repeti-la aqui faria o mesmo texto
 * aparecer duas vezes na tela.
 */
export const ConsultErrorSummary = forwardRef<HTMLDivElement, { errors: ConsultFieldErrors }>(
  ({ errors }, ref) => {
    const fields = [
      errors.plate ? "Placa do veículo" : undefined,
      errors.renavam ? "RENAVAM" : undefined,
    ].filter((label): label is string => Boolean(label));

    if (fields.length === 0) {
      return null;
    }

    return (
      <div
        ref={ref}
        role="alert"
        tabIndex={-1}
        className="flex items-start gap-3 rounded-md border-l-4 border-status-error bg-status-error-bg px-4 py-3 text-status-error-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
      >
        <AlertCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
        <p className="text-body">
          {fields.length === 1
            ? `Corrija o campo ${fields[0]} para continuar.`
            : `Corrija estes campos para continuar: ${fields.join(", ")}.`}
        </p>
      </div>
    );
  },
);

ConsultErrorSummary.displayName = "ConsultErrorSummary";
