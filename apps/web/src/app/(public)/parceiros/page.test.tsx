import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import PartnersPage from "./page";

describe("PartnersPage (/parceiros)", () => {
  it("renders exactly one h1", () => {
    render(<PartnersPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("renders a path back to the individual (B2C) experience", () => {
    render(<PartnersPage />);
    expect(screen.getByRole("link", { name: "Voltar para pessoa física" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("never claims to have sent a partnership request", async () => {
    render(<PartnersPage />);
    expect(
      screen.queryByText(/solicitação enviada|cadastro realizado|obrigado pelo contato/i),
    ).not.toBeInTheDocument();
  });

  it("does not log to the console while rendering", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    render(<PartnersPage />);

    expect(errorSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
    warnSpy.mockRestore();
  });
});
