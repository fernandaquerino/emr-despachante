export type RuntimeEnvironment = "development" | "test" | "production";

export interface WorkerEnv {
  readonly nodeEnv: RuntimeEnvironment;
}

const runtimeEnvironments = new Set<RuntimeEnvironment>(["development", "test", "production"]);

export function validateWorkerEnv(source: Readonly<Record<string, string | undefined>>): WorkerEnv {
  const nodeEnv = source.NODE_ENV ?? "development";
  if (!runtimeEnvironments.has(nodeEnv as RuntimeEnvironment)) {
    throw new Error("NODE_ENV must be one of: development, test, production");
  }

  return Object.freeze({ nodeEnv: nodeEnv as RuntimeEnvironment });
}
