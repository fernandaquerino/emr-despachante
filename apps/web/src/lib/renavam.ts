const RENAVAM_LENGTH = 11;
/** Formato antigo tinha 9 dígitos; o atual tem 11, com zeros à esquerda. */
const MIN_TYPED_LENGTH = 9;

/**
 * Mantém apenas dígitos e corta em 11 — o comprimento do RENAVAM atual
 * (`UX_RULES.md` §5: "RENAVAM 11 dígitos"). Uso: normalizar o valor do input a
 * cada tecla, sem validar ainda.
 */
export function normalizeRenavam(rawValue: string): string {
  return rawValue.replace(/[^0-9]/g, "").slice(0, RENAVAM_LENGTH);
}

/**
 * Validação de **formato apenas**: 9 a 11 dígitos, já que documentos antigos
 * omitem os zeros à esquerda.
 *
 * Deliberadamente **sem** dígito verificador (mod 11). Não há regra de RENAVAM
 * registrada em nenhum documento do projeto — só o comprimento —, e rejeitar
 * no cliente um RENAVAM que o órgão aceita bloquearia o usuário numa tela sem
 * saída. A conferência real é do backend/órgão, que tem a base. Ver ADR-019.
 */
export function isValidRenavam(normalizedValue: string): boolean {
  return normalizedValue.length >= MIN_TYPED_LENGTH && normalizedValue.length <= RENAVAM_LENGTH;
}

/**
 * Forma canônica enviada à API: 11 dígitos, completando com zeros à esquerda
 * quando a pessoa digitou o formato antigo de 9.
 */
export function toCanonicalRenavam(normalizedValue: string): string {
  return normalizedValue.padStart(RENAVAM_LENGTH, "0");
}
