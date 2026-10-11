import { FileCheck2, FileClock, Paperclip, Search, SlidersHorizontal } from "lucide-react";
import {
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Timeline,
  formatAbsoluteDateTime,
} from "@emr/ui";

/**
 * Painéis do preview do Portal do Parceiro.
 *
 * **Leia antes de mexer:** as rotas `/partner/*` são `PlaceholderPage` hoje.
 * Estes painéis são a prévia de telas ainda não construídas, montadas com os
 * componentes reais que elas vão usar (`Table`, `StatusBadge`, `Timeline` do
 * `@emr/ui`). Não são captura de tela, e não são retângulos simulando uma:
 * é o Design System de verdade com dados de exemplo.
 *
 * Os status saem do enum canônico (`status-map.ts`, domínio `case`),
 * incluindo `WAITING_EXTERNAL`. Mostrar só o caminho feliz cria expectativa
 * que o produto não cumpre.
 *
 * Afordâncias interativas (busca, filtro, botões) são `aria-hidden`: num
 * preview elas não funcionam, e deixar leitor de tela tabular para dentro de
 * controle morto é pior que não anunciá-las.
 */

/** Identificadores de exemplo. Não correspondem a nenhuma solicitação real. */
const requests = [
  {
    id: "SR-4392",
    plate: "ABC1D23",
    service: "Licenciamento",
    status: "WAITING_EXTERNAL" as const,
    who: "Marcela Tavares",
  },
  {
    id: "SR-4388",
    plate: "GHI7J89",
    service: "Transferência",
    status: "WAITING_CLIENT" as const,
    who: "Rogério Pinheiro",
  },
  {
    id: "SR-4381",
    plate: "DEF4G56",
    service: "Multas",
    status: "IN_PROGRESS" as const,
    who: "Marcela Tavares",
  },
  {
    id: "SR-4375",
    plate: "JKL2M34",
    service: "IPVA",
    status: "RESOLVED" as const,
    who: "Cleiton Bastos",
  },
];

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-t border-border pt-3">
      <span className="font-mono text-h2 text-text numeric-tabular">{value}</span>
      <span className="text-body text-text-secondary-strong">{label}</span>
    </div>
  );
}

function RequestsTable({ rows }: { rows: typeof requests }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Solicitação</TableHead>
          <TableHead>Veículo</TableHead>
          <TableHead>Serviço</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell className="font-mono text-text">{row.id}</TableCell>
            <TableCell className="font-mono uppercase">{row.plate}</TableCell>
            <TableCell>{row.service}</TableCell>
            <TableCell>
              <StatusBadge domain="case" status={row.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function OverviewPanel() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
        <Metric label="Em andamento" value="12" />
        <Metric label="Aguardando órgão" value="5" />
        <Metric label="Aguardando você" value="2" />
        <Metric label="Concluídas no mês" value="38" />
      </div>
      <RequestsTable rows={requests.slice(0, 3)} />
    </div>
  );
}

export function RequestsPanel() {
  return (
    <div className="flex flex-col gap-5">
      <div aria-hidden="true" className="flex flex-wrap items-center gap-3">
        <span className="flex flex-1 items-center gap-2 rounded-sm border border-border bg-bg-subtle px-3 py-2 text-body text-text-muted">
          <Search className="h-4 w-4 shrink-0" />
          Buscar por placa ou número da solicitação
        </span>
        <span className="flex items-center gap-2 rounded-sm border border-border px-3 py-2 text-body text-text-secondary-strong">
          <SlidersHorizontal className="h-4 w-4" />
          Filtros
        </span>
      </div>
      <RequestsTable rows={requests} />
    </div>
  );
}

/** Rótulos são o conteúdo do passo, não "Passo 1", "Passo 2". */
const newRequestSteps = [
  { label: "Veículo", detail: "Placa ou RENAVAM", done: true },
  {
    label: "Serviço",
    detail: "Multas, IPVA, licenciamento, transferência, dívida ativa",
    done: true,
  },
  { label: "Documentos", detail: "Anexos exigidos pelo serviço", done: false },
  { label: "Observações", detail: "Contexto para a equipe EMR", done: false },
  { label: "Revisão", detail: "Confirmação e número da solicitação", done: false },
];

