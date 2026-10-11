import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConsultarPage from "./page";
import { ConsultarForm } from "./ConsultarForm";
import type { ConsultOutcome } from "../../../lib/consult";

const lookupVehicle = vi.hoisted(() => vi.fn());
const push = vi.hoisted(() => vi.fn());

vi.mock("../../../lib/consult", () => ({ lookupVehicle }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

const completedOutcome: ConsultOutcome = {
  status: "completed",
  consultationId: "lookup-42",
  vehicle: { plate: "ABC1D23", model: "Honda HR-V", year: 2022, overallStatus: "IRREGULAR" },
  pendings: [
    {
      id: "fine-1",
      kind: "fine",
      label: "Multa — avanço de sinal",
      amountCents: 29519,
      status: "OPEN",
    },
  ],
  totalCents: 29519,
  lastUpdatedAt: new Date(),
};

/** Promise cujo resolve fica nas nossas mãos — para observar o estado de loading. */
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}

const CTA = "Consultar veículo";

beforeEach(() => {
  lookupVehicle.mockReset();
  push.mockReset();
});

describe("/consultar — página", () => {
  it("has a single h1 and states the purpose of the screen", () => {
    render(<ConsultarPage />);

    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent("Consulte a situação do seu veículo");
    expect(
      screen.getByText(
        "Informe a placa para iniciar sua consulta e verificar as informações disponíveis sobre o veículo.",
      ),
    ).toBeInTheDocument();
  });

  it("warns up front that the RENAVAM may be requested", () => {
    render(<ConsultarPage />);
    expect(screen.getByText(/o RENAVAM do veículo pode ser solicitado/i)).toBeInTheDocument();
  });

  it("starts in idle: no RENAVAM field, no result, no request", () => {
    render(<ConsultarPage />);

    expect(screen.getByLabelText("Placa do veículo")).toHaveValue("");
    expect(screen.queryByLabelText("RENAVAM")).not.toBeInTheDocument();
    expect(lookupVehicle).not.toHaveBeenCalled();
  });
});

describe("/consultar — validação", () => {
  it("does not call the API with an invalid plate, and keeps what was typed", async () => {
    const user = userEvent.setup();
    render(<ConsultarForm />);

    await user.type(screen.getByLabelText("Placa do veículo"), "AB1");
    await user.click(screen.getByRole("button", { name: CTA }));

    expect(await screen.findByText("Placa inválida. Use ABC-1234 ou ABC1D23.")).toBeInTheDocument();
    expect(lookupVehicle).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Placa do veículo")).toHaveValue("AB1");
  });

  it("asks for the plate when the field is empty", async () => {
    const user = userEvent.setup();
    render(<ConsultarForm />);

    await user.click(screen.getByRole("button", { name: CTA }));

    expect(await screen.findByText("Informe a placa do veículo.")).toBeInTheDocument();
    expect(lookupVehicle).not.toHaveBeenCalled();
  });

  it("moves focus to the error summary after an invalid submit", async () => {
    const user = userEvent.setup();
    render(<ConsultarForm />);

    await user.type(screen.getByLabelText("Placa do veículo"), "AB1");
    await user.click(screen.getByRole("button", { name: CTA }));

    // UX_RULES.md §5: quem submeteu com o foco no botão precisa ser levado ao erro.
    const summary = await screen.findByRole("alert");
    expect(summary).toHaveFocus();
  });
});

describe("/consultar — loading", () => {
  it("shows progress, renames the button and blocks a duplicate submit", async () => {
    const pending = deferred<ConsultOutcome>();
    lookupVehicle.mockReturnValue(pending.promise);
    const user = userEvent.setup();
    render(<ConsultarForm />);

    await user.type(screen.getByLabelText("Placa do veículo"), "ABC1D23");
    await user.click(screen.getByRole("button", { name: CTA }));

    const button = await screen.findByRole("button", { name: "Consultando veículo…" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    // Feedback acessível, não só o spinner.
    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByText(/Consultando a situação do veículo/i)).toBeInTheDocument();
    // Dado digitado preservado durante a consulta.
    expect(screen.getByLabelText("Placa do veículo")).toHaveValue("ABC1D23");

    await user.click(button);
    expect(lookupVehicle).toHaveBeenCalledTimes(1);

    pending.resolve(completedOutcome);
    await waitFor(() => expect(push).toHaveBeenCalledWith("/consultar/lookup-42"));
  });
});

describe("/consultar — RENAVAM", () => {
  it("reveals the field only when the backend demands it, keeping the plate", async () => {
    lookupVehicle.mockResolvedValue({ status: "renavam_required" });
    const user = userEvent.setup();
    render(<ConsultarForm />);

    await user.type(screen.getByLabelText("Placa do veículo"), "MNO5P67");
    await user.click(screen.getByRole("button", { name: CTA }));

    expect(await screen.findByLabelText("RENAVAM")).toBeInTheDocument();
    expect(screen.getByLabelText("Placa do veículo")).toHaveValue("MNO5P67");
    // Não é erro: nenhuma copy de falha, e a explicação do motivo está na tela.
    expect(
      screen.queryByText(/não encontramos|não foi possível realizar/i),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText("Precisamos do RENAVAM para concluir esta consulta."),
    ).toBeInTheDocument();
  });

  it("validates the RENAVAM before resubmitting", async () => {
    lookupVehicle.mockResolvedValue({ status: "renavam_required" });
    const user = userEvent.setup();
    render(<ConsultarForm />);

    await user.type(screen.getByLabelText("Placa do veículo"), "MNO5P67");
    await user.click(screen.getByRole("button", { name: CTA }));
    await screen.findByLabelText("RENAVAM");

    await user.type(screen.getByLabelText("RENAVAM"), "123");
    await user.click(screen.getByRole("button", { name: CTA }));

    expect(await screen.findByText("RENAVAM inválido. Informe os 11 dígitos.")).toBeInTheDocument();
    expect(lookupVehicle).toHaveBeenCalledTimes(1);
  });

  it("resubmits with both fields and sends the RENAVAM in the payload", async () => {
    lookupVehicle
      .mockResolvedValueOnce({ status: "renavam_required" })
      .mockResolvedValueOnce(completedOutcome);
    const user = userEvent.setup();
    render(<ConsultarForm />);

    await user.type(screen.getByLabelText("Placa do veículo"), "MNO5P67");
    await user.click(screen.getByRole("button", { name: CTA }));
    await screen.findByLabelText("RENAVAM");

    await user.type(screen.getByLabelText("RENAVAM"), "12345678901");
    await user.click(screen.getByRole("button", { name: CTA }));

    await waitFor(() => expect(lookupVehicle).toHaveBeenCalledTimes(2));
    expect(lookupVehicle.mock.calls[0]?.[0]).toEqual({ plate: "MNO5P67" });
    expect(lookupVehicle.mock.calls[1]?.[0]).toEqual({
      plate: "MNO5P67",
      renavam: "12345678901",
    });
  });

  it("does not send the RENAVAM when it was never requested", async () => {
    lookupVehicle.mockResolvedValue(completedOutcome);
    const user = userEvent.setup();
    render(<ConsultarForm />);

    await user.type(screen.getByLabelText("Placa do veículo"), "ABC1D23");
    await user.click(screen.getByRole("button", { name: CTA }));

    await waitFor(() => expect(lookupVehicle).toHaveBeenCalled());
    expect(lookupVehicle.mock.calls[0]?.[0]).toEqual({ plate: "ABC1D23" });
  });
});

describe("/consultar — não encontrado e indisponível", () => {
  it("shows the not-found message and allows a correction", async () => {
    lookupVehicle.mockResolvedValue({ status: "not_found" });
    const user = userEvent.setup();
    render(<ConsultarForm />);

    await user.type(screen.getByLabelText("Placa do veículo"), "PQR8S90");
    await user.click(screen.getByRole("button", { name: CTA }));

    expect(
      await screen.findByText("Não encontramos um veículo com os dados informados."),
    ).toBeInTheDocument();
    // Campo editável e nova tentativa disponível.
    const field = screen.getByLabelText("Placa do veículo");
    expect(field).toBeEnabled();
    expect(field).toHaveValue("PQR8S90");
    expect(screen.getByRole("button", { name: CTA })).toBeEnabled();
  });

  it("shows the unavailable message without clearing the form or inventing data", async () => {
    lookupVehicle.mockResolvedValue({ status: "unavailable" });
    const user = userEvent.setup();
    render(<ConsultarForm />);

    await user.type(screen.getByLabelText("Placa do veículo"), "TUV1X23");
    await user.click(screen.getByRole("button", { name: CTA }));

    expect(
      await screen.findByText(/Não foi possível realizar a consulta agora/),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Placa do veículo")).toHaveValue("TUV1X23");
    // Nenhum dado de veículo na tela: não houve resposta para exibir.
    expect(screen.queryByText("Honda HR-V · 2022")).not.toBeInTheDocument();
    expect(screen.queryByText(/R\$/)).not.toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });

  it("retries the same data from the unavailable state", async () => {
    lookupVehicle
      .mockResolvedValueOnce({ status: "unavailable" })
      .mockResolvedValueOnce(completedOutcome);
    const user = userEvent.setup();
    render(<ConsultarForm />);

    await user.type(screen.getByLabelText("Placa do veículo"), "ABC1D23");
    await user.click(screen.getByRole("button", { name: CTA }));

    await user.click(await screen.findByRole("button", { name: "Tentar novamente" }));

    await waitFor(() => expect(push).toHaveBeenCalledWith("/consultar/lookup-42"));
  });

  it("separates the rate-limited state from a generic failure", async () => {
    lookupVehicle.mockResolvedValue({ status: "rate_limited" });
    const user = userEvent.setup();
    render(<ConsultarForm />);

    await user.type(screen.getByLabelText("Placa do veículo"), "ABC1D23");
    await user.click(screen.getByRole("button", { name: CTA }));

    expect(
      await screen.findByText("Muitas consultas em sequência. Tente em alguns minutos."),
    ).toBeInTheDocument();
  });
});

describe("/consultar — sucesso", () => {
  it("forwards to the result route using the id returned by the backend", async () => {
    lookupVehicle.mockResolvedValue(completedOutcome);
    const user = userEvent.setup();
    render(<ConsultarForm />);

    await user.type(screen.getByLabelText("Placa do veículo"), "ABC1D23");
    await user.click(screen.getByRole("button", { name: CTA }));

    await waitFor(() => expect(push).toHaveBeenCalledWith("/consultar/lookup-42"));
    expect(push).toHaveBeenCalledTimes(1);
  });

  it("never states the vehicle is clear on this screen", async () => {
    lookupVehicle.mockResolvedValue({ ...completedOutcome, pendings: [], totalCents: 0 });
    const user = userEvent.setup();
    render(<ConsultarForm />);

    await user.type(screen.getByLabelText("Placa do veículo"), "GHI7J89");
    await user.click(screen.getByRole("button", { name: CTA }));

    await waitFor(() => expect(push).toHaveBeenCalled());
    // Consulta concluída não é atestado de regularidade — esta tela só encaminha.
    expect(screen.queryByText(/regular|em dia|sem pendências/i)).not.toBeInTheDocument();
  });
});
