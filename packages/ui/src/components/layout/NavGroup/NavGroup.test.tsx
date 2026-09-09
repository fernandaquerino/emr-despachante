import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FileText, LayoutDashboard } from "lucide-react";
import { NavGroup } from "./NavGroup";

const items = [
  { label: "Visão geral", href: "/admin", icon: LayoutDashboard },
  { label: "Solicitações", href: "/admin/solicitacoes", icon: FileText },
];

describe("NavGroup", () => {
  it("renders the title and all visible items", () => {
    render(<NavGroup title="Operação" items={items} />);
    expect(screen.getByText("Operação")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Visão geral" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Solicitações" })).toBeInTheDocument();
  });

  it("omits the title when not provided", () => {
    render(<NavGroup items={items} />);
    expect(screen.queryByText("Operação")).not.toBeInTheDocument();
  });

  it("filters out hidden items", () => {
    render(
      <NavGroup
        items={[
          ...items,
          { label: "Faturas", href: "/admin/faturas", icon: FileText, hidden: true },
        ]}
      />,
    );
    expect(screen.queryByRole("link", { name: "Faturas" })).not.toBeInTheDocument();
  });

  it("renders nothing when every item is hidden", () => {
    const { container } = render(
      <NavGroup
        items={[{ label: "Faturas", href: "/admin/faturas", icon: FileText, hidden: true }]}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("marks exactly one item as active for an exact path match", () => {
    render(<NavGroup items={items} activePath="/admin" />);
    expect(screen.getByRole("link", { name: "Visão geral" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Solicitações" })).not.toHaveAttribute("aria-current");
  });

  it("marks the item active for a nested subroute without also activating the parent", () => {
    render(<NavGroup items={items} activePath="/admin/solicitacoes/123" />);
    expect(screen.getByRole("link", { name: "Solicitações" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Visão geral" })).not.toHaveAttribute("aria-current");
  });

  it("does not activate a sibling route that only shares a string prefix", () => {
    render(
      <NavGroup
        items={[{ label: "Veículos", href: "/admin/veiculo", icon: FileText }]}
        activePath="/admin/veiculos"
      />,
    );
    expect(screen.getByRole("link", { name: "Veículos" })).not.toHaveAttribute("aria-current");
  });
});