export function NewRequestPanel() {
  return (
    <ol className="flex flex-col">
      {newRequestSteps.map((step, index) => {
        const current = !step.done && newRequestSteps[index - 1]?.done !== false;
        return (
          <li
            key={step.label}
            className="flex gap-4 border-b border-border-subtle py-4 last:border-b-0"
          >
            <span
              aria-hidden="true"
              className={
                step.done
                  ? "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-action-accent text-text-on-accent"
                  : current
                    ? "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-action-accent"
                    : "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border-strong"
              }
            >
              {step.done ? <FileCheck2 className="h-4 w-4" /> : null}
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="text-h4 text-text">{step.label}</span>
              <span className="text-body text-text-secondary-strong">{step.detail}</span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* Datas fixas: `new Date()` em tempo de render divergiria entre servidor e
   cliente e geraria aviso de hidratação. */
const trackingEvents = [
  {
    id: "e4",
    title: "Aguardando retorno do órgão",
    description: "A solicitação foi protocolada e está na fila do Detran.",
    at: new Date("2026-09-29T14:12:00-03:00"),
  },
  {
    id: "e3",
    title: "Documentos conferidos",
    description: "Comprovante de residência e CRLV anterior aceitos.",
    at: new Date("2026-09-28T09:40:00-03:00"),
  },
  {
    id: "e2",
    title: "Pagamento confirmado",
    description: "Confirmação recebida do provedor de pagamento.",
    at: new Date("2026-09-27T17:05:00-03:00"),
  },
  {
    id: "e1",
    title: "Solicitação aberta",
    description: "Aberta por Marcela Tavares.",
    at: new Date("2026-09-27T16:48:00-03:00"),
  },
];

export function TrackingPanel() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex flex-col">
          <span className="font-mono text-h3 text-text">SR-4392</span>
          <span className="text-body text-text-secondary-strong">
            Licenciamento · <span className="font-mono uppercase">ABC1D23</span>
          </span>
        </div>
        <StatusBadge domain="case" status="WAITING_EXTERNAL" />
      </div>
      <Timeline events={trackingEvents} />
    </div>
  );
}

const pendingDocs = [
  { id: "SR-4388", label: "Comprovante de endereço do comprador" },
  { id: "SR-4381", label: "Procuração assinada" },
];

const team = [
  { name: "Marcela Tavares", role: "Administradora", status: "ACTIVE" as const },
  { name: "Rogério Pinheiro", role: "Operador", status: "ACTIVE" as const },
  { name: "Cleiton Bastos", role: "Operador", status: "INVITED" as const },
];

export function DocumentsTeamPanel() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="flex flex-col gap-4">
        <h4 className="flex items-center gap-2 text-h4 text-text">
          <FileClock aria-hidden="true" className="h-5 w-5 text-action-accent" />
          Pendências de documento
        </h4>
        <ul className="flex flex-col divide-y divide-border-subtle">
          {pendingDocs.map((doc) => (
            <li key={doc.id} className="flex items-start gap-3 py-3">
              <Paperclip aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" />
              <div className="flex flex-col">
                <span className="text-body-public text-text">{doc.label}</span>
                <span className="font-mono text-body text-text-secondary-strong">{doc.id}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h4 className="text-h4 text-text">Equipe da organização</h4>
        <ul className="flex flex-col divide-y divide-border-subtle">
          {team.map((member) => (
            <li key={member.name} className="flex items-center justify-between gap-3 py-3">
              <div className="flex flex-col">
                <span className="text-body-public text-text">{member.name}</span>
                <span className="text-body text-text-secondary-strong">{member.role}</span>
              </div>
              <StatusBadge domain="operator" status={member.status} />
            </li>
          ))}
        </ul>
        <p className="text-body text-text-secondary-strong">
          Último acesso em {formatAbsoluteDateTime(new Date("2026-09-29T08:15:00-03:00"))}.
        </p>
      </section>
    </div>
  );
}
