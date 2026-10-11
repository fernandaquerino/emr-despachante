import {
  VEHICLE_LOOKUP_PATH,
  type ConsultErrorCode,
  type ConsultInput,
  type ConsultOutcome,
  type ConsultVehicle,
  type PendingItem,
  sumPendingCents,
} from "./contract";

/**
 * Cliente HTTP da consulta pública. Único lugar do app que conhece status
 * HTTP, formato de corpo e timeout — a UI consome `ConsultOutcome`.
 *
 * Regras duras aqui:
 * - **Nunca lançar** para a UI: rede, timeout, 5xx e corpo inesperado todos
 *   viram `unavailable`. Um `throw` virando "erro genérico" apagaria a
 *   diferença entre "não encontramos" e "não conseguimos consultar".
 * - **Nunca logar** placa ou RENAVAM (`SECURITY_ARCHITECTURE.md:174`).
 * - **Nunca inventar dado**: corpo que não casa com o contrato é
 *   indisponibilidade, não resultado parcial fabricado.
 */

/** Consulta de órgão é lenta; acima disso a espera deixa de ser informativa. */
const REQUEST_TIMEOUT_MS = 15_000;

export interface FetchVehicleLookupOptions {
  /** Cancelamento vindo do chamador (troca de consulta, unmount). */
  signal?: AbortSignal;
  baseUrl: string;
  timeoutMs?: number;
}

export async function fetchVehicleLookup(
  input: ConsultInput,
  { signal, baseUrl, timeoutMs = REQUEST_TIMEOUT_MS }: FetchVehicleLookupOptions,
): Promise<ConsultOutcome> {
  const timeout = AbortSignal.timeout(timeoutMs);
  // O abort do chamador e o do timeout precisam valer os dois.
  const combinedSignal = signal ? AbortSignal.any([signal, timeout]) : timeout;

  let response: Response;
  try {
    response = await fetch(new URL(VEHICLE_LOOKUP_PATH, baseUrl), {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      // `renavam` entra no corpo só quando existe — e nunca na URL, para não
      // vazar em access log/Referer/histórico (ADR-019).
      body: JSON.stringify(
        input.renavam ? { plate: input.plate, renavam: input.renavam } : { plate: input.plate },
      ),
      signal: combinedSignal,
    });
  } catch (error) {
    // Cancelamento do chamador não é falha de consulta: quem cancelou já sabe
    // o que fazer, e sobrescrever o estado aqui causaria a corrida que o
    // cancelamento existe para evitar.
    if (signal?.aborted) {
      throw error;
    }
    return { status: "unavailable" };
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    // 5xx costuma vir sem corpo JSON; o status ainda diz o suficiente.
    body = undefined;
  }

  if (!response.ok) {
    return mapErrorResponse(response.status, body);
  }

  return parseLookupBody(body);
}

/**
 * Prefere o código de domínio ao status HTTP (`CLAUDE.md` §21: o frontend
 * trata código, não mensagem). O status é o fallback para quando o corpo não
 * veio ou não segue o contrato — um proxy ou gateway no caminho pode responder
 * um 502 de texto puro, e isso continua sendo indisponibilidade.
 */
function mapErrorResponse(status: number, body: unknown): ConsultOutcome {
  switch (readErrorCode(body)) {
    case "VEHICLE_NOT_FOUND":
      return { status: "not_found" };
    case "VEHICLE_LOOKUP_RATE_LIMITED":
      return { status: "rate_limited" };
    case "VEHICLE_LOOKUP_INVALID_PLATE":
      // O cliente já valida o formato antes de chamar: chegar aqui é
      // divergência de contrato, não algo corrigível nesta tela.
      return { status: "unavailable" };
    case "VEHICLE_LOOKUP_UNAVAILABLE":
      return { status: "unavailable" };
  }

  if (status === 404) return { status: "not_found" };
  if (status === 429) return { status: "rate_limited" };
  return { status: "unavailable" };
}

