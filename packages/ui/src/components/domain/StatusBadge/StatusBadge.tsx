import { Badge } from "../../base/Badge";
import { getStatusMeta, type StatusDomain, type StatusDomainMap } from "../../../lib/status-map";

/**
 * Status = texto + ícone + cor, sempre. Nunca aceita string livre — só
 * enums tipados da tabela canônica (docs/design-system/COMPONENTS.md
 * §Status). Ver docs/design-system/DOMAIN_COMPONENTS.md — "um mesmo estado
 * de negócio se renderiza igual em toda tela".
 */
export interface StatusBadgeProps<D extends StatusDomain> {
  domain: D;
  status: StatusDomainMap[D];
  className?: string;
}

export function StatusBadge<D extends StatusDomain>({
  domain,
  status,
  className,
}: StatusBadgeProps<D>) {
  const meta = getStatusMeta(domain, status);

  return (
    <Badge tone={meta.tone} icon={meta.icon} iconSpin={meta.spin} className={className}>
      {meta.label}
    </Badge>
  );
}
