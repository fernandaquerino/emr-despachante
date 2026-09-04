import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "./Pagination";

describe("Pagination", () => {
  it("marks the current page and disables the boundary buttons", () => {
    render(<Pagination page={1} pageCount={3} onPageChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Página 1" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("button", { name: "Página anterior" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Próxima página" })).not.toBeDisabled();
  });

  it("calls onPageChange with the clicked page", async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={1} pageCount={3} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Página 2" }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("collapses distant pages with an ellipsis", () => {
    render(<Pagination page={1} pageCount={26} onPageChange={() => {}} />);
    expect(screen.getByText("…")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Página 26" })).toBeInTheDocument();
  });
});
