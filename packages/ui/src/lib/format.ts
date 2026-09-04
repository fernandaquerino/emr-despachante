/**
 * Formatação de números/moeda/tempo relativo em PT-BR.
 * Fonte das regras: docs/design-system/UX_RULES.md §8.
 */

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/** Formata um valor em centavos (inteiro) como "R$ 1.284,50". */
export function formatCentsToBRL(cents: number): string {
  return currencyFormatter.format(cents / 100);
}

const relativeTimeFormatter = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });
const absoluteDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});
const absoluteDateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
const WEEK_MS = 7 * DAY_MS;

/**
 * "há 3 min", "há 2h", "há 1 dia". Após 7 dias, retorna data absoluta
 * (dd/mm/aaaa), conforme UX_RULES.md §8.
 */
export function formatRelativeTime(date: Date, now: Date = new Date()): string {
  const diffMs = now.getTime() - date.getTime();

  if (diffMs >= WEEK_MS) {
    return absoluteDateFormatter.format(date);
  }
  if (diffMs >= DAY_MS) {
    return relativeTimeFormatter.format(-Math.round(diffMs / DAY_MS), "day");
  }
  if (diffMs >= HOUR_MS) {
    return relativeTimeFormatter.format(-Math.round(diffMs / HOUR_MS), "hour");
  }
  if (diffMs >= MINUTE_MS) {
    return relativeTimeFormatter.format(-Math.round(diffMs / MINUTE_MS), "minute");
  }
  return relativeTimeFormatter.format(0, "minute");
}

/** Timestamp absoluto legível, usado em tooltips sobre tempo relativo. */
export function formatAbsoluteDateTime(date: Date): string {
  return absoluteDateTimeFormatter.format(date);
}

/** `true` quando `date` está há mais de `thresholdHours` horas atrás. */
export function isStale(date: Date, thresholdHours = 4, now: Date = new Date()): boolean {
  return now.getTime() - date.getTime() > thresholdHours * HOUR_MS;
}
