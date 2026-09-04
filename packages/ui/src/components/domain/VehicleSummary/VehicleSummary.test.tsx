import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VehicleSummary } from "./VehicleSummary";

const vehicle = {
  plate: "ABC1D23",
  model: "Honda HR-V",
  year: 2022,
  overallStatus: "IRREGULAR" as const,
};

describe("VehicleSummary", () => {
  it("renders the plate, status and calls onOpen", async () => {
    const onOpen = vi.fn();
    render(<VehicleSummary vehicle={vehicle} lastUpdatedAt={new Date()} onOpen={onOpen} />);

    expect(screen.getByText("ABC1D23")).toBeInTheDocument();
    expect(screen.getByText("Irregular")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Ver veículo →" }));
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it("shows the StaleDataBanner only when lastUpdatedAt is older than 4h", () => {
    const { rerender } = render(
      <VehicleSummary
        vehicle={vehicle}
        lastUpdatedAt={new Date()}
        onOpen={() => {}}
        onRefresh={() => {}}
      />,
    );
    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    const fiveHoursAgo = new Date(Date.now() - 5 * 60 * 60 * 1000);
    rerender(
      <VehicleSummary
        vehicle={vehicle}
        lastUpdatedAt={fiveHoursAgo}
        onOpen={() => {}}
        onRefresh={() => {}}
      />,
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows the block reason as caption when licensing is BLOCKED", () => {
    render(
      <VehicleSummary
        vehicle={vehicle}
        lastUpdatedAt={new Date()}
        onOpen={() => {}}
        licensing={{ status: "BLOCKED", reason: "Bloqueado por multa" }}
      />,
    );
    expect(screen.getByText("Bloqueado por multa")).toBeInTheDocument();
  });
});
