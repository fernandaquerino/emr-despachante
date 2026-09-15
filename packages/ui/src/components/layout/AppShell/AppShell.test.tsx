import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { LayoutDashboard } from "lucide-react";
import { AppShell } from "./AppShell";

const navGroups = [
  {
    items: [{ label: "Visão geral", href: "/admin", icon: LayoutDashboard }],
  },
];

function renderShell(props: Partial<Parameters<typeof AppShell>[0]> = {}) {
  return render(
    <AppShell
      variant="sidebar"
      logo={<span>Logo</span>}
      navGroups={navGroups}
      activePath="/admin"
      headerLeft={<span>Título</span>}
      userMenu={<span>Menu</span>}
      {...props}
    >
      <p>Conteúdo</p>
    </AppShell>,
  );
}

describe("AppShell", () => {
  it("renders a desktop sidebar for variant sidebar", () => {
    renderShell({ variant: "sidebar" });
    // Sidebar e MobileNav renderizam os mesmos itens; garantimos que ao
    // menos o link do desktop existe.
    expect(screen.getAllByRole("link", { name: "Visão geral" }).length).toBeGreaterThan(0);
  });

  it("does not render a sidebar for variant minimal", () => {
    const { container } = renderShell({ variant: "minimal", navGroups: [] });
    expect(container.querySelector("aside")).not.toBeInTheDocument();
  });

  it("does not render a mobile nav trigger for variant minimal", () => {
    renderShell({ variant: "minimal", navGroups: [] });
    expect(screen.queryByRole("button", { name: "Abrir menu" })).not.toBeInTheDocument();
  });

  it("opens the mobile nav when the trigger is clicked", async () => {
    const user = userEvent.setup();
    renderShell();

    await user.click(screen.getByRole("button", { name: "Abrir menu" }));

    // O Radix Dialog corretamente marca o resto da página como
    // aria-hidden enquanto o drawer está aberto (comportamento de modal),
    // então só o link dentro do drawer fica acessível nesse momento — o
    // que também comprova que o MobileNav montou os mesmos itens.
    const dialog = await screen.findByRole("dialog", { name: "Navegação" });
    await waitFor(() => {
      expect(within(dialog).getByRole("link", { name: "Visão geral" })).toBeInTheDocument();
    });
  });

  it("applies the 1024px max-width by default for the minimal variant", () => {
    const { container } = renderShell({ variant: "minimal", navGroups: [] });
    expect(container.querySelector("main > div")).toHaveClass("max-w-[1024px]");
  });

  it("applies the 1440px max-width by default for sidebar variants", () => {
    const { container } = renderShell({ variant: "sidebar-dense" });
    expect(container.querySelector("main > div")).toHaveClass("max-w-[1440px]");
  });

  it("renders the header with tall height for the minimal (OWNER) variant", () => {
    const { container } = renderShell({ variant: "minimal", navGroups: [] });
    expect(container.querySelector("header")).toHaveClass("h-16");
  });
});
