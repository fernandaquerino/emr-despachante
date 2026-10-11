import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PlateConsultWidget } from "./PlateConsultWidget";
import type { ConsultOutcome } from "../../../lib/consult";

const lookupVehicle = vi.hoisted(() => vi.fn());

vi.mock("../../../lib/consult", () => ({ lookupVehicle }));

const completedOutcome: ConsultOutcome = {
  status: "completed",
  consultationId: "lookup-1",
  vehicle: { plate: "ABC1D23", model: "Honda HR-V", year: 2022, overallStatus: "IRREGULAR" },
  pendings: [
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

  it("asks only for the plate — no contact and no RENAVAM field before the result", () => {
    render(<PlateConsultWidget />);

    expect(screen.getByLabelText("Placa do veículo")).toBeInTheDocument();
    expect(screen.queryByLabelText("RENAVAM")).not.toBeInTheDocument();
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
    lookupVehicle.mockResolvedValue(completedOutcome);
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

  it("renders the landing result in place, without navigating away", async () => {
    lookupVehicle.mockResolvedValue(completedOutcome);
    const user = userEvent.setup();
    render(<PlateConsultWidget />);

    await user.type(screen.getByLabelText("Placa do veículo"), "ABC1D23");
    await user.click(screen.getByRole("button", { name: "Consultar débitos grátis" }));

    // LANDING_PAGE_SPEC.md §Nota S2: na landing o resultado é estado expandido
    // do widget, não um redirect para /consultar/:id.
    expect(await screen.findByText("Multa — avanço de sinal")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Consultar outra placa" })).toBeInTheDocument();
  });

  it("never claims 'not found' for a plate it could not actually look up", async () => {
    lookupVehicle.mockResolvedValue({ status: "unavailable" });
    const user = userEvent.setup();
    render(<PlateConsultWidget />);

    await user.type(screen.getByLabelText("Placa do veículo"), "XYZ9W87");
    await user.click(screen.getByRole("button", { name: "Consultar débitos grátis" }));

    expect(
      await screen.findByRole("heading", {
        name: "Não conseguimos carregar a situação deste veículo",
      }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/não encontramos/i)).not.toBeInTheDocument();
  });

  it("distinguishes 'not found' from 'could not consult'", async () => {
    lookupVehicle.mockResolvedValue({ status: "not_found" });
    const user = userEvent.setup();
    render(<PlateConsultWidget />);

    await user.type(screen.getByLabelText("Placa do veículo"), "PQR8S90");
    await user.click(screen.getByRole("button", { name: "Consultar débitos grátis" }));

    expect(
      await screen.findByText("Não encontramos um veículo com os dados informados."),
    ).toBeInTheDocument();
    // A placa fica no campo para ser corrigida.
    expect(screen.getByLabelText("Placa do veículo")).toHaveValue("PQR8S90");
  });

  it("asks for the RENAVAM only when the lookup demands it, keeping the plate", async () => {
    lookupVehicle.mockResolvedValue({ status: "renavam_required" });
    const user = userEvent.setup();
    render(<PlateConsultWidget />);

    await user.type(screen.getByLabelText("Placa do veículo"), "MNO5P67");
    await user.click(screen.getByRole("button", { name: "Consultar débitos grátis" }));

    expect(await screen.findByLabelText("RENAVAM")).toBeInTheDocument();
    expect(screen.getByLabelText("Placa do veículo")).toHaveValue("MNO5P67");
    // Pedir um dado a mais não é falha: nenhuma copy de erro aqui.
    expect(screen.queryByText(/não encontramos|não foi possível/i)).not.toBeInTheDocument();
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
