import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PublicHeader } from "./PublicHeader";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("PublicHeader", () => {
  it("renders the home nav links and CTAs", () => {
    render(<PublicHeader />);

    const desktopNav = screen.getByRole("navigation", { name: "Navegação principal" });
    expect(within(desktopNav).getByRole("link", { name: "Serviços" })).toHaveAttribute(
      "href",
      "#servicos",
    );
    expect(screen.getAllByRole("link", { name: "Entrar" })[0]).toHaveAttribute("href", "/login");
    expect(screen.getAllByRole("link", { name: "Para empresas" })[0]).toHaveAttribute(
      "href",
      "/parceiros",
    );
  });

  it("opens and closes the mobile menu without shifting the header height", async () => {
    const user = userEvent.setup();
    render(<PublicHeader />);

    await user.click(screen.getByRole("button", { name: "Abrir menu" }));
    expect(await screen.findByRole("dialog", { name: "Menu" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Fechar" }));
    expect(screen.queryByRole("dialog", { name: "Menu" })).not.toBeInTheDocument();
  });
});
