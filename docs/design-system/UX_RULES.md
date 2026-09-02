# EMR Despachante — UX Rules

> Regras aplicáveis a toda superfície do produto. Complementa `DESIGN_SYSTEM.md` §24 (anti-patterns) e §25 (checklist).

---

## 1. Princípios operacionais

1. **Operação por exceção.** A UI destaca o que precisa de ação humana; o "caminho normal" fica silencioso.
2. **Cliente e veículo como centro.** Toda informação é navegável a partir de cliente, veículo, serviço/pedido, caso.
3. **Status intermediário é produto.** "Aguardando webhook", "processando baixa", "precisa de ação" merecem tratamento visual explícito, não são "loadings".
4. **Não esconder dado desatualizado.** Sempre mostrar timestamp + oferecer "Atualizar".
5. **Financeiro só é verdade após confirmação confiável.** UI nunca renderiza `PAID` a partir de retorno de checkout.
6. **Toda exceção precisa virar trabalho visível.** Falhas repetidas geram `Case` operacional — a UI oferece esse fluxo em qualquer lugar que exiba erro persistente.

## 2. Hierarquia visual — leitura em 3 segundos

Ordem canônica em qualquer tela operacional:

1. **O que está errado ou pendente** (status + prioridade).
2. **Onde** (cliente, veículo, pedido).
3. **O que fazer agora** (próxima ação sugerida).
4. **Contexto** (histórico, metadata).
5. **Números gerais** (KPIs, gráficos).

No Dashboard Operacional, essa ordem também é a ordem vertical na tela.

## 3. Estados de dados — obrigatórios em toda lista/bloco

Toda superfície que carrega dado externo prevê 6 estados:

| Estado | Tratamento |
|---|---|
| `loading` | Skeleton com shape do layout final. Nunca spinner genérico. |
| `empty` | `EmptyState` com motivo + CTA. Nunca "Nada aqui." |
| `error` | `ErrorState` com contexto do erro + botão "Tentar novamente". |
| `stale` | `StaleDataBanner` com timestamp + [Atualizar]. Dado velho é exibido. |
| `partial-failure` | Banner acima; blocos que carregaram são exibidos; blocos com erro têm placeholder próprio. |
| `permission-denied` | 403 amigável com explicação (ex.: "Este caso pertence a outro time"). |

## 4. Acessibilidade — WCAG 2.2 AA baseline

### Contraste
- Texto normal ≥4.5:1.
- Large text (≥18px ou 14px bold) ≥3:1.
- Valores monetários e status labels ≥7:1 (target AAA).
- Ícones informativos ≥3:1.
- Componentes UI (border de input focado, indicador de checked) ≥3:1.

### Foco
- `:focus-visible` sempre com ring 2px `--border-focus` + `outline-offset: 2px`.
- Nunca `outline: none` sem substituto.
- Ordem de tab reflete leitura visual.
- Foco não pode ser obscurecido por sticky headers/footers.

### Teclado
- Toda ação disponível por mouse é disponível por teclado.
- Tabelas: `↑↓` navega linhas; `Enter` abre detalhe; `Space` marca checkbox; `Home/End` primeiro/último; `PgUp/PgDn` páginas.
- Modals: focus trap; `Esc` fecha (exceto confirmações destrutivas — apenas Cancelar).
- Copilot: `Ctrl/⌘+/` abre; `Esc` fecha; `↑` recupera prompt anterior.
- Skip link "Pular para o conteúdo" no topo.

### Screen reader
- `<h1>` única por rota; hierarquia H1→H2→H3 sem pular níveis.
- Landmarks: `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>` semânticos.
- Ícones decorativos: `aria-hidden="true"`.
- Ícones semânticos: `role="img"` + `aria-label`.
- Live regions: **uma** `role="status" aria-atomic="true"` por área que atualiza (contagem de casos, status de operação). Nunca uma live region por badge.
- Tabelas: `<caption>` (pode ser sr-only) + `scope="col"` em th + `aria-sort`.

### Motion
- `@media (prefers-reduced-motion: reduce)` zera todas as animações não essenciais.
- Nenhuma animação `>320ms` em transição de UI (exceto explicações de fluxo, onde é conteúdo).

### Toque
- Área clicável mínima 44×44px (mobile).
- Espaçamento entre alvos ≥8px.

