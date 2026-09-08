import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Breadcrumb } from "./Breadcrumb";

const items = [
  { label: "Home", href: "/admin" },
  { label: "Clientes", href: "/admin/clientes" },
  { label: "Fernanda Querino" },
];

describe("Breadcrumb", () => {
  it("renders all items with the last one as current page and unlinked", () => {
    render(<Breadcrumb items={items} />);
    const current = screen.getByText("Fernanda Querino");
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current.tagName).not.toBe("A");
  });

  it("renders earlier items as links", () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/admin");
    expect(screen.getByRole("link", { name: "Clientes" })).toHaveAttribute(
      "href",
      "/admin/clientes",
    );
  });

  it("truncates long labels with a title attribute", () => {
    const longLabel = "Um nome de cliente extremamente longo para truncar";
    render(<Breadcrumb items={[{ label: longLabel }]} />);
    const el = screen.getByText(longLabel);
    expect(el).toHaveClass("truncate");
    expect(el).toHaveAttribute("title", longLabel);
  });
});
