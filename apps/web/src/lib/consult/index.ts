import { fetchVehicleLookup } from "./client";
import { lookupVehicleMock } from "./mock";
import type { ConsultInput, ConsultOutcome } from "./contract";

export type {
  ConsultErrorCode,
  ConsultInput,
  ConsultOutcome,
  ConsultVehicle,
  PendingItem,
  PendingItemKind,
} from "./contract";
export { sumPendingCents, VEHICLE_LOOKUP_PATH } from "./contract";
export { MOCK_PLATES } from "./mock";

/**
 * Porta única da consulta de veículo — é isto que a UI importa, nunca
 * `client.ts` nem `mock.ts` direto.
 *
 * A escolha da fonte é de ambiente, não de código: `NEXT_PUBLIC_CONSULT_SOURCE`
 * fica em `mock` enquanto `BE-VEH-001` (#159) não estiver no ar, e vira `api`
 * sem tocar em componente nenhum. Validação da variável em `src/config/env.ts`.
 *
 * `process.env.NEXT_PUBLIC_*` é inlined pelo Next no bundle do cliente, então
 * a leitura funciona nos dois lados. Os valores entram como argumento default
 * para que os testes possam injetá-los.
 */
export interface LookupVehicleOptions {
  signal?: AbortSignal;
  source?: string;
  baseUrl?: string;
}

export async function lookupVehicle(
  input: ConsultInput,
  {
    signal,
    source = process.env.NEXT_PUBLIC_CONSULT_SOURCE,
    baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL,
  }: LookupVehicleOptions = {},
): Promise<ConsultOutcome> {
  if (source === "api" && baseUrl) {
    return fetchVehicleLookup(input, { signal, baseUrl });
  }
  return lookupVehicleMock(input);
}
