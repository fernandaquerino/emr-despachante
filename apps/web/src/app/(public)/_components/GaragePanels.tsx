import { FileCheck2, Download } from "lucide-react";
import { MoneyBreakdown, StatusBadge, Timeline, formatCentsToBRL } from "@emr/ui";

/**
 * Painéis ilustrativos da área logada (LANDING_PAGE_SPEC.md §S3).
 *
 * São **ilustração, não produto**: nenhum dado real, nenhuma chamada de API.
 * O chrome decorativo é `aria-hidden`; o conteúdo textual continua legível
 * para leitor de tela porque é ele que comunica a promessa.
 *
 * Regra que estes painéis respeitam: o mockup só mostra estados que o produto
 * realmente tem (STATUS_MODEL.md), incluindo `PROCESSING` — uma landing que
 * só mostra o caminho felizantecipa uma expectativa que o produto não cumpre.
 */
const vehicles = [
  {
    plate: "ABC1D23",
    model: "Honda HR-V · 2022",
    status: "IRREGULAR" as const,
    detail: "2 multas em aberto",
  },
  {
    plate: "GHI7J89",
    model: "VW T-Cross · 2023",
    status: "REGULAR" as const,
    detail: "Sem pendências",
  },
  {
    plate: "DEF4G56",
    model: "Toyota Corolla · 2021",
    status: "PROCESSING" as const,
    detail: "Aguardando o órgão",
  },
];

export function VehiclesPanel() {
  return (
    <ul className="flex flex-col divide-y divide-border-subtle">
      {vehicles.map((vehicle) => (
        <li
          key={vehicle.plate}
          className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-3"
        >
          <div className="flex min-w-0 flex-col">
            <span className="font-mono text-body font-semibold uppercase text-text">
              {vehicle.plate}
            </span>
            <span className="truncate text-body text-text-secondary-strong">{vehicle.model}</span>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1 text-right">
            <StatusBadge domain="vehicle" status={vehicle.status} />
            <span className="text-body text-text-secondary-strong">{vehicle.detail}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function DebtsPanel() {
  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col divide-y divide-border-subtle">
        <li className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-3">
          <div className="flex flex-col">
            <span className="text-body text-text">Licenciamento 2026</span>
            <span className="text-body text-text-secondary-strong">
              Vence em <span className="font-mono">31/10/2026</span>
            </span>
          </div>
          <StatusBadge domain="licensing" status="BLOCKED" />
        </li>
        <li className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-3">
          <div className="flex flex-col">
            <span className="text-body text-text">Multa — avanço de sinal</span>
            <span className="text-body text-text-secondary-strong">
              Vence em <span className="font-mono">14/11/2026</span>
            </span>
          </div>
          <span className="numeric-tabular text-body text-text">{formatCentsToBRL(29519)}</span>
        </li>
      </ul>
      <MoneyBreakdown
        lines={[
          { label: "Multa — avanço de sinal", amountCents: 29519 },
          { label: "Multa — estacionamento irregular", amountCents: 13066 },
        ]}
        totalLabel="Total em aberto"
        totalCents={42585}
      />
    </div>
  );
}

export function DocumentsPanel() {
  const documents = [
    { id: "doc-1", label: "Comprovante de pagamento — Licenciamento 2025", date: "12/03/2025" },
    { id: "doc-2", label: "Comprovante de pagamento — Multa 2024", date: "08/11/2024" },
    { id: "doc-3", label: "Histórico do veículo — ABC1D23", date: "02/10/2026" },
  ];

  return (
    <ul className="flex flex-col divide-y divide-border-subtle">
      {documents.map((document) => (
        <li
          key={document.id}
          className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-3"
        >
          <div className="flex min-w-0 items-center gap-3">
            <FileCheck2 aria-hidden="true" className="h-5 w-5 shrink-0 text-action-accent" />
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-body text-text">{document.label}</span>
              <span className="font-mono text-body text-text-secondary-strong">
                {document.date}
              </span>
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 text-body-public font-semibold text-text-link">
            <Download aria-hidden="true" className="h-4 w-4" />
            Baixar
          </span>
        </li>
      ))}
    </ul>
  );
}

export function AlertsPanel() {
  const now = Date.now();
  return (
    <Timeline
      events={[
        {
          id: "alert-1",
          title: "Multa nova detectada",
          description: "Honda HR-V · ABC1D23 — avanço de sinal",
          at: new Date(now - 1000 * 60 * 42),
        },
        {
          id: "alert-2",
          title: "Licenciamento vence em 15 dias",
          description: "VW T-Cross · GHI7J89",
          at: new Date(now - 1000 * 60 * 60 * 9),
        },
        {
          id: "alert-3",
          title: "Pagamento aguardando confirmação",
          description: "Toyota Corolla · DEF4G56",
          at: new Date(now - 1000 * 60 * 60 * 26),
        },
      ]}
    />
  );
}
