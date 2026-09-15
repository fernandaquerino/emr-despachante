/**
 * Resolve, dentre uma lista de hrefs, qual é a correspondência ativa para
 * `activePath` — usada por `NavGroup`/`Sidebar`/`MobileNav`.
 *
 * Um href "bate" se for igual a `activePath` ou se `activePath` for uma
 * sub-rota dele (`${href}/...`). Quando mais de um bate (ex.: `/admin` e
 * `/admin/solicitacoes` para `/admin/solicitacoes/123`), vence o mais
 * específico (string mais longa) — nunca mais de 1 item ativo por vez
 * (UX_RULES.md §11).
 */
export function resolveActiveHref(
  hrefs: string[],
  activePath: string | undefined,
): string | undefined {
  if (!activePath) return undefined;

  let best: string | undefined;
  for (const href of hrefs) {
    const matches = activePath === href || activePath.startsWith(`${href}/`);
    if (matches && (!best || href.length > best.length)) {
      best = href;
    }
  }
  return best;
}

/**
 * `Sidebar`/`MobileNav` renderizam vários `NavGroup`s a partir da mesma
 * `activePath`. Como `NavGroup` resolve o item ativo só entre os próprios
 * itens, passar a mesma `activePath` "crua" para todo grupo faria um grupo
 * vizinho (ex.: "Visão geral" isolado em outro grupo) reagir ao mesmo
 * prefixo e também se marcar ativo. Esta função decide, para um grupo
 * específico, se ele deve receber a `activePath` real (quando o item
 * vencedor — mais específico — está entre os itens dele) ou `undefined`
 * (quando o vencedor pertence a outro grupo).
 */
export function scopeActivePathToGroup(
  allGroupsHrefs: string[][],
  groupIndex: number,
  activePath: string | undefined,
): string | undefined {
  const winner = resolveActiveHref(allGroupsHrefs.flat(), activePath);
  if (!winner) return undefined;

  return allGroupsHrefs[groupIndex]?.includes(winner) ? activePath : undefined;
}
