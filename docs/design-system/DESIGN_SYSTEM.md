# EMR Despachante — Design System

> Documento de decisão do Design System. Fonte da verdade para direção visual, tokens, componentes, hierarquia, motion, acessibilidade e regras de UI da IA.
> Companion files: `TOKENS.md`, `COMPONENTS.md`, `UX_RULES.md`, `AI_COPILOT_UI.md`.

---

## 1. Product design analysis

O EMR Despachante é um **CRM operacional + fila de exceções + fintech leve + portal governamental** para uma empresa de despachante veicular. Três perfis operam a mesma plataforma:

| Perfil | Volume de uso | Densidade ideal | Modo padrão | Objetivo dominante |
|---|---|---|---|---|
| PROPRIETÁRIO | Curto e pontual | Confortável (6/10) | Light | "Meu carro está regular? O que devo pagar?" |
| ADMIN | Jornada longa diária | Dense (8/10) | Light c/ dark opt-in | "O que preciso resolver agora?" |
| ADMIN | Análise + intervenção | Dense (8/10) | Light c/ dark opt-in | "Como está a operação e onde está o gargalo?" |

Restrições que moldaram todas as decisões:

- **STATUS_MODEL** tem 6 (veículo) + 4 (prioridade) + 6 (pagamento) + 7 (licenciamento) + 6 (caso) + 6 (submission) enums. A paleta preservou verde/âmbar/vermelho/azul/roxo/cinza como semânticos e escolheu **navy** como primary para não colidir com nenhum.
- **Regra financeira:** "checkout iniciado ≠ pago". A UI precisa expressar `PENDING`, `PROCESSING`, `PAID`, `CLEARANCE_PROCESSING`, `CLEARED` como estados distintos — cada um com label + ícone + cor.
- **Degradação parcial (RNF-011):** feed pode cair sem derrubar dashboard. Cada bloco carrega estados próprios (loading/error/stale/empty).
- **Perf target (RNF-015):** dashboard `<500ms` via endpoint agregado — a UI não pode assumir 10 spinners simultâneos.

## 2. UI UX Pro Max — pesquisa utilizada

Buscas rodadas via `scripts/search.py`:

| Query | Domain | Match utilizado |
|---|---|---|
| `operational dashboard vehicle services SaaS trustworthy financial not-bank` | design-system | Style: **Minimalism & Swiss Style** + **Data-Dense Dashboard**; Font mood: **Financial Trust** (IBM Plex Sans); Palette: dark+green positive → adaptado para light-first navy/emerald |
| `operational dashboard queue triage exception` | product | Match: RPA/Automation Dashboard, Financial Dashboard, Analytics Dashboard, Smart Home/IoT |
| `fintech trust professional not-bank` | color | Match: **B2B Service** (navy+cobalt) + **CRM & Client Management** + **Invoice & Billing** — três referências convergentes para navy/cobalt/green |
| `professional dashboard tabular numbers table` | typography | Match: Financial Trust (IBM Plex Sans), Minimal Swiss (Inter), Corporate Trust (Lexend + Source Sans 3) |
| `revenue funnel time series operational` | chart | Line Chart (trend), Funnel/Sankey (conversão), Line with Confidence Band (previsão), Heatmap (padrões) |
| `form validation error inline label` | ux | Focusable Error Summary + Error Placement + Inline Validation (blur) + Form Labels |
| `data table sorting pagination sticky header` | ux | Table Handling (overflow-x), Bulk Actions (multi-select) |
| `status badge color icon text combined accessibility` | ux | Color Only (High), Color Contrast 4.5:1, Contextual Live Badge Updates |
| `AI copilot side panel citation confirmation` | ux | AI Disclaimer (High), Streaming (Medium), Confirmation Dialogs (High) |
| `dashboard antipattern too many charts vanity metrics` | ux | Excessive Motion (High), Container Width (Medium) |
| `accessible ethical calm reduce anxiety` | style | **Accessible & Ethical** aplicado como viés transversal |

## 3. Três direções consideradas

Resumo — detalhe completo no changelog de decisão.

