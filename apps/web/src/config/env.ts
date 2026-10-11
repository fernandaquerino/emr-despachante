export interface WebEnv {
  readonly apiBaseUrl: string;
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

  const whatsappNumber = source.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim();
  if (whatsappNumber && !/^[1-9][0-9]{9,14}$/.test(whatsappNumber)) {
    throw new Error("NEXT_PUBLIC_WHATSAPP_NUMBER must be digits only, in international format");
  }

  return Object.freeze(whatsappNumber ? { apiBaseUrl, whatsappNumber } : { apiBaseUrl });
}
