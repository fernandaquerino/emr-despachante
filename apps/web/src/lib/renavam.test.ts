import assert from "node:assert/strict";
import test from "node:test";
import { isValidRenavam, normalizeRenavam, toCanonicalRenavam } from "./renavam";

test("normalizeRenavam keeps only digits and caps at 11", () => {
  assert.equal(normalizeRenavam("1234567890"), "1234567890");
  assert.equal(normalizeRenavam("123.456.789-01"), "12345678901");
  assert.equal(normalizeRenavam("1234567890123"), "12345678901");
  assert.equal(normalizeRenavam("abc"), "");
});

test("isValidRenavam accepts the 9-to-11-digit range", () => {
  assert.equal(isValidRenavam("123456789"), true);
  assert.equal(isValidRenavam("12345678901"), true);
});

test("isValidRenavam rejects values outside the accepted length", () => {
  assert.equal(isValidRenavam(""), false);
  assert.equal(isValidRenavam("12345678"), false);
});

test("isValidRenavam does not apply a check digit — the org owns that rule", () => {
  // Sequência sem dígito verificador válido continua aceita de propósito:
  // barrar aqui deixaria o usuário sem saída numa tela que não tem a base.
  assert.equal(isValidRenavam("00000000000"), true);
});

test("toCanonicalRenavam left-pads the old 9-digit format to 11", () => {
  assert.equal(toCanonicalRenavam("123456789"), "00123456789");
  assert.equal(toCanonicalRenavam("12345678901"), "12345678901");
});
