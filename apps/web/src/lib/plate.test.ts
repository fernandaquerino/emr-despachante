import assert from "node:assert/strict";
import test from "node:test";
import { formatPlateForDisplay, isValidPlate, normalizePlate } from "./plate";

test("normalizePlate uppercases, strips invalid characters, and caps length", () => {
  assert.equal(normalizePlate("abc1234"), "ABC1234");
  assert.equal(normalizePlate("abc-1234"), "ABC1234");
  assert.equal(normalizePlate("abc 1d23extra"), "ABC1D23");
  assert.equal(normalizePlate("áéc1234"), "C1234");
});

test("isValidPlate accepts old-format and Mercosul plates", () => {
  assert.equal(isValidPlate("ABC1234"), true);
  assert.equal(isValidPlate("ABC1D23"), true);
});

test("isValidPlate rejects incomplete or malformed values", () => {
  assert.equal(isValidPlate(""), false);
  assert.equal(isValidPlate("ABC123"), false);
  assert.equal(isValidPlate("ABCD123"), false);
  assert.equal(isValidPlate("AB1234"), false);
});

test("formatPlateForDisplay adds a hyphen only for old-format plates", () => {
  assert.equal(formatPlateForDisplay("AB"), "AB");
  assert.equal(formatPlateForDisplay("ABC1234"), "ABC-1234");
  assert.equal(formatPlateForDisplay("ABC1D23"), "ABC1D23");
});
