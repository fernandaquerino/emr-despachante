import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PlateConsultWidget } from "./PlateConsultWidget";
import type { LookupOutcome } from "./lib/vehicle-lookup";

const lookupVehicle = vi.hoisted(() => vi.fn());

vi.mock("./lib/vehicle-lookup", () => ({ lookupVehicle }));

const pendingOutcome: LookupOutcome = {
  kind: "pending",
  vehicle: { plate: "ABC1D23", model: "Honda HR-V", year: 2022, overallStatus: "IRREGULAR" },
  items: [
    {
      id: "fine-1",
      kind: "fine",
      label: "Multa — avanço de sinal",
      amountCents: 29519,
      dueDate: "2026-11-14",
      status: "OPEN",
    },
    {
      id: "licensing-1",
      kind: "licensing",
      label: "Licenciamento 2026",
      amountCents: 13066,
      dueDate: "2026-10-31",
      status: "BLOCKED",
    },
  ],
  totalCents: 42585,
  lastUpdatedAt: new Date(),
};

describe("PlateConsultWidget", () => {
  beforeEach(() => {
    lookupVehicle.mockReset();
  });

  it("asks only for the plate — no contact field before the result", () => {
    render(<PlateConsultWidget />);

    expect(screen.getByLabelText("Placa do veículo")).toBeInTheDocument();
    expect(screen.queryByLabelText("WhatsApp ou e-mail")).not.toBeInTheDocument();
  });

  it("rejects a malformed plate without calling the lookup", async () => {
    const user = userEvent.setup();
    render(<PlateConsultWidget />);

    await user.type(screen.getByLabelText("Placa do veículo"), "AB1");
    await user.click(screen.getByRole("button", { name: "Consultar débitos grátis" }));

    expect(await screen.findByText("Placa inválida. Use ABC-1234 ou ABC1D23.")).toBeInTheDocument();
    expect(lookupVehicle).not.toHaveBeenCalled();
  });

  it("shows the pending items, the total and the alert opt-in after a successful lookup", async () => {
    lookupVehicle.mockResolvedValue(pendingOutcome);
    const user = userEvent.setup();
    render(<PlateConsultWidget />);

    await user.type(screen.getByLabelText("Placa do veículo"), "ABC1D23");
    await user.click(screen.getByRole("button", { name: "Consultar débitos grátis" }));

    // Cada valor aparece uma vez só: a lista detalha, o total fecha.
    expect(await screen.findByText("Multa — avanço de sinal")).toBeInTheDocument();
    expect(screen.getByText("Total em aberto nos órgãos")).toBeInTheDocument();
    expect(screen.getAllByText("R$ 295,19")).toHaveLength(1);
    expect(screen.getByText("R$ 425,85")).toBeInTheDocument();
    expect(screen.getByText("Em aberto")).toBeInTheDocument();
    // Contato só existe depois do resultado, e com consentimento explícito.
    expect(screen.getByLabelText("WhatsApp ou e-mail")).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", {
        name: "Autorizo a EMR a me enviar avisos sobre este veículo.",
      }),
    ).not.toBeChecked();
  });

  it("never claims 'not found' for a plate it could not actually look up", async () => {
    lookupVehicle.mockResolvedValue({ kind: "prototype_pending", plate: "XYZ9W87" });
    const user = userEvent.setup();
    render(<PlateConsultWidget />);

    await user.type(screen.getByLabelText("Placa do veículo"), "XYZ9W87");
    await user.click(screen.getByRole("button", { name: "Consultar débitos grátis" }));

    expect(await screen.findByText("Placa XYZ9W87 em formato válido.")).toBeInTheDocument();
    expect(screen.queryByText(/não encontramos/i)).not.toBeInTheDocument();
  });

  it("offers a retry when the lookup fails", async () => {
    lookupVehicle.mockRejectedValue(new Error("network"));
    const user = userEvent.setup();
    render(<PlateConsultWidget />);

    await user.type(screen.getByLabelText("Placa do veículo"), "ABC1D23");
    await user.click(screen.getByRole("button", { name: "Consultar débitos grátis" }));

    expect(
      await screen.findByRole("heading", {
        name: "Não conseguimos carregar a situação deste veículo",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tentar novamente" })).toBeInTheDocument();
  });
});