const ERROR_CODES: readonly ConsultErrorCode[] = [
  "VEHICLE_NOT_FOUND",
  "VEHICLE_LOOKUP_INVALID_PLATE",
  "VEHICLE_LOOKUP_RATE_LIMITED",
  "VEHICLE_LOOKUP_UNAVAILABLE",
];

function readErrorCode(body: unknown): ConsultErrorCode | undefined {
  if (!isRecord(body)) return undefined;
  const { code } = body;
  return ERROR_CODES.find((known) => known === code);
}

/**
 * Validação defensiva da resposta: um 200 com corpo fora do contrato é
 * indisponibilidade. Sem `zod` no projeto (não é dependência do repo), a
 * checagem é manual e estreita — só o que a UI realmente usa.
 */
export function parseLookupBody(body: unknown): ConsultOutcome {
  if (!isRecord(body)) {
    return { status: "unavailable" };
  }

  if (body.status === "renavam_required") {
    return { status: "renavam_required" };
  }

  if (body.status !== "completed") {
    return { status: "unavailable" };
  }

  const vehicle = parseVehicle(body.vehicle);
  const lastUpdatedAt = parseDate(body.lastUpdatedAt);
  if (!vehicle || !lastUpdatedAt || typeof body.consultationId !== "string") {
    return { status: "unavailable" };
  }

  const pendings = parsePendings(body.pendings);
  if (!pendings) {
    return { status: "unavailable" };
  }

  const unavailableSources = parseStringArray(body.unavailableSources);

  return {
    status: "completed",
    consultationId: body.consultationId,
    vehicle,
    pendings,
    // O total é derivado, nunca lido do corpo: um total divergente da lista
    // mostraria dois números contraditórios na mesma tela.
    totalCents: sumPendingCents(pendings),
    lastUpdatedAt,
    ...(unavailableSources?.length ? { unavailableSources } : {}),
  };
}

const VEHICLE_STATUSES = [
  "REGULAR",
  "ATTENTION",
  "IRREGULAR",
  "PROCESSING",
  "MANUAL_REVIEW",
  "UNKNOWN",
] as const;

const PENDING_KINDS = ["fine", "licensing", "payment"] as const;

function parseVehicle(value: unknown): ConsultVehicle | undefined {
  if (!isRecord(value)) return undefined;
  const { plate, model, year, overallStatus } = value;
  if (typeof plate !== "string" || typeof model !== "string" || typeof year !== "number") {
    return undefined;
  }
  if (!isOneOf(overallStatus, VEHICLE_STATUSES)) return undefined;
  return { plate, model, year, overallStatus };
}

function parsePendings(value: unknown): PendingItem[] | undefined {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) return undefined;

  const items: PendingItem[] = [];
  for (const entry of value) {
    if (!isRecord(entry)) return undefined;
    const { id, label, kind, status, amountCents, dueDate, note } = entry;
    if (typeof id !== "string" || typeof label !== "string") return undefined;
    if (!isOneOf(kind, PENDING_KINDS) || typeof status !== "string") return undefined;
    if (amountCents !== undefined && typeof amountCents !== "number") return undefined;

    items.push({
      id,
      label,
      kind,
      // O enum de status é por domínio e validado no servidor; aqui a union
      // discriminada por `kind` já impede um status de outro domínio chegar ao
      // `StatusBadge` errado.
      status,
      ...(typeof amountCents === "number" ? { amountCents } : {}),
      ...(typeof dueDate === "string" ? { dueDate } : {}),
      ...(typeof note === "string" ? { note } : {}),
    } as PendingItem);
  }
  return items;
}

function parseDate(value: unknown): Date | undefined {
  if (typeof value !== "string") return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function parseStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.filter((entry): entry is string => typeof entry === "string");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isOneOf<T extends readonly string[]>(value: unknown, allowed: T): value is T[number] {
  return typeof value === "string" && (allowed as readonly string[]).includes(value);
}