### Text scaling & reflow
- Layout suporta zoom até 200% sem scroll horizontal (exceto tabelas de dados, permitido).
- `line-height` unitless (1.5); nunca clipar texto em altura fixa.
- Copy longa (motivo do caso, notas): `inline-size: min(100%, 75ch)`.

### Cognitiva
- Placeholders nunca substituem labels.
- Erros específicos, não genéricos.
- Confirmações destrutivas com descrição do impacto.
- Não usar métricas ou linguagem que gere ansiedade artificial ("último caso!"), oferta relâmpago, etc.

## 5. Forms — regras duras

- Label sempre visível, associado por `for`/`id`.
- Validação `onBlur` para maioria; `onSubmit` para operações financeiras.
- Erro inline abaixo do campo com `aria-describedby` + `aria-invalid="true"`.
- Após submit inválido, foco vai para `Focusable Error Summary` no topo do form (`role="alert" tabindex="-1"`).
- Feedback pós-submit: `loading → success/error` state visível. Nunca botão silencioso.
- Autocomplete HTML preenchido: `cpf`, `email`, `tel`, `postal-code`, `given-name`, `family-name`, `current-password`, `new-password`.
- Máscaras PT-BR: CPF `000.000.000-00`, telefone `(00) 00000-0000`, placa Mercosul `ABC1D23` ou antiga `ABC-1234`, RENAVAM 11 dígitos, CEP `00000-000`, valores `R$ 1.234,56`.
- Não bloquear paste em campos comuns.
- Não desabilitar botão de submit por default — validar após clique com foco no erro (mais acessível).

## 6. Tabelas — regras duras

- Sticky header + sombra `--elev-1` ao scroll.
- Sortable columns anunciam via `aria-sort`.
- Colunas numéricas: `text-align: right`, `font-variant-numeric: tabular-nums`.
- Nunca zebra por default (dense demais); hover row em `--bg-subtle`.
- Bulk actions em sticky bar contextual (aparece quando ≥1 linha selecionada).
- Ação por linha: `MoreVertical` dropdown na última coluna; nunca 3 links "cru" duplicando.
- Empty com filtro aplicado: sugere "Limpar filtros".
- Loading inicial: 8 skeleton rows.
- Refetch: overlay leve, preserva conteúdo.
- Paginação server-side com contador total.

## 7. Status system — regras duras

- **Status nunca é apenas cor.** Sempre label + ícone + cor.
- Uma coluna de tabela dedicada a status usa `StatusBadge`, não string colorida.
- Composição de status: `PaymentStatus` local + provider + submission renderizados como badges separados na mesma linha; nunca fundidos em texto ambíguo.
- Priority usa barra 4px lateral + label + ícone opcional; nunca só cor.
- Nunca pintar linha inteira de tabela com fundo semântico (verde/vermelho/amarelo) — badge apenas.

## 8. Números, moedas, IDs

- Moeda PT-BR: `R$ 1.284,50` (Intl `pt-BR` `BRL`).
- Números grandes: `1.284.220` (separador `.`).
- Datas: `12/09/2026` (curta), `12 de setembro de 2026, 09:34` (longa).
- Tempo relativo: `há 3 min`, `há 2h`, `há 1 dia`. Após 7 dias, mostrar data absoluta.
- IDs técnicos (payment ID, case ID, RENAVAM, hash): fonte `--font-mono`, sem alteração de case.
- Placa: fonte `--font-mono`, uppercase, com hífen antigo (`ABC-1234`) ou sem (`ABC1D23`).
- CPF exibido: mascarado por padrão (`123.***.***.-45`), reveal com botão + audit log.

## 9. Copywriting

- Voz: direta, honesta, sem exageros. "Não conseguimos atualizar agora." > "Ops, algo deu errado!".
- Sem exclamação decorativa. Sem "🎉". Sem emojis (exceto CTA de IA `✨` — ver `AI_COPILOT_UI.md`).
- Ações em verbo no infinitivo: "Pagar multa", "Assumir caso", "Atualizar situação".
- Confirmações destrutivas descrevem impacto concreto.
- Erros técnicos são traduzidos ("O provedor de pagamento não respondeu em tempo. Vamos tentar novamente automaticamente.") — nunca stack trace.
- Status labels são substantivos: "Pago", "Aguardando", "Bloqueado".
- Não usar "sistema" no singular ("O sistema não conseguiu…"). Preferir voz ativa: "Não conseguimos…".

## 10. Feedback e confirmação

