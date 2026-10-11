# EMR Despachante — Architecture Decision Records

## ADR-000 — Monorepo pnpm com apps e packages compartilhados

### Contexto
O produto terá web (Next.js), API (NestJS) e worker assíncrono, além de código compartilhado (tipos, UI, configuração). Times pequenos e um único ciclo de release inicial não justificam múltiplos repositórios.

### Decisão
Usar um monorepo gerenciado por pnpm workspaces, com `apps/web`, `apps/api`, `apps/worker` e `packages/ui`, `packages/types`, `packages/config`. Dependências internas usam `workspace:*`. Apps não dependem uns dos outros; packages podem ser consumidos por qualquer app.

### Por que
Um único `pnpm install` e `pnpm typecheck` cobrem todo o workspace, com compartilhamento de tipos e UI sem publicar pacotes em registry. Deploy de cada app permanece independente (build por `--filter`). Separação em repositórios distintos só deve ocorrer com necessidade operacional demonstrada (times separados, ciclos de release incompatíveis).

---

## ADR-001 — Prevenção de pagamento duplicado

### Contexto
Duas requisições podem tentar pagar a mesma multa.

### Decisão
Constraint no banco impede mais de um pagamento ativo por multa.

### Por que
Lock em memória falha com múltiplas instâncias.

---

## ADR-002 — Idempotência de webhook

### Contexto
Provedores reenviam webhooks.

### Decisão
Persistir `provider + event_id` antes/na transação de processamento e retornar sucesso em replay.

### Segurança
Validar HMAC antes de processar.

---

## ADR-003 — Transactional Outbox

### Contexto
Pagamento confirmado precisa disparar submissão externa.

### Problema
DB commit + publish separado pode perder evento.

### Decisão
Pagamento e outbox na mesma transação.

---

## ADR-004 — DetranClient como adapter

### Contexto
Não existe integração pública uniforme disponível para este projeto.

### Decisão
Toda dependência governamental passa por uma interface.

### Implementação de estudo
Mock com:
- latência;
- timeout;
- falha;
- inconsistência controlada.

---

## ADR-005 — Dashboard com agregações antes de CQRS pesado

### Contexto
Despachante precisa de dashboard rápido.

### Decisão
V1:
- queries agregadas;
- índices;
- cache curto.

Read model separado só quando métricas justificarem.

---

## ADR-006 — Consentimento no vínculo despachante-cliente

### Decisão
Despachante inicia vínculo, proprietário aceita.

Sem aceite:
- acesso a dados fica limitado;
- veículo não entra como gerenciado ativo.

---

## ADR-007 — State machine financeira

Estados não podem ser alterados livremente.

Exemplos:
- PENDING -> PAID
- PENDING -> FAILED
- PAID -> REFUND_PENDING
- REFUND_PENDING -> REFUNDED

Transições inválidas são rejeitadas.

---

## ADR-008 — Política de abertura de caso manual

Criar caso quando:
- mensagem vai para DLQ;
- tentativa externa excede threshold;
- reconciliação diverge;
- baixa demora além do SLA interno;
- documento falha;
- webhook não pode ser reconciliado.

---

## ADR-009 — Cache com staleness explícita

Dados governamentais em cache precisam apresentar `lastUpdatedAt`.

O sistema nunca deve transformar cache antigo em “estado atual” sem indicar timestamp.

---

## ADR-010 — Documentos privados no S3

Bucket privado.

Download:
- autorização na API;
- presigned GET curta.

Upload/geração:
- worker;
- object key não previsível.


---

## ADR-011 — IA via tool calling, não SQL

### Contexto
Copilot precisa consultar dados transacionais.

### Decisão
LLM chama tools controladas da API.

### Consequência
Mais trabalho de schemas/tools, mas autorização e domínio permanecem sob controle.

---

## ADR-012 — Write tools com confirmação

### Contexto
Ações via IA podem ter efeitos operacionais/financeiros.

### Decisão
Toda mutação sensível requer confirmação explícita no frontend.

---

## ADR-013 — RAG separado de dados transacionais

### Contexto
Procedimentos internos são texto; pagamentos/casos são dados estruturados.

### Decisão
RAG é usado para conhecimento documental.
Tool calling é usado para estado transacional.

---

## ADR-014 — IA degradável

### Decisão
Falha de provider de IA não afeta funções essenciais do EMR Despachante.

---

