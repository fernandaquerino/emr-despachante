import assert from "node:assert/strict";
import test from "node:test";
import { validateWorkerEnv } from "./env";

test("validates the worker runtime environment", () => {
  assert.deepEqual(validateWorkerEnv({ NODE_ENV: "production" }), { nodeEnv: "production" });
  assert.deepEqual(validateWorkerEnv({}), { nodeEnv: "development" });
});

test("rejects an unsupported worker runtime environment", () => {
  assert.throws(() => validateWorkerEnv({ NODE_ENV: "staging" }), /NODE_ENV must be one of/);
});
