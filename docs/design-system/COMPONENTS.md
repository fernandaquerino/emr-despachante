# EMR Despachante — Component Inventory

> Inventário de componentes com variants, sizes, states e regras de uso.
> Todos os componentes referenciam **semantic tokens** (`TOKENS.md`), nunca primitives.
> Convenção de states: `default`, `hover`, `focus-visible`, `active`, `selected`, `disabled`, `loading`, `error`.

---

## Foundations

### Typography
Roles definidos em `TOKENS.md` §4. Componente `<Text as="h1|h2|body|label|caption">` deve garantir role semântico correto.

### Iconography
- Biblioteca: **Lucide** (`lucide-react`).
- Nunca emojis como ícones.
- Stroke: 1.5px (default), 2px em ícones de status (mais visíveis em 12–16px).
- Sizes: `12` (badges), `16` (inputs/botões), `20` (ações), `24` (headers de card), `32` (empty state).
- Cor: `currentColor` — sempre herda do texto pai.
- Ícone puramente decorativo: `aria-hidden="true"`.
- Ícone semântico sem texto: `aria-label` obrigatório + `role="img"`.
- Nunca usar ícone sozinho para status crítico — sempre acompanhar de label.

### Spacing / Grid
Ver `TOKENS.md` §5 e `DESIGN_SYSTEM.md` §14.

---

## Actions

### Button

Variants: `primary`, `secondary`, `accent`, `destructive`, `ghost`, `link`.
Sizes: `sm` (h 32px, padding 8/12), `md` (h 40px, padding 10/16), `lg` (h 48px, padding 12/20).

| State | Primary | Secondary | Destructive |
|---|---|---|---|
| default | bg `--action-primary` fg `--text-on-primary` | bg `--surface-default` border `--action-secondary-border` fg `--text-primary` | bg `--action-destructive` fg `--text-on-primary` |
| hover | bg `--action-primary-hover` | bg `--action-secondary-hover` | bg `--action-destructive-hover` |
| focus-visible | outline 2px `--border-focus`, offset 2px | idem | idem |
| active | bg `--action-primary-active` scale 0.98 | idem | idem |
| disabled | bg `--action-primary-disabled` fg `--text-disabled` cursor not-allowed opacity 1 | idem | idem |
| loading | spinner esquerda + label mantido + `aria-busy` | idem | idem |

Regras:

- Máximo **1 primary por bloco visível**.
- `destructive` só após confirmação (usar `ConfirmDialog`).
- Ícone à esquerda por padrão; à direita apenas em "Continuar →" ou dropdown.
- Loading nunca esconde o label — apenas adiciona spinner.

### IconButton

Sizes: `sm` (28px), `md` (36px), `lg` (44px — mobile touch target).
Sempre com `aria-label`. Tooltip em hover ≥350ms. Focus e hover iguais ao Button.

### Link

Cor `--text-link`, underline `hover` e `focus-visible` sempre. Nunca só cor.

---

## Forms

### Input / Textarea

Sizes: `md` (h 40px), `sm` (h 32px em filtros).

States: `default`, `hover` (border-strong), `focus-visible` (border-focus + ring 3px cobalt @ 20% opacity), `disabled` (bg subtle, fg disabled), `error` (border status-error + helper texto status-error + `aria-invalid=true`), `success` (opt-in: check à direita).

Elementos: label acima (obrigatório), hint opcional abaixo, error inline abaixo com `id` referenciado por `aria-describedby`.

### Select / Combobox

- `Select` para listas fechadas curtas.
- `Combobox` (input+dropdown filtrável) para listas ≥10 opções ou entidades (cliente, veículo, operadora, serviço).
- Highlight opção sob foco por teclado (`aria-activedescendant`).
- Empty state: "Nenhum resultado para '{query}'".

### Search

Input com ícone `Search` à esquerda + botão `X` à direita quando não vazio + atalho `⌘K` visual (badge à direita).
Debounce 250ms. Loading skeleton no dropdown.

### Checkbox / Radio / Switch