## ADR-015 — PostgreSQL, Prisma e Docker Compose para ambiente local

### Contexto
O projeto ainda não tinha banco de dados, ORM/migration tool nem forma repetível de subir um
ambiente local. A issue FND-005 exige PostgreSQL, migrations, seed fictício, Docker Compose,
healthcheck e comandos de reset/migrate/seed, sem modelar todas as entidades do domínio.

### Decisão
- PostgreSQL 16 (imagem `postgres:16.4-alpine`) via Docker Compose, versão pinada.
- Prisma como ORM e ferramenta de migrations em `apps/api`.
- `docker-compose.yml` na raiz define somente o serviço `postgres`, com volume nomeado e
  healthcheck via `pg_isready`. Dockerização de `api`/`worker` fica para issue futura.
- `prisma migrate dev` para desenvolvimento local (gera e aplica migrations); `prisma migrate
  deploy` reservado para pipelines futuros (aplica migrations existentes, não interativo).
- `schema.prisma` cobre um recorte mínimo (`User`, `Vehicle`, `Fine`, `Licensing`) suficiente
  para exercitar os enums oficiais de `docs/product/STATUS_MODEL.md`. Modelagem completa do
  domínio (`docs/engineering/DATA_MODEL.md`) permanece fora de escopo.
- Seed (`prisma/seed.ts`) usa `upsert` por chave única para ser idempotente, com dados
  claramente fictícios (prefixo "TESTE", domínio `example.com`).

### Por que
Prisma dá migrations versionadas, client tipado e integra bem com TypeScript/NestJS sem exigir
SQL manual nesta fase. Docker Compose evita depender de instalação local de Postgres e garante
ambiente reprodutível entre desenvolvedores. Volume nomeado (em vez de bind mount) evita
acoplar dados do banco a um diretório do repositório.

### Consequência
- Só `apps/api` ganha dependência de Prisma; `apps/web` e `apps/worker` não são afetados.
- Migrations em `apps/api/prisma/migrations` são versionadas em git.
- Qualquer nova entidade de domínio, incluindo dados sensíveis (CPF/CNPJ, RENAVAM,
  financeiro), deve seguir mascaramento/minimização de `docs/engineering/SECURITY_AND_LGPD.md`
  já a partir da próxima issue que expandir o schema.
- `prisma migrate reset` é destrutivo; o script `db:reset` não usa `--force` por padrão,
  exigindo confirmação interativa como proteção contra execução acidental fora do ambiente
  local.

---

## ADR-016 — Âmbar como cor de CTA na área pública

### Contexto
A landing pública usava `Button variant="primary"` (navy `#0F172A`) como chamada principal,
dentro de um cartão branco sobre a dobra navy. O botão não se separava do resto: mesma cor da
marca, mesma cor do texto, nenhum contraste de ação. Não existia variant de accent preenchido
— `accent` é outline (fundo branco + texto cobalt), então não havia nenhuma opção "cheia" no
Design System além de navy e vermelho destrutivo.

Duas regras do DS apontam para o lado oposto desta decisão e precisam ser citadas:

- `docs/design-system/DESIGN_SYSTEM.md` §anti-patterns: *"Verde como primary — proibido (queima
  semântica de sucesso)"*.
- `docs/product/LANDING_PAGE_SPEC.md` §0.5: *"Acento único: `--action-accent` (cobalt
  `#0369A1`)"*.

O argumento do anti-pattern é sobre **queimar semântica de status**, e vale igualmente para o
âmbar, que hoje significa `warning` / "Atenção" / "Aguardando".

### Decisão
Criar `--action-cta` (+ `-hover`, `-active`) e `--text-on-cta` como tokens semânticos, e um
variant `cta` no `Button`, **restritos à área pública** (`apps/web/src/app/(public)`).

- Light: `--action-cta: #f59e0b` (amber-500) com `--text-on-cta: #0f172a` (navy-900).
- Dark: `--action-cta: #fbbf24` (amber-400), mesmo texto navy.

O ponto da escala não é arbitrário: âmbar escuro (amber-600/700) com texto **branco** entrega
3.4:1 e **reprova** WCAG AA para texto normal. Amber-500 com texto **navy** entrega 9.4:1 e
passa AAA — mais contraste e mais pop ao mesmo tempo.

### Por que
A decisão foi tomada pelo negócio com o conflito documental explicitado. O ganho pretendido é
de conversão na dobra; o custo é duplicar o significado do âmbar no sistema.

