# EMR Despachante — AI Copilot UI

> Regras de UI para o **EMR Copilot** (operação/admin) e para o **Chatbot do proprietário**.
> Referências: [`AI_PRODUCT_SPEC.md`](../ai/AI_PRODUCT_SPEC.md), [`AI_ARCHITECTURE.md`](../ai/AI_ARCHITECTURE.md), [`SCREEN_SPECS.md §26–§30`](../product/SCREEN_SPECS.md).

---

## 1. Princípios

1. **A IA é parte natural do produto, não uma feature à parte.** Sem estética "chatbot roxo futurista". Herda tokens (`navy`, `cobalt`, tipografia Inter).
2. **A IA nunca é fonte da verdade.** Dados vêm de tools autorizadas ou RAG citado.
3. **Toda resposta é rotulada como IA.** Nunca personificar como humano.
4. **Mutação sempre confirmada.** Write actions passam por `ConfirmationCard`.
5. **Explicabilidade obrigatória.** Quando a IA recomenda algo, expõe os fatores (prioridade, idade, dependência).
6. **Fallback preserva navegação.** Se o LLM cai, o produto continua funcionando.

## 2. Trigger e entrada

### Operação (`/admin`, `/admin`)

- Botão no header: `<Sparkles />` (ícone Lucide, tamanho 20, cor `--text-primary`) + label "Copilot".
- Cor: usa `Button variant="secondary"` do sistema. **Nunca gradient roxo, nunca dourado, nunca "shimmer".**
- Atalho: `Ctrl/⌘ + /` abre/foca; badge visual do atalho no hover tooltip.
- Estado ativo (painel aberto): `bg --surface-selected`, `border --border-focus`.

### Ações contextuais nas telas

Botão discreto secondary em cards/painéis específicos. Label sempre em verbo + escopo:

| Local | Label | Escopo |
|---|---|---|
| Dashboard Operacional (topo direito) | ✨ Resumir minha fila | resume casos da admin atual |
| Dashboard Admin (topo direito) | ✨ Resumir operação | resume período atual do filtro |
| Detalhe do caso | ✨ Resumir caso | usa case + timeline + payment relacionado |
| Detalhe do caso | ✨ Sugerir próxima ação | usa case + histórico + procedimentos (RAG) |
| Detalhe do caso | ✨ Gerar mensagem para cliente | draft para revisão humana |
| Detalhe do cliente | ✨ Resumir histórico | resume vínculo + eventos |
| Reconciliação | ✨ Explicar divergência | analisa payment específico |

O `✨` (Sparkles) é o único símbolo reservado para AI — nunca em outros lugares.

### Proprietário (`/app`)

Chatbot separado, mais simples:
- Widget flutuante bottom-right, 56×56px, ícone `MessageCircle` + `Sparkles` sobreposto pequeno.
- Bg `--action-primary`, fg `--text-on-primary`.
- Abre em modal/sheet 480px desktop, full-screen mobile.

## 3. Painel Copilot (operação)

### Anatomia

- **Slide da direita**, largura 420px desktop, full-screen sheet em mobile.
- Não bloqueia interação com a página (backdrop transparente, não modal). Em telas <1280px, comporta-se como drawer com backdrop leve.
- `z-index: var(--z-drawer)`.
- Radius 0 na borda direita (sticky), `--radius-xl` na esquerda.
- Shadow `--elev-3` (light) / border-left `--border-strong` (dark).

### Header do painel

- Título "EMR Copilot" em `H4`.
- Badge "IA" pequena ao lado (`Alert` variant `info`, altura 20px).
- Ações à direita: `Refresh` (nova sessão), `MoreVertical` (feedback, ajuda), `X` (fechar).
- Border-bottom 1px.

### Body

Scroll vertical. Padding lateral 16px, top 12px, bottom 80px (espaço para input).

Composto por:

1. **Empty state** (nova sessão): welcome + suggested prompts.
2. **Message stream**: mensagens do usuário e da IA.
3. **Tool result cards**: entidades retornadas por tools.
4. **Confirmation cards**: para write actions.

### Input (footer)

Sticky bottom:
- Textarea auto-resize (1–4 linhas), fonte 14px, placeholder "Pergunte sobre casos, clientes, pagamentos…".
- Botão `Send` (Enter também envia; Shift+Enter quebra linha).
- Label "IA · O Copilot pode se enganar. Confira ações antes de confirmar." em caption abaixo do input.

## 4. Suggested prompts (empty state)

Chips clicáveis, agrupados por intenção:

