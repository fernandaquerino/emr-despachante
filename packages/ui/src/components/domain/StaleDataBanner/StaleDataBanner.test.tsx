import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StaleDataBanner } from "./StaleDataBanner";

describe("StaleDataBanner", () => {
  it("shows the relative timestamp and calls onRefresh", async () => {
    const onRefresh = vi.fn();
    const fiveHoursAgo = new Date(Date.now() - 5 * 60 * 60 * 1000);
    render(<StaleDataBanner lastUpdatedAt={fiveHoursAgo} onRefresh={onRefresh} />);

    expect(screen.getByRole("status")).toHaveTextContent(/última atualização/i);
    await userEvent.click(screen.getByRole("button", { name: "Atualizar" }));
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it("disables the refresh button while refreshing", () => {
    render(<StaleDataBanner lastUpdatedAt={new Date()} onRefresh={() => {}} refreshing />);
    expect(screen.getByRole("button", { name: "Atualizando…" })).toBeDisabled();
  });
});
