import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select } from "./Select";

const options = [
  { value: "OPEN", label: "Aberto" },
  { value: "RESOLVED", label: "Resolvido" },
];

describe("Select", () => {
  it("associates the label and shows the placeholder when empty", () => {
    render(<Select label="Status" placeholder="Todos os status" options={options} />);
    expect(screen.getByText("Todos os status")).toBeInTheDocument();
    expect(screen.getByLabelText("Status")).toBeInTheDocument();
  });

  it("selects an option and calls onValueChange", async () => {
    const onValueChange = vi.fn();
    render(
      <Select
        label="Status"
        placeholder="Todos os status"
        options={options}
        onValueChange={onValueChange}
      />,
    );

    await userEvent.click(screen.getByRole("combobox", { name: "Status" }));
    await userEvent.click(await screen.findByRole("option", { name: "Resolvido" }));

    expect(onValueChange).toHaveBeenCalledWith("RESOLVED");
  });
});