**Priorização:**
- "Quais casos preciso priorizar hoje?"
- "Quais casos críticos estão sem responsável?"

**Resumo:**
- "Resuma o que mudou hoje."
- "Resuma minha fila atual."

**Investigação:**
- "Quais pagamentos precisam de atenção?"
- "Quais casos têm relação com timeout do DetranClient?"

**Busca:**
- "Buscar cliente ou veículo"

Chips: `border --border-default`, `bg --surface-default`, hover `--bg-subtle`. Ícone `Sparkles` 12px à esquerda.

## 5. Message components

### User message

Alinhamento direita, `bg --bg-emphasis`, `radius --radius-md`, padding `10/12`, max-width 85%.

### AI message

Alinhamento esquerda, `bg --surface-raised`, border 1px `--border-subtle`, `radius --radius-md`, padding `12/14`, max-width 100%.

Header interno:
- Avatar `Sparkles` 20px em círculo `--surface-selected`.
- Label "IA" + timestamp `--text-muted`.

Body: markdown rendering (paragraph, bold, italic, code inline, code block, list). Não permitir HTML arbitrário.

Footer da mensagem:
- Actions: `Copy` (copiar texto), `RegenerateResponse` (Refresh), `👍 Feedback positivo` / `👎 Feedback negativo`.
- Actions só aparecem em hover ou focus para reduzir ruído.

### Streaming state

- Tokens aparecem à medida que chegam. **Sem cursor piscante fake** — usar cursor real `|` do texto durante stream.
- Se >3s sem token: mostrar sub-label "Consultando dados da operação…" abaixo do avatar (não spinner grande).

### Loading (antes do primeiro token)

- Mostrar shimmer skeleton de 2–3 linhas ou label "Pensando…" com `Sparkles` pulsante suave (respeitando `prefers-reduced-motion`).

### Erro na resposta

- Mensagem "Não consegui responder agora. {motivo específico se disponível}." + botão "Tentar novamente".
- Se erro parcial (uma tool falhou): mostrar o que conseguiu + linha "Não consegui carregar o pagamento agora. [Tentar novamente]".

## 6. Tool result cards

Quando a IA chama `getCustomerSummary`, `getCaseDetail`, `getPaymentSummary`, o retorno vira card dentro da mensagem:

### CustomerCard (mini)
```
┌──────────────────────────────┐
│ 👤 Mariana Alves              │
│ 2 veículos · 2 pendências     │
│ [Abrir cliente →]             │
└──────────────────────────────┘
```

### VehicleCard (mini)
```
┌──────────────────────────────┐
│ 🚗 ABC1D23 · Honda HR-V       │
│ [Irregular] 2 multas em aberto│
│ [Abrir veículo →]             │
└──────────────────────────────┘
```

### CaseCard (mini)
```
┌──────────────────────────────┐
│ #1842 · Alta · WAITING_EXTERNAL│
│ Baixa não reconhecida há 26h   │
│ Cliente: Mariana Alves         │
│ [Abrir caso →]                 │
└──────────────────────────────┘
```

Regras:
- Cards são compactos (padding 12px, radius `--radius-md`, elev-1).
- CTA sempre linka para a rota canônica da entidade — nunca duplica funcionalidade.
- Máx 5 cards por resposta; excesso vira lista com "[Ver mais 12 →]".

## 7. Confirmation card (write actions)

Toda write action (assignCase, changeCaseStatus, createRefundRequest, resendCustomerNotification, sendCustomerMessage) usa `ConfirmationCard`:

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

- Border-left 4px `--status-warning`, bg `--surface-raised`.
- Botão primary = a ação; botão secondary = Cancelar.
- Ações destrutivas: botão `destructive` variant + input adicional de confirmação (opcional).
- `aria-live="polite"` no card para leitores.
- Nunca auto-execute em countdown; sempre requer clique.

## 8. Rascunho de mensagem para cliente

Draft aparece como card editável:

```
┌──────────────────────────────────────────────┐
│ ✨ Rascunho gerado                             │
│                                                │
│ ┌────────────────────────────────────────┐   │
│ │ Olá Mariana, precisamos do seu CRLV    │   │
│ │ para prosseguir com o licenciamento... │   │  ← textarea editável
│ └────────────────────────────────────────┘   │
│                                                │
│ Referências usadas:                            │
│ • Procedimento: solicitar_documento_cliente.md│
│ • Caso: #1842                                  │
│                                                │
│      [Cancelar]  [Revisar e enviar]           │
└──────────────────────────────────────────────┘
```

