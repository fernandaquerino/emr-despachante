"use client";

import Link from "next/link";
import { CircleCheckBig } from "lucide-react";
import {
  Alert,
  EmptyState,
  MoneyBreakdown,
  StaleDataBanner,
  StatusBadge,
  buttonVariants,
  cn,
  formatCentsToBRL,
  isStale,
} from "@emr/ui";
import { AlertSubscription } from "./AlertSubscription";
import type { ConsultOutcome, ConsultVehicle, PendingItem } from "../../../lib/consult";

/**
 * Resultado da consulta por placa, renderizado **no lugar** do formulário,
 * dentro do mesmo cartão do widget (LANDING_PAGE_SPEC.md §S2). Não é uma
 * seção separada: uma seção de resultado ficaria vazia antes da primeira
 * consulta e duplicaria a rota `/consultar/:id`.
 *
 * Sem `VehicleSummary` aqui de propósito: aquele componente é um cartão com
 * elevação própria e CTA "Ver veículo" para a lista do proprietário — usá-lo
 * aqui aninharia cartão dentro de cartão e exigiria um `onOpen` falso.
 * O resumo é composto com os mesmos primitivos (placa mono + StatusBadge).
 */
export function ConsultResult({
  outcome,
  onReset,
}: {
  outcome: Extract<ConsultOutcome, { status: "completed" }>;
  onReset: () => void;
}) {
  // Ausência de pendência é resultado, não estado separado — e nunca é
  // atestado de regularidade: o texto fala desta consulta, não do veículo.
  if (outcome.pendings.length === 0) {
    return (
      <div className="flex flex-col gap-5">
        <VehicleHeader
          plate={outcome.vehicle.plate}
          model={outcome.vehicle.model}
          year={outcome.vehicle.year}
          overallStatus={outcome.vehicle.overallStatus}
        />
        <EmptyState
          icon={CircleCheckBig}
          title="Tudo em dia"
          description="Este veículo não tem pendências nesta consulta."
          className="py-4"
        />
        <AlertSubscription plate={outcome.vehicle.plate} />
        <ResetLink onReset={onReset} />
      </div>
    );
  }

  const billableItems = outcome.pendings.filter((item) => item.amountCents !== undefined);

  return (
    <div className="flex flex-col gap-5">
      <VehicleHeader
        plate={outcome.vehicle.plate}
        model={outcome.vehicle.model}
        year={outcome.vehicle.year}
        overallStatus={outcome.vehicle.overallStatus}
      />

      {isStale(outcome.lastUpdatedAt) ? (
        <StaleDataBanner lastUpdatedAt={outcome.lastUpdatedAt} onRefresh={onReset} />
      ) : null}

      {outcome.unavailableSources?.length ? (
        <Alert
          tone="warning"
          title={`Não conseguimos consultar ${outcome.unavailableSources.join(", ")} agora.`}
          description="O que está abaixo é o resultado parcial — o restante aparece quando o órgão responder."
        />
      ) : null}

      <ul className="flex flex-col divide-y divide-border-subtle border-y border-border-subtle">
        {outcome.pendings.map((item) => (
          <PendingRow key={item.id} item={item} />
        ))}
      </ul>

      {/* `lines` vazio de propósito: a lista acima já é o detalhamento item a
          item. Repeti-lo aqui mostraria cada valor duas vezes — o que o
          componente contribui neste contexto é o total. */}
      {billableItems.length > 0 ? (
        <MoneyBreakdown
          lines={[]}
          totalLabel="Total em aberto nos órgãos"
          totalCents={outcome.totalCents}
        />
      ) : null}

      <p className="text-body text-text-secondary-strong">
        Valores informados pelos órgãos. A taxa de serviço da EMR é apresentada antes de qualquer
        pagamento, no resumo do checkout.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href="/cadastro"
          className={cn(buttonVariants({ variant: "primary", size: "lg" }), "sm:flex-1")}
        >
          Resolver minhas pendências
        </Link>
        <Link
          href="/cadastro"
          className="rounded-sm text-body-public font-semibold text-text-link underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
        >
          Criar conta para acompanhar
        </Link>
      </div>

      <div className="border-t border-border-subtle pt-5">
        <AlertSubscription plate={outcome.vehicle.plate} />
      </div>

      <ResetLink onReset={onReset} />
    </div>
  );
}

function VehicleHeader({
  plate,
  model,
  year,
  overallStatus,
}: {
  plate: string;
  model: string;
  year: number;
  overallStatus: ConsultVehicle["overallStatus"];
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-col">
        <span className="font-mono text-h3 font-semibold uppercase tracking-wide text-text">
          {plate}
        </span>
        <span className="text-body-public text-text-secondary-strong">
          {model} · {year}
        </span>
      </div>
      <StatusBadge domain="vehicle" status={overallStatus} />
    </div>
  );
}

/** Status sempre com label — nunca só cor/ícone (COMPONENTS.md §Status). */
function PendingRow({ item }: { item: PendingItem }) {
  return (
    <li className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1 py-3">
      <div className="flex min-w-0 flex-col">
        <span className="text-body text-text">{item.label}</span>
        {item.dueDate ? (
          <span className="text-body text-text-secondary-strong">
            Vence em <span className="font-mono">{formatDueDate(item.dueDate)}</span>
          </span>
        ) : null}
        {item.note ? (
          <span className="mt-0.5 text-body text-text-secondary-strong">{item.note}</span>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {item.amountCents !== undefined ? (
          <span className="numeric-tabular text-body font-medium text-text">
            {formatCentsToBRL(item.amountCents)}
          </span>
        ) : null}
        <ItemStatusBadge item={item} />
      </div>
    </li>
  );
}

/** Switch explícito porque `StatusBadge` é genérico por domínio: `item` é uma
 *  union discriminada, então cada branch narrowa para o enum certo sem cast. */
function ItemStatusBadge({ item }: { item: PendingItem }) {
  switch (item.kind) {
    case "fine":
      return <StatusBadge domain="fine" status={item.status} />;
    case "licensing":
      return <StatusBadge domain="licensing" status={item.status} />;
    case "payment":
      return <StatusBadge domain="payment" status={item.status} />;
  }
}

function ResetLink({ onReset }: { onReset: () => void }) {
  return (
    <button
      type="button"
      onClick={onReset}
      className="self-start rounded-sm text-body-public font-semibold text-text-link underline hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
    >
      Consultar outra placa
    </button>
  );
}

function formatDueDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}
