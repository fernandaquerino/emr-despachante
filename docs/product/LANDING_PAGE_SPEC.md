# EMR Despachante — Landing Page Spec (Proprietário / B2C)

> Spec de estrutura, copywriting e mapeamento de Design System para a landing
> pública `/` (rota `app/(public)/page.tsx`).
> Referência de modelo de negócio: despachante veicular digital (licenciamento,
> IPVA, transferência, multas, regularização).
> Fontes de verdade: `REQUIREMENTS.md`, `SCREEN_SPECS.md`, `STATUS_MODEL.md`,
> `docs/design-system/*`, `SECURITY_AND_LGPD.md`.

---

## 0. Conflitos e bloqueios — ler antes de implementar

Esta spec foi escrita contra a documentação existente. Quatro pontos do briefing
**não têm respaldo no repositório** e estão marcados no corpo do documento com
`[COMERCIAL]`, `[DS-GAP]` ou `[LGPD]`. Nenhum deles foi resolvido por invenção
(CLAUDE.md §3).

### 0.1 `[COMERCIAL]` Parcelamento em 12x, PIX com desconto, aprovação imediata

O briefing pede headline focada em *"parcelamento em 12x / PIX com desconto /
aprovação imediata"*. O que a documentação diz:

| Claim do briefing | Documentação | Situação |
|---|---|---|
| Parcelamento em até 12x no cartão | `SCREEN_SPECS.md` §8 lista métodos: **Pix, boleto, cartão (se sandbox escolhido)**. Nenhuma menção a parcelamento. | **Sem respaldo** |
| PIX com desconto | `REQUIREMENTS.md` L166 e `DATA_MODEL.md` L306: descontos são **capacidade futura dependente de validação comercial**. O campo `desconto` em `SCREEN_SPECS.md` §7 é o desconto **do órgão na multa**, não desconto EMR por método. | **Sem respaldo** |
| Aprovação imediata | `CLAUDE.md` §11 (invariante): `checkout success != payment confirmation`. `SCREEN_SPECS.md` §8: *"O status será atualizado após confirmação do pagamento."* | **Contradiz invariante** |
| Download do CRLV-e | `REQUIREMENTS.md` RF-023 é **"CRLV simulado"**. | **Não prometer documento oficial** |

**Decisão aplicada:** cada bloco afetado traz **duas versões de copy** —
`copy A (ship now)`, ancorada no que existe, e `copy B [COMERCIAL]`, pronta para
destravar assim que houver confirmação comercial + implementação. Não misture:
`unsupported_financial_claim_rate = 0` é meta do projeto (CLAUDE.md §14), e
claim financeiro falso em landing é risco de CDC/Procon, não só de produto.

**Ação necessária:** confirmar com o negócio (a) existe parcelamento? em qual
provider? com juros de quem? (b) existe desconto por método? (c) o cartão sai do
sandbox? Até lá, use copy A.

#### Atualização 2026-10-08 — parcelamento confirmado

O negócio **confirmou a existência de parcelamento no cartão**. Com isso, o destaque
*"Parcele no cartão"* foi liberado e está em produção na dobra (`HomeHero.tsx`).

Escopo exato do que foi liberado, e só isso:

| Claim | Situação |
|---|---|
| "Parcele no cartão" (sem número de parcelas) | **Liberado** — confirmado pelo negócio |
| "em até 12x" | **Ainda bloqueado** — o número de parcelas não foi confirmado |
| "PIX com desconto" | **Ainda bloqueado** — sem respaldo |
| "Aprovação imediata" | **Permanece proibido** — contradiz o invariante `checkout success != payment confirmation` (CLAUDE.md §11) |

Pendências que esta confirmação **não** resolve e que precisam entrar antes de qualquer
comunicação mais específica: provider, número máximo de parcelas, de quem são os juros e se o
cartão saiu do sandbox. Sem isso, não detalhar condição de parcelamento em nenhuma tela
(CDC art. 52).

### 0.2 `[DS-GAP]` Componentes especificados mas não exportados

`COMPONENTS.md` especifica componentes que **`packages/ui/src/index.ts` não
exporta**. A landing depende de 5 deles:

| Componente | Em `COMPONENTS.md` | Exportado | Impacto nesta spec |
|---|---|---|---|
| `Skeleton` | sim (§Feedback) | **não** | Loading do widget de consulta (S2) |
| `Spinner` | sim (§Feedback) | **não** (inline no Button) | `Button` já resolve o caso da landing (`loading` + `aria-busy`). `Spinner` avulso só é necessário se outro bloco precisar. |
| `Alert` (inline) | sim (§Feedback) | **não** | Erro de placa não encontrada (S2) |
| `Toast` | sim (§Feedback) | **não** | Feedback de lead enviado (S6) |
| `Card` | **não existe** | não | Grid de serviços (S5), depoimentos (S8) |
| `ServiceStatusStepper` | `DOMAIN_COMPONENTS.md` | **não** | Jornada (S7) |
| `Avatar` | pasta existe | **não** (pasta sem export) | Depoimentos (S8) |

**Decisão aplicada:** a spec mapeia o componente **canônico** quando existe. Onde
não existe, marca `[DS-GAP]` e indica o caminho: criar em `packages/ui` seguindo
`COMPONENTS.md` (não criar variante local na landing — CLAUDE.md §15). Para
`Card`, a recomendação é **não criar** — ver §0.5.

### 0.3 `[LGPD]` Input de contato na Hero antes do resultado

O briefing pede *"Input de Placa + Input de Contato"* no widget da dobra
principal. Dois problemas:

1. **Conversão:** pedir contato antes de entregar valor é o padrão que mais
   derruba taxa de conclusão em widget de consulta. O valor (os débitos) é o que
   compra o contato.
2. **LGPD** (`SECURITY_AND_LGPD.md`, RNF-001 "PII minimizada"): coletar telefone/
   e-mail numa consulta anônima exige base legal + consentimento explícito +
   finalidade declarada no mesmo bloco.

**Decisão aplicada — captura progressiva:**
`placa (só placa) → resultado visível → contato para "salvar e acompanhar"`.
O contato passa a ser trocado por um benefício concreto (alerta de vencimento),
com checkbox de consentimento LGPD. Se o negócio exigir contato antes do
resultado, o campo volta — mas com consentimento explícito e microcopy de
finalidade, nunca como campo "mudo".

### 0.4 Conflito com a decisão FE-PUB-001 (campo de placa fora da Hero)

`HomeHero.tsx` carrega a decisão registrada: *"o campo de consulta misturado ao
hero prejudica a hierarquia"* — o campo foi movido para `PlateSection`, abaixo.
O briefing pede o widget **na dobra principal**.

