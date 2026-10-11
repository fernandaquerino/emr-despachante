const OLD_PLATE = /^[A-Z]{3}[0-9]{4}$/;
const MERCOSUL_PLATE = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
const MAX_PLATE_LENGTH = 7;

/**
 * Mantém apenas letras e números, força maiúsculas e corta em 7 caracteres —
 * o comprimento de uma placa (antiga ou Mercosul) sem hífen. Uso: normalizar
 * o valor do input de placa a cada tecla, sem validar formato ainda.
 */
export function normalizePlate(rawValue: string): string {
  return rawValue
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, MAX_PLATE_LENGTH);
}

/**
 * Placa antiga (`AAA9999`) ou Mercosul (`AAA9A99`) — únicos formatos
 * brasileiros válidos. Não faz lookup nem chama API: validação puramente de
 * formato, para feedback imediato no campo (FE-PUB-001 está fora do escopo
 * de consulta real).
 */
export function isValidPlate(normalizedValue: string): boolean {
  return OLD_PLATE.test(normalizedValue) || MERCOSUL_PLATE.test(normalizedValue);
}

/**
 * Formato de exibição `AAA-9999` / `AAA9A99` (Mercosul não usa hífen).
 * Aceita valor parcial (enquanto o usuário ainda está digitando).
 */
export function formatPlateForDisplay(normalizedValue: string): string {
  if (normalizedValue.length <= 3) {
    return normalizedValue;
  }

  const isMercosul = /^[A-Z]{3}[0-9][A-Z]/.test(normalizedValue);
  if (isMercosul) {
    return normalizedValue;
  }

  return `${normalizedValue.slice(0, 3)}-${normalizedValue.slice(3)}`;
}
