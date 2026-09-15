import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FileText } from "lucide-react";
import { NavItem } from "./NavItem";
import { ComponentProps } from "react";

function FakeLink({ href, children, ...props }: ComponentProps<"a">) {
  return (
    <a data-fake="" href={href} {...props}>
      {children}
    </a>
  );
}

describe("NavItem", () => {
  it("renders the label and links to href", () => {
    render(<NavItem label="Solicitações" href="/admin/solicitacoes" icon={FileText} />);
    expect(screen.getByRole("link", { name: "Solicitações" })).toHaveAttribute(
      "href",
      "/admin/solicitacoes",
    );
  });

  it("marks the item as current page when active", () => {
    render(<NavItem label="Casos" href="/admin/casos" icon={FileText} isActive />);
    expect(screen.getByRole("link", { name: "Casos" })).toHaveAttribute("aria-current", "page");
  });

  it("does not mark aria-current when inactive", () => {
    render(<NavItem label="Casos" href="/admin/casos" icon={FileText} />);
    expect(screen.getByRole("link", { name: "Casos" })).not.toHaveAttribute("aria-current");
  });

  it("hides the visible label but keeps an accessible name when collapsed", () => {
    render(<NavItem label="Casos" href="/admin/casos" icon={FileText} collapsed />);
    expect(screen.queryByText("Casos")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Casos" })).toBeInTheDocument();
  });

  it("renders a badge when provided and not collapsed", () => {
    render(<NavItem label="Casos" href="/admin/casos" icon={FileText} badge={<span>3</span>} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("omits the badge when collapsed", () => {
    render(
      <NavItem
        label="Casos"
        href="/admin/casos"
        icon={FileText}
        badge={<span>3</span>}
        collapsed
      />,
    );
    expect(screen.queryByText("3")).not.toBeInTheDocument();
  });

  it("renders through a custom linkAs component", () => {
    render(<NavItem label="Casos" href="/admin/casos" icon={FileText} linkAs={FakeLink} />);
    expect(screen.getByRole("link", { name: "Casos" })).toHaveAttribute("data-fake", "");
  });
});