- Checkbox: `Check`/`Minus` (indeterminate) em fundo cobalt.
- Radio: círculo preenchido cobalt.
- Switch: track 32×18px, knob 14px; label sempre à direita ou acima; nunca sem label.

Focus ring 2px `--border-focus` offset 2px.

### DatePicker

- Formato PT-BR: `dd/mm/aaaa`.
- Input com máscara + botão calendário.
- Popover com calendário mês. Setas teclado navegam dias.
- Range picker separado (2 inputs): "De" / "Até".

---

## Feedback

### Alert (inline)

Variants: `info`, `success`, `warning`, `error`.
Estrutura: ícone + título curto + descrição opcional + ação opcional. Border-left 4px na cor semântica + bg da variante `-bg`.
Nunca fechável em erros críticos.

### Toast

Position: `top-right` desktop, `bottom-center` mobile. Duration: `4s` info, `6s` warning, `manual close` para error. Máx 3 empilhados. Não é canal único para erros graves.

### Tooltip

Delay 350ms hover, 0ms keyboard focus. Sempre `role="tooltip"`. Max-width 240px, texto `body-sm`.

### Skeleton

Match ao layout final (shape, altura, gap). Nunca spinner genérico em lista.

### Progress

Variants: `linear` (bar horizontal, altura 4px), `circular` (uso raro, apenas ação em botão).
Determinado sempre que possível; se indeterminado, animação sutil `1.4s ease-in-out infinite`.

### Spinner

Uso: dentro de botão em loading + em pequenos placeholders. Nunca ocupar tela inteira sozinho — usar Skeleton.

---

## Status

### StatusBadge

Estrutura: `[icon 12px] [label 12px 500]`, pill radius `--radius-full`, padding `2px 8px`, gap `4px`, altura 20px.

