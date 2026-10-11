import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "./page";

describe("HomePage (/)", () => {
  it("renders exactly one h1", () => {
    render(<HomePage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("renders every section of the landing page, with the plate widget above the fold", () => {
    render(<HomePage />);

    expect(screen.getByLabelText("Placa do veículo")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Todos os seus veículos num painel que não te deixa esquecer nada.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "A papelada não mudou. A forma de resolver, sim." }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "O que você resolve aqui" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Você vê o valor antes de pagar" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Quatro passos, do pedido à conclusão" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Por que confiar o documento do seu carro à EMR" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Perguntas frequentes" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Comece pela placa. O resto é com a gente." }),
    ).toBeInTheDocument();
  });

  it("keeps the payment invariant visible: checkout start is not confirmation", () => {
    render(<HomePage />);

    expect(
      screen.getByText("O status do pedido muda só após a confirmação oficial do pagamento."),
    ).toBeInTheDocument();
  });

  it("does not render the WhatsApp CTA without a configured number", () => {
    render(<HomePage />);
    expect(
      screen.queryByRole("link", { name: "Falar com a EMR no WhatsApp" }),
    ).not.toBeInTheDocument();
  });

  it("does not log to the console while rendering", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    render(<HomePage />);

    expect(errorSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
    warnSpy.mockRestore();
  });
});