### Consequência
- Âmbar passa a ter dois significados: `warning`/`aguardando` no app autenticado, ação na
  landing. Isso é dívida de design assumida, não descuido.
- Mitigações obrigatórias, documentadas em `COMPONENTS.md §Button` e no próprio componente:
  - `variant="cta"` é **proibido** em telas autenticadas;
  - `variant="cta"` é **proibido** no mesmo bloco visível de um `StatusBadge` âmbar;
  - no máximo 1 `cta` por viewport (hoje: dobra e CTA final, que não coexistem em tela).
- Se o produto ganhar um segundo CTA de conversão em tela autenticada, esta ADR precisa ser
  revista antes — e não contornada com um `className`.

### Nota de implementação relacionada
Ao implementar esta ADR descobriu-se que o preset mapeia cores para `var(--token)` cru, e o
Tailwind v3 **não emite regra alguma** quando se aplica modificador de opacidade sobre isso
(`bg-surface/95`, `text-text-inverse/75`). Havia 14 ocorrências em produção: o header sticky
estava totalmente transparente (conteúdo do FAQ vazava por cima da navegação) e o texto de
apoio da dobra renderizava preto puro sobre navy (contraste 1.2:1). A correção foi criar tokens
para as camadas translúcidas (`--surface-header`, `--surface-on-inverse`, `--border-inverse`,
`--surface-watermark`, `--surface-accent-subtle`) e proibir o padrão via teste
(`apps/web/src/lib/token-opacity.test.ts`).

---

## ADR-017 — Fotografia na área pública

### Contexto
A landing não tinha nenhuma imagem: só tipografia, ícones e mockups de painel. Para um serviço
de despachante vendido a público amplo, isso lê como ferramenta técnica, não como serviço
prestado por gente. Ao mesmo tempo, `LANDING_PAGE_SPEC.md` §S8 proíbe depoimento fictício
(CDC art. 37), e foto de pessoa desconhecida ao lado de uma citação é exatamente isso.

### Decisão
- Fotografia da área pública é **versionada** em `apps/web/public/images/` e servida por
  `next/image`. Sem `remotePatterns`: nada de hotlink para banco de imagem.
- A fotografia é **ilustrativa**. Nunca aparece ao lado de citação, nome próprio ou afirmação
  de que a pessoa retratada é cliente da EMR.
- Em bloco de depoimento, o avatar é **iniciais**. Foto só se for a pessoa real, com
  autorização de uso arquivada.
- Enquanto um arquivo não existe, `_components/Photo.tsx` renderiza um bloco provisório
  **visivelmente marcado** com o briefing da foto que falta — nunca uma ilustração vetorial
  improvisada nem uma imagem quebrada.

### Por que
Separa dois problemas que costumam ser confundidos: "a página precisa de calor humano"
(resolve-se com fotografia ilustrativa) e "a página precisa de prova social" (só se resolve com
conteúdo real e autorizado). Misturar os dois é o caminho curto para publicidade enganosa.

### Consequência
- `apps/web/next.config.mjs` ganha bloco `images` (apenas `formats`).
- A foto da dobra usa `priority` por ser o provável LCP.
- Substituir um placeholder por foto real é uma mudança de uma linha
  (`available: false → true`) em `_components/lib/photos.ts`.

### Nota de implementação (2026-10-08)

As duas fotos em uso foram **geradas por IA** (Higgsfield, modelo `z_image`) a partir dos
briefings do manifesto, e estão versionadas em `apps/web/public/images/`. Decisões de
produção que vale registrar:

- **JPEG, não WebP.** A máquina de build não tem encoder WebP (`cwebp` ausente, `sips` do
  macOS não exporta WebP). Isso não custa nada ao usuário final: `next/image` converte para
  AVIF/WebP no servidor via `images.formats`. Trocar a fonte para WebP depois é indiferente
  para o resultado entregue.
- **Duas imagens foram descartadas antes destas**, e o motivo importa para quem for
  regerar: um fundo abstrato em azul saturado (virou "blob de gradiente de IA", fora do navy
  da marca) e uma foto de mulher exausta diante de uma pilha de papéis (comunicava o
  problema, não o alívio que a seção promete). Prompt bonito não basta: a imagem precisa
  dizer a mesma coisa que o texto ao lado dela.