| Enum → | Label | Icon | Fundo | Texto |
|---|---|---|---|---|
| **VehicleOverallStatus** |
| REGULAR | Regular | `CheckCircle2` | `--status-success-bg` | `--status-success-fg` |
| ATTENTION | Atenção | `AlertCircle` | `--status-warning-bg` | `--status-warning-fg` |
| IRREGULAR | Irregular | `XCircle` | `--status-error-bg` | `--status-error-fg` |
| PROCESSING | Processando | `Loader2` (spin) | `--status-processing-bg` | `--status-processing-fg` |
| MANUAL_REVIEW | Revisão manual | `UserCog` | `--status-neutral-bg` | `--status-neutral-fg` |
| UNKNOWN | Sem informação | `HelpCircle` | `--status-neutral-bg` | `--status-neutral-fg` |
| **PaymentStatus** |
| PENDING | Aguardando pagamento | `Clock` | `--status-warning-bg` | `--status-warning-fg` |
| PAID | Pago | `CheckCircle2` | `--status-success-bg` | `--status-success-fg` |
| FAILED | Falhou | `XCircle` | `--status-error-bg` | `--status-error-fg` |
| CANCELLED | Cancelado | `Ban` | `--status-neutral-bg` | `--status-neutral-fg` |
| REFUND_PENDING | Reembolso pendente | `RotateCcw` | `--status-warning-bg` | `--status-warning-fg` |
| REFUNDED | Reembolsado | `RotateCcw` | `--status-info-bg` | `--status-info-fg` |
| **FineStatus** |
| OPEN | Em aberto | `AlertCircle` | `--status-warning-bg` | `--status-warning-fg` |
| PAYMENT_PENDING | Pagamento pendente | `Clock` | `--status-warning-bg` | `--status-warning-fg` |
| PAID | Pago | `CheckCircle2` | `--status-success-bg` | `--status-success-fg` |
| CLEARANCE_PROCESSING | Processando baixa | `Loader2` (spin) | `--status-processing-bg` | `--status-processing-fg` |
| CLEARED | Baixada | `CheckCircle2` | `--status-success-bg` | `--status-success-fg` |
| CANCELLED | Cancelada | `Ban` | `--status-neutral-bg` | `--status-neutral-fg` |
| **LicensingStatus** |
| ELIGIBLE | Liberado | `CheckCircle2` | `--status-success-bg` | `--status-success-fg` |
| BLOCKED | Bloqueado | `Lock` | `--status-error-bg` | `--status-error-fg` |
| PAYMENT_PENDING | Pagamento pendente | `Clock` | `--status-warning-bg` | `--status-warning-fg` |
| PAID | Pago | `CheckCircle2` | `--status-success-bg` | `--status-success-fg` |
| PROCESSING | Processando | `Loader2` (spin) | `--status-processing-bg` | `--status-processing-fg` |
| DOCUMENT_READY | Documento disponível | `FileCheck` | `--status-success-bg` | `--status-success-fg` |
| FAILED | Falhou | `XCircle` | `--status-error-bg` | `--status-error-fg` |
| **CaseStatus** |
| OPEN | Aberto | `CircleDot` | `--status-warning-bg` | `--status-warning-fg` |
| IN_PROGRESS | Em andamento | `Loader2` (spin) | `--status-info-bg` | `--status-info-fg` |
| WAITING_CLIENT | Aguardando cliente | `UserClock` | `--status-neutral-bg` | `--status-neutral-fg` |
| WAITING_EXTERNAL | Aguardando órgão | `Clock` | `--status-processing-bg` | `--status-processing-fg` |
| RESOLVED | Resolvido | `CheckCircle2` | `--status-success-bg` | `--status-success-fg` |
| CANCELLED | Cancelado | `Ban` | `--status-neutral-bg` | `--status-neutral-fg` |
| **GovernmentSubmissionStatus** |
| NOT_REQUESTED | Não solicitado | `Circle` | `--status-neutral-bg` | `--status-neutral-fg` |
| QUEUED | Na fila | `Clock` | `--status-neutral-bg` | `--status-neutral-fg` |
| PROCESSING | Processando | `Loader2` (spin) | `--status-processing-bg` | `--status-processing-fg` |
| CONFIRMED | Confirmado | `CheckCircle2` | `--status-success-bg` | `--status-success-fg` |
| FAILED | Falhou | `XCircle` | `--status-error-bg` | `--status-error-fg` |
| MANUAL_REVIEW | Revisão manual | `UserCog` | `--status-neutral-bg` | `--status-neutral-fg` |
| **OperatorStatus** |
| INVITED | Convite pendente | `MailPlus` | `--status-warning-bg` | `--status-warning-fg` |
| ACTIVE | Ativa | `CheckCircle2` | `--status-success-bg` | `--status-success-fg` |
| SUSPENDED | Suspensa | `Pause` | `--status-warning-bg` | `--status-warning-fg` |
| DISABLED | Desativada | `Ban` | `--status-neutral-bg` | `--status-neutral-fg` |
| **ServiceStatus** |
| ACTIVE | Ativo | `CheckCircle2` | `--status-success-bg` | `--status-success-fg` |
| INACTIVE | Inativo | `Ban` | `--status-neutral-bg` | `--status-neutral-fg` |

### PriorityBadge

Estrutura: `[bar 4px cor] [label]`. Barra vertical de 4px à esquerda + label. Em tabela, também aparece como cor da primeira coluna reduzida.

| Priority | Label | Cor barra + label |
|---|---|---|
| CRITICAL | Crítica | `--priority-critical` |
| HIGH | Alta | `--priority-high` |
| MEDIUM | Média | `--priority-medium` |
| LOW | Baixa | `--priority-low` |

### PaymentStatus (composto)

Componente que combina `PaymentStatus` local + `PaymentStatus` provider + `GovernmentSubmissionStatus` em uma linha explicativa. Ex.: "Pago (provider) — aguardando baixa (órgão)". Cada substatus é um mini-badge.

### CaseStatus (composto)

Mesma lógica: label + ícone principal + secondary caption com "há Xh" quando aplicável.

### ProcessingState

Componente para blocos maiores (não pill): banner com `Loader2 (spin)`, título ("Estamos aguardando a atualização do órgão"), subtítulo com contexto e timestamp.

---

## Data

### Table

Anatomia:

