import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FileText, LayoutDashboard } from "lucide-react";
import { Sidebar } from "./Sidebar";

const groups = [
  {
    title: "Operação",
    items: [
      { label: "Visão geral", href: "/admin", icon: LayoutDashboard },
      { label: "Solicitações", href: "/admin/solicitacoes", icon: FileText },
    ],
  },
];

describe("Sidebar", () => {
  it("renders the logo, groups and items", () => {
    render(<Sidebar logo={<span>Logo</span>} groups={groups} />);
    expect(screen.getByText("Logo")).toBeInTheDocument();
    expect(screen.getByText("Operação")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Visão geral" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Solicitações" })).toBeInTheDocument();
  });

  it("applies the expanded width by default and the collapsed width when collapsed", () => {
    const { rerender, container } = render(<Sidebar logo={<span>Logo</span>} groups={groups} />);
    expect(container.querySelector("aside")).toHaveClass("w-sidebar-expanded");

    rerender(<Sidebar logo={<span>Logo</span>} groups={groups} collapsed />);
    expect(container.querySelector("aside")).toHaveClass("w-sidebar-collapsed");
  });

  it("calls onToggleCollapse when the toggle button is clicked", async () => {
    const user = userEvent.setup();
    const onToggleCollapse = vi.fn();
    render(
      <Sidebar logo={<span>Logo</span>} groups={groups} onToggleCollapse={onToggleCollapse} />,
    );

    await user.click(screen.getByRole("button", { name: "Recolher menu" }));
    expect(onToggleCollapse).toHaveBeenCalledTimes(1);
  });

  it("does not render a toggle button when onToggleCollapse is not provided", () => {
    render(<Sidebar logo={<span>Logo</span>} groups={groups} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders the footer slot when provided", () => {
    render(<Sidebar logo={<span>Logo</span>} groups={groups} footer={<span>Perfil</span>} />);
    expect(screen.getByText("Perfil")).toBeInTheDocument();
  });

  it("calls a function footer with the current collapsed state", () => {
    const footer = vi.fn((collapsed: boolean) => (
      <span>{collapsed ? "Recolhido" : "Expandido"}</span>
    ));
    const { rerender } = render(
      <Sidebar logo={<span>Logo</span>} groups={groups} footer={footer} />,
    );
    expect(screen.getByText("Expandido")).toBeInTheDocument();

    rerender(<Sidebar logo={<span>Logo</span>} groups={groups} footer={footer} collapsed />);
    expect(screen.getByText("Recolhido")).toBeInTheDocument();
  });

  it("renders logoCollapsed instead of logo when collapsed", () => {
    render(
      <Sidebar
        logo={<span>Logo expandido</span>}
        logoCollapsed={<span>Logo colapsado</span>}
        groups={groups}
        collapsed
      />,
    );
    expect(screen.queryByText("Logo expandido")).not.toBeInTheDocument();
    expect(screen.getByText("Logo colapsado")).toBeInTheDocument();
  });

  it("uses the icon-only toggle button when collapsed", () => {
    render(
      <Sidebar logo={<span>Logo</span>} groups={groups} collapsed onToggleCollapse={() => {}} />,
    );
    expect(screen.queryByText("Recolher")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Expandir menu" })).toBeInTheDocument();
  });

  it("applies dense spacing classes when density is dense", () => {
    const { container } = render(
      <Sidebar logo={<span>Logo</span>} groups={groups} density="dense" />,
    );
    expect(container.querySelector("nav")).toHaveClass("gap-3");
  });

  it("propagates activePath so exactly one item is marked active", () => {
    render(<Sidebar logo={<span>Logo</span>} groups={groups} activePath="/admin/solicitacoes" />);
    expect(screen.getByRole("link", { name: "Solicitações" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Visão geral" })).not.toHaveAttribute("aria-current");
  });

  it("does not leak the active state to a sibling group when the winning route belongs to another group", () => {
    // "Visão geral" (/admin) e "Solicitações" (/admin/solicitacoes) em
    // grupos diferentes — reproduz o layout real do ADMIN, onde a raiz do
    // contexto fica isolada da seção "Operação".
    const groupsAcrossSections = [
      { items: [{ label: "Visão geral", href: "/admin", icon: LayoutDashboard }] },
      {
        title: "Operação",
        items: [{ label: "Solicitações", href: "/admin/solicitacoes", icon: FileText }],
      },
    ];

    render(
      <Sidebar
        logo={<span>Logo</span>}
        groups={groupsAcrossSections}
        activePath="/admin/solicitacoes/123"
      />,
    );

    expect(screen.getByRole("link", { name: "Solicitações" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Visão geral" })).not.toHaveAttribute("aria-current");
  });
});