- **O fundo da dobra não virou imagem.** A profundidade vem de duas luzes difusas em CSS
  (`--surface-inverse-glow`), não de um arquivo: pesa zero, escala em qualquer viewport e
  não corre o risco de virar decoração genérica. Primeira tentativa usou alpha 0.22, que
  **desaparece** sobre o navy e devolve a sensação de cor chapada — o que resolve é a faixa
  entre o ponto mais escuro (`--surface-inverse-deep`, quase preto) e o mais claro.
- **A foto da dobra sangra pela direita e é dissolvida por MÁSCARA, não por véu colorido.**
  Um véu por cima precisaria começar exatamente na cor do fundo naquele ponto; como o fundo
  ali é um gradiente com luz, sobra uma emenda vertical visível (testado e descartado).
  Mascarando (`mask-image` + `mask-composite: intersect`), a própria foto perde opacidade e
  o gradiente aparece através dela — sem emenda, seja qual for a cor atrás.

---

## ADR-018 — Verde de marca no FAB de WhatsApp

### Contexto
`LANDING_PAGE_SPEC.md` §S10 especificava o FAB de WhatsApp como `variant="secondary"` com
ícone, e proibia explicitamente o fundo verde: *"**Não** verde WhatsApp saturado — quebra o
acento único (§0.5). Ícone da marca é aceitável; fundo verde não."*

O negócio pediu o botão redondo, com o glifo da marca e o fundo verde do WhatsApp — o
affordance que o usuário brasileiro reconhece sem ler rótulo.

### Decisão
Adotar o botão verde, modelando a cor como **cor de marca de terceiro**, não como cor
semântica:

- Token `--brand-whatsapp: #25D366` (+ `-hover`), em um grupo `brand` separado no preset.
- Valor **idêntico em light e dark**: cor de logotipo não responde a tema.
- Uso restrito ao FAB da área pública.
- Glifo copiado do SVG oficial (Simple Icons, CC0), não redesenhado à mão.

### Por que
Separar "verde de marca" de "verde semântico" resolve o conflito real. O anti-pattern do DS
(*"Verde como primary — queima semântica de sucesso"*) existe para impedir que o usuário leia
verde como "deu certo". Num logotipo do WhatsApp isso não acontece: o verde ali significa
"WhatsApp", do mesmo jeito que o azul do logo do Facebook não significa "informação".
`--status-success` segue sendo o único verde semântico, e verde continua proibido como cor de
ação genérica.

### Consequência
- O "acento único" da landing passa a ter duas exceções documentadas: âmbar para conversão
  (ADR-016) e verde de marca para o canal WhatsApp (esta). Uma terceira exceção deve ser
  tratada como sinal de que o princípio precisa ser reescrito, não estendido de novo.
- **Pendência de acessibilidade conhecida:** glifo branco sobre `#25D366` dá **1.98:1**, abaixo
  do mínimo de 3:1 da WCAG 1.4.11 para objeto gráfico. Mitigações aplicadas: alvo de 56px
  (acima dos 44px recomendados), `aria-label` explícito, e anel interno para destacar a aresta
  do círculo sobre fundo claro. Para conformidade plena, trocar `--brand-whatsapp` por
  `#128C7E` (verde escuro oficial do WhatsApp, 4.1:1 com glifo branco) — é mudança de um
  token. Fica registrado como decisão consciente de marca sobre contraste.
- `brand` é um grupo novo no preset. Toda cor de terceiro futura entra lá, nunca na escala
  semântica.

---

## ADR-019 — Contrato da consulta pública de veículo e fonte por ambiente

### Contexto

