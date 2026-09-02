# EMR Despachante — Domain Components

> Componentes específicos do domínio EMR Despachante.
> Fonte única de anatomia; regras de fluxo/UX complementares em [`AI_COPILOT_UI.md`](./AI_COPILOT_UI.md) e [`UX_RULES.md`](./UX_RULES.md).
> Todos os tokens vêm de [`TOKENS.md`](./TOKENS.md); componentes base (Button, Input, Table) em [`COMPONENTS.md`](./COMPONENTS.md).

---

## Princípio

**Um mesmo estado de negócio se renderiza igual em toda tela.** Se `PaymentStatus = CLEARANCE_PROCESSING` aparece em 5 lugares diferentes, deve ter o mesmo label, ícone, cor e altura em todos.

Toda tela que precisar exibir uma entidade central (cliente, veículo, caso, pagamento, submissão) **precisa** usar o domain component correspondente — não recriar layout.

## Índice

1. [CustomerSummary](#1-customersummary)
2. [VehicleSummary](#2-vehiclesummary)
3. [CaseCard](#3-casecard)
4. [CaseTimeline](#4-casetimeline)
5. [PaymentSummary](#5-paymentsummary)
6. [PaymentStatus (composto)](#6-paymentstatus-composto)
7. [ServiceStatusStepper](#7-servicestatusstepper)
8. [ReconciliationStatus](#8-reconciliationstatus)
9. [ProcessingState](#9-processingstate)
10. [GlobalSearch + ResultItem](#10-globalsearch--resultitem)
11. [CopilotPanel](#11-copilotpanel)
12. [AI Tool Result Card](#12-ai-tool-result-card)
13. [AI Write-Confirmation Card](#13-ai-write-confirmation-card)

---

## 1. CustomerSummary

Card resumido de cliente, usado em: detalhe do cliente (header), lista de clientes (opção de "vista card"), busca global, resultado de tool do Copilot.

### Anatomia

```
┌─ CustomerSummary ─────────────────────────────────┐
│ ┌──┐  Mariana Alves        [ATIVO]                │
│ │MA│  mariana@email.com · (11) 98765-4321         │
│ └──┘  CPF: 123.***.***.-45   (mono)                │
│ ─────────────────────────────────────────────────  │
│ 🚗 2  ⚠ 2  💰 R$ 812,40  📁 1                     │
│ Veíc.  Pend. Total aberto  Casos                  │
│ ─────────────────────────────────────────────────  │
│                             [ Ver detalhe → ]     │
└───────────────────────────────────────────────────┘
```

### Props

| Prop | Tipo | Obrigatório |
|---|---|---|
| `customer` | `{ id, name, email, phone, cpfMasked, status }` | ✅ |
| `metrics` | `{ vehicles, pendencies, totalOpen, cases }` | ✅ |
| `variant` | `"compact"` \| `"default"` | — (default) |
| `onOpen` | `() => void` | — |

### Regras

- Nome em Body Large 500. Status como `StatusBadge` (`ACTIVE`/`INVITED`/`SUSPENDED`/`DISABLED`).
- CPF sempre mascarado por padrão. Reveal apenas em `/admin` com audit log.
- Métricas com `tabular-nums`; valor monetário formatado PT-BR.
- Avatar: iniciais em círculo `--surface-selected`. Nunca ilustração/foto.
- Variant `compact` remove métricas + reduz padding (usado em Copilot).

### States

- `default`, `hover` (surface-raised + elev-2), `loading` (skeleton), `error` (banner interno "Não conseguimos carregar os dados deste cliente. [Tentar novamente]").

---

## 2. VehicleSummary

Card de veículo, usado em: "Meus veículos", detalhe do cliente, dashboard operacional, resultado de busca, tool do Copilot.

### Anatomia

```
┌─ VehicleSummary ──────────────────────────────────┐
│ ABC1D23    Honda HR-V 2022      [Irregular]       │
│ (mono)     ─────────────────────                  │
│ ⚠ Última atualização: há 2h    [ Atualizar ]      │
│ ─────────────────────────────────────────────────  │
│  Multas          Licenciamento                    │
│  2 em aberto     Bloqueado por multa              │
│                                                    │
│  [ Ver veículo → ]                                │
└───────────────────────────────────────────────────┘
```

### Props

| Prop | Tipo | Obrigatório |
|---|---|---|
| `vehicle` | `{ plate, model, year, overallStatus }` | ✅ |
| `lastUpdatedAt` | `Date` | ✅ |
| `fines` | `{ openCount }` | — |
| `licensing` | `{ status, reason? }` | — |
| `onRefresh` | `() => void` | — |
| `onOpen` | `() => void` | ✅ |

### Regras

- Placa em `--font-mono`, uppercase, sem formatação decorativa.
- `overallStatus` sempre via `StatusBadge` (cores/ícones da tabela canônica em `COMPONENTS.md` §Status).
- **Se `lastUpdatedAt > 4h`**, mostrar `StaleDataBanner` inline com CTA "Atualizar".
- Botão "Atualizar" muda para spinner em loading; retorna à normalidade após resposta.
- Se `licensing.status = BLOCKED` com `reason`, mostrar o motivo como caption.

---

## 3. CaseCard

Card compacto de caso, usado em: dashboard operacional, lista de casos, "sem responsável", tool result do Copilot.

### Anatomia

```
┌─ CaseCard ────────────────────────────────────────┐
│ ▌ #1842 · Mariana Alves · ABC1D23                 │  ← barra 4px priority
│ ▌ Baixa não reconhecida há 26h após pagamento     │  ← motivo, 2 linhas máx
│ ▌ [WAITING_EXTERNAL]  há 26h  · 👤 Ana Ribeiro    │
└───────────────────────────────────────────────────┘
```

### Props

| Prop | Tipo |
|---|---|
| `case` | `{ id, priority, status, reason, createdAt, assignee? }` |
| `customer` | `{ id, name }` |
| `vehicle` | `{ plate }` |
| `variant` | `"queue"` \| `"copilot"` \| `"unassigned"` |
| `onOpen` | `() => void` |

### Regras

- Barra 4px `--priority-{low|medium|high|critical}` na borda esquerda (única presença da cor de prioridade além do próprio label).
- Motivo truncado em 2 linhas com ellipsis; tooltip revela completo.
- `assignee`: mostrar avatar 20px + nome. Se ausente: badge "Sem responsável" em `--status-warning-bg`.
- Variant `unassigned` destaca o badge "Sem responsável".
- Variant `copilot` remove ações e não expande no hover (leitura passiva dentro do painel).
- Click no card inteiro abre `/casos/:id` (não em botão separado).

### States

- Default, hover (`--bg-subtle` + elev-1), focus-visible (outline 2px cobalt), loading (skeleton), disabled (opacity 0.5 — quando caso foi resolvido durante refresh).

---

## 4. CaseTimeline

Timeline vertical com eventos técnicos e operacionais do caso.

### Anatomia

```
Filtros: [Todos] [Sistema] [Notas] [Ações]

●─ Caso criado                                       agora
│  Detectada divergência entre webhook (PAID) e
│  submission (PROCESSING). Prioridade HIGH.
│
●─ Nota interna · Ana Ribeiro                       há 15min
│  Tentei nova submissão manual. Aguardando 30min.
│  ┌─────────────────────────────────────────┐
│  │ (fundo --bg-subtle, texto completo)      │
│  └─────────────────────────────────────────┘
│
●─ Submissão externa retentada                      há 30min
│  Retry 3 de 5. Response: timeout.
│
○─ [Adicionar nota interna]
```

### Props

| Prop | Tipo |
|---|---|
| `events` | `Array<TimelineEvent>` |
| `filters` | `Array<"all"|"system"|"notes"|"actions">` |
| `canAddNote` | `boolean` |
| `onAddNote` | `(text: string) => Promise<void>` |
| `appendOnly` | `boolean` (default `true`) |

### Regras

- Linha vertical 2px `--border-default`; círculos 12px na cor da categoria.
- Ordem: mais recente no topo.
- Cada evento: ícone por categoria + título + descrição opcional + timestamp relativo (tooltip com absoluto).
- Notas internas: card com fundo `--bg-subtle`, autor + timestamp, texto preservado com quebras.
- **Append-only visualmente:** notas nunca editáveis; para correção, adicionar nova.
- Filtros preservam scroll position.
- Empty: "Este caso ainda não tem eventos registrados."
- Loading: 3 skeleton items.

### Acessibilidade

- Container: `role="feed"` + `aria-busy` durante loading.
- Cada evento: `role="article"` com `aria-labelledby` no título.
- Filtros: `role="tablist"` + `role="tab"` + `aria-selected`.

---

## 5. PaymentSummary

Bloco vertical de pagamento, usado em: detalhe da multa, detalhe do pedido, detalhe do caso, reconciliação.

### Anatomia

```
┌─ PaymentSummary ──────────────────────────────────┐
│  R$ 412,50            [PAID] [CLEARANCE_PROCESSING]│
│  (KPI tabular)         ─── local ─── ─── órgão ─── │
│                                                    │
│  Método: Pix           Provider: PagBrasil        │
│  payment_id: PAY-8291        (mono)                │
│  provider_ref: 5a3f-...      (mono)                │
│  ─────────────────────────────────────────────    │
│  Timeline financeira (últimos 5)                   │
│   • Webhook recebido — há 26h                     │
│   • Payment criado    — há 26h                    │
│   • Checkout iniciado — há 26h                    │
│                                                    │
│  [ Ver pagamento completo → ]                     │
└───────────────────────────────────────────────────┘
```

### Props

| Prop | Tipo |
|---|---|
| `payment` | `{ id, amount, method, provider, providerRef, statusLocal, statusProvider, submissionStatus? }` |
| `timeline` | `Array<PaymentEvent>` (limit 5) |
| `onOpenFull` | `() => void` |

### Regras

- Valor em KPI size (`--font-size-kpi`) com `tabular-nums`.
- Cores semânticas apenas nos badges — nunca pintar o valor em verde/vermelho.
- IDs sempre em `--font-mono`, com truncação central se > 24 chars (`5a3f-…-b7c2`).
- Provider reference sempre copiável (hover mostra `Copy` icon).
- Se `statusLocal ≠ statusProvider`, incluir `ReconciliationStatus` acima do bloco (ver §8).

---

## 6. PaymentStatus (composto)

Micro-componente de status composto, usado dentro de `PaymentSummary`, listas de pagamento, tool result da IA.

### Anatomia

```
[PAID]  →  [CLEARANCE_PROCESSING]
local       órgão

ou linha corrida:
Pago (provider) · aguardando baixa (órgão)
```

### Regras

- Sempre expor os 3 níveis quando existirem: local, provider, government submission.
- Nunca fundir em texto ambíguo ("processando"): manter os 3 badges canônicos.
- Se um dos níveis é `NOT_REQUESTED`, ocultar aquele badge (não renderizar cinza).
- Divergência local ≠ provider destaca com ícone `AlertTriangle` `--status-warning` entre eles.

### Props

| Prop | Tipo |
|---|---|
| `statusLocal` | `PaymentStatus` |
| `statusProvider` | `PaymentStatus` |
| `submissionStatus` | `GovernmentSubmissionStatus?` |
| `layout` | `"badges"` \| `"inline"` |

---

## 7. ServiceStatusStepper

Stepper horizontal (desktop) / vertical (mobile) para o ciclo de um pedido.

### Anatomia (horizontal)

```
● ─── ● ─── ⟳ ─── ○ ─── ○ ─── ○
│     │     │     │     │     │
Criado Pgto  Pgto  Enviado Baixa Concluído
      pend. conf. p/ órgão conf.
09:34  09:35 09:40  ...
```

Estados de círculo:

| Estado | Visual |
|---|---|
| Concluído | círculo preenchido `--status-success`, `Check` interno branco |
| Atual (processing) | círculo com `Loader2` (spin) `--status-processing` |
| Atual (waiting) | círculo com `Clock` `--status-warning` |
| Futuro | círculo vazio border `--border-strong` |
| Erro | círculo `--status-error` com `X` + label sublinhada + link "Precisamos revisar este pedido" abaixo |
| Cancelado | círculo `--status-neutral` com `Ban` |

### Props

| Prop | Tipo |
|---|---|
| `steps` | `Array<{ id, label, status, completedAt?, description? }>` |
| `orientation` | `"horizontal"` \| `"vertical"` |
| `currentStepId` | `string` |
| `errorMessage` | `string?` |

### Regras

- Timestamp abaixo de cada etapa concluída (`HH:mm` do dia, `dd/mm HH:mm` se >24h).
- Etapa em erro interrompe o stepper (etapas seguintes ficam `disabled`).
- Nunca animar transição entre estados em página cheia (respeitar `reduced-motion`).
- Mobile: layout vertical com linha à esquerda; cada etapa vira card empilhado.

---

## 8. ReconciliationStatus

Bloco para tela de reconciliação financeira e para PaymentSummary quando há divergência.

### Anatomia

```
┌─ ReconciliationStatus ─────────────────────────────┐
│  ⚠ Divergência detectada                           │
│  ─────────────────────────────────────────────────  │
│   Local            Provider          Idade         │
│   [PENDING]        [PAID]            3h            │
│                                                     │
│   [ Criar caso operacional ]  [ Ver detalhes ]    │
└────────────────────────────────────────────────────┘
```

### Props

| Prop | Tipo |
|---|---|
| `statusLocal` | `PaymentStatus` |
| `statusProvider` | `PaymentStatus` |
| `ageHours` | `number` |
| `threshold` | `number` (default 1h) |
| `onCreateCase` | `() => void` |
| `onOpenDetail` | `() => void` |

### Regras

- Border-left 4px `--status-warning` quando divergente < threshold; `--status-error` quando ≥ threshold.
- Botão "Criar caso" desaparece se já existe caso vinculado (mostrar link "Ver caso #NNNN").
- `ageHours` em `tabular-nums`.
- Se `statusLocal = statusProvider`, componente não renderiza nada (`null`).

---

## 9. ProcessingState

Banner de estado transitório, usado quando um processo assíncrono está em andamento e o usuário precisa entender por que a UI não avançou.

### Anatomia

```
┌─ ProcessingState ──────────────────────────────────┐
│  ⟳  Estamos aguardando a atualização do órgão      │
│     Última tentativa: há 8min · Próxima em ~2min   │
│                                                     │
│     [ Ver detalhes técnicos ]                      │
└────────────────────────────────────────────────────┘
```

### Props

| Prop | Tipo |
|---|---|
| `title` | `string` |
| `subtitle` | `string?` |
| `lastAttempt` | `Date?` |
| `nextAttempt` | `Date?` |
| `severity` | `"processing"` \| `"warning"` |
| `onShowDetails` | `() => void?` |

### Regras

- Ícone `Loader2` em spin lento (2s) — pausa com `prefers-reduced-motion`.
- Cor de fundo: `--status-processing-bg` (default) ou `--status-warning-bg` (severity=warning).
- Sempre visível quando aplicável — não substituir por spinner puro sem contexto.
- Nunca ocupar a tela inteira; posicionar acima ou dentro do bloco relacionado.
- Se `nextAttempt` no passado, mudar para "Verificando…".

---

## 10. GlobalSearch + ResultItem

Componente de busca global no header, essencial para o princípio da IA: "toda informação navegável a partir de cliente/veículo/caso".

### Anatomia (input + dropdown)

```
Header:
┌──────────────────────────────────────────────────┐
│  🔍  Buscar cliente, placa, caso…      [⌘ K]     │
└──────────────────────────────────────────────────┘

Dropdown aberto:
┌──────────────────────────────────────────────────┐
│  🔍  mari                              [X] [⌘ K] │
├──────────────────────────────────────────────────┤
│  CLIENTES (3)                                     │
│  ┌────────────────────────────────────────────┐  │
│  │ 👤 Mariana Alves                    ↵      │  │  ← highlight match
│  │    mariana@email.com · 2 veículos          │  │
│  └────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────┐  │
│  │ 👤 Marina Costa                             │  │
│  │    marina.c@email.com · 1 veículo          │  │
│  └────────────────────────────────────────────┘  │
│                                                    │
│  VEÍCULOS (1)                                     │
│  ┌────────────────────────────────────────────┐  │
│  │ 🚗 ABC1D23 · Honda HR-V     [Irregular]   │  │
│  │    Mariana Alves                            │  │
│  └────────────────────────────────────────────┘  │
│                                                    │
│  CASOS (0)  ·  PAGAMENTOS (0)                     │
├──────────────────────────────────────────────────┤
│  ↑↓ navegar   ↵ abrir   esc fechar               │
└──────────────────────────────────────────────────┘
```

### Anatomia do ResultItem

```
┌─ SearchResultItem ────────────────────────────────┐
│  [ícone tipo]  Título com <mark>match</mark>      │
│                subtítulo secundário               │
│                                       [↵ atalho] │
└───────────────────────────────────────────────────┘
```

### Estados do dropdown

| Estado | Conteúdo |
|---|---|
| **Vazio (foco recém-aberto)** | "Buscas recentes" (últimas 5) + atalhos ("Digite `#` para buscar caso, `p:` para placa"). |
| **Digitando** | Skeleton de 3 items após 150ms; resultados streamados por grupo. |
| **Com resultados** | Grupos ordenados: Clientes → Veículos → Casos → Pagamentos. Máx 5 por grupo, com "[Ver todos os 12 →]" quando exceder. |
| **Sem resultados** | "Nenhum resultado para '{query}'. [Buscar em auditoria] [Buscar em documentos]" — sugestões de escopos alternativos. |
| **Erro** | "Não conseguimos buscar agora. [Tentar novamente]" — não fecha o dropdown. |
| **Permission-denied em item** | Item aparece disabled com tooltip "Você não tem acesso a este registro." |

### Comportamento por teclado

| Tecla | Ação |
|---|---|
| `⌘/Ctrl + K` | Foca o input de qualquer lugar |
| `↓` / `↑` | Navega entre resultados (roving `aria-activedescendant`) |
| `Enter` | Abre item focado |
| `Esc` | Fecha dropdown; segundo Esc limpa input |
| `Tab` | Move foco para próximo grupo |
| `⌘/Ctrl + Enter` | Abre item em nova aba |

### Props

| Prop | Tipo |
|---|---|
| `onSearch` | `(query: string) => Promise<GroupedResults>` |
| `debounceMs` | `number` (default 250) |
| `recentSearches` | `Array<{ query, resultCount, at }>` |
| `groups` | `Array<"customers"|"vehicles"|"cases"|"payments">` |
| `onSelect` | `(item: SearchResult) => void` |

### Regras

- Debounce 250ms; requisição cancelada se query mudar.
- Match highlight com `<mark>` semântico (bg `--status-warning-bg` opcional, fg preservada — nunca só cor).
- Ícone por tipo: `User`, `Car`, `FolderOpen`, `CreditCard`.
- Busca por padrões: `#1842` (caso), `ABC1D23` (placa), CPF, `PAY-XXXX` (payment).
- Recent searches persistidas localmente (localStorage), com botão "Limpar" no rodapé do grupo.
- Fechamento: click fora, `Esc`, ou navegação.
- Nunca busca sem consentir permissões — resultados filtrados server-side por RBAC.

### Acessibilidade

- Input: `role="combobox"` + `aria-expanded` + `aria-controls` + `aria-autocomplete="list"`.
- Dropdown: `role="listbox"` com `aria-label="Resultados da busca"`.
- Items: `role="option"` + `aria-selected` no atual.
- Grupos: `role="group"` + `aria-label` com nome do grupo.
- Atalhos anunciados no rodapé (visíveis a screen reader).

---

## 11. CopilotPanel

Painel lateral do EMR Copilot. Anatomia detalhada em [`AI_COPILOT_UI.md §3`](./AI_COPILOT_UI.md).

### Resumo de anatomia

```
┌─ CopilotPanel ─────────────────┐  (420px desktop)
│  ✨ EMR Copilot  [IA]  ⟳ ⋮ ✕   │  ← header 56px
├────────────────────────────────┤
│                                 │
│  Suggested prompts (empty)      │
│  ou                             │
│  Message stream                 │
│  ├ user                         │
│  ├ ai                           │
│  ├ tool result cards            │
│  └ confirmation cards           │
│                                 │
├────────────────────────────────┤
│  [ textarea auto-resize ]  [→] │  ← input sticky
│  IA · pode se enganar…         │
└────────────────────────────────┘
```

### Props

| Prop | Tipo |
|---|---|
| `open` | `boolean` |
| `role` | `"ADMIN"` \| `"ADMIN"` |
| `context` | `{ page, entityId? }` — para prompts contextuais |
| `session` | `CopilotSession` |
| `onClose` | `() => void` |
| `onSend` | `(message: string) => Promise<void>` |

### Regras críticas

- **Nunca gradient roxo** — mesma paleta do resto do produto (navy + cobalt).
- Ícone único da IA: `Sparkles` (Lucide). Nunca outros.
- Backdrop transparente (não modal) em `>=1280px`; drawer com backdrop leve abaixo.
- Focus trap **desligado** (usuário pode voltar à página); `Esc` fecha; foco retorna ao trigger.
- Não bloqueia a página — usuário navega enquanto conversa.
- Fallback: se LLM indisponível, painel abre em estado "temporariamente indisponível" mantendo a UI navegável.

### Anti-patterns proibidos

Ver [`AI_COPILOT_UI.md §14`](./AI_COPILOT_UI.md) — resumo: sem persona humana, sem gradient, sem emojis (exceto `✨` reservado), sem autoplay, sem streaming fake.

---

## 12. AI Tool Result Card

Card compacto retornado pela IA quando uma tool retorna uma entidade. Usado dentro de mensagens da IA no `CopilotPanel`.

### Anatomia (variantes)

**CustomerCard mini:**
```
┌──────────────────────────────┐
│ 👤 Mariana Alves              │
│ 2 veículos · 2 pendências     │
│ [Abrir cliente →]             │
└──────────────────────────────┘
```

**VehicleCard mini:**
```
┌──────────────────────────────┐
│ 🚗 ABC1D23 · Honda HR-V       │
│ [Irregular] 2 multas em aberto│
│ [Abrir veículo →]             │
└──────────────────────────────┘
```

**CaseCard mini:**
```
┌──────────────────────────────┐
│ #1842 · Alta · WAITING_EXTERNAL│
│ Baixa não reconhecida há 26h   │
│ Cliente: Mariana Alves         │
│ [Abrir caso →]                 │
└──────────────────────────────┘
```

**PaymentCard mini:**
```
┌──────────────────────────────┐
│ 💰 PAY-8291 · R$ 412,50       │
│ [PAID] [CLEARANCE_PROCESSING] │
│ [Ver pagamento →]             │
└──────────────────────────────┘
```

### Props (união discriminada)

```ts
type ToolResultCard =
  | { kind: "customer"; customer: CustomerSummaryDTO }
  | { kind: "vehicle"; vehicle: VehicleSummaryDTO }
  | { kind: "case"; case: CaseDTO }
  | { kind: "payment"; payment: PaymentDTO };
```

### Regras

- Cada card **reutiliza os StatusBadges canônicos** — nunca renderiza status próprio.
- Padding 12px, radius `--radius-md`, elev-1, bg `--surface-raised`.
- CTA sempre linka para a rota canônica da entidade — nunca duplica funcionalidade.
- Máximo 5 cards por resposta da IA; excesso vira lista com "[Ver mais 12 →]".
- Fonte de dados: sempre resultado real de tool call — a IA nunca "inventa" um card.
- Rótulo pequeno "IA · dados via {tool_name}" opcional em hover, para auditabilidade.

### Consistência com telas principais

O `CustomerCard mini` é uma variante `compact` de `CustomerSummary` (§1). Se o design do `CustomerSummary` mudar, o mini muda junto. **Nunca criar layout independente.**

---

## 13. AI Write-Confirmation Card

Card obrigatório antes de qualquer write action executada pela IA (`assignCase`, `changeCaseStatus`, `createRefundRequest`, `resendCustomerNotification`, `sendCustomerMessage`).

Ver [`AI_COPILOT_UI.md §7`](./AI_COPILOT_UI.md) para exemplo completo.

### Anatomia

```
┌──────────────────────────────────────────────┐
│ ⚠  Confirmar ação                             │
│                                                │
│ Alterar o caso #1842 para "Aguardando órgão"? │
│                                                │
│ Motivo (sugerido pela IA):                    │
│ Pagamento confirmado; submissão externa       │
│ ainda pendente há 26h.                        │
│                                                │
│ Impacto:                                       │
│ • Status muda para WAITING_EXTERNAL            │
│ • Timer de SLA reinicia                        │
│ • Notificação enviada ao responsável           │
│                                                │
│      [Cancelar]  [Confirmar mudança]          │
└──────────────────────────────────────────────┘
```

### Props

| Prop | Tipo |
|---|---|
| `action` | `{ tool: string, entityId: string, params: object }` |
| `title` | `string` — pergunta clara |
| `reason` | `string` — justificativa da IA |
| `impact` | `Array<string>` — bullets de efeito no sistema |
| `severity` | `"info"` \| `"warning"` \| `"destructive"` |
| `requireTypedConfirmation` | `string?` — para destrutivas |
| `onConfirm` | `() => Promise<void>` |
| `onCancel` | `() => void` |

### Regras

- Border-left 4px `--status-warning` (default) ou `--status-error` (destructive).
- Botão de confirmação usa variant `primary` ou `destructive` conforme severity.
- `requireTypedConfirmation`: input adicional obrigatório (ex.: "Digite o ID do caso" ou "Digite CANCELAR").
- **Nunca countdown auto-execute** — sempre requer clique explícito.
- `aria-live="polite"` no card; `role="alertdialog"` com foco no primeiro botão.
- Após confirm, o card vira mensagem imutável no stream com resultado ("✓ Caso #1842 alterado para WAITING_EXTERNAL — há 3s").
- Se falhar: mostrar erro específico com botão "Tentar novamente" ou "Cancelar".
- Cancel sempre volta ao estado anterior da conversa sem side effects.

### Segurança

- Autorização é validada server-side quando o botão é clicado — o card nunca é a fonte da verdade de permissão.
- Se a permissão mudou entre a sugestão da IA e o clique, mostrar "Você não tem mais permissão para executar esta ação. [Fechar]".

---

## Checklist de consistência (domain)

Antes de aprovar PR que toque em domain components:

- [ ] Entidade usa o domain component canônico (não layout ad-hoc).
- [ ] StatusBadge/PriorityBadge vem da tabela canônica.
- [ ] IDs técnicos em `--font-mono` truncados centralmente se > 24 chars.
- [ ] CPF sempre mascarado (reveal auditado).
- [ ] Valores monetários com `tabular-nums` + formato PT-BR.
- [ ] Placas em uppercase mono.
- [ ] Stale > 4h mostra `StaleDataBanner`.
- [ ] Payment nunca `PAID` antes de webhook.
- [ ] Divergência local ≠ provider renderiza `ReconciliationStatus`.
- [ ] IA usa apenas `Sparkles` como ícone reservado.
- [ ] Toda write action da IA passa por `AI Write-Confirmation Card`.
- [ ] Tool result card reutiliza variant `compact` do domain component base.
- [ ] Copilot fecha com `Esc` e retorna foco ao trigger.
- [ ] GlobalSearch respeita RBAC server-side.
