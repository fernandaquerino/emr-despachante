import {
  AlertCircle,
  Ban,
  CheckCircle2,
  Circle,
  CircleDot,
  CircleUserRound,
  Clock,
  FileCheck,
  HelpCircle,
  Loader2,
  Lock,
  MailPlus,
  Pause,
  RotateCcw,
  UserCog,
  XCircle,
  type LucideIcon,
} from "lucide-react";

/**
 * Enums de status do domínio EMR Despachante.
 *
 * Fonte da verdade: docs/product/STATUS_MODEL.md. `packages/types` ainda
 * está vazio (bootstrap de outra issue) — replicamos os literal unions aqui
 * para o StatusBadge ser autocontido. Quando `@emr/types` ganhar esses
 * enums, trocar por import de lá.
 */
export type VehicleOverallStatus =
  "REGULAR" | "ATTENTION" | "IRREGULAR" | "PROCESSING" | "MANUAL_REVIEW" | "UNKNOWN";

export type PaymentStatus =
  "PENDING" | "PAID" | "FAILED" | "CANCELLED" | "REFUND_PENDING" | "REFUNDED";

export type FineStatus =
  "OPEN" | "PAYMENT_PENDING" | "PAID" | "CLEARANCE_PROCESSING" | "CLEARED" | "CANCELLED";

export type LicensingStatus =
  "ELIGIBLE" | "BLOCKED" | "PAYMENT_PENDING" | "PAID" | "PROCESSING" | "DOCUMENT_READY" | "FAILED";

export type CaseStatus =
  "OPEN" | "IN_PROGRESS" | "WAITING_CLIENT" | "WAITING_EXTERNAL" | "RESOLVED" | "CANCELLED";

export type GovernmentSubmissionStatus =
  "NOT_REQUESTED" | "QUEUED" | "PROCESSING" | "CONFIRMED" | "FAILED" | "MANUAL_REVIEW";

export type OperatorStatus = "INVITED" | "ACTIVE" | "SUSPENDED" | "DISABLED";

export type ServiceStatus = "ACTIVE" | "INACTIVE";

export type StatusTone = "success" | "warning" | "error" | "info" | "processing" | "neutral";

export interface StatusMeta {
  label: string;
  icon: LucideIcon;
  /** Ícone deve girar (usado só para `Loader2` em estados "processando"). */
  spin?: boolean;
  tone: StatusTone;
}

export type StatusDomainMap = {
  vehicle: VehicleOverallStatus;
  payment: PaymentStatus;
  fine: FineStatus;
  licensing: LicensingStatus;
  case: CaseStatus;
  governmentSubmission: GovernmentSubmissionStatus;
  operator: OperatorStatus;
  service: ServiceStatus;
};

export type StatusDomain = keyof StatusDomainMap;

/**
 * Tabela canônica enum → { label, icon, tone }.
 * Fonte da verdade: docs/design-system/COMPONENTS.md §Status → StatusBadge.
 * `tone` mapeia para os tokens `--status-{tone}-{bg|fg|border}`.
 */
