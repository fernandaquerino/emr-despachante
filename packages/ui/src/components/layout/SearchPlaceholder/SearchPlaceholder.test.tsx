import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SearchPlaceholder } from "./SearchPlaceholder";

describe("SearchPlaceholder", () => {
  it("renders the default placeholder text", () => {
    render(<SearchPlaceholder />);
    expect(screen.getByText("Buscar")).toBeInTheDocument();
  });

  it("renders a custom placeholder", () => {
    render(<SearchPlaceholder placeholder="Buscar (Ctrl+K)" />);
    expect(screen.getByText("Buscar (Ctrl+K)")).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<SearchPlaceholder onClick={onClick} />);

    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
