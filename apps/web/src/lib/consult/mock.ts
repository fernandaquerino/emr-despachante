import {
  type ConsultInput,
  type ConsultOutcome,
  type ConsultVehicle,
  type PendingItem,
  sumPendingCents,
} from "./contract";

/**
 * Implementação de desenvolvimento da consulta, usada enquanto `BE-VEH-001`
 * (#159) está aberta — e ela depende de `INT-GOV-001` (#203), cinco
 * milestones à frente. Sem isto, `/consultar` não teria como existir.
 *
 * Dataset fictício, documentado em `docs/product/PROTOTYPE_DATA.md`. Segue
 * ADR-004 (mock do adapter governamental com latência, falha e
 * inconsistência controladas) — aqui no nível do frontend, porque o adapter
 * de verdade ainda não existe.
 *
 * **Honestidade acima de completude:** uma placa válida que não está no
 * dataset **não** retorna `not_found`. Dizer "não encontramos este veículo"
 * afirmaria que consultamos a base do órgão, o que não aconteceu. Ela retorna
 * `unavailable`, que é literalmente verdade: não conseguimos consultar agora.
 * `not_found` só sai para a placa designada abaixo, para que o estado seja
 * alcançável em teste e demonstração.
 *
 * Nenhum valor aqui é tabela de preço: só aparecem débitos de órgão, nunca a
 * taxa da EMR (RF-048 ainda é requisito, não dado confirmado).
 */

/** Latência simulada para que os estados de loading sejam reais, não um frame invisível. */
const SIMULATED_LATENCY_MS = 900;

/** Placas designadas para os estados que não dependem de dataset. */
export const MOCK_PLATES = {
  /** Exige RENAVAM na primeira tentativa e conclui no reenvio. */
  renavamRequired: "MNO5P67",
  notFound: "PQR8S90",
  unavailable: "TUV1X23",
} as const;

interface MockEntry {
  vehicle: ConsultVehicle;
  pendings: PendingItem[];
  unavailableSources?: string[];
  /** Quando `true`, a primeira consulta sem RENAVAM devolve `renavam_required`. */
  requiresRenavam?: boolean;
}

const MOCK_VEHICLES: Record<string, MockEntry> = {
  ABC1D23: {
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
        id: "fine-2",
        kind: "fine",
        label: "Multa — estacionamento irregular",
        amountCents: 13066,
        dueDate: "2026-10-27",
        status: "OPEN",
      },
      {
        id: "licensing-1",
        kind: "licensing",
        label: "Licenciamento 2026",
        dueDate: "2026-10-31",
        status: "BLOCKED",
        note: "Bloqueado enquanto houver multa em aberto.",
      },
    ],
  },
  DEF4G56: {
    vehicle: { plate: "DEF4G56", model: "Toyota Corolla", year: 2021, overallStatus: "PROCESSING" },
    pendings: [
      {
        id: "payment-1",
        kind: "payment",
        label: "Licenciamento 2026",
        amountCents: 18742,
        status: "PAID",
        note: "Pagamento confirmado. Estamos aguardando a atualização do órgão.",
      },
    ],
  },
  // Sem pendência nesta consulta — `completed` com `pendings` vazio, nunca um
  // atestado de regularidade.
  GHI7J89: {
    vehicle: { plate: "GHI7J89", model: "VW T-Cross", year: 2023, overallStatus: "REGULAR" },
    pendings: [],
  },
  // Partial failure: um órgão não respondeu.
  JKL2M34: {
    vehicle: { plate: "JKL2M34", model: "Chevrolet Onix", year: 2020, overallStatus: "ATTENTION" },
    pendings: [
      {
        id: "fine-3",
        kind: "fine",
        label: "Multa — excesso de velocidade",
        amountCents: 19572,
        dueDate: "2026-12-03",
        status: "OPEN",
      },
    ],
    unavailableSources: ["IPVA (Sefaz)"],
  },
  [MOCK_PLATES.renavamRequired]: {
    vehicle: {
      plate: MOCK_PLATES.renavamRequired,
      model: "Fiat Argo",
      year: 2019,
      overallStatus: "ATTENTION",
    },
    requiresRenavam: true,
    pendings: [
      {
        id: "fine-4",
        kind: "fine",
        label: "Multa — transitar em faixa exclusiva",
        amountCents: 13066,
        dueDate: "2026-11-30",
        status: "OPEN",
      },
    ],
  },
};

export async function lookupVehicleMock(input: ConsultInput): Promise<ConsultOutcome> {
  await delay(SIMULATED_LATENCY_MS);

  if (input.plate === MOCK_PLATES.notFound) {
    return { status: "not_found" };
  }
  if (input.plate === MOCK_PLATES.unavailable) {
    return { status: "unavailable" };
  }

  const entry = MOCK_VEHICLES[input.plate];
  if (!entry) {
    // Ver nota de honestidade no topo: desconhecido ≠ inexistente.
    return { status: "unavailable" };
  }

  if (entry.requiresRenavam && !input.renavam) {
    return { status: "renavam_required" };
  }

  return {
    status: "completed",
    consultationId: mockConsultationId(input.plate),
    vehicle: entry.vehicle,
    pendings: entry.pendings,
    totalCents: sumPendingCents(entry.pendings),
    lastUpdatedAt: new Date(),
    ...(entry.unavailableSources ? { unavailableSources: entry.unavailableSources } : {}),
  };
}

/**
 * Determinístico para que `/consultar/:id` seja reproduzível em
 * desenvolvimento. No servidor o id será opaco — a UI nunca deve derivar
 * significado dele.
 */
function mockConsultationId(plate: string): string {
  return `mock-${plate.toLowerCase()}`;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
