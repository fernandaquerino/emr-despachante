import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FileText, LayoutDashboard } from "lucide-react";
import { MobileNav } from "./MobileNav";

const groups = [
  {
    title: "Operação",
    items: [
      { label: "Visão geral", href: "/admin", icon: LayoutDashboard },
      { label: "Solicitações", href: "/admin/solicitacoes", icon: FileText },
    ],
  },
];

describe("MobileNav", () => {
  it("renders the same groups as the Sidebar when open", () => {
    render(<MobileNav open onOpenChange={() => {}} logo={<span>Logo</span>} groups={groups} />);

    expect(screen.getByRole("link", { name: "Visão geral" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Solicitações" })).toBeInTheDocument();
  });

  it("renders nothing visible when closed", () => {
    render(
      <MobileNav open={false} onOpenChange={() => {}} logo={<span>Logo</span>} groups={groups} />,
    );

    expect(screen.queryByRole("link", { name: "Visão geral" })).not.toBeInTheDocument();
  });

  it("calls onOpenChange when the drawer is dismissed", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<MobileNav open onOpenChange={onOpenChange} logo={<span>Logo</span>} groups={groups} />);

    await user.click(screen.getByRole("button", { name: "Fechar" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("propagates activePath to mark the right item active", () => {
    render(
      <MobileNav
        open
        onOpenChange={() => {}}
        logo={<span>Logo</span>}
        groups={groups}
        activePath="/admin/solicitacoes"
      />,
    );

    expect(screen.getByRole("link", { name: "Solicitações" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("calls a function footer with collapsed=false (the drawer never collapses)", () => {
    const footer = vi.fn((collapsed: boolean) => (
      <span>{collapsed ? "Recolhido" : "Expandido"}</span>
    ));
    render(
      <MobileNav
        open
        onOpenChange={() => {}}
        logo={<span>Logo</span>}
        groups={groups}
        footer={footer}
      />,
    );

    expect(screen.getByText("Expandido")).toBeInTheDocument();
  });
});
