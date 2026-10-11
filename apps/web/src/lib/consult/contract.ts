import type { FineStatus, LicensingStatus, PaymentStatus, VehicleOverallStatus } from "@emr/ui";

/**
 * Contrato da consulta pública de veículo por placa.
 *
 * ⚠️ **PENDENTE DE CONFIRMAÇÃO.** `BE-VEH-001` (issue #159) ainda está aberta e
 * não define endpoint, payload, response nem error codes — e
 * `docs/engineering/API_SPEC.md` §Vehicles só lista rotas autenticadas. O que
 * está aqui é a proposta do frontend, registrada em `ADR-019`, para ser
 * confirmada (ou corrigida) quando o backend existir.
 *
 * A UI depende de `ConsultOutcome`, nunca de status HTTP: toda a tradução
 * HTTP → domínio vive em `client.ts`. Se o contrato real divergir, muda um
 * arquivo só.
 */

/** `POST /public/vehicle-lookups` — ver ADR-019 para o porquê de POST. */
export const VEHICLE_LOOKUP_PATH = "/public/vehicle-lookups";

export interface ConsultInput {
  /** Normalizada por `normalizePlate`: uppercase, sem hífen, 7 caracteres. */
  plate: string;
  /**
   * Só presente quando o servidor pediu (`renavam_required`). Nunca enviar
   * campo vazio: dado sensível que não precisa trafegar não trafega
   * (`SECURITY_AND_LGPD.md` §Minimização).
   */
  renavam?: string;
}

/**
 * Erros de domínio estáveis (`CLAUDE.md` §21). O frontend trata **código**,
 * nunca texto de mensagem.
 */
export type ConsultErrorCode =
  | "VEHICLE_NOT_FOUND"
  | "VEHICLE_LOOKUP_INVALID_PLATE"
  | "VEHICLE_LOOKUP_RATE_LIMITED"
  | "VEHICLE_LOOKUP_UNAVAILABLE";

export interface ConsultVehicle {
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

/**
 * Resultado de uma consulta, do ponto de vista da UI.
 *
 * `renavam_required` é **etapa do fluxo, não erro** (requisito explícito de
 * `FE-PUB-002`/#151): a UI pede o campo adicional e reenvia, sem copy de
 * falha.
 *
 * Não existe variante "regular": ausência de pendência é `completed` com
 * `pendings` vazio. Consulta bem-sucedida não é atestado de regularidade —
 * é o que os órgãos responderam **nesta** consulta (`LANDING_PAGE_SPEC.md` §S2).
 */
export type ConsultOutcome =
  | {
      status: "completed";
      /** Identifica a consulta cacheada no servidor; é o `:id` de `/consultar/:id`. */
      consultationId: string;
      vehicle: ConsultVehicle;
      pendings: PendingItem[];
      /** Soma apenas do que tem valor apurado — ver `sumPendingCents`. */
      totalCents: number;
      /** Staleness explícita é obrigatória em dado de órgão (ADR-009). */
      lastUpdatedAt: Date;
      /** Órgãos que não responderam — partial failure (`SCREEN_SPECS.md` §Estados). */
      unavailableSources?: string[];
    }
  | { status: "renavam_required" }
  | { status: "not_found" }
  | { status: "rate_limited" }
  | { status: "unavailable" };

/** Soma apenas o que tem valor apurado — item sem `amountCents` não entra no total. */
export function sumPendingCents(items: readonly PendingItem[]): number {
  return items.reduce((total, item) => total + (item.amountCents ?? 0), 0);
}
