import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { LoadingState } from "./LoadingState";

describe("LoadingState", () => {
  it("is hidden from assistive tech (parent owns the busy announcement)", () => {
    const { container } = render(<LoadingState variant="list" count={2} />);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });

  it("renders the requested number of skeleton rows per variant", () => {
    const { container: list } = render(<LoadingState variant="list" count={4} />);
    expect(list.firstChild?.firstChild?.childNodes).toHaveLength(4);

    const { container: table } = render(<LoadingState variant="table" count={5} />);
    expect(table.firstChild?.firstChild?.childNodes).toHaveLength(5);
  });
});