**Resolução proposta (não é uma terceira regra — é a reconciliação das duas):**
Hero em **split assimétrico**, com o widget ocupando o lado direito como *asset*
da dobra, não embutido na coluna de texto. Isso satisfaz "consulta na dobra
principal" e preserva a hierarquia que motivou FE-PUB-001 (headline e widget não
competem pelo mesmo eixo vertical). `PlateSection` deixa de existir como seção
duplicada; a âncora `#consulta` passa a apontar para a Hero, e o CTA do hero
passa a ser `submit` do widget. Ver §S1.

### 0.5 Decisões de direção visual (taste) aplicadas sobre o DS

O DS é a fonte de verdade (CLAUDE.md §15). As decisões abaixo são de *composição*,
dentro dos tokens existentes:

- **Sem card-wrapper decorativo.** Agrupamento por `border-t` / `divide-y` /
  espaço negativo. Card só onde elevação comunica hierarquia real (widget de
  consulta, resultado). Por isso §0.2 recomenda **não** criar `Card` genérico.
- **Sem linha de 3 cards iguais.** Serviços (S5) em grid assimétrico 2 colunas
  com um item em largura dupla; pares/dores (S4) em zigue-zague.
- **Hero não centralizado.** Split `1.05fr 0.95fr`, texto à esquerda.
- **Números em `font-mono`** (`--font-mono: IBM Plex Mono`) — valores de débito,
  placa, prazos. Nunca valor monetário em `font-sans`.
- **Tipografia:** o DS usa `Inter` e `--font-size-display: 36px`. 36px é a escala
  do *app*, não de marketing. **Recomendação:** adicionar um step
  `--font-size-display-marketing` (≈ 48px/60px responsivo) em `TOKENS.md`
  restrito à área pública, mantendo `Inter`. Não trocar a família — a
  consistência app↔landing vale mais que a distinção tipográfica.
- **Acento único:** `--action-accent` (cobalt `#0369A1`). Zero gradiente em
  texto, zero glow. Primary continua navy `#0F172A`.
  **Exceção (2026-10-08, decisão de negócio):** a cor de **ação de conversão**
  passou a ser âmbar via `--action-cta` / `Button variant="cta"`, por objetivo
  de conversão na dobra. Cobalt segue sendo o acento de *acento* (eyebrow,
  link, ícone); âmbar é só botão de conversão. Custo assumido, restrições e
  justificativa em **ADR-016**.
- **Motion:** `framer-motion` aprovado pelo usuário, **ainda não instalado**:
  `pnpm add framer-motion --filter @emr/web`. Usar apenas onde `use-reveal.ts`
  (CSS, já existente) não resolve: `layoutId` nas Tabs da Garagem (S3) e o
  carrossel de prova social (S8). O resto permanece em CSS — diff menor e sem
  custo de bundle. Spring padrão: `{ type: "spring", stiffness: 100, damping: 20 }`.
  Tudo sob `prefers-reduced-motion` (já zerado globalmente em `base.css`).

---

## 1. Diretrizes de UX transversais

### 1.1 Hierarquia de CTA

Máximo **1 primary por bloco visível** (`COMPONENTS.md` §Button).

| Nível | Componente | Uso | Ocorrências |
|---|---|---|---|
| Primário | `Button variant="primary" size="lg"` | "Consultar débitos grátis" | Hero (S1), CTA final (S10) |
| Secundário | `Button variant="secondary"` | "Criar minha Garagem", "Ver serviços" | S3, S5 |
| Terciário | `Button variant="ghost"` / `variant="link"` | "Ver todos", "Saber mais" | S5, S9 |
| Flutuante | `Button` + âncora fixa | WhatsApp | S10 |

O WhatsApp flutuante **não** é primary visual: ele não deve competir com o
widget de consulta na dobra. Ver S10.

### 1.2 Formulário enxuto