```
┌ header (sticky, bg surface, border-bottom) ─────────────────┐
│ [ ] │ Coluna 1 ↕ │ Coluna 2 │ Coluna 3 (num, right)  │ ⋯   │
├──────────────────────────────────────────────────────────────┤
│ [ ] │ ...       │ ...      │ 1.234,50                │ ⋮   │
└──────────────────────────────────────────────────────────────┘
[footer] Total: 1284 · Página 1 de 26 · [◀ 1 2 … 26 ▶] · [50/pág]
```

Densidades:
- Dense: row 36px, cell padding `8px 12px`, font 13px.
- Comfort: row 44px, cell padding `12px 16px`, font 14px.

States:
- Row default → hover `--bg-subtle` → selected `--surface-selected` + border-left 2px cobalt.
- Focus-visible: outline dentro da célula focada (`:focus-visible` scoped).
- Loading (primeira carga): skeleton rows 8× row-height.
- Refetching (após primeira carga): overlay `--bg-default 40% alpha` + spinner discreto no header.
- Empty: componente `EmptyState` embutido.
- Error: `ErrorState` acima; body preserva última carga.
- Partial failure: banner acima; feed/coluna secundária mostra "Não foi possível carregar".
- Stale: `StaleDataBanner` acima com timestamp.

Recursos:
- Ordenação: click no header (sort). Anunciar via `aria-sort="ascending|descending|none"`.
- Bulk: checkbox column; ao selecionar, sticky action bar aparece no topo da tabela ("3 selecionados · [Assumir] [Alterar status] [X]").
- Ação por linha: última coluna com IconButton `MoreVertical` abrindo dropdown de ações; nunca linkar 3× a mesma linha.
- Truncação: colunas de texto longo `text-overflow: ellipsis`; tooltip revela completo.
- Paginação: `20/50/100`. Total sempre visível. Server-side.
- Responsividade: `overflow-x: auto` (crítica) ou lista de cards (secundária).

### Pagination

`[◀ Anterior] [1] [2] [3] … [n] [Próxima ▶]` + seletor de tamanho de página. Estado: current com fg on-primary e bg action-primary.

### Filters (FilterBar)

Chips horizontais logo acima da tabela + botão `Filtros` para expandir painel lateral com mais opções + botão "Limpar filtros" quando ao menos 1 aplicado. Chips aplicados mostram valor + `X` para remover. Contagem entre parênteses ("Prioridade: Crítica (6)").

### EmptyState

Anatomia: ícone 32px `--text-muted`, título H3, descrição body, CTA opcional. Exemplos:

- "Nenhum caso encontrado com esses filtros. [Limpar filtros]"
- "Você ainda não cadastrou nenhum veículo. [Cadastrar veículo]"

Nunca "Nada aqui." isolado.

### ErrorState

Ícone `AlertTriangle` `--status-error`, título "Não conseguimos carregar {contexto}", descrição do que aconteceu se conhecido, botão "Tentar novamente". Nunca "Algo deu errado".

### StaleDataBanner

Banner amarelo suave (`--status-warning-bg`), altura 40px, ícone `Info`, texto: "Última atualização: {timestamp}. [Atualizar]".

### Timeline

Coluna vertical com linha de 2px `--border-default` à esquerda e círculos de 12px por evento. Cada item:
- ícone da categoria + título + descrição opcional + timestamp relativo (`há 3 min`, `há 2h`, `12/09 09:34`) com timestamp absoluto em tooltip.
- filtros no topo (Tudo, Consultas, Multas, Pagamentos, etc.) como chips.
- ordenação: mais recente no topo.
- append-only visualmente (notas internas nunca editadas).

### KPI Card

Anatomia:

```
┌────────────────────────────┐
│ LABEL (12px caps caption)  │
│ 1.284  [↑ 12% vs semana]   │  ← valor 28px tabular + delta 12px
│ ─────────────────────────  │
│ Ver detalhes →             │  ← link para lista filtrada
└────────────────────────────┘
```

- Altura 96px, padding 16px, radius `--radius-lg`, elev-1.
- Valor tabular-nums; sinal do delta com ícone (↑ verde, ↓ vermelho para métricas onde queda é ruim; inverter semântica quando queda é boa — e sempre com label).
- Card inteiro clicável (`role="link"` ou `<a>`). Nunca puramente decorativo.