- Sempre editável antes do envio.
- "Referências usadas" lista chunks do RAG citados.
- Envio efetivo abre `ConfirmationCard` separado antes da mutação real.

## 9. Citations / references (RAG)

Quando a resposta vem de conteúdo interno (RAG), incluir bloco "Referências" no rodapé da mensagem:

```
Referências:
• [Procedimento: baixa_pagamento_atraso.md] — 2 trechos
• [FAQ: reembolso.md] — 1 trecho
```

- Cada referência é linkável para o documento fonte.
- Se a referência vem de uma tool result estruturada (ex.: `getPaymentSummary`), citar como "Fonte: Payment PAY-8291".

## 10. Fallback

Estados de indisponibilidade:

| Situação | UI |
|---|---|
| LLM indisponível | Ao abrir painel: "Copilot temporariamente indisponível. A operação continua funcionando normalmente." + link "Ver status". |
| Tool específica falhou | Mostrar resultado parcial + linha "Não consegui carregar {tool} agora." |
| Rate limit atingido | "Muitas solicitações. Aguarde alguns segundos." + timer visual. |
| Sessão expirada | "Sua sessão expirou. Faça login novamente." + link. |

Regra: **falha no Copilot nunca bloqueia o produto principal.**

## 11. Feedback loop

- Cada mensagem da IA tem 👍 / 👎.
- Ao clicar 👎: dropdown com motivos ("Impreciso", "Não entendeu", "Ação errada", "Outro").
- Feedback logado com prompt version, tool calls, resposta (RF-AI-014).
- Nunca "punir" o usuário — sem popup, sem obrigação.

## 12. Chatbot do proprietário — regras específicas

- Estética mais simples: apenas mensagens (sem tool result cards elaborados; usar links diretos).
- Escopo restrito: só acessa dados do usuário autenticado.
- Suggested prompts iniciais:
  - "Por que meu licenciamento está bloqueado?"
  - "Meu pagamento foi confirmado?"
  - "Onde baixo meu documento?"
  - "Tenho multas em aberto?"
- Respostas frequentemente incluem CTA: "Ver multas →", "Ver licenciamento →".
- Nunca permitir mutação financeira via chatbot.
- Nunca acessar dados de terceiros.
- Rótulo "Assistente EMR" (mais amigável que "IA") + subtitle "Respostas baseadas nos seus dados".

## 13. Acessibilidade do Copilot

- Painel: `role="dialog"` + `aria-label="EMR Copilot"` + `aria-modal="false"` (não bloqueia página).
- Foco vai ao input ao abrir; `Esc` fecha; foco retorna ao trigger.
- Mensagens em stream: usar `role="log" aria-live="polite"` no container de mensagens.
- Rótulo "IA" em cada mensagem lido por screen reader.
- Confirmation card: `role="alertdialog"`, foco no primeiro botão.
- Suggested prompts: buttons focáveis por tab.
- Feedback (👍/👎): buttons com `aria-label` explícito.
- Cores herdam do sistema (contraste ≥4.5:1 já garantido).

## 14. Anti-patterns proibidos

1. **Gradient roxo/rosa/azul-neon** no painel, botão ou avatar de IA.
2. **Persona humana** ("Sou a Ana, sua assistente…"). Sempre "IA" / "EMR Copilot".
3. **Autoplay de resposta** sem clique.
4. **Streaming fake** (mostrar cursor piscante mas render em bloco).
5. **Ocultar erros** — se uma tool falhou, dizer.
6. **Confirmação inline** ("Vou fazer isso agora." sem card explícito).
7. **Sugerir ação destrutiva sem descrever impacto.**
8. **Copiar dados de outros clientes** para acelerar resposta — a IA respeita RBAC.
9. **Prometer futuro** ("Vou avisar quando terminar") sem mecanismo real.
10. **Emojis decorativos** (exceto `✨` Sparkles reservado).
11. **Chat como único caminho** — toda ação do Copilot também existe na UI regular.
12. **Mensagens sem timestamp** — todo turno tem hora.

## 15. Métricas de UI (observabilidade)

Instrumentar (RF-AI-014):

- Abertura do painel (por trigger: header, atalho, ação contextual).
- Uso de suggested prompts vs prompt livre.
- Tempo até primeiro token.
- Taxa de aceitação de ConfirmationCard (confirmar vs cancelar).
- Feedback 👍/👎 por resposta.
- Regeneração (Refresh).
- Fallback triggers.