### Direção A — Trust Navy + Emerald Signal ✅ ESCOLHIDA
- Primary `#0F172A` navy, Accent `#0369A1` cobalt, Success `#16A34A` emerald.
- Inter (UI) + IBM Plex Mono (IDs/placas).
- Referenciada em B2B Service + CRM + Invoice na base.

### Direção B — Institutional Teal
- Primary `#0F766E` teal + Lexend/Source Sans 3.
- Rejeitada: teal colide com green de status; Lexend reduz densidade.

### Direção C — Slate + Cobalt (dark-first)
- Primary neutro + cobalt sobre dark.
- Rejeitada: dark-first é hostil ao proprietário em contexto financeiro.

## 4. Direção recomendada e justificativa

**Direção A — Trust Navy + Emerald Signal**, light-first com dark opt-in, densidade 8/10 nos dashboards operacionais.

Motivos objetivos:

1. **Preserva 100% da semântica de status** — nenhum hue de estado é queimado como marca.
2. **Match triplo na base** — três produtos análogos (B2B, CRM, Invoice) usam a mesma família de paleta.
3. **Bi-modal sem trocar identidade** — a marca é o navy; a única mudança do dark é inversão de superfície.
4. **Tipografia otimizada para dashboard** — Inter tem `font-variant-numeric: tabular-nums` nativo, ótima renderização em PT-BR, ampla adoção; Plex Mono complementa em IDs.
5. **Sem "AI purple gradient"** — roxo restrito ao status `PROCESSING`, nunca à marca ou ao Copilot.

## 5. Psicologia das cores aplicada

| Cor | Papel | Intenção emocional | Regra dura |
|---|---|---|---|
| Navy `#0F172A` | Primary/marca | Confiança institucional, estabilidade, autoridade sem calor | Nunca em status; nunca em ação destrutiva |
| Cobalt `#0369A1` | Accent/CTA secundário | Ação calma, hyperlink, foco | Nunca em erro |
| Emerald `#16A34A` | Success + status Regular/Pago/Concluído | Confirmação, "posso avançar" | Exclusiva de sucesso — jamais decorativa |
| Amber `#D97706` | Warning + Atenção + Aguardando | Cautela, "olhe aqui", sem urgência | Reservado para atenção acionável |
| Red `#DC2626` | Error + Irregular + Failed + destructive | Falha, bloqueio, impedimento | Nunca marca; nunca hover decorativo |
| Blue `#2563EB` | Info + Processing técnico | Neutralidade informativa | Distinto de cobalt (accent) por matiz mais saturada |
| Purple `#7C3AED` | Status PROCESSING/aguardando externo | Estado ambíguo "trabalhando" sem julgar sucesso/falha | Nunca marca; nunca Copilot |
| Slate 500 `#64748B` | Neutral + Muted + Unknown | "Sem informação", desabilitado | Textos secundários e estados neutros |

**Heurística:** cor não substitui label. Toda cor semântica sempre vem com ícone + texto (regra WCAG "color only", Severity High).

## 6. Paleta completa

Ver `TOKENS.md` §1–§3 (primitives + semantic + dark mode).

Resumo:

- Primitives: `navy-{50..950}`, `slate-{50..950}`, `blue-{50..900}`, `emerald-{50..900}`, `amber-{50..900}`, `red-{50..900}`, `purple-{50..900}`.
- Semantic light: `--bg-default #F8FAFC`, `--surface-default #FFFFFF`, `--text-primary #0F172A`, `--text-secondary #475569`, `--border-default #E2E8F0`.
- Semantic dark: `--bg-default #0B1220`, `--surface-default #111827`, `--text-primary #F8FAFC`, `--text-secondary #94A3B8`, `--border-default #334155`.

## 7. Typography system

Fonts:

- **Inter** — UI, headings, body, tables. Variable weight 300–700. `font-variant-numeric: tabular-nums` habilitado em: KPI, valores monetários, datas em coluna, placas, IDs numéricos.
- **IBM Plex Mono** — identificadores técnicos (payment ID, case ID, placa, RENAVAM, hash de webhook).

Fallbacks: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.

Escala completa em `TOKENS.md` §4.

