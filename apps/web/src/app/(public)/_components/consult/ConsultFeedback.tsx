"use client";

import { Alert, ErrorState } from "@emr/ui";
import type { ConsultState } from "./use-vehicle-consult";

/**
 * Estados de falha e de "não encontrado" da consulta.
 *
 * Nenhum deles renderiza veículo, valor ou status: se o backend não devolveu
 * dado, a tela não mostra dado. "Não encontramos" e "não conseguimos
 * consultar" são afirmações diferentes e nunca são colapsadas em um erro
 * genérico — `UX_RULES.md` §9 proíbe "algo deu errado".
 *
 * `renavam_required` não passa por aqui de propósito: é etapa do fluxo, não
 * falha (`FE-PUB-002`/#151).
 */
export const NOT_FOUND_MESSAGE = "Não encontramos um veículo com os dados informados.";
export const UNAVAILABLE_MESSAGE =
  "Não foi possível realizar a consulta agora. Tente novamente em alguns instantes.";
export const RATE_LIMITED_MESSAGE = "Muitas consultas em sequência. Tente em alguns minutos.";

export function ConsultFeedback({ state, onRetry }: { state: ConsultState; onRetry: () => void }) {
  if (state.status === "not_found") {
    return (
      <Alert
        tone="warning"
        title={NOT_FOUND_MESSAGE}
        description="Confira os caracteres da placa — e o RENAVAM, se foi solicitado — e tente de novo."
      />
    );
  }

  if (state.status === "rate_limited") {
    return <Alert tone="info" title={RATE_LIMITED_MESSAGE} />;
  }

  if (state.status === "unavailable") {
    return (
      <ErrorState
        context="a situação deste veículo"
        description={`${UNAVAILABLE_MESSAGE} Os dados que você digitou foram mantidos.`}
        onRetry={onRetry}
      />
    );
  }

  return null;
}
