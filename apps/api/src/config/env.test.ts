import assert from "node:assert/strict";
import test from "node:test";
import { validateApiEnv } from "./env";

test("validates and types API environment variables", () => {
  const env = validateApiEnv({
    NODE_ENV: "test",
    PORT: "3100",
    DATABASE_URL: "postgresql://user:password@localhost:5432/emr",
  });

  assert.deepEqual(env, {
    nodeEnv: "test",
    port: 3100,
    databaseUrl: "postgresql://user:password@localhost:5432/emr",
  });
});

test("rejects missing or invalid API configuration", () => {
  assert.throws(() => validateApiEnv({ NODE_ENV: "test" }), /DATABASE_URL is required/);
  assert.throws(
    () => validateApiEnv({ NODE_ENV: "staging", DATABASE_URL: "postgresql://localhost/emr" }),
    /NODE_ENV must be one of/,
  );
  assert.throws(
    () => validateApiEnv({ PORT: "70000", DATABASE_URL: "postgresql://localhost/emr" }),
    /PORT must be an integer/,
  );
});