## 8. Hierarquia visual

Regra dominante: **o usuário identifica em 3 segundos → o que está acontecendo → o que é importante → o que precisa ser feito.**

| Elemento | Peso | Tamanho (desktop) | Cor | Regra |
|---|---|---|---|---|
| Page title | 600 | 24px | text-primary | Uma H1 por rota |
| Section title | 600 | 18px | text-primary | Sem numeração |
| KPI valor | 600 | 28px, tabular-nums | text-primary | Delta pequeno abaixo |
| Primary action | 500 | 14px | on-primary sobre primary | Máx 1 por bloco visível |
| Secondary action | 500 | 14px | text-primary sobre surface | Border 1px |
| Filters | 400 | 13px | text-secondary | Chip alinhado à direita da tabela |
| Status label | 500 | 12px | semantic sobre semantic-subtle | Sempre com ícone |
| Metadata | 400 | 12px | text-muted | Nunca portador de decisão |
| Table info | 400 | 13px | text-primary | Números tabulares |
| Destructive action | 500 | 14px | destructive | Sempre após confirmação |

No **Dashboard Operacional** a hierarquia é: `Casos críticos > Meus casos > Sem responsável > Mais antigos > Aguardando cliente > Indicadores gerais`. KPIs nunca vêm antes da lista acionável na leitura vertical.

## 9. Design tokens

Documento completo: `TOKENS.md`.

Arquitetura em 3 camadas:

1. **Primitive** — escalas cromáticas cruas (`navy-500`, `emerald-600`).
2. **Semantic** — intenção (`--action-primary`, `--status-success`, `--text-secondary`).
3. **Component** — específico (`--button-primary-bg`, `--table-row-hover`).

Componentes **nunca** referenciam primitives diretamente.

## 10. Spacing

