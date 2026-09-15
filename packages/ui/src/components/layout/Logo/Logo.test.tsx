import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Logo } from "./Logo";

describe("Logo", () => {
  it("renders the full lockup with an accessible name by default", () => {
    const { container } = render(<Logo />);

    expect(screen.getByRole("img", { name: "EMR Despachantes" })).toBeInTheDocument();
    expect(container.querySelector("img")?.getAttribute("src")).toContain("logo-full.svg");
  });

  it("renders the official mark asset when variant is mark", () => {
    const { container } = render(<Logo variant="mark" />);

    expect(screen.getByRole("img", { name: "EMR Despachantes" })).toBeInTheDocument();
    expect(container.querySelector("img")?.getAttribute("src")).toContain("logo-mark.svg");
  });

  it("accepts a custom accessible label", () => {
    render(<Logo label="Página inicial da EMR" />);

    expect(screen.getByRole("img", { name: "Página inicial da EMR" })).toBeInTheDocument();
  });

  it("is hidden from the accessibility tree when decorative", () => {
    const { container } = render(<Logo decorative />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });

  it("keeps the asset decorative and applies the inverse treatment", () => {
    const { container } = render(<Logo variant="mark" tone="inverse" />);
    const image = container.querySelector("img");

    expect(image).toHaveAttribute("alt", "");
    expect(image).toHaveAttribute("aria-hidden", "true");
    expect(image).toHaveClass("brightness-0", "invert");
  });

  it.each([
    ["sm", "h-6"],
    ["md", "h-8"],
    ["lg", "h-10"],
  ] as const)("applies the %s size to the complete asset", (size, expectedClass) => {
    render(<Logo size={size} />);

    expect(screen.getByRole("img")).toHaveClass(expectedClass);
  });
});
