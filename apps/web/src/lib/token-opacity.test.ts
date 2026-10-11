import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import path from "node:path";
import test from "node:test";

/**
 * Guarda de regressão para uma falha silenciosa e cara.
 *
 * O preset do Design System mapeia cores para `var(--token)` cru. O Tailwind
 * v3 NÃO consegue aplicar modificador de opacidade (`/75`, `/[0.06]`) sobre
 * isso: ele não emite regra nenhuma. O elemento então herda a cor do pai —
 * foi assim que o lead da dobra passou a renderizar preto puro sobre o navy
 * (contraste 1.2:1) e o header sticky ficou totalmente transparente, deixando
 * o conteúdo do FAQ vazar por cima da navegação.
 *
 * Como nada quebra em build nem em teste de DOM (`vitest` roda com
 * `css: false`), a checagem precisa ser no código-fonte.
 *
 * Para camada translúcida, use um token dedicado (`--surface-on-inverse`,
 * `--border-inverse`, `--surface-header`, ...) em vez do modificador.
 */
const TOKEN_GROUPS = ["text", "surface", "bg", "border", "action", "status", "data", "priority"];
const PATTERN = `(text|bg|border|ring|from|to|via|divide|outline)-(${TOKEN_GROUPS.join(
  "|",
)})-[a-z0-9-]*/(\\[?[0-9.]+\\]?)`;

test("nenhum utilitário Tailwind aplica opacidade sobre cor de token", () => {
  const root = path.resolve(import.meta.dirname, "../..");
  let hits = "";

  try {
    hits = execFileSync(
      "grep",
      ["-rnoE", "--include=*.tsx", "--include=*.ts", PATTERN, path.join(root, "src")],
      { encoding: "utf8" },
    );
  } catch (error) {
    // grep sai com código 1 quando não encontra nada — este é o caso feliz.
    const status = (error as { status?: number }).status;
    if (status === 1) return;
    throw error;
  }

  assert.equal(
    hits.trim(),
    "",
    `Modificador de opacidade sobre cor de token não gera CSS. Ocorrências:\n${hits}`,
  );
});
