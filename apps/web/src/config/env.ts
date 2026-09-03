export interface WebEnv {
  readonly apiBaseUrl: string;
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

  return Object.freeze({ apiBaseUrl });
}