Escala base 4px: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96`.

Dense grid (8/10): gap 8px, card padding 12–16px, section gap 24px.

## 11. Radius

Filosofia: **cantos calmos, nunca redondos demais** — reforça confiança financeira sem parecer duro.

| Uso | Valor | Motivo |
|---|---|---|
| Input | `6px` | Suficiente para suavizar sem infantilizar |
| Button | `6px` | Igual ao input para alinhamento visual |
| Card | `10px` | Diferencia superfície de controle |
| Modal / Drawer | `12px` | Contêiner mais macio |
| Badge / Chip | `9999px` (pill) | Legibilidade + convenção universal |
| Avatar | `9999px` | Convenção |
| Tooltip | `6px` | |

## 12. Elevation

Poucos níveis. Sombra sempre sutil (financial, não playful).

- `--elev-0`: none — inputs em repouso, table rows.
- `--elev-1`: `0 1px 2px rgba(15,23,42,.06)` — cards, KPI.
- `--elev-2`: `0 4px 12px rgba(15,23,42,.08)` — dropdowns, popovers, hover em card.
- `--elev-3`: `0 12px 32px rgba(15,23,42,.12)` — modals, drawers, Copilot panel.
- Dark: shadow opacidade maior + `border: 1px solid var(--border-default)` para separação (não brilhos).

## 13. Motion

Perfil **Subtle** (3/10). Motion serve significado, nunca decoração.

- `--motion-fast`: 120ms — hover, focus ring.
- `--motion-normal`: 200ms — accordion, drawer, tab switch.
- `--motion-slow`: 320ms — modal enter, Copilot panel enter.
- Easing padrão: `cubic-bezier(0.2, 0, 0, 1)` (ease-out).
- Streaming de IA: sem animação de "digitando" fake — apenas token-by-token real.
- **Regra dura:** respeitar `@media (prefers-reduced-motion: reduce)` — todas as transições caem para 0ms mantendo o estado final.
- Anti: bounce, spring exagerada, fade em página inteira, spinner infinito sem contexto.

## 14. Grid / Layout

### Área interna (`/admin`, `/admin`)

- Sidebar fixa: `240px` desktop; `72px` colapsada.
- Header: `56px` fixo.
- Content: max-width `1440px`, padding lateral `24px` (`>=1024px`) / `16px` (mobile).
- Grid 12 col, gap `24px` seções, `8px` intra-tabela.

### Área proprietário (`/app`)

- Header simplificado `64px`, sem sidebar.
- Content: max-width `1024px`, padding lateral `24px`.
- Cards em grid 1/2/3 colunas conforme breakpoint.
- Densidade confortável (6/10).

### Dashboard

- Linha 1: KPI cards (mín 4, máx 8), grid `repeat(auto-fit, minmax(200px, 1fr))`, altura 96px.
- Linha 2: fila prioritária (sempre — nunca ocultada por scroll).
- Linhas 3+: gráficos secundários agrupados em card.
- **Regra:** nunca uma tela composta apenas por cards decorativos.

## 15. Component inventory

Documento completo: `COMPONENTS.md`.

Categorias: Foundations, Actions, Forms, Feedback, Status, Data, Navigation, Overlay, Domain.

## 16. Component states

Toda superfície interativa define: `default`, `hover`, `focus-visible`, `active`, `selected`, `disabled`, `loading`, `error` (quando aplicável). Especificado por componente em `COMPONENTS.md`.

## 17. Tables

Documento operacional: `COMPONENTS.md` §Data > Table.

Regras:

- Row height dense 36px / confortável 44px.
- Sticky header (com sombra `--elev-1` no scroll).
- Zebra desligada por padrão; hover row em `--bg-subtle`.
- Colunas numéricas: alinhadas à direita, `tabular-nums`, sem separadores decorativos.
- Truncação com `title` HTML e tooltip em hover.
- Ação por linha: última coluna, dropdown de 3-dots — nunca link "cru" duplicando outra coluna.
- Bulk: checkbox column + action bar contextual que aparece ao selecionar (sticky no topo da tabela).
- Vazio: EmptyState explicando o filtro atual + CTA "Limpar filtros".
- Erro parcial: banner acima da tabela; body preserva última carga bem-sucedida.
- Stale: banner com timestamp; jamais esconder a data velha.
- Mobile: `overflow-x: auto` para tabelas críticas; converter para lista de cards para leitura secundária.
- Paginação: `20/50/100` por página; contagem total sempre visível.

## 18. Forms

Regras chave (base UX):

- Label sempre visível — placeholder nunca substitui label.
- Validação `onBlur` para maioria; `onSubmit` para operações financeiras.
- Erro inline abaixo do campo + `aria-describedby`.
- Após submit inválido: foco em `Focusable Error Summary` no topo (`role="alert" tabindex="-1"`).
- Máscaras de PT-BR: CPF, telefone, placa (Mercosul e antiga), RENAVAM, CEP, valores em `R$`.
- Autocomplete: `cpf`, `email`, `tel`, `postal-code` — obrigatório onde HTML define.

## 19. Status system

Padrão universal `StatusBadge`:

```
[ícone 12px] [label 12px 500] — variante pill
```

| Grupo (VehicleOverallStatus) | Label | Ícone (Lucide) | Cor de fundo | Cor de texto |
|---|---|---|---|---|
| REGULAR | Regular | `CheckCircle2` | `emerald-50` | `emerald-800` |
| ATTENTION | Atenção | `AlertCircle` | `amber-50` | `amber-800` |
| IRREGULAR | Irregular | `XCircle` | `red-50` | `red-800` |
| PROCESSING | Processando | `Loader2` (spin lento) | `purple-50` | `purple-800` |
| MANUAL_REVIEW | Revisão manual | `UserCog` | `slate-100` | `slate-800` |
| UNKNOWN | Sem informação | `HelpCircle` | `slate-50` | `slate-600` |

Priority (`CasePriority`):

| Nível | Label | Cor |
|---|---|---|
| CRITICAL | Crítica | `red-600` (barra 4px à esquerda + label) |
| HIGH | Alta | `amber-600` |
| MEDIUM | Média | `blue-500` |
| LOW | Baixa | `slate-400` |

**Prioridade é comunicada por posição vertical + barra lateral + label + ícone opcional — nunca só por cor.**

Payment/Licensing/Case/Submission usam o mesmo padrão. Tabela completa em `COMPONENTS.md` §Status.

Regra: `Display status` pode ser composto ("Pago — aguardando baixa"), mas `sourceOfTruth status` sempre é renderizado como badge canônico ao lado.

## 20. Charts

Escolhas justificadas por match com a base da skill:

| Gráfico do doc | Tipo escolhido | Motivo |
|---|---|---|
| Receita por período | Line chart | Trend time-series clássico. `<1000 pts` = SVG (Recharts). |
| Volume por serviço | Bar chart horizontal (top 5) | Comparação categórica finita (Multas, Licenciamento, IPVA, Transferência, Dívida ativa) |
| Funil operacional (pedido→pago→concluído) | Funnel chart (Recharts) | Match direto — 5 estágios, monotonicamente decrescentes |
| Casos manuais abertos × resolvidos | Line dual-axis ou stacked bar diária | Compara duas séries no tempo |
| Distribuição de saúde da carteira | Horizontal stacked bar 100% | Melhor que pizza para 6 estados |
| Padrões por hora × dia (opcional) | Heatmap 24×7 | Se justificado por volume; sempre com legenda numérica |

Regras:

- **Nunca radar/candlestick** — audiência não-especialista.
- Tooltips sempre com valor absoluto + delta.
- Séries múltiplas: variar `stroke-dasharray` + cor + label direto (regra: nunca só cor).
- Palette de dados usa cores neutras + destaque semântico (verde/vermelho apenas quando o valor É bom/ruim, nunca decorativo).
- Fallback a11y: cada gráfico expõe uma tabela equivalente via botão "Ver dados".
- Biblioteca recomendada: **Recharts** (integra com Next.js/React, tree-shakeable, acessibilidade decente).

## 21. Copilot UI rules

Documento completo: `AI_COPILOT_UI.md`.

Princípios chave:

- Trigger no header: botão `Sparkles` + label "Copilot" — sem gradient roxo.
- Painel lateral direito 420px (desktop), full-screen sheet (mobile).
- Mensagens em stream token-by-token; nunca spinner sem contexto.
- Tool results como cards de entidade linkáveis (cliente, veículo, caso, pagamento).
- Write action: sempre `ConfirmationCard` com resumo do impacto + [Confirmar] [Cancelar].
- Rótulo "IA" visível em toda resposta gerada. Sem persona humana.
- Fallback: "Copilot temporariamente indisponível" — não bloqueia navegação.

## 22. Responsive rules

Breakpoints: `375, 640, 768, 1024, 1280, 1440`.

- Mobile-first. `375px` é o alvo mínimo obrigatório.
- Sidebar → drawer offcanvas `<1024px`.
- Tabelas críticas de operação → `overflow-x: auto` + colunas essenciais primeiro; tabelas secundárias → transformar em cards.
- Dashboard mobile: KPIs essenciais (top 3), fila de atenção, busca, ações rápidas. Gráficos secundários ocultos atrás de tab/expand.
- Copilot mobile: full-screen sheet em vez de painel lateral.
- Nunca desabilitar zoom.

## 23. Accessibility

Base WCAG 2.2 AA, com AAA em texto crítico financeiro (valores/status).

Regras não-negociáveis:

- Contraste texto: ≥4.5:1 normal, ≥3:1 large text, ≥7:1 em valores monetários e status labels.
- Foco visível: `outline: 2px solid var(--border-focus); outline-offset: 2px` em `:focus-visible`.
- Navegação por teclado 100% em: forms, tabelas (linhas focáveis, `Enter` abre detalhe, `Space` seleciona checkbox), Copilot, modals (foco trap + `Esc` fecha).
- Ícones em botão sem texto: `aria-label` obrigatório.
- Status: sempre label + ícone + cor.
- `prefers-reduced-motion`: transições caem para 0ms.
- Tabela: `<caption>` oculto com contexto, `scope="col"` em th, ordenação anunciada via `aria-sort`.
- Live regions: fila de casos usa **uma** `role="status" aria-atomic="true"` por bloco — não uma por badge.
- Forms: label associado (`for`/`id`), `aria-describedby` para erros, `Focusable Error Summary` no topo.
- Text reflow: sem clip em altura fixa; usar `line-height: 1.5`, `inline-size: min(100%, 75ch)` em textos longos (motivo do caso, notas).
- Touch target: 44×44px mínimo.
- Zoom até 200% sem scroll horizontal (exceto tabelas de dados densos, permitido).

## 24. Anti-patterns específicos do EMR Despachante

Além dos anti-patterns gerais, vetados neste produto:

1. **"Pago" antes do webhook** — jamais renderizar `PAID` a partir de retorno de checkout. Fonte da verdade é webhook idempotente.
2. **Dashboard só de gráficos** — a fila prioritária sempre é o primeiro conteúdo abaixo dos KPIs.
3. **Status apenas por cor** — vetado por regra semântica e por WCAG.
4. **Spinner infinito no Copilot** — usar stream real; se `>3s` sem token, mostrar "Consultando dados da operação…".
5. **Erro genérico "algo deu errado"** — todo erro carrega contexto (qual integração falhou, quando, próxima ação sugerida).
6. **Esconder dado stale** — sempre mostrar timestamp da última atualização; nunca renderizar dado velho como fresco.
7. **KPI sem link** — todo card de KPI é clicável para lista filtrada correspondente.
8. **Ranking público entre usuários internos** — vetado no MVP (SCREEN_SPECS §11).
9. **Vermelho como cor de marca** — proibido.
10. **Verde como primary** — proibido (queima semântica de sucesso).
11. **"AI purple gradient"** — Copilot usa navy/cobalt como qualquer outra feature; roxo é reservado a status `PROCESSING`.
12. **Cor "Regular verde" em fundo grande** — verde só em badge/label/ícone, nunca preencher hero, card grande ou linha inteira de tabela.
13. **Sidebar com item "Copilot"** — Copilot é transversal, acessado pelo header.
14. **Placeholder-como-label** — vetado em todos os forms.
15. **Cobrar em tempo real ("último minuto!")** — o produto vende confiança, não urgência artificial.
16. **Confirmação de mutação por IA sem card explícito** — nunca executar write só porque o texto do usuário sugere.
17. **Fake typing indicator na IA** — se está streamando, mostrar tokens reais; se está pensando (tool call), mostrar "Consultando dados…".
18. **Toast como único canal de erro grave** — erros de pagamento/webhook aparecem no local do dado, não somente em toast.

## 25. Checklist de consistência

Antes de qualquer PR de UI:

- [ ] Cores vêm de tokens semânticos, nunca hex direto.
- [ ] Status usa label + ícone + cor (nunca só cor).
- [ ] Botão primário máx 1 por bloco visível.
- [ ] Ícone-only tem `aria-label`.
- [ ] `:focus-visible` renderiza outline 2px cobalt.
- [ ] `prefers-reduced-motion` respeitado.
- [ ] Contraste texto ≥4.5:1 (≥7:1 em valores/status).
- [ ] Toda lista tem estados `loading`, `empty`, `error`, `stale`, `partial-failure`.
- [ ] Toda tabela tem sticky header e paginação.
- [ ] Valores monetários usam `tabular-nums` e formato PT-BR (`R$ 1.284,50`).
- [ ] IDs técnicos (payment ID, case ID, RENAVAM) em IBM Plex Mono.
- [ ] Toggle dark mode não muda identidade da marca.
- [ ] `375px` testado sem scroll horizontal fora de tabelas.
- [ ] Zoom 200% preserva leitura.
- [ ] Toda resposta de IA rotula "IA" e permite feedback (👍/👎).
- [ ] Toda mutação de IA passa por `ConfirmationCard`.
- [ ] Skeleton corresponde ao layout final (não spinner genérico).
- [ ] Stale banner presente com timestamp em cache.
- [ ] Copilot fecha com `Esc` e trap de foco enquanto aberto.

## Changelog de decisão

- **2026-09-02** — Versão inicial. Direção A (Trust Navy + Emerald Signal) aprovada. Light-first, dark opt-in. Densidade 8/10 nos dashboards operacionais, 6/10 no proprietário.
