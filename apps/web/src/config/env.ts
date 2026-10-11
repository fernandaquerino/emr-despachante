/**
 * Fonte da consulta pública de veículo. `mock` enquanto `BE-VEH-001` (#159)
 * não estiver no ar — ver `src/lib/consult/index.ts` e ADR-019.
 */
export type ConsultSource = "mock" | "api";

const CONSULT_SOURCES: readonly ConsultSource[] = ["mock", "api"];

export interface WebEnv {
  readonly apiBaseUrl: string;
  readonly consultSource: ConsultSource;
  /**
   * Número de WhatsApp em formato internacional, só dígitos (ex.:
   * `5511900000000`). Opcional: sem ele, o CTA flutuante de WhatsApp
   * simplesmente não é renderizado — melhor ausente do que apontando para um
   * número placeholder.
   */
  readonly whatsappNumber?: string;
}

export function validateWebEnv(source: Readonly<Record<string, string | undefined>>): WebEnv {
  const apiBaseUrl = source.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is required");
  }

  let parsedApiBaseUrl: URL;
  try {
    parsedApiBaseUrl = new URL(apiBaseUrl);
  } catch {
    throw new Error("NEXT_PUBLIC_API_BASE_URL must be a valid URL");
  }

  if (!["http:", "https:"].includes(parsedApiBaseUrl.protocol)) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL must use the http or https protocol");
  }

  // Default explícito: sem a variável, a consulta usa o mock. Preferível a
  // apontar para uma API que ainda não existe e falhar em runtime.
  const consultSource = source.NEXT_PUBLIC_CONSULT_SOURCE?.trim() || "mock";
  if (!CONSULT_SOURCES.includes(consultSource as ConsultSource)) {
    throw new Error('NEXT_PUBLIC_CONSULT_SOURCE must be either "mock" or "api"');
  }

  const whatsappNumber = source.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim();
  if (whatsappNumber && !/^[1-9][0-9]{9,14}$/.test(whatsappNumber)) {
    throw new Error("NEXT_PUBLIC_WHATSAPP_NUMBER must be digits only, in international format");
  }

  const base = { apiBaseUrl, consultSource: consultSource as ConsultSource };
  return Object.freeze(whatsappNumber ? { ...base, whatsappNumber } : base);
}