`FE-PUB-002` (#151) exige a rota `/consultar` com os estados `validação`,
`loading`, `não encontrado`, `indisponível` e `RENAVAM solicitado quando
necessário`. A dependência declarada, `BE-VEH-001` (#159), está **aberta e sem
critérios de aceite**: não define endpoint, método, payload, response, error
codes, limites de rate limit nem como o backend sinaliza que precisa do
RENAVAM. Ela depende de `INT-GOV-001` (#203), que está em M6 — cinco
milestones à frente de M1, onde as duas primeiras vivem.

Além disso, `docs/engineering/API_SPEC.md` §Vehicles só lista rotas
autenticadas: não havia nenhuma rota pública de consulta especificada em
lugar algum do repositório.

Seguir `CLAUDE.md` §3 ("não inventar requisitos") não podia significar não
entregar: significava propor o contrato explicitamente, em vez de decidir
silenciosamente dentro de um componente.

### Decisão

**1. O contrato é proposta do frontend, marcada como pendente.**
`POST /public/vehicle-lookups`, documentado em `API_SPEC.md` §Public Vehicle
Lookup e tipado em `apps/web/src/lib/consult/contract.ts`. Confirmar ou
corrigir ao implementar `BE-VEH-001`.

**2. POST com o RENAVAM no corpo, nunca em query string.**
RENAVAM é dado sensível (`SECURITY_AND_LGPD.md` §Dados sensíveis) e
`SECURITY_ARCHITECTURE.md` proíbe logá-lo. Query string vaza em access log,
header `Referer` e histórico do navegador. É o mesmo raciocínio que já proíbe
PII no deep link de WhatsApp (`LANDING_PAGE_SPEC.md`).

**3. `renavam_required` é `200` com status discriminado, não erro.**
É etapa do fluxo (`USER_FLOWS.md` §Fluxo 1: "RENAVAM quando necessário").
Modelá-lo como `4xx` levaria a UI a tratá-lo como falha genérica, que é
exatamente o que #151 proíbe.

**4. Error codes de domínio estáveis** (`CLAUDE.md` §21):
`VEHICLE_NOT_FOUND`, `VEHICLE_LOOKUP_INVALID_PLATE`,
`VEHICLE_LOOKUP_RATE_LIMITED`, `VEHICLE_LOOKUP_UNAVAILABLE`. O frontend trata
código, nunca texto de mensagem.

**5. A UI depende de `ConsultOutcome`, não de HTTP.** Toda a tradução
HTTP → domínio fica em `client.ts`. Rede, timeout, 5xx e corpo fora do
contrato convergem para `unavailable` — nunca um `throw` que a UI traduziria
em "algo deu errado", e nunca dado fabricado.

**6. Não existe variante "regular" no resultado.** Ausência de pendência é
`completed` com `pendings` vazio. Consulta bem-sucedida **não** é atestado de
regularidade: é o que os órgãos responderam nesta consulta.

**7. Fonte da consulta por ambiente:** `NEXT_PUBLIC_CONSULT_SOURCE`
(`mock` | `api`, default `mock`). Enquanto #159 não estiver no ar, a consulta
resolve pelo dataset de `docs/product/PROTOTYPE_DATA.md`, seguindo ADR-004
(mock com latência e falha controladas) — no nível do frontend, porque o
adapter real ainda não existe. Virar `api` não toca em componente nenhum.

**8. Placa desconhecida pelo mock retorna `unavailable`, não `not_found`.**
Dizer "não encontramos este veículo" afirmaria que consultamos a base do
órgão, o que não aconteceu. `not_found` só sai para a placa designada em
`MOCK_PLATES`, para o estado ser alcançável em teste e demonstração.

**9. RENAVAM validado só por formato no cliente** (9 a 11 dígitos, normalizado
para 11 com zeros à esquerda). **Sem dígito verificador mod-11.** Nenhum
documento do projeto define regra de RENAVAM além do comprimento
(`UX_RULES.md` §5: "RENAVAM 11 dígitos"), e rejeitar no cliente um RENAVAM que
o órgão aceita deixaria o usuário travado numa tela sem saída. A conferência
real é de quem tem a base.

### Consequência

- Divergência entre o contrato proposto e o real custa **um arquivo**
  (`client.ts`), não uma refatoração de UI.
- A mesma máquina de estados (`useVehicleConsult`) serve duas apresentações: o
  widget da landing renderiza o resultado in-place (`LANDING_PAGE_SPEC.md`
  §Nota S2) e `/consultar` encaminha para `/consultar/:id`
  (`EMR-SCREEN-MAP.md` §2.3). **Isso é inconsistência de UX assumida**, não
  acidente: as duas superfícies têm especificações diferentes e ambas são
  documentadas. Vale reavaliar quando `FE-PUB-003` entrar.
- `/consultar/:id` tem hoje apenas uma casca pública; o conteúdo é escopo de
  `FE-PUB-003` (#152).
- `GET /public/vehicle-lookups/:id` existe no contrato para que o resultado
  seja recuperável sem reenviar o RENAVAM, mas ainda não é consumido.
- `NEXT_PUBLIC_API_BASE_URL`, antes validado e nunca usado, passa a ser
  consumido de fato.
