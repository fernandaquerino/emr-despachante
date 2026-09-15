import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Header } from "./Header";

describe("Header", () => {
  it("renders the left, search, actions and userMenu slots", () => {
    render(
      <Header
        left={<span>Título</span>}
        searchSlot={<span>Busca</span>}
        actionsSlot={<span>Ações</span>}
        userMenu={<span>Menu</span>}
      />,
    );

    expect(screen.getByText("Título")).toBeInTheDocument();
    expect(screen.getByText("Busca")).toBeInTheDocument();
    expect(screen.getByText("Ações")).toBeInTheDocument();
    expect(screen.getByText("Menu")).toBeInTheDocument();
  });

  it("omits the search slot wrapper when not provided", () => {
    render(<Header left={<span>Título</span>} userMenu={<span>Menu</span>} />);
    expect(screen.queryByText("Busca")).not.toBeInTheDocument();
  });

  it("applies the default 56px height class", () => {
    const { container } = render(
      <Header left={<span>Título</span>} userMenu={<span>Menu</span>} />,
    );
    expect(container.querySelector("header")).toHaveClass("h-header");
  });

  it("applies the tall 64px height class when height is tall", () => {
    const { container } = render(
      <Header left={<span>Título</span>} userMenu={<span>Menu</span>} height="tall" />,
    );
    expect(container.querySelector("header")).toHaveClass("h-16");
  });

  it("renders the mobile nav trigger when provided", () => {
    render(
      <Header
        left={<span>Título</span>}
        userMenu={<span>Menu</span>}
        mobileNavTrigger={<button>Abrir menu</button>}
      />,
    );
    expect(screen.getByRole("button", { name: "Abrir menu" })).toBeInTheDocument();
  });
});
