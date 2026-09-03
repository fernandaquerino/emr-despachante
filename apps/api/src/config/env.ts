export type RuntimeEnvironment = "development" | "test" | "production";

export interface ApiEnv {
  readonly nodeEnv: RuntimeEnvironment;
  readonly port: number;
  readonly databaseUrl: string;
}

const runtimeEnvironments = new Set<RuntimeEnvironment>(["development", "test", "production"]);

export function validateApiEnv(source: Readonly<Record<string, string | undefined>>): ApiEnv {
  const nodeEnv = source.NODE_ENV ?? "development";
  if (!runtimeEnvironments.has(nodeEnv as RuntimeEnvironment)) {
    throw new Error("NODE_ENV must be one of: development, test, production");
  }

  const portValue = source.PORT ?? "3001";
  const port = Number(portValue);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535");
  }

  const databaseUrl = source.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required");
  }

  let parsedDatabaseUrl: URL;
  try {
    parsedDatabaseUrl = new URL(databaseUrl);
  } catch {
    throw new Error("DATABASE_URL must be a valid PostgreSQL connection URL");
  }

  if (!["postgres:", "postgresql:"].includes(parsedDatabaseUrl.protocol)) {
    throw new Error("DATABASE_URL must use the postgres or postgresql protocol");
  }

  return Object.freeze({
    nodeEnv: nodeEnv as RuntimeEnvironment,
    port,
    databaseUrl,
  });
}