- Widget de consulta: **1 campo obrigatório** (placa). RENAVAM só aparece
  quando o retorno exigir (`USER_FLOWS.md` Fluxo 1: *"RENAVAM quando necessário"`).
- Label **acima** do input, sempre visível (`COMPONENTS.md` §Input). Nunca
  placeholder-as-label.
- Máscara de placa: aceita os dois formatos brasileiros — `AAA-9999` (antigo) e
  `AAA9A99` (Mercosul). Normalizar para uppercase sem hífen. `apps/web/src/lib/plate.ts`
  já existe — **reutilizar**, não reimplementar.
- `inputMode="text"` + `autoCapitalize="characters"` + `maxLength={7}`.
- Erro inline abaixo do campo, `aria-invalid` + `aria-describedby`.

### 1.3 Feedback visual instantâneo

| Momento | Componente | Regra |
|---|---|---|
| Submit em andamento | `Button loading` — **confirmado**: `Button.tsx:51` já implementa `loading` com `aria-busy` e `disabled` automático, label mantido | Nunca esconder o label (`COMPONENTS.md`) |
| Carregando resultado | `Skeleton` `[DS-GAP]` no shape final do resultado | Nunca spinner genérico em lista |
| Dado desatualizado | `StaleDataBanner` (existe) | Com timestamp absoluto |
| Consulta em processamento no órgão | `LoadingState` / `ProcessingState` | Texto: ver S2 |
| Placa não encontrada | `Alert variant="warning"` `[DS-GAP]` | Nunca "Algo deu errado" |
| Falha de integração | `ErrorState` (existe) + "Tentar novamente" | Preserva última carga |

### 1.4 Acessibilidade (não negociável)

- Hierarquia de heading: um `h1` (Hero), `h2` por seção, `h3` em itens.
- Toda seção com `id` + `aria-labelledby` apontando para seu `h2`.
- Ícone decorativo `aria-hidden="true"`; ícone semântico com `aria-label` + `role="img"`.
- Status **nunca** só por cor/ícone — `StatusBadge` sempre com label.
- Contraste: texto sobre `surface-inverse` em `text-inverse/75` mínimo (já em uso).
- Carrossel (S8) com controles de teclado e `pause` — autoplay sem pausa é falha WCAG 2.2.1.
- Touch target mobile ≥ 44px (`IconButton size="lg"`).

---

## 2. Estrutura seção por seção

Ordem final (10 seções). `PlateSection` é absorvida pela Hero (§0.4).

```text
S1  Hero + Widget de consulta        #consulta
S2  Resultado da consulta rápida     (estado da S1, não seção separada — ver nota)
S3  Garagem Digital (demo do app)    #garagem
S4  Dores e soluções                 #por-que
S5  Serviços                         #servicos
S6  Condições de pagamento           #pagamento
S7  Jornada (stepper)                #como-funciona
S8  Prova social e segurança         #seguranca
S9  FAQ                              #faq
S10 Rodapé + CTA flutuante
```

> **Nota sobre S2:** o briefing pede uma seção separada para a UI do resultado.
> Isso cria um problema: a seção ficaria vazia/fantasma antes de qualquer
> consulta, e duplicaria a rota `/consultar/:id` que já existe
> (`INFORMATION_ARCHITECTURE.md`). A spec trata S2 como **estado expandido do
> widget da S1**, renderizado in-place, com a rota `/consultar/:id` como destino
> do "ver detalhes completos". Mantém a promessa do briefing ("ver os débitos
> instantaneamente na tela") sem seção morta e sem UI duplicada.

---

### S1 — Hero com Widget de Consulta Instantânea

**Layout:** split assimétrico `lg:grid-cols-[1.05fr_0.95fr]`, `min-h-[100dvh]`
(nunca `h-screen`). Mobile: coluna única, widget **acima** da prova social.
Fundo `surface-inverse` (navy) com grid sutil — já implementado em `HomeHero.tsx`.

#### Copy — coluna esquerda

**Eyebrow** (`text-label uppercase tracking-wide text-[var(--cobalt-300)]`)
```
Despachante 100% digital
```

**H1** (`--font-size-display-marketing`, `tracking-tight`, `text-inverse`)

*copy A (ship now):*
```
Descubra o que o seu carro
deve. Em 30 segundos, sem
cadastro.
```

*copy B `[COMERCIAL]` — liberar só após §0.1:*
```
Seu carro em dia sem fila,
sem cartório e sem sair
de casa. Pague em até 12x.
```

**Sub-headline** (`text-body-lg text-text-inverse/75 max-w-lg`)

*copy A:*
```
Digite a placa e veja IPVA, licenciamento e multas num só lugar.
A gente resolve a papelada e você acompanha cada etapa pelo app.
```

*copy B `[COMERCIAL]`:*
```
Digite a placa, veja tudo que está em aberto e escolha como pagar:
Pix à vista ou cartão em até 12x. A papelada é nossa.
```

**Microcopy sob o widget** (`text-caption text-text-inverse/60`)
```
Consulta gratuita. Não pedimos CPF nem cadastro para consultar.
```

**Badges de prova social** (`Badge` — existe)

> Regra: **números reais ou nenhum número.** A spec não inventa métrica
> (`CLAUDE.md` §3; skill: "NO Fake Numbers"). Até o negócio fornecer os dados,
> usar badges **qualitativos**, que não exigem auditoria:

*copy A (qualitativo, ship now):*
```
[ Badge ] Consulta direto na base dos órgãos
[ Badge ] Pagamento confirmado só por retorno oficial
[ Badge ] Acompanhamento em tempo real
```

*copy B (quantitativo — preencher com dado real antes de publicar):*
```
[ Badge ] {N} veículos regularizados
[ Badge ] Nota {X} em {M} avaliações
[ Badge ] Atendemos {UF list}
```

#### Widget de consulta — coluna direita

Único bloco da landing com elevação real (`shadow-elev3`, `rounded-xl`,
`bg-surface`, `border-border`) — a elevação aqui **comunica hierarquia**, logo é
legítima (§0.5).

```text
┌──────────────────────────────────────────┐
│ CONSULTA GRATUITA            [ Badge ]   │  label caps + Badge "Grátis"
├──────────────────────────────────────────┤
│ Placa do veículo                         │  label (obrigatório, acima)
│ ┌──────────────────────────────────────┐ │
│ │ ABC1D23                      [ car ] │ │  Input md, font-mono, uppercase
│ └──────────────────────────────────────┘ │
│ Formatos antigo e Mercosul               │  hint
│                                          │
│ [    Consultar débitos grátis        ]   │  Button primary lg, full width
│                                          │
│ ── ou ───────────────────────────────    │
│ Já tem conta? Entrar                     │  Button variant="link"
└──────────────────────────────────────────┘
```

**Mapeamento de componentes**

| Elemento | Componente DS | Props/notas |
|---|---|---|
| Container do widget | — (composição) | `bg-surface border border-border rounded-xl shadow-elev3 p-6` |
| Selo "Grátis" | `Badge` | API real: `tone="success" \| "warning" \| "error" \| "info" \| "processing" \| "neutral"` + `icon` (componente lucide) — **não** `variant` |
| Campo de placa | `Input size="md"` | `font-mono`, `autoCapitalize="characters"`, `maxLength={7}`, máscara via `lib/plate.ts` |
| Ícone no campo | `lucide-react` `Car` | 16px, `aria-hidden` |
| CTA | `Button variant="primary" size="lg"` | `className="w-full"`, `loading` no submit |
| Erro de formato | `Alert variant="error"` `[DS-GAP]` ou helper inline do `Input` | `aria-describedby` |
| Link de login | `Button variant="link"` | `href="/login"` |
| Tooltip "por que a placa?" | `Tooltip` | delay 350ms, max-w 240px |

**UX do campo**
- Foco automático **apenas desktop** (`lg:`). Autofocus em mobile abre o teclado
  e esconde a headline — regressão de conversão.
- Validação **on blur** e on submit, nunca a cada tecla (`onChange` validando
  gera erro vermelho enquanto a pessoa ainda digita).
- `Enter` submete.
- Botão desabilitado **não** é o padrão: deixe habilitado e valide no submit,
  com erro explicativo. Botão cinza-morto sem explicação é o maior ponto de
  abandono em widget de placa.

**Estados do widget**

| Estado | UI |
|---|---|
| `idle` | como acima |
| `invalid` | borda `status-error`, helper "Placa inválida. Use AAA-9999 ou AAA1B23." |
| `loading` | `Button loading` + label mantido; widget ganha `Skeleton` de 3 linhas abaixo `[DS-GAP]` |
| `success` | expande para o resultado (S2), `layout` transition |
| `not_found` | `Alert variant="warning"`: "Não encontramos essa placa na base. Confira os caracteres ou fale com a gente no WhatsApp." + CTA WhatsApp |
| `error` | `ErrorState` inline: "Não conseguimos consultar agora." + "Tentar novamente" |
| `rate_limited` | `Alert variant="info"`: "Muitas consultas em sequência. Tente em alguns minutos." — consulta anônima **precisa** de rate limit (`SECURITY_AND_LGPD.md` §Webhooks/rate limiting aplicado também aqui) |

**Motion:** reveal on mount em cascata via `use-reveal.ts` (já existe, CSS).
Widget com `delayMs: 260`. Sem framer-motion nesta seção.

**Mockup lateral (direcionamento visual):** o widget **substitui** o mockup de
painel hoje presente em `HomeHero.tsx`. Aquele mockup (lista de `StatusBadge`)
migra para a S3 (Garagem Digital), onde é o conteúdo central e não um enfeite.

---

### S2 — Resultado da consulta rápida (estado expandido do widget)

Renderizado in-place no widget da S1 (§Nota). `aria-live="polite"` para anunciar
o resultado a leitor de tela.

#### Copy

**Título do resultado** (`h2` visualmente `--font-size-h2`)
```
Encontramos o seu veículo
```

**Linha do veículo** → `VehicleSummary` (existe)
```
ABC1D23 · {marca/modelo} · {ano}
```

**Bloco de pendências** — `divide-y divide-border-subtle`, sem card interno:

```text
┌──────────────────────────────────────────────┐
│ ABC1D23 · Fiat Argo 2021      [ Atenção ]    │  VehicleSummary + StatusBadge
├──────────────────────────────────────────────┤
│ IPVA 2026              venc. 15/03   R$ 0,00 │  font-mono no valor
│                                 [ Em aberto ]│  StatusBadge
├──────────────────────────────────────────────┤
│ Licenciamento 2026     venc. 31/10          │
│                                 [ Bloqueado ]│  StatusBadge licensing BLOCKED
├──────────────────────────────────────────────┤
│ Multas (2)                          R$ 0,00 │
│                                 [ Em aberto ]│  StatusBadge fine OPEN
├──────────────────────────────────────────────┤
│ Total em aberto               R$ 0,00       │  MoneyBreakdown
│                                              │
│ [ Resolver minhas pendências ]               │  Button primary
│ Ver detalhes completos →                     │  link → /consultar/:id
└──────────────────────────────────────────────┘
```

**Mapeamento**

| Elemento | Componente DS |
|---|---|
| Resumo do veículo | `VehicleSummary` (existe) |
| Status geral | `StatusBadge domain="vehicle"` — enums `REGULAR/ATTENTION/IRREGULAR/PROCESSING/MANUAL_REVIEW/UNKNOWN` |
| Status por item | `StatusBadge domain="fine" \| "licensing" \| "payment"` |
| Valores | `MoneyBreakdown` (existe) + `formatCurrency` de `lib/format` |
| Agrupamento | `divide-y` — **sem** card por linha |
| CTA | `Button variant="primary"` → `/cadastro?placa=` ou `/consultar/:id` |
| Dado velho | `StaleDataBanner` (existe) |

**Copy de status — alinhada ao `STATUS_MODEL.md`.** Nunca escrever status em
texto livre; sempre o label canônico de `COMPONENTS.md` §StatusBadge:

| Situação | Copy obrigatória |
|---|---|
| Licenciamento bloqueado por multa | "Licenciamento bloqueado: há multa em aberto." (erro de domínio `LICENSING_BLOCKED_BY_OPEN_FINES`) |
| Consulta em processamento no órgão | "Estamos consultando a base do órgão. Isso leva alguns segundos." |
| Pagamento iniciado | "Aguardando confirmação do pagamento." — **nunca** "pago" (CLAUDE.md §11) |
| Pago, aguardando órgão | "Pagamento confirmado. Estamos aguardando a atualização do órgão." (`SCREEN_SPECS.md` §6) |
| Sem pendência | "Tudo em dia. Seu veículo não tem pendências nesta consulta." + CTA "Receber alerta antes do próximo vencimento" |

**Estado `empty` / veículo regular — não esquecer.** É o estado que mais escapa:
a pessoa consulta, está tudo certo, e a landing não tem o que oferecer. Use
`EmptyState` (existe) com o CTA de alerta de vencimento — é aqui que a captura
de contato (§0.3) tem a melhor taxa.

**Captura de contato `[LGPD]`** — aparece **somente neste ponto**, depois do valor:

```text
Quer ser avisado antes de vencer?
┌────────────────────────────────┐
│ WhatsApp ou e-mail             │  Input md
└────────────────────────────────┘
[x] Autorizo a EMR a me enviar avisos sobre este veículo.   Checkbox (existe)
    Consulte a Política de Privacidade.                      link
[ Ativar alertas ]                                           Button secondary
```
Checkbox **não pré-marcado** (consentimento LGPD precisa ser ativo).
Finalidade declarada no próprio label. Sem contato ≠ sem resultado.

**Parcialidade:** se um órgão responde e outro falha, mostrar o que veio +
banner "Não conseguimos consultar {órgão} agora." Nunca descartar resultado
parcial (partial failure é estado obrigatório — `SCREEN_SPECS.md` §Estados,
CLAUDE.md §18).

---

### S3 — Garagem Digital (demo da área logada)

`id="garagem"`. Fundo `bg-subtle` para separar da Hero sem borda pesada.

#### Copy

**Eyebrow:** `Sua garagem digital`

**H2:**
```
Todos os seus veículos, num painel que não te deixa esquecer nada.
```

**Lead** (`max-w-[65ch]`):
```
Cadastre seus carros uma vez. A partir daí você vê o que está em aberto,
recebe aviso antes de cada vencimento e baixa seus comprovantes quando quiser —
sem procurar e-mail antigo nem ligar para ninguém.
```

#### Demonstração em Tabs

`Tabs` (existe, underline style, `COMPONENTS.md` §Tabs). 4 abas; cada aba troca
o mockup à direita. **`layoutId` do framer-motion no indicador** da aba ativa.

| Aba | Label | Copy do painel | Componentes no mockup |
|---|---|---|---|
| 1 | Meus veículos | "Toda a frota numa tela — placa, modelo, status geral e o que precisa de atenção primeiro." | `VehicleSummary` ×3 + `StatusBadge domain="vehicle"` |
| 2 | Débitos e prazos | "IPVA, licenciamento e multas com valor e vencimento. O que vence antes aparece antes." | `divide-y` + `StatusBadge` + `MoneyBreakdown` + valores `font-mono` |
| 3 | Documentos | "Comprovantes de pagamento e CRLV no seu histórico, com download seguro." `[COMERCIAL]` ver nota | lista + `lucide-react` `FileCheck` + `Button variant="ghost"` "Baixar" |
| 4 | Alertas | "Avisamos antes de vencer — licenciamento, IPVA e multa nova." | `Timeline` (existe) com eventos |

> **`[COMERCIAL]` CRLV:** `REQUIREMENTS.md` RF-023 é **"CRLV simulado"**. Até
> existir emissão real, a copy da aba 3 **não pode** dizer "CRLV-e oficial" nem
> "documento válido". Use: *"comprovantes de pagamento e histórico do veículo"*.
> Trocar para "CRLV-e" só quando RF-023 sair de simulado.

**Alertas — copy dos itens (ancorada em RF-053/054/055):**
```
Multa nova detectada           · RF-053
Licenciamento vence em 15 dias · RF-054
Pagamento aguardando confirmação · RF-055
```

**Mapeamento**

| Elemento | Componente DS | Notas |
|---|---|---|
| Navegação das abas | `Tabs` | underline, `border-bottom 2px` em ativo, focus ring padrão |
| Indicador ativo | framer-motion `layoutId="garagem-tab"` | spring 100/20 |
| Mockup | composição + `AppShell` **não** — não embutir shell real na landing | mockup estático, `aria-hidden` no chrome decorativo |
| Veículos | `VehicleSummary` | mesmos dados de `PROTOTYPE_DATA.md` |
| Status | `StatusBadge` | enum tipado, nunca string |
| Histórico/alertas | `Timeline` | ordenação: mais recente no topo |
| Download | `Button variant="ghost"` + `Tooltip` | "Download exige login" — `SECURITY_AND_LGPD.md`: presigned URL + autorização |
| CTA da seção | `Button variant="secondary" size="lg"` | "Criar minha garagem" → `/cadastro` |

**Acessibilidade do mockup:** o painel ilustrativo é conteúdo decorativo com
texto real. Marcar o container com `role="img"` + `aria-label` descritivo, ou
manter o texto legível e marcar só o chrome (barra de janela, sidebar fake) como
`aria-hidden`. Não deixar um painel fake navegável por `Tab`.

**Mobile:** Tabs viram `Drawer`? **Não.** Tabs com scroll horizontal
(`overflow-x-auto`, sem scrollbar visível) + mockup em coluna única. Drawer para
4 abas é peso desnecessário.

**Estados:** esta seção é estática (demo). Não precisa loading/error — mas o
mockup **deve ilustrar** os estados reais do produto, incluindo um
`StatusBadge PROCESSING`, para que a expectativa criada na landing seja a do
produto real.

---

### S4 — Dores e soluções

`id="por-que"`. **Zigue-zague de 2 colunas**, não 3 cards (§0.5). 3 pares,
alternando lado. Agrupamento por `border-t`, sem card.

**H2:**
```
A papelada não mudou. A forma de resolver, sim.
```

| # | Antes (dor) | Com a EMR |
|---|---|---|
| 1 | "Fila no Detran, senha, e voltar outro dia porque faltava um documento." | "Você resolve pelo celular e só é chamado se faltar algo de verdade." |
| 2 | "Descobrir a multa quando o licenciamento já está bloqueado." | "Aviso quando a multa aparece — antes de virar bloqueio." |
| 3 | "Ligar para o despachante para saber 'como está'." | "Status visível a qualquer hora, com a etapa em que seu pedido está." |

**Mapeamento**

| Elemento | Componente DS |
|---|---|
| Coluna "antes" | texto `text-text-muted` + `lucide-react` `X` 16px em `--status-error` |
| Coluna "com a EMR" | texto `text-text` + `Check` 16px em `--status-success` |
| Separador entre pares | `border-t border-border-subtle` |
| Ícones | `lucide-react`, stroke 1.5, `aria-hidden` |

**Motion:** reveal on scroll via `use-reveal.ts` `mode="onScroll"`, stagger de
80ms por par. Sem framer-motion.

**Anti-padrão a evitar:** não usar vermelho como fundo de bloco na coluna "antes".
Dor em fundo vermelho lê como erro do sistema, não como contexto. Diferencie por
peso e cor de texto.

---

### S5 — Serviços

`id="servicos"`. Reaproveita `ServicesGrid.tsx`, que já existe e já tem o
catálogo correto (`PRODUCT_DESCRIPTION.md` §5). **Ajuste de layout:** o grid
atual tende a 3 colunas iguais; mudar para **assimétrico**:
`md:grid-cols-2 lg:grid-cols-3` com os 2 serviços de implementação profunda
(Multas, Licenciamento) em `lg:col-span-2` / destaque, e os estruturais em
células simples.

**H2:**
```
O que você resolve aqui
```

**Lead:**
```
Os serviços estão organizados por quem precisa resolver — não por nome de
formulário do órgão.
```

| Serviço | Copy | Ícone (`lucide-react`) | Profundidade |
|---|---|---|---|
| Multas | "Consulte multas em aberto, pague e acompanhe a baixa junto ao órgão." | `ScrollText` | profunda |
| Licenciamento | "Veja pendências, libere o licenciamento e acompanhe a emissão." | `FileCheck` | profunda |
| IPVA | "Acompanhe a situação do IPVA, incluindo exercícios anteriores." | `Landmark` | estrutural |
| Transferência | "Organize a documentação de transferência de propriedade." | `ArrowLeftRight` | estrutural |
| Dívida ativa | "Identifique débitos inscritos em dívida ativa do veículo." | `Receipt` | estrutural |
| Gravame `[COMERCIAL]` | **Não documentado** em `PRODUCT_DESCRIPTION.md` §5. Só incluir após confirmação. | `Lock` | — |

> **Preço e prazo:** `page.tsx` hoje documenta explicitamente *"Nenhum preço/prazo
> é exibido aqui porque nenhum está confirmado no repositório."* Mantido.
> `RF-048` (gestão de preços/taxa) ainda é requisito, não dado.

**Mapeamento**

| Elemento | Componente DS |
|---|---|
| Item | `ServicesGrid` existente — **não** criar `ServiceCard` novo (CLAUDE.md §15) |
| Ícone | `lucide-react` 24px (header de card), stroke 1.5 |
| Selo de disponibilidade | `Badge` + `Tooltip` "Disponibilidade varia por estado" |
| CTA por item | `Button variant="link"` "Consultar" → `#consulta` |

---

### S6 — Condições de pagamento e simulador

`id="pagamento"`. **Seção mais sensível da landing.** Ver §0.1.

#### copy A — ship now (ancorada em `SCREEN_SPECS.md` §8)

**H2:**
```
Pague do jeito que já funciona pra você
```

**Lead:**
```
Você vê o valor da pendência, a taxa da EMR e o total antes de pagar.
Sem valor que aparece depois.
```

| Método | Copy | Componente |
|---|---|---|
| Pix | "Confirmação em minutos após o pagamento." | `Badge` + `lucide-react` `QrCode` |
| Boleto | "Prazo de compensação bancária normal." | `Badge` + `Barcode` |
| Cartão | "Disponível conforme a forma de pagamento habilitada." | `Badge` + `CreditCard` |

**Bloco de transparência** → `MoneyBreakdown` (existe), espelhando o checkout
real (`SCREEN_SPECS.md` §8): `valor da pendência` + `taxa EMR` + `total`.

**Aviso obrigatório** (nota informativa estática, conforme `COMPONENTS.md` §Feedback):
```
O status do seu pedido é atualizado após a confirmação oficial do pagamento.
Começar o checkout, por si só, não confirma o pagamento.
```
Essa frase **não é opcional** — é a materialização do invariante
`checkout success != payment confirmation` (CLAUDE.md §11) na camada de
marketing. Remover isso da landing cria expectativa que o backend
intencionalmente não cumpre.

**Refinamento visual (2026-10-08):** o aviso usa a mesma superfície neutra do
resumo de checkout, com contorno completo discreto, sem faixa lateral colorida.
O título curto "Confirmação do pagamento" antecede as duas explicações
obrigatórias. Ícone informativo decorativo, texto em contraste alto e `aside`
rotulado pelo título; sem live region, pois o conteúdo é uma orientação estática.

#### copy B `[COMERCIAL]` — bloqueada até §0.1 ser resolvido

**H2:** `Pix com desconto ou até 12x no cartão`
**Lead:** `Escolha pagar à vista com desconto no Pix ou parcelar em até 12x. Aprovação na hora.`

**Simulador** — só faz sentido na copy B. Estrutura proposta:

| Elemento | Componente DS | Notas |
|---|---|---|
| Valor a simular | `Input` | `font-mono`, máscara de moeda, `inputMode="decimal"` |
| Nº de parcelas | `Select` | 1–12 |
| Resultado | `MoneyBreakdown` | parcela, total, **custo efetivo total** |
| Aviso | `Alert` `[DS-GAP]` tone `warning` | "Simulação. Valores confirmados no checkout." |

> **Atenção regulatória:** simulador de parcelamento exibindo parcela sem
> informar juros/CET é exposição a CDC art. 52. Se a copy B for liberada, o
> simulador precisa de: taxa de juros, CET e total — ou deve mostrar apenas
> parcelamento **sem juros**, se for o caso. Isso é decisão do negócio +
> jurídico, não de design.

**Até a decisão:** implementar copy A sem simulador. É menos chamativo e é
verdade.

---

### S7 — Jornada (stepper)

`id="como-funciona"`. Reaproveita `ProcessSteps.tsx` (existe). Ajustar copy para
incluir pagamento e WhatsApp, mantendo alinhamento ao `ServiceRequestStatus`
(`STATUS_MODEL.md`: `NEW → IN_PROGRESS → WAITING_* → COMPLETED`).

**H2:** `Quatro passos, do pedido à conclusão`

| # | Título | Copy | Ícone | Status mapeado |
|---|---|---|---|---|
| 1 | Consulte a placa | "Sem cadastro. Você vê o que está em aberto." | `CarFront` | — |
| 2 | Escolha o que resolver | "Selecione os serviços a partir do que encontramos." | `Clipboard` | `NEW` |
| 3 | Pague com segurança | "Valor, taxa e total visíveis antes de confirmar." | `CreditCard` | `IN_PROGRESS` |
| 4 | Acompanhe até o fim | "Status no painel e aviso no WhatsApp a cada etapa." | `CheckCircle` | `WAITING_* → COMPLETED` |

> Passo 3 na copy B `[COMERCIAL]`: "Pague no Pix ou em até 12x".

**Mapeamento**

| Elemento | Componente DS |
|---|---|
| Stepper | `ProcessSteps` existente. `ServiceStatusStepper` `[DS-GAP]` é do app (estado real), **não** reutilizar aqui — a landing ilustra, não reflete estado |
| Conector entre passos | `border-t` / linha 2px `--border-default`, nunca seta emoji |
| Numeração | `font-mono` |

**Motion:** reveal on scroll com stagger 100ms. Conector desenhando-se
(`scaleX` 0→1) — `transform` apenas, nunca `width`.

---

### S8 — Prova social e segurança

`id="seguranca"`. Reaproveita `TrustSection.tsx` (existe, já com os 4 princípios
corretos) e **adiciona** depoimentos.

**H2:** `Por que confiar o documento do seu carro à EMR`

#### Depoimentos — carrossel

> **`[COMERCIAL]` Depoimentos precisam ser reais.** A spec não gera depoimento
> fictício: testemunho inventado em landing é publicidade enganosa
> (CDC art. 37), independentemente de parecer inofensivo. Estrutura e requisitos
> abaixo; **conteúdo vem do negócio.**

Cada depoimento precisa de: nome real (ou primeiro nome + inicial com
autorização), cidade/UF, serviço utilizado, e **autorização de uso de imagem/
depoimento registrada**. Sem autorização, não publica.

| Elemento | Componente DS | Notas |
|---|---|---|
| Carrossel | framer-motion, loop `x: ["0%", "-50%"]` seamless | `pause` no hover **e** no focus; controles de teclado |
| Item | composição, `border-l 2px` em vez de card | sem card (§0.5) |
| Avatar | `Avatar` `[DS-GAP]` (pasta existe, sem export) | foto real autorizada ou iniciais — **nunca** ícone "egg" genérico |
| Serviço citado | `Badge` | ex. "Licenciamento" |
| Nota | `font-mono` | só se houver fonte verificável |

**Performance:** carrossel infinito é animação perpétua → componente-folha
isolado com `"use client"` + `React.memo`, sem re-render no pai (skill §9B;
CLAUDE.md §7/§8).

#### Segurança — manter o conteúdo atual de `TrustSection`

Os 4 pontos já implementados estão corretos e ancorados em
`SECURITY_AND_LGPD.md`. Mantidos sem alteração:
- confirmação de pagamento só por retorno oficial do provedor;
- status explícito por solicitação;
- integrações com órgãos com fila e nova tentativa;
- dados pessoais com minimização e acesso restrito.

**Selos** `[COMERCIAL]`: só exibir selo (SSL, certificação, associação de
despachantes, Reclame Aqui) que a empresa **efetivamente possua**. Selo
decorativo de segurança é o AI tell mais custoso desta página — e o mais
checável por um cliente desconfiado.

---

### S9 — FAQ

`id="faq"`. Reaproveita `Faq.tsx` + `Accordion` (existe — disclosure WAI-ARIA, um
item aberto por vez, `grid-template-rows` 0fr→1fr).

**H2:** `Perguntas frequentes`

Os 4 itens atuais de `page.tsx` são mantidos (estão corretos). Adicionar os 5
abaixo, cobrindo as dúvidas de app/conta pedidas no briefing:

| id | Pergunta | Resposta |
|---|---|---|
| `cadastro` | Preciso criar conta para consultar meu veículo? | *(mantida)* "Não. A consulta inicial pela placa não exige cadastro. Uma conta é necessária apenas para acompanhar e concluir solicitações." |
| `app-preco` | Preciso pagar para usar o app? | "Não. Criar a conta, cadastrar veículos, consultar pendências e receber alertas não têm custo. Você paga apenas o serviço que solicitar, com o valor visível antes de confirmar." |
| `documentos-depois` | Como acesso meus documentos depois? | "Pelo seu painel, em Documentos. Os arquivos ficam vinculados ao veículo e ao pedido, e o download é autorizado só para você." |
| `alertas` | Como funcionam os alertas de vencimento? | "Depois de cadastrar o veículo, avisamos quando aparece multa nova, quando um prazo está perto de vencer e quando há pagamento aguardando confirmação." |
| `pagamento-confirmado` | Quando meu pagamento é considerado confirmado? | *(mantida)* "Somente após a confirmação oficial do provedor de pagamento — o início do checkout não é, por si só, uma confirmação." |
| `cobertura` | Vocês atendem qualquer serviço em qualquer estado? | *(mantida)* "A disponibilidade varia por serviço e por estado. As condições específicas são mostradas ao iniciar cada solicitação." |
| `acompanhamento` | Como acompanho uma solicitação em andamento? | *(mantida)* "Pelo seu painel, com o status atualizado a cada etapa do processo." |
| `dados` | O que vocês fazem com os meus dados? | "Coletamos o mínimo necessário para executar o serviço. A consulta pela placa não exige CPF. Veja a Política de Privacidade." |
| `cancelar` | Posso cancelar um pedido? | `[COMERCIAL]` — política de cancelamento/reembolso não documentada. `REQUIREMENTS.md` menciona `REFUND_PENDING`/`REFUNDED` como status, mas não a política. **Definir com o negócio antes de publicar.** |

**Mapeamento**

| Elemento | Componente DS |
|---|---|
| Lista | `Accordion` (existe). API real: `items: AccordionItem[]` + `defaultOpenId` — controlado internamente, um aberto por vez. Não há prop `type`. |
| Trigger | `aria-expanded` + `aria-controls`, `ChevronDown` rotação 180° |
| Painel | `role="region"` + `aria-labelledby` |
| CTA de escape | `Button variant="link"` "Não achou sua dúvida? Fale no WhatsApp" |

**SEO:** adicionar `FAQPage` JSON-LD derivado **do mesmo array** `faqItems` —
nunca duplicar o texto num bloco separado (fonte única, risco zero de divergir).

---

### S10 — Rodapé e CTA flutuante

#### CTA final (antes do rodapé)

Reaproveita `FinalCta.tsx` (existe).

**H2:** `Comece pela placa. O resto é com a gente.`
**Lead:** `Consulta gratuita e sem cadastro. Em 30 segundos você sabe o que está em aberto.`
**Primary:** `Consultar meu veículo` → `#consulta`
**Secondary:** `Soluções para empresas` → `/parceiros`

#### Botão flutuante de WhatsApp

| Aspecto | Decisão |
|---|---|
| Componente | `Button` + wrapper `fixed bottom-4 right-4 z-40` |
| Visual | ~~`variant="secondary"` com ícone `MessageCircle`, sem verde~~ — **revisto em 2026-10-08.** Botão circular de 56px, glifo oficial do WhatsApp (Simple Icons) e fundo `--brand-whatsapp` (`#25D366`). O verde entra como cor de **marca de terceiro**, não como verde semântico de sucesso, que continua proibido como cor de ação. Decisão, trade-off de contraste e caminho de correção em **ADR-018**. |
| Aparição | Só **após** a dobra da Hero (scroll > 100dvh), via `use-scrolled.ts` (já existe). Flutuante na dobra compete com o widget de consulta. |
| Mobile | ≥ 44px de touch target; deslocar acima da safe-area (`pb-[env(safe-area-inset-bottom)]`) |
| A11y | `aria-label="Falar com a EMR no WhatsApp"`; `rel="noopener noreferrer"` |
| Z-index | `z-40` — abaixo de `Dialog`/`Drawer` (§5 da skill: z-index só para contexto sistêmico) |
| `[LGPD]` | Deep link de WhatsApp **não** pode carregar PII na query (`SECURITY_AND_LGPD.md`: "evitar PII desnecessária"). Mensagem pré-preenchida genérica, sem placa. |

#### Rodapé institucional

`Footer.tsx` existe. Conteúdo obrigatório:

```text
┌─ Logo + tagline ─────┬─ Serviços ──┬─ Empresa ────┬─ Legal ──────┐
│ EMR Despachante      │ Multas      │ Sobre        │ Termos de uso│
│ Despachante digital  │ Licenciamento│ Parceiros   │ Privacidade  │
│                      │ IPVA        │ Contato      │ Cookies      │
│                      │ Transferência│ WhatsApp    │              │
├──────────────────────┴─────────────┴──────────────┴──────────────┤
│ {Razão Social} · CNPJ {00.000.000/0000-00} · {endereço}          │  font-mono no CNPJ
│ © 2026 EMR Despachante. Todos os direitos reservados.            │
└──────────────────────────────────────────────────────────────────┘
```

`[COMERCIAL]` Razão social, CNPJ, endereço e dados de registro de despachante
**devem vir do negócio**. Não são inventáveis e são exigência legal de
identificação do fornecedor (CDC art. 31). Placeholders no código devem falhar
visivelmente (ex. `{{RAZAO_SOCIAL}}`), nunca ficar com dado plausível-mas-falso.

---

## 3. Checklist de estados por seção (CLAUDE.md §18)

| Seção | loading | empty | error | stale | partial | unauthorized | disabled | conflict |
|---|---|---|---|---|---|---|---|---|
| S1 widget | `Button loading` | — | `ErrorState` | — | — | — | n/a (ver §1.2) | rate limit |
| S2 resultado | `Skeleton` `[DS-GAP]` | `EmptyState` "tudo em dia" | `ErrorState` | `StaleDataBanner` | banner por órgão | n/a | — | — |
| S3 garagem | n/a (demo) | — | — | — | — | tooltip "download exige login" | — | — |
| S4–S5, S7–S9 | n/a (estático) | — | — | — | — | — | — | — |
| S6 simulador | `Button loading` | — | `Alert` | — | — | — | — | — |
| S10 WhatsApp | — | — | fallback para `/contato` se o deep link falhar | — | — | — | — | — |

---

## 4. Ordem de implementação sugerida

1. **S1 + S2** — maior impacto em conversão, e resolve o conflito FE-PUB-001.
   Depende de: `Skeleton`, `Alert` `[DS-GAP]`.
2. **`[DS-GAP]`** — `Skeleton`, `Alert`, `Avatar` export em `packages/ui`,
   seguindo `COMPONENTS.md`. PR separado do PR da landing.
3. **S9 FAQ** — baixo custo, ganho de SEO imediato, só conteúdo.
4. **S4 + S5** — ajuste de layout em componentes que já existem.
5. **S3 Garagem** — maior volume de trabalho; precisa de `framer-motion`.
6. **S7 + S10** — ajustes nos componentes existentes.
7. **S6 pagamento** — **bloqueado** em §0.1. Implementar copy A sem simulador;
   simulador só depois da decisão comercial + jurídica.
8. **S8 prova social** — **bloqueado** em depoimentos/selos reais. Implementar
   só o bloco de segurança (já existe) e adicionar depoimentos quando o
   conteúdo chegar.

## 4A. Status de implementação (atualizado em 08/10/2026)

| Seção | Status | Arquivo |
|---|---|---|
| S1 Hero + widget | **implementado** | `HomeHero.tsx`, `PlateConsultWidget.tsx` |
| S2 Resultado | **implementado** (todos os estados, dados de protótipo) | `ConsultResult.tsx`, `lib/vehicle-lookup.ts` |
| S3 Garagem Digital | **implementado** | `GarageShowcase.tsx`, `GaragePanels.tsx` |
| S4 Dores e soluções | **implementado** | `PainSolution.tsx` |
| S5 Serviços | **copy ajustada** (layout bento já existia) | `ServicesGrid.tsx` + `page.tsx` |
| S6 Pagamento | **copy A implementada**, sem simulador | `PaymentTerms.tsx` |
| S7 Jornada | **copy ajustada** (passo de pagamento adicionado) | `page.tsx` |
| S8 Prova social | **só o bloco de segurança** — depoimentos/selos pendentes de conteúdo real | `TrustSection.tsx` |
| S9 FAQ | **implementado** + JSON-LD `FAQPage` | `page.tsx`, `Faq.tsx` |
| S10 FAB WhatsApp | **implementado**, condicionado a `NEXT_PUBLIC_WHATSAPP_NUMBER` | `WhatsAppFab.tsx` |
| S10 Rodapé institucional | **pendente** — falta razão social, CNPJ, endereço e as rotas `/termos` e `/privacidade` | `Footer.tsx` |

### Resolução dos `[DS-GAP]` do §0.2

| Componente | Desfecho |
|---|---|
| `Alert` | **criado** em `packages/ui/src/components/base/Alert` (variantes info/success/warning/error, `role="alert"` só em erro), com teste e story |
| `Skeleton` | **não era necessário**: `LoadingState` já implementa o padrão documentado (skeleton no shape do layout, nunca spinner em lista) |
| `Spinner` | **não era necessário**: `Button` já tem `loading` com `aria-busy` |
| `Toast` | **não usado**: o opt-in de alertas confirma com `Alert` inline, que persiste |
| `Card` | **não criado**, por decisão de §0.5 |
| `Avatar`, `ServiceStatusStepper` | **não usados** — dependem de S8 (depoimentos) |

### Novo token

`--font-size-display-marketing` (48px) em `tokens.css` + `text-display-marketing`
no preset, restrito à área pública (§0.5). A h1 usa
`text-display lg:text-display-marketing`.

### Seam da consulta

`_components/lib/vehicle-lookup.ts` é o **único** ponto que muda quando a
consulta real existir. Hoje resolve do dataset de `PROTOTYPE_DATA.md` com
latência simulada. Placa válida fora do dataset retorna `prototype_pending`,
não `not_found`: dizer "não encontramos" afirmaria que consultamos o órgão.

Dois estados da §1.3 ficaram fora porque não são alcançáveis sem backend:
`rate_limited` (precisa do rate limit do servidor) e `stale` real (o
`StaleDataBanner` está ligado, mas `lastUpdatedAt` é sempre "agora" no
protótipo).

---

## 5. Validação antes de abrir PR

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Mais: revisar contraste (WCAG AA), navegação por teclado no widget e no
carrossel, `prefers-reduced-motion`, e a página em 360px de largura sem scroll
horizontal.

---

## S11 — `/parceiros` (Portal do Parceiro, B2B)

Reconstruída em 2026-10-10 a partir de briefing comercial B2B. Público: gerente de operação
de concessionária, revenda, locadora e frota. Dials aplicados: `DESIGN_VARIANCE 6 /
MOTION 4 / DENSITY 5` — mais contido que a landing B2C, porque o comprador avalia
credibilidade e rastreabilidade, não expressividade.

### S11.1 `[COMERCIAL]` Quatro claims bloqueados

O briefing pedia quatro afirmações que **não têm lastro** no repositório. Mesma disciplina do
§0.1: nenhuma foi implementada, e cada uma destrava em uma linha.

| Claim | Evidência contra | O que está na página |
|---|---|---|
| "baixa de gravame" | **Zero** ocorrências de "gravame" em `docs/`. Não está no catálogo de serviços. | Serviços = multas, licenciamento, IPVA, transferência, dívida ativa. |
| "Sem mensalidade fixa" | **Zero** ocorrências de "mensalidade". O FAQ da própria página diz que a cobrança é definida comercialmente. | "O cadastro da organização não tem custo. O modelo de cobrança é definido junto com nossa equipe comercial." |
| "EMR Copilot (IA Assistente)" | `ROADMAP.md` → **M12**. Milestone futuro, não existe. | Fora do grid de recursos. |
| "Download de PDF do CRLV-e" | `REQUIREMENTS.md` RF-023 = "CRLV **simulado**"; `DASHBOARD_SPEC.md` = "CRLV mock". | "Documentos e comprovantes centralizados", sem citar o documento oficial. |

**Ação necessária:** confirmar com o negócio (a) gravame entra no catálogo? (b) existe
isenção de mensalidade contratualmente? (c) quando o Copilot sai do M12? (d) a emissão de
CRLV deixa de ser simulada? Até lá, a copy acima permanece.

### S11.2 Formulário de captação

A dobra tem formulário B2B de 4 campos (empresa, responsável, contato, volume). **Não há
endpoint de lead** (`TODO(FE-PUB-002)`), então o submit monta uma mensagem e abre o WhatsApp
da EMR. Decisões que não são estéticas:

- O destino dos dados fica **escrito na tela** antes do envio. Nada é gravado no site, mas o
  usuário precisa saber para onde a informação vai (`SECURITY_AND_LGPD.md`, PII minimizada).
- O componente **nunca** diz "solicitação enviada" nem "cadastro realizado": abrir o WhatsApp
  não é ter enviado. Há teste travando essa promessa em `parceiros/page.test.tsx`.
- Sem `NEXT_PUBLIC_WHATSAPP_NUMBER`, o botão vira link para o contato comercial em vez de
  fingir que funciona. Mesma disciplina do FAB.

Quando o endpoint existir, troca-se `handleSubmit` em `PartnerLeadForm.tsx`; o resto do
componente (validação, erros, acessibilidade) permanece.

### S11.3 `[PRÉVIA]` Preview do portal

A seção "O portal" mostra cinco telas em abas: visão geral, solicitações, nova solicitação,
acompanhamento, documentos e equipe.

**Estas telas ainda não existem.** As rotas `/partner/*` são `PlaceholderPage` hoje. O preview
é montado com os **componentes reais** que elas vão usar (`Table`, `StatusBadge`, `Timeline`
do `@emr/ui`), com dados de exemplo. Não é captura de tela, e deliberadamente não é um
conjunto de `div`s simulando uma.

Regras que o preview respeita:
- status saem do enum canônico (`status-map.ts`, domínio `case`), incluindo `WAITING_EXTERNAL`
  e `WAITING_CLIENT` — mostrar só o caminho feliz cria expectativa que o produto não cumpre;
- afordâncias que não funcionam (busca, filtro) são `aria-hidden`, para leitor de tela não
  tabular para dentro de controle morto;
- datas são fixas, não `new Date()`: data em tempo de render diverge entre servidor e cliente
  e gera aviso de hidratação.

**Risco aceito:** é prévia de produto não construído. Se o comercial não quiser expor isso
antes do portal existir, a seção sai e a página continua de pé.

### S11.4 Ritmo de eyebrow

A página tem 8 seções, então o teto é 3 eyebrows (1 a cada 3). Em uso: dobra, "Como começar".
Por isso `eyebrow` virou **opcional** em `ServicesGrid`, `ProcessSteps` e `TrustSection`
(mudança retrocompatível; a landing B2C não foi afetada).

### S11.5 Imagem

A foto da dobra é a fornecida pelo negócio (aperto de mão em salão de concessionária),
recortada para remover o veículo mais evidente da borda direita. **Pendência:** ainda há um
emblema de montadora desfocado ao fundo, entre os dois executivos. É marca de terceiro em
peça de marketing; avaliar desfoque adicional antes de publicar.
