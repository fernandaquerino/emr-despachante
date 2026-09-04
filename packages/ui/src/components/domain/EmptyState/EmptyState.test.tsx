import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders title, description and an optional CTA", () => {
    render(
      <EmptyState
        title="Nenhum caso encontrado"
        description="Nenhum caso corresponde aos filtros atuais."
        action={<a href="/casos">Limpar filtros</a>}
      />,
    );

    expect(screen.getByRole("heading", { name: "Nenhum caso encontrado" })).toBeInTheDocument();
    expect(screen.getByText("Nenhum caso corresponde aos filtros atuais.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Limpar filtros" })).toBeInTheDocument();
  });
});