---

## Navigation

### Sidebar

Fixa desktop, drawer mobile.

- 240px desktop expandida, 72px colapsada.
- Logo no topo (48px).
- Grupos com título 11px caps `--text-muted`.
- Item: ícone 20px + label 14px + optional badge à direita.
- Estado ativo: bg `--surface-selected`, border-left 3px cobalt, ícone e texto cor `--text-link`.
- Hover: bg `--bg-subtle`.
- Bottom: perfil compacto + toggle de tema.

### Header

56px, sticky, bg `--surface-default`, border-bottom 1px.

Conteúdo (ops/admin):
- esquerda: breadcrumb ou title da rota
- centro: `GlobalSearch` (300–480px)
- direita: `Copilot` button + `Bell` (notifications) + Avatar/menu.

### Tabs

Underline style. Padding 12/16, gap 24, border-bottom 2px em ativo. Focus ring padrão.

### Breadcrumb

`Home / Clientes / Mariana Alves`. Separador `ChevronRight` 12px. Último item sem link. Truncação com `…` em textos longos.

### GlobalSearch

Input com `Search`, atalho `⌘K` visível. Dropdown com resultados agrupados por tipo: Clientes, Veículos, Casos, Pagamentos. Cada resultado com badge do tipo + nome + subtítulo.

---

## Overlay

### Modal

- Backdrop `rgba(15,23,42,0.5)` (light) / `rgba(0,0,0,0.7)` (dark).
- Container centralizado, max-width `520px` (sm), `720px` (md), `960px` (lg).
- Radius `--radius-xl`, elev-3.
- Header: título H3 + `X` close.
- Body: scroll interno se >70vh.
- Footer: ações à direita, primary última.
- Focus trap; `Esc` fecha (exceto em `ConfirmDialog` destrutivo — só o botão Cancelar).
- `aria-modal="true"`, `aria-labelledby` no título.

### Drawer

Slide da direita (padrão) ou esquerda (mobile menu).
Larguras: `sm 360px`, `md 480px`, `lg 640px`, full em mobile.
Handle discreto na borda interna se resizable.

### Popover

Anchored a um trigger. Radius `--radius-md`, elev-2, padding `12px 16px`. `Esc` fecha, focus trap opcional.

### Dropdown menu

Radius `--radius-md`, elev-2. Item: h 36px, padding `8px 12px`. Ícone 16 opcional à esquerda; atalho de teclado à direita em `--text-muted`.

### ConfirmDialog

Sub-tipo de Modal com estrutura fixa:

- Título curto ("Suspender operadora Ana Ribeiro?")
- Descrição objetiva do impacto ("A operadora perde acesso imediatamente. Casos abertos podem ser reatribuídos.")
- Se destrutivo: input de confirmação opcional (digite o nome).
- Ações: `[Cancelar]` `[Confirmar]` (primary ou destructive conforme ação).

---

## Domain components

Todos os componentes de domínio (CustomerSummary, VehicleSummary, CaseCard, CaseTimeline, PaymentSummary, PaymentStatus composto, ServiceStatusStepper, ReconciliationStatus, ProcessingState, GlobalSearch + ResultItem, CopilotPanel, AI Tool Result Card, AI Write-Confirmation Card) estão especificados em **[`DOMAIN_COMPONENTS.md`](./DOMAIN_COMPONENTS.md)**.

O único componente estrutural que permanece aqui:

### AppShell

Container raiz:
- Sidebar + Header + Content + (opcional) CopilotPanel sobreposto.
- Content wrapper com padding responsivo.
- Provider de tema, toast, auth.

---

## Guidelines de composição

- Prefira **1 padrão canônico por caso**. Ex.: se `CaseCard` existe, não crie `CaseListItem` alternativo para o mesmo contexto.
- Domain components **envolvem** primitivos — nunca reimplementam Button/Input.
- Card com ação principal usa `<button>` ou `<a>` externo, nunca div com `onClick`.
- Todo componente com estado assíncrono expõe `loading`/`error`/`empty` como prop ou renderiza slots.
- Componentes de status recebem enum tipado — nunca string livre.
