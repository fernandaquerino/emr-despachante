import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Avatar } from "./Avatar";
describe("Avatar", () => {
  it("renders initials when there is no image", () => {
    render(<Avatar name="Fernanda Querino" />);
    expect(screen.getByRole("img", { name: "Fernanda Querino" })).toHaveTextContent("FQ");
  });

  it("renders an image when src is provided", () => {
    render(<Avatar name="Fernanda Querino" src="https://example.com/avatar.png" />);
    const img = screen.getByRole("img", { name: "Fernanda Querino" });
    expect(img.tagName).toBe("IMG");
    expect(img).toHaveAttribute("src", "https://example.com/avatar.png");
  });
});
