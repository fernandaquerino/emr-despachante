import { describe, expect, it, vi, beforeEach } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useVehicleConsult } from "./use-vehicle-consult";
import type { ConsultOutcome } from "../../../../lib/consult";

const lookupVehicle = vi.hoisted(() => vi.fn());

vi.mock("../../../../lib/consult", () => ({ lookupVehicle }));

const completed = (consultationId: string): ConsultOutcome => ({
  status: "completed",
  consultationId,
  vehicle: { plate: "ABC1D23", model: "Honda HR-V", year: 2022, overallStatus: "IRREGULAR" },
  pendings: [],
  totalCents: 0,
  lastUpdatedAt: new Date(),
});

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}

beforeEach(() => {
  lookupVehicle.mockReset();
});

/**
 * A guarda de corrida é testada no hook, não pela UI: o formulário desabilita
 * os campos e o botão durante o `loading`, então duas consultas simultâneas
 * não são alcançáveis por clique. O invariante continua valendo — é o nível
 * do hook que realmente o protege (CLAUDE.md §22).
 */
describe("useVehicleConsult — condição de corrida", () => {
  it("discards a stale response so it cannot overwrite a newer one", async () => {
    const first = deferred<ConsultOutcome>();
    const second = deferred<ConsultOutcome>();
    lookupVehicle.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);

    const { result } = renderHook(() => useVehicleConsult());

    act(() => result.current.setPlate("ABC1D23"));
    act(() => {
      result.current.submit();
    });
    act(() => result.current.setPlate("JKL2M34"));
    act(() => {
      result.current.submit();
    });

    expect(lookupVehicle).toHaveBeenCalledTimes(2);

    // A segunda resolve primeiro.
    await act(async () => {
      second.resolve(completed("lookup-second"));
      await second.promise;
    });

    await waitFor(() => {
      expect(result.current.state.status).toBe("completed");
    });
    expect(
      result.current.state.status === "completed" && result.current.state.result.consultationId,
    ).toBe("lookup-second");

    // A primeira chega atrasada e é descartada.
    await act(async () => {
      first.resolve(completed("lookup-first"));
      await first.promise;
    });

    expect(
      result.current.state.status === "completed" && result.current.state.result.consultationId,
    ).toBe("lookup-second");
  });

  it("aborts the in-flight request when a newer one starts", async () => {
    const signals: Array<AbortSignal | undefined> = [];
    lookupVehicle.mockImplementation((_input, options) => {
      signals.push(options?.signal);
      return new Promise(() => {});
    });

    const { result } = renderHook(() => useVehicleConsult());

    act(() => result.current.setPlate("ABC1D23"));
    act(() => {
      result.current.submit();
    });
    act(() => result.current.setPlate("JKL2M34"));
    act(() => {
      result.current.submit();
    });

    // Cortar na rede evita gastar o rate limit com resposta que ninguém usa.
    expect(signals[0]?.aborted).toBe(true);
    expect(signals[1]?.aborted).toBe(false);
  });
});

describe("useVehicleConsult — RENAVAM", () => {
  it("keeps the field visible across the resubmit loading state", async () => {
    const pending = deferred<ConsultOutcome>();
    lookupVehicle
      .mockResolvedValueOnce({ status: "renavam_required" })
      .mockReturnValueOnce(pending.promise);

    const { result } = renderHook(() => useVehicleConsult());

    act(() => result.current.setPlate("MNO5P67"));
    await act(async () => {
      result.current.submit();
    });
    await waitFor(() => expect(result.current.renavamRequired).toBe(true));

    act(() => result.current.setRenavam("12345678901"));
    act(() => {
      result.current.submit();
    });

    // Durante o loading do reenvio o campo não pode desaparecer, ou leva
    // embora o que a pessoa acabou de digitar.
    expect(result.current.state.status).toBe("loading");
    expect(result.current.renavamRequired).toBe(true);
    expect(result.current.renavam).toBe("12345678901");
    // `pending` fica sem resolver de propósito: o que este teste observa é o
    // estado durante o loading.
    void pending;
  });

  it("left-pads a 9-digit RENAVAM to the canonical 11 digits", async () => {
    lookupVehicle
      .mockResolvedValueOnce({ status: "renavam_required" })
      .mockResolvedValueOnce(completed("lookup-1"));

    const { result } = renderHook(() => useVehicleConsult());

    act(() => result.current.setPlate("MNO5P67"));
    await act(async () => {
      result.current.submit();
    });
    await waitFor(() => expect(result.current.renavamRequired).toBe(true));

    act(() => result.current.setRenavam("123456789"));
    await act(async () => {
      result.current.submit();
    });

    await waitFor(() => expect(lookupVehicle).toHaveBeenCalledTimes(2));
    expect(lookupVehicle.mock.calls[1]?.[0]).toEqual({
      plate: "MNO5P67",
      renavam: "00123456789",
    });
  });

  it("clears the RENAVAM request on reset, so the next plate starts clean", async () => {
    lookupVehicle.mockResolvedValue({ status: "renavam_required" });

    const { result } = renderHook(() => useVehicleConsult());

    act(() => result.current.setPlate("MNO5P67"));
    await act(async () => {
      result.current.submit();
    });
    await waitFor(() => expect(result.current.renavamRequired).toBe(true));

    act(() => result.current.reset());

    expect(result.current.renavamRequired).toBe(false);
    expect(result.current.plate).toBe("");
    expect(result.current.renavam).toBe("");
    expect(result.current.state.status).toBe("idle");
  });
});

describe("useVehicleConsult — normalização", () => {
  it("normalizes the plate as it is typed and pasted", () => {
    const { result } = renderHook(() => useVehicleConsult());

    act(() => result.current.setPlate("abc-1234"));
    expect(result.current.plate).toBe("ABC1234");

    act(() => result.current.setPlate(" abc 1d23 "));
    expect(result.current.plate).toBe("ABC1D23");
  });

  it("keeps only digits in the RENAVAM", () => {
    const { result } = renderHook(() => useVehicleConsult());

    act(() => result.current.setRenavam("123.456.789-01"));
    expect(result.current.renavam).toBe("12345678901");
  });

  it("does not call the lookup with an invalid plate", () => {
    const { result } = renderHook(() => useVehicleConsult());

    act(() => result.current.setPlate("AB1"));
    act(() => {
      expect(result.current.submit()).toBe(false);
    });

    expect(lookupVehicle).not.toHaveBeenCalled();
    expect(result.current.errors.plate).toBe("Placa inválida. Use ABC-1234 ou ABC1D23.");
  });
});
