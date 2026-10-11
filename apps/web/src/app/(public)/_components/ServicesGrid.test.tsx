import { describe, expect, it } from "vitest";
import { resolveServicesGrid } from "./ServicesGrid";

/**
 * Invariante: a grade nunca pode terminar com célula vazia.
 *
 * O bug que originou este teste: o destaque ocupava 2 de 3 colunas de forma
 * fixa, o que só fecha a grade com 5 ou 8 itens. Com 3 itens sobravam duas
 * células vazias, com 4 sobrava uma. Nada disso quebra build nem render, e
 * `vitest` roda com `css: false`, então nenhum teste de DOM pegaria.
 */
describe("resolveServicesGrid", () => {
  const counts = [2, 3, 4, 5, 6, 7, 8, 9];

  it.each(counts)("fecha a grade sem buraco com %i itens", (count) => {
    const { columns, featureSpansTwo } = resolveServicesGrid(count);
    const cells = count + (featureSpansTwo ? 1 : 0);
    expect(cells % columns).toBe(0);
  });

  it("não cai em três cards idênticos quando há três itens", () => {
    // 3 colunas sem destaque = a fileira de cards iguais que queremos evitar.
    expect(resolveServicesGrid(3)).toEqual({ columns: 2, featureSpansTwo: true });
  });

  it("mantém o bento de cinco itens da landing inalterado", () => {
    expect(resolveServicesGrid(5)).toEqual({ columns: 3, featureSpansTwo: true });
  });
});
