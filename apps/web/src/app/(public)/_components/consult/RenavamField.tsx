"use client";

import { forwardRef } from "react";
import { Input } from "@emr/ui";

/**
 * Campo de RENAVAM, renderizado **somente** quando o backend sinalizou que
 * precisa dele. Não é obrigatório por padrão e não aparece na primeira
 * tentativa (`LANDING_PAGE_SPEC.md` §1.2: um campo obrigatório só).
 *
 * RENAVAM é dado sensível (`SECURITY_AND_LGPD.md` §Dados sensíveis): vive em
 * estado React enquanto a tela existe e nunca vai para storage, cookie ou URL.
 * Mono e sem alteração de case por ser ID técnico (`UX_RULES.md` §8).
 */
export interface RenavamFieldProps {
  value: string;
  onValueChange: (rawValue: string) => void;
  error?: string;
  disabled?: boolean;
}

export const RenavamField = forwardRef<HTMLInputElement, RenavamFieldProps>(
  ({ value, onValueChange, error, disabled }, ref) => (
    <Input
      ref={ref}
      label="RENAVAM"
      hint="11 dígitos, como no documento do veículo (CRLV)."
      error={error}
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
      disabled={disabled}
      inputMode="numeric"
      autoComplete="off"
      spellCheck={false}
      maxLength={11}
      placeholder="00000000000"
      className="font-mono tracking-wide"
    />
  ),
);

RenavamField.displayName = "RenavamField";
