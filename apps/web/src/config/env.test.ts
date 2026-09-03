import assert from "node:assert/strict";
import test from "node:test";
import { validateWebEnv } from "./env";

test("validates the public API URL", () => {
  assert.deepEqual(validateWebEnv({ NEXT_PUBLIC_API_BASE_URL: "https://api.example.test" }), {
    apiBaseUrl: "https://api.example.test",
  });
});

test("rejects missing, malformed, or non-HTTP public API URLs", () => {
  assert.throws(() => validateWebEnv({}), /NEXT_PUBLIC_API_BASE_URL is required/);
  assert.throws(
    () => validateWebEnv({ NEXT_PUBLIC_API_BASE_URL: "api.example.test" }),
    /must be a valid URL/,
  );
  assert.throws(
    () => validateWebEnv({ NEXT_PUBLIC_API_BASE_URL: "file:///tmp/api" }),
    /must use the http or https protocol/,
  );
});
