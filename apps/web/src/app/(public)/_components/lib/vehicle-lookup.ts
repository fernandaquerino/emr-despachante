import type { FineStatus, LicensingStatus, PaymentStatus, VehicleOverallStatus } from "@emr/ui";

/**
 * Seam única entre a landing e a consulta real por placa.
 *
 * A rota `/consultar` e o endpoint de consulta ainda não existem neste
 * repositório (FE-PUB-002 / backend). Até existirem, `lookupVehicle` resolve
 * a partir do dataset de prototipação documentado em
 * `docs/product/PROTOTYPE_DATA.md`. Quando a API existir, **só este arquivo
 * muda**: a assinatura (`Promise<LookupOutcome>`) e os estados que a UI já
 * trata permanecem iguais.
 *
 * Honestidade em produção: uma placa válida que não está no dataset NÃO
 * retorna "não encontramos" — retornar isso seria afirmar que consultamos a
 * base do órgão, o que não aconteceu. Ela retorna `prototype_pending`, e a UI
 * diz exatamente o que é verdade: a consulta completa ainda não está no ar.
 */

export interface LookupVehicle {
  plate: string;
  model: string;
  year: number;
  overallStatus: VehicleOverallStatus;
}

export type PendingItemKind = "fine" | "licensing" | "payment";

interface PendingItemBase {
  id: string;
  label: string;
  /** `undefined` quando o valor depende de etapa posterior (ex.: taxa do órgão ainda não apurada). */
  amountCents?: number;
  dueDate?: string;
  /** Ex.: motivo de um licenciamento bloqueado. */
  note?: string;
}

/**
 * Union discriminada por `kind` para que cada item carregue o enum do seu
 * próprio domínio. `StatusBadge` é genérico por domínio e nunca aceita string
 * livre (COMPONENTS.md §Status) — com a union, a UI narrowa no `switch` e
 * dispensa cast.
 */
export type PendingItem =
  | (PendingItemBase & { kind: "fine"; status: FineStatus })
  | (PendingItemBase & { kind: "licensing"; status: LicensingStatus })
  | (PendingItemBase & { kind: "payment"; status: PaymentStatus });

export type LookupOutcome =
  | {
      kind: "pending";
      vehicle: LookupVehicle;
      items: PendingItem[];
      totalCents: number;
      lastUpdatedAt: Date;
      /** Órgãos que não responderam — partial failure (SCREEN_SPECS.md §Estados). */
      unavailableSources?: string[];
    }
  | { kind: "regular"; vehicle: LookupVehicle; lastUpdatedAt: Date }
  | { kind: "prototype_pending"; plate: string }
  | { kind: "error" };

/**
 * Valores fictícios, como todo o conteúdo de `PROTOTYPE_DATA.md`. Não são
 * tabela de preços: nenhum preço/taxa da EMR está confirmado no repositório
 * (RF-048 ainda é requisito, não dado), por isso aqui só aparecem valores de
 * débito do órgão — nunca a taxa EMR.
 */
interface PrototypePending {
  vehicle: LookupVehicle;
  items: PendingItem[];
  unavailableSources?: string[];
}

const prototypeVehicles: Record<string, PrototypePending | { regular: LookupVehicle }> = {
  ABC1D23: {
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
    items: [
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
  GHI7J89: {
    regular: { plate: "GHI7J89", model: "VW T-Cross", year: 2023, overallStatus: "REGULAR" },
  },
  JKL2M34: {
    vehicle: { plate: "JKL2M34", model: "Chevrolet Onix", year: 2020, overallStatus: "ATTENTION" },
    items: [
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
};

/** Soma apenas o que tem valor apurado — item sem `amountCents` não entra no total. */
function sumPendingCents(items: PendingItem[]): number {
  return items.reduce((total, item) => total + (item.amountCents ?? 0), 0);
}

export async function lookupVehicle(normalizedPlate: string): Promise<LookupOutcome> {
  // Latência simulada para que os estados de loading da UI sejam reais e não
  // um frame invisível. Sai junto com o dataset quando a API entrar.
  await new Promise((resolve) => setTimeout(resolve, 900));

  const entry = prototypeVehicles[normalizedPlate];
  if (!entry) {
    return { kind: "prototype_pending", plate: normalizedPlate };
  }

  const lastUpdatedAt = new Date();

  if ("regular" in entry) {
    return { kind: "regular", vehicle: entry.regular, lastUpdatedAt };
  }

  return {
    kind: "pending",
    vehicle: entry.vehicle,
    items: entry.items,
    totalCents: sumPendingCents(entry.items),
    lastUpdatedAt,
    unavailableSources: entry.unavailableSources,
  };
}
