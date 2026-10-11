"use client";

import { forwardRef } from "react";
import { Input } from "@emr/ui";
import { formatPlateForDisplay } from "../../../../lib/plate";

/**
 * Campo de placa. A máscara é do chamador (`formatPlateForDisplay` na
 * exibição, `normalizePlate` na escrita) — o `Input` do DS não é um campo
 * mascarado, e `src/lib/plate.ts` é a implementação canônica que
 * `LANDING_PAGE_SPEC.md` §1.2 manda reutilizar.
 *
 * `Input` já cuida de label/`for`, `aria-invalid` e `aria-describedby`; não há
 * wrapper de campo novo aqui (CLAUDE.md §15).
 */
export interface PlateFieldProps {
  value: string;
  onValueChange: (rawValue: string) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export const PlateField = forwardRef<HTMLInputElement, PlateFieldProps>(
  ({ value, onValueChange, error, disabled, className }, ref) => (
    <Input
      ref={ref}
      label="Placa do veículo"
      hint="Placa antiga (ABC-1234) ou Mercosul (ABC1D23)"
      error={error}
      value={formatPlateForDisplay(value)}
      onChange={(event) => onValueChange(event.target.value)}
      disabled={disabled}
      // Teclado alfanumérico: a placa tem letras e números.
      inputMode="text"
      autoCapitalize="characters"
      autoComplete="off"
      spellCheck={false}
      // 8 = 7 caracteres + o hífen do formato antigo exibido.
      maxLength={8}
      placeholder="ABC-1234"
      className={className}
    />
  ),
);

PlateField.displayName = "PlateField";
