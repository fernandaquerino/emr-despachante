import { useState } from "react";
import { StatusBadge } from "../StatusBadge";
import { StaleDataBanner } from "../StaleDataBanner";
import type { LicensingStatus, VehicleOverallStatus } from "../../../lib/status-map";
import { isStale } from "../../../lib/format";
import { cn } from "../../../lib/cn";

/**
 * Anatomia/props/regras: docs/design-system/DOMAIN_COMPONENTS.md §2.
 * Placa em mono uppercase. `StaleDataBanner` aparece automaticamente se
 * `lastUpdatedAt` > 4h. Se `licensing.status = BLOCKED` com `reason`, o
 * motivo vira caption.
 */
export interface VehicleSummaryVehicle {
  plate: string;
  model: string;
  year: number;
  overallStatus: VehicleOverallStatus;
}

export interface VehicleSummaryProps {
  vehicle: VehicleSummaryVehicle;
  lastUpdatedAt: Date;
  fines?: { openCount: number };
  licensing?: { status: LicensingStatus; reason?: string };
  onRefresh?: () => void | Promise<void>;
  onOpen: () => void;
  className?: string;
}

export function VehicleSummary({
  vehicle,
  lastUpdatedAt,
  fines,
  licensing,
  onRefresh,
  onOpen,
  className,
}: VehicleSummaryProps) {
  const [refreshing, setRefreshing] = useState(false);

  async function handleRefresh() {
    if (!onRefresh) return;
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 shadow-elev1",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-body font-semibold uppercase text-text">
          {vehicle.plate}
        </span>
        <StatusBadge domain="vehicle" status={vehicle.overallStatus} />
      </div>
      <p className="text-body-sm text-text-secondary">
        {vehicle.model} · {vehicle.year}
      </p>

      {isStale(lastUpdatedAt) && onRefresh ? (
        <StaleDataBanner
          lastUpdatedAt={lastUpdatedAt}
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />
      ) : null}

      {fines || licensing ? (
        <div className="grid grid-cols-2 gap-3 border-t border-border pt-3 text-body-sm">
          {fines ? (
            <div>
              <div className="text-label text-text-muted">Multas</div>
              <div className="text-text">
                {fines.openCount > 0 ? `${fines.openCount} em aberto` : "Nenhuma pendência"}
              </div>
            </div>
          ) : null}
          {licensing ? (
            <div>
              <div className="text-label text-text-muted">Licenciamento</div>
              <div className="text-text">
                <StatusBadge domain="licensing" status={licensing.status} />
              </div>
              {licensing.status === "BLOCKED" && licensing.reason ? (
                <div className="mt-1 text-caption text-text-muted">{licensing.reason}</div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      <button
        type="button"
        onClick={onOpen}
        className="self-end text-body-sm font-medium text-text-link underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
      >
        Ver veículo →
      </button>
    </div>
  );
}