const STATUS_TABLE: { [D in StatusDomain]: Record<StatusDomainMap[D], StatusMeta> } = {
  vehicle: {
    REGULAR: { label: "Regular", icon: CheckCircle2, tone: "success" },
    ATTENTION: { label: "Atenção", icon: AlertCircle, tone: "warning" },
    IRREGULAR: { label: "Irregular", icon: XCircle, tone: "error" },
    PROCESSING: { label: "Processando", icon: Loader2, spin: true, tone: "processing" },
    MANUAL_REVIEW: { label: "Revisão manual", icon: UserCog, tone: "neutral" },
    UNKNOWN: { label: "Sem informação", icon: HelpCircle, tone: "neutral" },
  },
  payment: {
    PENDING: { label: "Aguardando pagamento", icon: Clock, tone: "warning" },
    PAID: { label: "Pago", icon: CheckCircle2, tone: "success" },
    FAILED: { label: "Falhou", icon: XCircle, tone: "error" },
    CANCELLED: { label: "Cancelado", icon: Ban, tone: "neutral" },
    REFUND_PENDING: { label: "Reembolso pendente", icon: RotateCcw, tone: "warning" },
    REFUNDED: { label: "Reembolsado", icon: RotateCcw, tone: "info" },
  },
  fine: {
    OPEN: { label: "Em aberto", icon: AlertCircle, tone: "warning" },
    PAYMENT_PENDING: { label: "Pagamento pendente", icon: Clock, tone: "warning" },
    PAID: { label: "Pago", icon: CheckCircle2, tone: "success" },
    CLEARANCE_PROCESSING: {
      label: "Processando baixa",
      icon: Loader2,
      spin: true,
      tone: "processing",
    },
    CLEARED: { label: "Baixada", icon: FileCheck, tone: "success" },
    CANCELLED: { label: "Cancelada", icon: Ban, tone: "neutral" },
  },
  licensing: {
    ELIGIBLE: { label: "Liberado", icon: CheckCircle2, tone: "success" },
    BLOCKED: { label: "Bloqueado", icon: Lock, tone: "error" },
    PAYMENT_PENDING: { label: "Pagamento pendente", icon: Clock, tone: "warning" },
    PAID: { label: "Pago", icon: CheckCircle2, tone: "success" },
    PROCESSING: { label: "Processando", icon: Loader2, spin: true, tone: "processing" },
    DOCUMENT_READY: { label: "Documento disponível", icon: FileCheck, tone: "success" },
    FAILED: { label: "Falhou", icon: XCircle, tone: "error" },
  },
  case: {
    OPEN: { label: "Aberto", icon: CircleDot, tone: "warning" },
    IN_PROGRESS: { label: "Em andamento", icon: Loader2, spin: true, tone: "info" },
    // COMPONENTS.md pede o ícone "UserClock", que não existe em lucide-react
    // 1.40 — usamos o equivalente mais próximo disponível (sinalizado ao
    // usuário na resposta desta issue).
    WAITING_CLIENT: { label: "Aguardando cliente", icon: CircleUserRound, tone: "neutral" },
    WAITING_EXTERNAL: { label: "Aguardando órgão", icon: Clock, tone: "processing" },
    RESOLVED: { label: "Resolvido", icon: CheckCircle2, tone: "success" },
    CANCELLED: { label: "Cancelado", icon: Ban, tone: "neutral" },
  },
  governmentSubmission: {
    NOT_REQUESTED: { label: "Não solicitado", icon: Circle, tone: "neutral" },
    QUEUED: { label: "Na fila", icon: Clock, tone: "neutral" },
    PROCESSING: { label: "Processando", icon: Loader2, spin: true, tone: "processing" },
    CONFIRMED: { label: "Confirmado", icon: CheckCircle2, tone: "success" },
    FAILED: { label: "Falhou", icon: XCircle, tone: "error" },
    MANUAL_REVIEW: { label: "Revisão manual", icon: UserCog, tone: "neutral" },
  },
  operator: {
    INVITED: { label: "Convite pendente", icon: MailPlus, tone: "warning" },
    ACTIVE: { label: "Ativa", icon: CheckCircle2, tone: "success" },
    SUSPENDED: { label: "Suspensa", icon: Pause, tone: "warning" },
    DISABLED: { label: "Desativada", icon: Ban, tone: "neutral" },
  },
  service: {
    ACTIVE: { label: "Ativo", icon: CheckCircle2, tone: "success" },
    INACTIVE: { label: "Inativo", icon: Ban, tone: "neutral" },
  },
};

/** Busca a meta canônica (label/icon/tone) de um status para um domínio. */
export function getStatusMeta<D extends StatusDomain>(
  domain: D,
  status: StatusDomainMap[D],
): StatusMeta {
  return STATUS_TABLE[domain][status];
}
