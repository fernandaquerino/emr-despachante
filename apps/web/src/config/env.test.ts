import assert from "node:assert/strict";
import test from "node:test";
import { validateWebEnv } from "./env";

test("validates the public API URL", () => {
  assert.deepEqual(validateWebEnv({ NEXT_PUBLIC_API_BASE_URL: "https://api.example.test" }), {
    apiBaseUrl: "https://api.example.test",
    consultSource: "mock",
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

test("accepts an optional WhatsApp number and rejects a malformed one", () => {
  assert.deepEqual(
    validateWebEnv({
      NEXT_PUBLIC_API_BASE_URL: "https://api.example.test",
      NEXT_PUBLIC_WHATSAPP_NUMBER: "5511987654321",
    }),
    {
      apiBaseUrl: "https://api.example.test",
      consultSource: "mock",
      whatsappNumber: "5511987654321",
    },
  );

  assert.throws(
    () =>
      validateWebEnv({
        NEXT_PUBLIC_API_BASE_URL: "https://api.example.test",
        NEXT_PUBLIC_WHATSAPP_NUMBER: "+55 (11) 98765-4321",
      }),
    /must be digits only/,
  );
});

test("defaults the consult source to the mock and accepts the API source", () => {
  // Enquanto BE-VEH-001 (#159) não existir, a ausência da variável tem de
  // cair no mock — nunca apontar para uma API inexistente.
  assert.equal(
    validateWebEnv({ NEXT_PUBLIC_API_BASE_URL: "https://api.example.test" }).consultSource,
    "mock",
  );
  assert.equal(
    validateWebEnv({
      NEXT_PUBLIC_API_BASE_URL: "https://api.example.test",
      NEXT_PUBLIC_CONSULT_SOURCE: "api",
    }).consultSource,
    "api",
  );
});

test("rejects an unknown consult source", () => {
  assert.throws(
    () =>
      validateWebEnv({
        NEXT_PUBLIC_API_BASE_URL: "https://api.example.test",
        NEXT_PUBLIC_CONSULT_SOURCE: "producao",
      }),
    /must be either "mock" or "api"/,
  );
});
