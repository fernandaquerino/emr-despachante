import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SidebarFooter } from "./SidebarFooter";

describe("SidebarFooter", () => {
  it("renders the name and a theme toggle", () => {
    render(<SidebarFooter name="Fernanda Querino" />);
    expect(screen.getByText("Fernanda Querino")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Mudar para tema/ })).toBeInTheDocument();
  });

  it("hides the name text when collapsed but keeps the avatar", () => {
    render(<SidebarFooter name="Fernanda Querino" collapsed />);
    expect(screen.queryByText("Fernanda Querino")).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Fernanda Querino" })).toBeInTheDocument();
  });
});