- Sucesso silencioso em ações simples (salvar filtro, marcar checkbox).
- Toast em ações que mudam estado remoto (criar nota, assumir caso).
- Toast NUNCA é canal único para erro financeiro/crítico — mostrar também no local do dado.
- Confirmação destrutiva sempre em `ConfirmDialog` com resumo do impacto.
- Mutação de IA sempre em `ConfirmationCard` (ver `AI_COPILOT_UI.md`).

## 11. Navegação

- Sidebar por perfil (`/app` sem sidebar, `/admin` admin, `/admin` completa).
- Item ativo sempre destacado; nunca mais de 1 ativo.
- Copilot **não é item de sidebar** — acessível pelo header.
- Breadcrumb obrigatório em rotas profundas (`/admin/clientes/:id/veiculos/:vid`).
- Voltar navegador respeita histórico (nunca `window.location.replace` em navegação normal).
- Deep-linking obrigatório: cada tela tem URL própria; filtros e paginação refletem em query string.

## 12. Responsividade

- Mobile-first. Testar `375px` como piso.
- Sidebar → drawer offcanvas `<1024px`.
- Tabelas críticas: `overflow-x: auto` + colunas essenciais primeiro.
- Tabelas secundárias (histórico, documentos): converter para lista de cards.
- Dashboard mobile: KPIs essenciais (top 3), fila de atenção, busca, ações rápidas.
- Copilot mobile: full-screen sheet.
- Nunca desabilitar zoom (`user-scalable=no` é proibido).
- Viewport meta obrigatório: `<meta name="viewport" content="width=device-width, initial-scale=1">`.

## 13. Performance perceptível

- Skeletons match ao layout final.
- `<Skeleton>` aparece em ≤100ms; nada de "flash of no content".
- KPIs de dashboard: 1 endpoint agregado; nunca 1 fetch por card.
- Tabelas: paginação server-side; nunca "carregar tudo".
- Imagens: `<Image>` do Next com sizes + priority quando above-the-fold.
- Fonts: `display: swap` em Inter/Plex Mono; preload apenas Inter 400/500.
- CLS <0.1: reservar espaço para imagens, skeletons com dimensões finais.
- Prefetch de rotas prováveis (`/casos/:id` a partir do dashboard).

## 14. Notificações e "novidades"

- Badge de contagem em ícone: usar live region contextual, não um `aria-live` por número.
- Toasts empilhados: máx 3; excesso é agrupado ("+2 novas").
- Nunca autoplay de som.
- Notificação de "novo caso crítico" chega discretamente (badge no sidebar + toast opcional), não interrompe o trabalho.

## 15. Idempotência da UI

- Botões de ação (assumir caso, pagar, criar caso) desabilitam durante request e mostram estado loading.
- Se conflito 409 (ex.: caso já atribuído): mostrar mensagem específica + refresh do estado.
- Retry manual sempre disponível em erro transitório.

## 16. Vetos operacionais específicos do EMR Despachante

Ver `DESIGN_SYSTEM.md` §24 para a lista completa dos 18 anti-patterns específicos. Reforço dos mais críticos:

- **Nunca renderizar `PAID` antes do webhook** — usar `Payment Processing` até confirmação idempotente.
- **Nunca esconder dado stale** — sempre mostrar timestamp + [Atualizar].
- **Nunca dashboard só de gráficos** — fila prioritária primeiro.
- **Nunca ranking público de usuários internos** — métricas pessoais são privadas no MVP.
- **Nunca AI purple gradient** — Copilot herda a paleta do produto.
- **Nunca `PAID` verde e `CLEARED` verde iguais sem distinção** — `PAID` = success-bg verde; `CLEARED` = success-bg verde + label distinto + ícone `FileCheck`.
- **Nunca métricas cognitivamente pesadas sem contexto** — cada KPI vem com delta + link para lista filtrada.

## 17. Checklist de review

Antes de aprovar PR de UI:

- [ ] Segue tokens semânticos.
- [ ] Status com label + ícone + cor.
- [ ] Todos os estados de dado previstos.
- [ ] A11y: contraste, foco, teclado, aria.
- [ ] `prefers-reduced-motion` respeitado.
- [ ] Empty/error/stale/loading testados.
- [ ] 375px sem scroll horizontal.
- [ ] Zoom 200% legível.
- [ ] Copy revisada (voz, ausência de "!", sem stack traces).
- [ ] Não introduziu anti-pattern da §16.
