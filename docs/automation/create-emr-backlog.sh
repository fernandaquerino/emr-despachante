#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# EMR Despachantes — Backlog v2
#
# Objetivo:
#   recriar o backlog com responsabilidades explícitas:
#   - PT/PROD = produto e protótipo
#   - FE       = telas e experiência frontend
#   - BE       = capabilities/regras/APIs backend
#   - INT      = integrações externas
#   - FND/PLAT = foundation/plataforma
#   - QA       = qualidade
#   - SEC      = segurança
#   - SD       = system design
#
# Princípio:
#   uma issue NÃO deve misturar frontend + backend + integração.
#
# Uso:
#   gh auth login
#   chmod +x create-emr-backlog-v2.sh
#   ./create-emr-backlog-v2.sh
#
# Variáveis opcionais:
#   REPO=fernandaquerino/emr-despachante
#   OWNER=fernandaquerino
#   PROJECT_TITLE="EMR Despachantes — Backlog v2"
#   PROJECT_NUMBER=12
#   CREATE_PROJECT=true
#
# O script é idempotente por título de issue/label/milestone.
# ============================================================

REPO="fernandaquerino/emr-despachante"
OWNER="fernandaquerino"
PROJECT_ID="10"
PROJECT_TITLE="EMR Despachantes"
PROJECT_NUMBER="11"
CREATE_PROJECT=true

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

ok()   { echo -e "${GREEN}✓${NC} $1"; }
info() { echo -e "${YELLOW}→${NC} $1"; }
fail() { echo -e "${RED}✗${NC} $1"; }

validate_environment() {
  command -v gh >/dev/null 2>&1 || {
    fail "GitHub CLI não encontrado."
    exit 1
  }

  gh auth status >/dev/null 2>&1 || {
    fail "Autentique primeiro com: gh auth login"
    exit 1
  }

  gh repo view "$REPO" >/dev/null 2>&1 || {
    fail "Repositório não encontrado ou sem acesso: $REPO"
    exit 1
  }

  gh auth refresh -s project >/dev/null 2>&1 || true
}

ensure_project() {
  if [ "$CREATE_PROJECT" != "true" ]; then
    info "CREATE_PROJECT=false; issues não serão adicionadas automaticamente a Project."
    return
  fi

  if [ -z "$PROJECT_NUMBER" ]; then
    PROJECT_NUMBER="$(
      PROJECT_TITLE="$PROJECT_TITLE" gh project list \
        --owner "$OWNER" \
        --limit 100 \
        --format json \
        --jq '.projects[] | select(.title == env.PROJECT_TITLE) | .number' \
        2>/dev/null | head -n 1 || true
    )"
  fi

  if [ -z "$PROJECT_NUMBER" ]; then
    info "Criando GitHub Project: $PROJECT_TITLE"
    gh project create --owner "$OWNER" --title "$PROJECT_TITLE" >/dev/null

    PROJECT_NUMBER="$(
      PROJECT_TITLE="$PROJECT_TITLE" gh project list \
        --owner "$OWNER" \
        --limit 100 \
        --format json \
        --jq '.projects[] | select(.title == env.PROJECT_TITLE) | .number' \
        2>/dev/null | head -n 1 || true
    )"
  fi

  if [ -n "$PROJECT_NUMBER" ]; then
    ok "Project #$PROJECT_NUMBER — $PROJECT_TITLE"
  else
    info "Project não foi resolvido; continuando sem item-add."
  fi
}

create_label() {
  local name="$1"
  local color="$2"
  local description="$3"

  if LABEL_NAME="$name" gh label list \
      --repo "$REPO" \
      --limit 500 \
      --json name \
      --jq '.[] | select(.name == env.LABEL_NAME) | .name' \
      2>/dev/null | grep -q .; then
    return
  fi

  gh label create "$name" \
    --repo "$REPO" \
    --color "$color" \
    --description "$description" >/dev/null

  ok "Label: $name"
}

create_milestone() {
  local title="$1"

  if MILESTONE_TITLE="$title" gh api \
      "repos/$REPO/milestones?state=all&per_page=100" \
      --jq '.[] | select(.title == env.MILESTONE_TITLE) | .title' \
      2>/dev/null | grep -q .; then
    return
  fi

  gh api "repos/$REPO/milestones" \
    --method POST \
    -f title="$title" \
    -f state="open" >/dev/null

  ok "Milestone: $title"
}

add_to_project() {
  local url="$1"

  if [ -z "$PROJECT_NUMBER" ]; then
    return
  fi

  gh project item-add "$PROJECT_NUMBER" \
    --owner "$OWNER" \
    --url "$url" >/dev/null 2>&1 || true
}

create_issue() {
  local title="$1"
  local labels="$2"
  local milestone="$3"
  local body
  body="$(cat)"

  local existing_url
  existing_url="$(
    TITLE="$title" gh issue list \
      --repo "$REPO" \
      --state all \
      --limit 1000 \
      --json title,url \
      --jq '.[] | select(.title == env.TITLE) | .url' \
      2>/dev/null | head -n 1 || true
  )"

  if [ -n "$existing_url" ]; then
    info "Já existe: $title"
    add_to_project "$existing_url"
    return
  fi

  local issue_url
  issue_url="$(
    gh issue create \
      --repo "$REPO" \
      --title "$title" \
      --body "$body" \
      --label "$labels" \
      --milestone "$milestone"
  )"

  ok "$title"
  add_to_project "$issue_url"
  sleep 0.15
}

validate_environment
ensure_project

info "Criando labels..."
create_label 'type:product' '5319e7' 'Produto / definição'
create_label 'type:prototype' 'bfd4f2' 'Protótipo / UX'
create_label 'type:screen' '0075ca' 'Tela / frontend'
create_label 'type:capability' 'e4e669' 'Capability de backend'
create_label 'type:integration' 'd93f0b' 'Integração externa/async'
create_label 'type:platform' '006b75' 'Plataforma / foundation'
create_label 'type:quality' '7057ff' 'Qualidade / testes'
create_label 'type:security' 'b60205' 'Segurança'
create_label 'type:architecture' '8250df' 'Arquitetura / system design'
create_label 'type:design-system' 'a371f7' 'Design System'
create_label 'layer:product' 'cfd3d7' 'Layer Product'
create_label 'layer:prototype' 'f9d0c4' 'Layer Prototype'
create_label 'layer:frontend' '0075ca' 'Layer Frontend'
create_label 'layer:backend' 'e4e669' 'Layer Backend'
create_label 'layer:integration' 'd93f0b' 'Layer Integration'
create_label 'layer:platform' '006b75' 'Layer Platform'
create_label 'layer:quality' '7057ff' 'Layer Quality'
create_label 'layer:security' 'b60205' 'Layer Security'
create_label 'layer:architecture' '8250df' 'Layer Architecture'
create_label 'surface:public' 'fbca04' 'Superfície pública'
create_label 'surface:owner' '0e8a16' 'Área do proprietário'
create_label 'surface:partner' '1d76db' 'Portal do parceiro'
create_label 'surface:admin' '5319e7' 'Admin / operação interna'
create_label 'surface:shared' 'cfd3d7' 'Transversal'
create_label 'priority:P0' 'b60205' 'Prioridade P0'
create_label 'priority:P1' 'fbca04' 'Prioridade P1'
create_label 'priority:P2' '0e8a16' 'Prioridade P2'
create_label 'domain:accessibility' 'ededed' 'Domínio accessibility'
create_label 'domain:admin' 'ededed' 'Domínio admin'
create_label 'domain:ai' 'ededed' 'Domínio ai'
create_label 'domain:async' 'ededed' 'Domínio async'
create_label 'domain:audit' 'ededed' 'Domínio audit'
create_label 'domain:auth' 'ededed' 'Domínio auth'
create_label 'domain:cases' 'ededed' 'Domínio cases'
create_label 'domain:catalog' 'ededed' 'Domínio catalog'
create_label 'domain:customers' 'ededed' 'Domínio customers'
create_label 'domain:dashboard' 'ededed' 'Domínio dashboard'
create_label 'domain:database' 'ededed' 'Domínio database'
create_label 'domain:design-system' 'ededed' 'Domínio design-system'
create_label 'domain:devops' 'ededed' 'Domínio devops'
create_label 'domain:devsecops' 'ededed' 'Domínio devsecops'
create_label 'domain:documents' 'ededed' 'Domínio documents'
create_label 'domain:fines' 'ededed' 'Domínio fines'
create_label 'domain:foundation' 'ededed' 'Domínio foundation'
create_label 'domain:government' 'ededed' 'Domínio government'
create_label 'domain:navigation' 'ededed' 'Domínio navigation'
create_label 'domain:notifications' 'ededed' 'Domínio notifications'
create_label 'domain:observability' 'ededed' 'Domínio observability'
create_label 'domain:operations' 'ededed' 'Domínio operations'
create_label 'domain:internal-users' 'ededed' 'Domínio internal-users'
create_label 'domain:orders' 'ededed' 'Domínio orders'
create_label 'domain:owner' 'ededed' 'Domínio owner'
create_label 'domain:partners' 'ededed' 'Domínio partners'
create_label 'domain:payments' 'ededed' 'Domínio payments'
create_label 'domain:performance' 'ededed' 'Domínio performance'
create_label 'domain:public-web' 'ededed' 'Domínio public-web'
create_label 'domain:quality' 'ededed' 'Domínio quality'
create_label 'domain:reconciliation' 'ededed' 'Domínio reconciliation'
create_label 'domain:security' 'ededed' 'Domínio security'
create_label 'domain:service-request' 'ededed' 'Domínio service-request'
create_label 'domain:settings' 'ededed' 'Domínio settings'
create_label 'domain:storybook' 'ededed' 'Domínio storybook'
create_label 'domain:system-design' 'ededed' 'Domínio system-design'
create_label 'domain:testing' 'ededed' 'Domínio testing'
create_label 'domain:vehicles' 'ededed' 'Domínio vehicles'
create_label 'domain:whatsapp' 'ededed' 'Domínio whatsapp'

info "Criando milestones..."
create_milestone 'M0 — Product & Prototype'
create_milestone 'M0.1 — System Design'
create_milestone 'M0.2 — Foundation & Design System'
create_milestone 'M1 — Public & Auth'
create_milestone 'M2 — Owner'
create_milestone 'M3 — Partner'
create_milestone 'M4 — Operations'
create_milestone 'M5 — Admin & Finance'
create_milestone 'M6 — Integrations & Async'
create_milestone 'M7 — Quality, Security & Delivery'
create_milestone 'M8 — EMR Copilot'

info "Criando issues..."

# [PROD-001] Fechar mapa de telas, rotas, papéis e jornadas
create_issue '[PROD-001] Fechar mapa de telas, rotas, papéis e jornadas' 'type:product,layer:product,domain:navigation,priority:P0' 'M0 — Product & Prototype' <<'ISSUE_BODY'
## Objetivo
Transformar o mapa de telas em fonte de verdade para produto, protótipo e implementação.

## Responsabilidade desta issue
- consolidar PUBLIC, OWNER, PARTNER, ADMIN;
- definir rota de cada tela;
- definir quem pode acessar cada rota;
- registrar fluxo de entrada/login/cadastro/convites;
- mapear cada tela para sua issue de frontend;
- registrar telas futuras sem colocá-las no MVP.

## Entregável
- Atualizar `docs/EMR-SCREEN-MAP.md`.
- Manter a matriz `rota → tela → acesso → issue FE → MVP`.
- Alinhar `docs/product/INFORMATION_ARCHITECTURE.md` com o mapa.
- Atualizar o índice de documentação.

## Decisões já esperadas
- cadastro público cria somente OWNER;
- login é único e o backend resolve o contexto;
- PARTNER/ADMIN entram por convite/provisionamento;
- ADMIN entra por provisionamento controlado;
- ServiceRequest e Case são conceitos diferentes.

## Fora de escopo
- implementar código;
- decidir detalhes de multi-tenancy sem System Design;
- implementar billing B2B ainda não definido.

## Definition of Done
- [ ] Nenhuma tela principal está sem rota
- [ ] Nenhuma rota está sem perfil de acesso
- [ ] Cada tela implementável aponta para uma issue FE
- [ ] Fluxos principais estão documentados
- [ ] Open questions estão explícitas
- [ ] `/owner` substitui `/app` como prefixo da área do proprietário
- [ ] Telas futuras estão marcadas como futuro/P1/P2, não como MVP implícito
ISSUE_BODY

# [PT-001] Protótipo — Público e Autenticação
create_issue '[PT-001] Protótipo — Público e Autenticação' 'type:prototype,layer:prototype,surface:public,domain:auth,priority:P0' 'M0 — Product & Prototype' <<'ISSUE_BODY'
## Telas
- `/`
- `/consultar`
- `/consultar/:id`
- `/parceiros`
- `/login`
- `/cadastro`
- `/recuperar-senha`
- `/redefinir-senha/:token`
- `/convite/:token`

## Objetivo
Validar a entrada pública e os fluxos de autenticação antes da implementação.

## Cobrir
- consulta por placa sem login;
- resultado público sem exposição indevida de PII;
- gate de login/cadastro antes de contratar;
- login único;
- cadastro somente OWNER;
- convite/ativação para perfis não públicos;
- loading/error/empty;
- desktop e mobile.

## Fora de escopo
- backend;
- provider real;
- implementação de auth.

## Definition of Done
- [ ] Jornada `Landing → Consulta → Resultado → Entrar/Cadastrar` navegável
- [ ] Jornada de convite navegável
- [ ] Regras de acesso não são contraditórias
ISSUE_BODY

# [PT-002] Protótipo — Área do Proprietário
create_issue '[PT-002] Protótipo — Área do Proprietário' 'type:prototype,layer:prototype,surface:owner,priority:P0' 'M0 — Product & Prototype' <<'ISSUE_BODY'
## Telas
- `/owner`
- `/owner/veiculos`
- `/owner/veiculos/:id`
- detalhe de multa
- `/owner/solicitacoes`
- `/owner/solicitacoes/:id`
- `/owner/documentos`
- `/owner/pagamentos`
- `/owner/pagamentos/:id`
- `/checkout/:id`

## Objetivo
Responder: “o que está acontecendo com meu veículo e preciso fazer alguma coisa?”

## Regras de UX
- sem dashboard analítico;
- prioridade para próxima ação e status intermediários;
- `Payment = PAID` não significa serviço concluído;
- owner nunca vê notas/cases técnicos internos.

## Definition of Done
- [ ] Fluxo completo B2C navegável
- [ ] Empty state de primeiro acesso
- [ ] Pendência que exige ação está evidente
- [ ] Mobile resolvido
ISSUE_BODY

# [PT-003] Protótipo — Portal do Parceiro
create_issue '[PT-003] Protótipo — Portal do Parceiro' 'type:prototype,layer:prototype,surface:partner,priority:P0' 'M0 — Product & Prototype' <<'ISSUE_BODY'
## Telas
- `/partner`
- `/partner/solicitacoes`
- `/partner/solicitacoes/nova`
- `/partner/solicitacoes/:id`
- `/partner/veiculos`
- `/partner/veiculos/:id`
- `/partner/documentos`
- `/partner/equipe`

## Objetivo
Substituir WhatsApp como fila/document store/status system, sem remover o canal de notificação.

## Regras
- PartnerOrganization não é Customer;
- solicitação normal não cria Case;
- dados são isolados por organização;
- documentos/notes internos da operação não vazam.

## Definition of Done
- [ ] Dashboard operacional e não analítico
- [ ] Wizard de nova solicitação navegável
- [ ] Tracking e pendências claros
- [ ] Equipe e convite representados
ISSUE_BODY

# [PT-004] Protótipo — Operação
create_issue '[PT-004] Protótipo — Operação' 'type:prototype,layer:prototype,surface:admin,priority:P0' 'M0 — Product & Prototype' <<'ISSUE_BODY'
## Telas
- `/admin`
- `/admin/solicitacoes`
- `/admin/solicitacoes/:id`
- `/admin/casos`
- `/admin/casos/:id`
- `/admin/clientes`
- `/admin/clientes/:id`
- `/admin/veiculos`
- `/admin/veiculos/:id`
- `/admin/pedidos`
- `/admin/pagamentos`

## Objetivo
Separar trabalho normal de exceções e tornar a próxima ação evidente.

## Definition of Done
- [ ] Solicitações e Cases têm propósitos visuais diferentes
- [ ] B2C e B2B aparecem no contexto correto
- [ ] Fila prioritária é compreensível
- [ ] Notas internas não aparecem em superfícies externas
ISSUE_BODY

# [PT-005] Protótipo — Administração e Financeiro
create_issue '[PT-005] Protótipo — Administração e Financeiro' 'type:prototype,layer:prototype,surface:admin,domain:payments,priority:P0' 'M0 — Product & Prototype' <<'ISSUE_BODY'
## Telas
- `/admin`
- `/admin/financeiro`
- pedidos/pagamentos
- reconciliação
- parceiros
- serviços e preços
- usuários internos
- auditoria
- configurações

## Objetivo
Validar gestão do negócio sem confundir valor processado com receita.

## Regras
- separar amount processed, government amount, service fee, provider fee, discounts/refunds e net revenue quando aplicável;
- preço alterado não reescreve histórico;
- gestão administrativa é diferente de preferências pessoais.

## Definition of Done
- [ ] Financeiro possui drill-down
- [ ] Reconciliação possui caminho de investigação
- [ ] Partner management está navegável
- [ ] Configurações administrativas estão separadas
ISSUE_BODY

# [PT-006] Design QA e handoff do protótipo
create_issue '[PT-006] Design QA e handoff do protótipo' 'type:quality,layer:prototype,domain:design-system,priority:P0' 'M0 — Product & Prototype' <<'ISSUE_BODY'
## Objetivo
Revisar o protótipo inteiro antes do System Design/implementação.

## Checklist
- [ ] Navegação entre todos os perfis
- [ ] Estados loading/empty/error/stale/permission
- [ ] Mobile
- [ ] Contraste/focus
- [ ] Status nunca depende só de cor
- [ ] Componentes repetidos usam o mesmo padrão
- [ ] Nenhuma tela inventa nova linguagem visual sem necessidade
- [ ] Handoff com rotas e screen IDs
ISSUE_BODY

# [SD-001] Requisitos, constraints, escala e decisões abertas
create_issue '[SD-001] Requisitos, constraints, escala e decisões abertas' 'type:architecture,layer:architecture,domain:system-design,priority:P0' 'M0.1 — System Design' <<'ISSUE_BODY'
## Responsabilidade
Definir fatos, hipóteses e perguntas que realmente mudam a arquitetura.

## Cobrir
- B2C + B2B/B2B2C;
- volumes/picos;
- latência/availability esperadas;
- tenancy como pergunta explícita;
- billing B2B como pergunta explícita;
- dependências externas;
- RPO/RTO somente se houver requisito.

## Entregável
`docs/architecture/REQUIREMENTS_AND_SCALE.md`

## Fora de escopo
- escolher serviços AWS por estética;
- inventar números.
ISSUE_BODY

# [SD-002] Domain boundaries, ownership e invariantes
create_issue '[SD-002] Domain boundaries, ownership e invariantes' 'type:architecture,layer:architecture,domain:system-design,priority:P0' 'M0.1 — System Design' <<'ISSUE_BODY'
## Responsabilidade
Definir quem é fonte da verdade para:
- User/Membership;
- PartnerOrganization;
- Vehicle;
- Order;
- Payment;
- ServiceRequest;
- Submission;
- Case;
- Document;
- Notification.

## Invariantes mínimas
- Payment só vira PAID via evento válido do provider;
- Payment PAID não conclui ServiceRequest automaticamente;
- ServiceRequest não cria Case sem exceção;
- preço histórico não é reescrito;
- autorização nunca depende só do frontend.

## Entregável
`docs/architecture/DOMAIN_MODEL.md`
ISSUE_BODY

# [SD-003] Arquitetura de alto nível e boundaries de execução
create_issue '[SD-003] Arquitetura de alto nível e boundaries de execução' 'type:architecture,layer:architecture,domain:system-design,priority:P0' 'M0.1 — System Design' <<'ISSUE_BODY'
## Responsabilidade
Definir C4 C1/C2 e comunicação síncrona/assíncrona.

## Avaliar
- Next.js;
- NestJS modular monolith;
- worker;
- PostgreSQL;
- Redis apenas se justificado;
- queue/DLQ;
- object storage;
- outbox;
- observability;
- AI boundary.

## Entregáveis
- `SYSTEM_DESIGN.md`
- `system-context.md`
- `container-diagram.md`

## Regra
Não introduzir microservices sem necessidade demonstrável.
ISSUE_BODY

# [SD-004] Data model, ownership e constraints
create_issue '[SD-004] Data model, ownership e constraints' 'type:architecture,layer:architecture,domain:database,priority:P0' 'M0.1 — System Design' <<'ISSUE_BODY'
## Responsabilidade
Criar ERD e regras de persistência a partir dos boundaries, não das telas.

## Cobrir
- chaves/relationships;
- PII;
- ownership/organization scope;
- índices derivados de queries reais;
- constraints críticas;
- price snapshots;
- idempotency keys;
- append-only/audit quando aplicável.

## Entregáveis
- `DATA_MODEL.md`
- `diagrams/erd.md`
ISSUE_BODY

# [SD-005] Fluxos críticos e failure modes
create_issue '[SD-005] Fluxos críticos e failure modes' 'type:architecture,layer:architecture,domain:async,priority:P0' 'M0.1 — System Design' <<'ISSUE_BODY'
## Sequence diagrams
- vehicle lookup;
- checkout/payment;
- webhook;
- outbox → queue → worker;
- government submission;
- partner request + notification;
- Case claim concorrente;
- documentos.

## Failure modes
- provider timeout;
- duplicate webhook;
- retry/DLQ;
- WhatsApp outage;
- upload failure;
- double submit;
- stale data.

## Entregáveis
- `CRITICAL_FLOWS.md`
- `FAILURE_MODES.md`
ISSUE_BODY

# [SD-006] Security, LGPD e threat model
create_issue '[SD-006] Security, LGPD e threat model' 'type:security,layer:architecture,domain:security,priority:P0' 'M0.1 — System Design' <<'ISSUE_BODY'
## Responsabilidade
Definir o modelo de segurança antes da implementação.

## Cobrir
- AuthN/AuthZ;
- session strategy;
- RBAC/ABAC;
- OWNER ownership;
- PartnerOrganization isolation;
- IDOR/BOLA;
- PII/minimização;
- documentos;
- webhooks;
- secrets;
- rate limiting;
- audit;
- AI scope.

## Entregável
`SECURITY_ARCHITECTURE.md`
ISSUE_BODY

# [SD-007] Observability, ADRs e baseline arquitetural
create_issue '[SD-007] Observability, ADRs e baseline arquitetural' 'type:architecture,layer:architecture,domain:observability,priority:P1' 'M0.1 — System Design' <<'ISSUE_BODY'
## Responsabilidade
Fechar a baseline antes de desenvolvimento funcional.

## Cobrir
- logs/metrics/traces;
- correlation/trace IDs;
- SLIs/SLOs iniciais;
- alert principles;
- runbook template;
- ADRs apenas para decisões relevantes e difíceis de reverter.

## Definition of Done
- [ ] Baseline aprovada
- [ ] Open questions bloqueadoras explícitas
- [ ] ADRs necessárias criadas
- [ ] Implementação pode começar sem decisões arquiteturais implícitas
ISSUE_BODY

# [FND-001] Workspace, monorepo e estrutura de aplicações
create_issue '[FND-001] Workspace, monorepo e estrutura de aplicações' 'type:platform,layer:platform,domain:foundation,priority:P0' 'M0.2 — Foundation & Design System' <<'ISSUE_BODY'
## Responsabilidade
Criar somente a estrutura base do repositório.

## Escopo
- `apps/web`
- `apps/api`
- `apps/worker`
- `packages/ui`
- `packages/types`
- `packages/config`
- package manager/workspaces
- scripts raiz
- README inicial

## Fora de escopo
- auth;
- banco;
- feature de produto;
- CI.
ISSUE_BODY

# [FND-002] TypeScript strict, ESLint, Prettier e EditorConfig
create_issue '[FND-002] TypeScript strict, ESLint, Prettier e EditorConfig' 'type:platform,layer:platform,domain:quality,priority:P0' 'M0.2 — Foundation & Design System' <<'ISSUE_BODY'
## Responsabilidade
Padronizar qualidade estática do código.

## Escopo
- TypeScript strict;
- configs compartilhadas;
- ESLint;
- Prettier;
- EditorConfig;
- scripts `lint`, `typecheck`, `format:check`;
- zero `@ts-ignore` sem justificativa.

## Fora de escopo
- testes;
- Git hooks;
- CI.
ISSUE_BODY

# [FND-003] Husky, lint-staged e convenções de commit
create_issue '[FND-003] Husky, lint-staged e convenções de commit' 'type:platform,layer:platform,domain:devops,priority:P1' 'M0.2 — Foundation & Design System' <<'ISSUE_BODY'
## Responsabilidade
Criar feedback local rápido sem transformar pre-commit em pipeline completo.

## Escopo
- Husky;
- lint-staged;
- format/lint apenas nos arquivos alterados;
- convenção de commits documentada;
- commitlint somente se adotado.

## Fora de escopo
- testes E2E no pre-commit;
- deploy.
ISSUE_BODY

# [FND-004] CI de Pull Request
create_issue '[FND-004] CI de Pull Request' 'type:platform,layer:platform,domain:devops,priority:P0' 'M0.2 — Foundation & Design System' <<'ISSUE_BODY'
## Responsabilidade
Bloquear regressões básicas em PR.

## Pipeline
- install com lockfile;
- lint;
- typecheck;
- unit tests;
- build;
- cache;
- cancelamento de runs obsoletos.

## Fora de escopo
- deploy;
- E2E completo;
- observability de produção.
ISSUE_BODY

# [FND-005] Docker Compose, PostgreSQL e migrations
create_issue '[FND-005] Docker Compose, PostgreSQL e migrations' 'type:platform,layer:platform,domain:database,priority:P0' 'M0.2 — Foundation & Design System' <<'ISSUE_BODY'
## Responsabilidade
Criar ambiente local persistente e repetível.

## Escopo
- PostgreSQL;
- migrations;
- seed fictício;
- Docker Compose;
- healthcheck;
- comandos reset/migrate/seed.

## Fora de escopo
- modelagem completa de todas as entidades;
- produção;
- backup policy.
ISSUE_BODY

# [FND-006] Configuração de ambiente e secrets
create_issue '[FND-006] Configuração de ambiente e secrets' 'type:security,layer:platform,domain:security,priority:P0' 'M0.2 — Foundation & Design System' <<'ISSUE_BODY'
## Responsabilidade
Padronizar configuração sem vazar segredos.

## Escopo
- `.env.example`;
- validação tipada de env;
- separação web/api/worker;
- nenhum secret em código;
- documentação de rotação;
- configuração por ambiente.

## Fora de escopo
- secrets manager de produção;
- deployment.
ISSUE_BODY

# [DS-001] Tokens, tema e foundations
create_issue '[DS-001] Tokens, tema e foundations' 'type:design-system,layer:frontend,domain:design-system,priority:P0' 'M0.2 — Foundation & Design System' <<'ISSUE_BODY'
## Responsabilidade
Implementar foundations do Design System.

## Escopo
- Navy/Cobalt brand;
- semantic colors;
- typography;
- spacing;
- radius;
- elevation;
- focus;
- breakpoints;
- CSS variables/tokens.

## Regra
Green permanece semântico para success/regular/paid; não é primary brand.
ISSUE_BODY

# [DS-002] Componentes base e domain components
create_issue '[DS-002] Componentes base e domain components' 'type:design-system,layer:frontend,domain:design-system,priority:P0' 'M0.2 — Foundation & Design System' <<'ISSUE_BODY'
## Responsabilidade
Criar somente componentes reutilizáveis comprovadamente necessários.

## Base
Button, Input, Select, Checkbox, Dialog, Drawer, Tabs, Table, Pagination, Badge, Tooltip.

## Domain
StatusBadge, VehicleSummary, MoneyBreakdown, Timeline, StaleDataBanner, EmptyState, ErrorState, LoadingState.

## Regras
- acessibilidade por padrão;
- sem componente genérico prematuro;
- status = texto + ícone + cor.
ISSUE_BODY

# [DS-003] Storybook e documentação visual
create_issue '[DS-003] Storybook e documentação visual' 'type:design-system,layer:frontend,domain:storybook,priority:P0' 'M0.2 — Foundation & Design System' <<'ISSUE_BODY'
## Responsabilidade
Tornar o Design System inspecionável e demonstrável.

## Escopo
- Storybook;
- stories dos componentes base;
- stories dos domain components;
- estados e variantes;
- viewport mobile/desktop;
- accessibility addon quando compatível;
- docs das foundations.

## Fora de escopo
- telas completas do app;
- testes E2E.
ISSUE_BODY

# [FE-SHARED-001] App Shell, roteamento e navegação por contexto
create_issue '[FE-SHARED-001] App Shell, roteamento e navegação por contexto' 'type:screen,layer:frontend,surface:shared,domain:navigation,priority:P0' 'M0.2 — Foundation & Design System' <<'ISSUE_BODY'
## Responsabilidade
Implementar somente a casca autenticada e navegação.

## Contextos
- OWNER
- PARTNER
- ADMIN

## Escopo
- layouts;
- sidebars;
- header;
- user menu;
- breadcrumbs/page header;
- mobile navigation;
- active state;
- placeholders de rota.

## Fora de escopo
- conteúdo funcional das telas;
- autorização de backend;
- busca/notificações funcionais.
ISSUE_BODY

# [FE-PUB-001] Site público — Landing e página para parceiros
create_issue '[FE-PUB-001] Site público — Landing e página para parceiros' 'type:screen,layer:frontend,surface:public,domain:public-web,priority:P0' 'M1 — Public & Auth' <<'ISSUE_BODY'
## Rotas
- `/`
- `/parceiros`

## Responsabilidade
Implementar páginas públicas de apresentação e conversão.

## Escopo
- header/footer;
- hero com entrada de placa;
- serviços;
- como funciona;
- segurança/confiança;
- FAQ resumido;
- CTA Entrar;
- CTA Para empresas;
- SEO/metadata;
- responsividade.

## Fora de escopo
- lookup real;
- auth;
- lead CRM.
ISSUE_BODY

# [FE-PUB-002] Consulta pública de veículo
create_issue '[FE-PUB-002] Consulta pública de veículo' 'type:screen,layer:frontend,surface:public,domain:vehicles,priority:P0' 'M1 — Public & Auth' <<'ISSUE_BODY'
## Rota
`/consultar`

## Responsabilidade
Implementar formulário/estado de consulta por placa.

## Estados
- idle;
- validação;
- loading;
- não encontrado;
- indisponível;
- RENAVAM solicitado quando necessário.

## Dependência
`BE-VEH-001`

## Fora de escopo
- provider governamental;
- cadastro do owner.
ISSUE_BODY

# [FE-PUB-003] Resultado público e seleção de serviços
create_issue '[FE-PUB-003] Resultado público e seleção de serviços' 'type:screen,layer:frontend,surface:public,domain:vehicles,priority:P0' 'M1 — Public & Auth' <<'ISSUE_BODY'
## Rota
`/consultar/:id`

## Responsabilidade
Mostrar somente dados públicos/seguros e permitir escolher o que resolver.

## Escopo
- resumo do veículo;
- pendências;
- última atualização;
- serviços elegíveis;
- breakdown quando disponível;
- CTA `Resolver pendências`;
- gate para login/cadastro.

## Fora de escopo
- PII do proprietário;
- pagamento;
- criação de ServiceRequest.
ISSUE_BODY

# [FE-AUTH-001] Login único
create_issue '[FE-AUTH-001] Login único' 'type:screen,layer:frontend,surface:shared,domain:auth,priority:P0' 'M1 — Public & Auth' <<'ISSUE_BODY'
## Rota
`/login`

## Responsabilidade
Implementar uma única tela de login para todos os papéis.

## Estados
- loading;
- credencial inválida;
- conta suspensa;
- convite não ativado;
- redirect para contexto autorizado.

## Regra
Não existe seletor Cliente/Partner/Admin.
ISSUE_BODY

# [FE-AUTH-002] Cadastro público do OWNER
create_issue '[FE-AUTH-002] Cadastro público do OWNER' 'type:screen,layer:frontend,surface:owner,domain:auth,priority:P0' 'M1 — Public & Auth' <<'ISSUE_BODY'
## Rota
`/cadastro`

## Responsabilidade
Implementar self-signup exclusivamente para OWNER.

## Escopo
- formulário;
- validação;
- termos/consentimento;
- duplicidade amigável;
- success redirect.

## Fora de escopo
- Partner self-signup;
- criação de Partner/Admin.
ISSUE_BODY

# [FE-AUTH-003] Recuperação e redefinição de senha
create_issue '[FE-AUTH-003] Recuperação e redefinição de senha' 'type:screen,layer:frontend,surface:shared,domain:auth,priority:P1' 'M1 — Public & Auth' <<'ISSUE_BODY'
## Rotas
- `/recuperar-senha`
- `/redefinir-senha/:token`

## Responsabilidade
Implementar somente a experiência de recuperação.

## Estados
- solicitado;
- token válido;
- token expirado;
- token já usado;
- senha alterada.
ISSUE_BODY

# [FE-AUTH-004] Convite, ativação e seleção de contexto
create_issue '[FE-AUTH-004] Convite, ativação e seleção de contexto' 'type:screen,layer:frontend,surface:shared,domain:auth,priority:P1' 'M1 — Public & Auth' <<'ISSUE_BODY'
## Rotas
- `/convite/:token`
- `/selecionar-contexto` quando necessário

## Responsabilidade
Ativar acesso de PARTNER/ADMIN e permitir escolher contexto somente quando o usuário possuir mais de um.

## Fora de escopo
- definir permissões;
- criar organização;
- enviar convite.
ISSUE_BODY

# [BE-IAM-001] Authentication, session e authorization baseline
create_issue '[BE-IAM-001] Authentication, session e authorization baseline' 'type:capability,layer:backend,surface:shared,domain:auth,priority:P0' 'M1 — Public & Auth' <<'ISSUE_BODY'
## Responsabilidade
Ser fonte da verdade para autenticação e contexto autorizado.

## Escopo
- login/logout;
- sessão/cookie;
- guards;
- membership/context resolution;
- account status;
- autorização server-side.

## Fora de escopo
- telas;
- cadastro;
- convite;
- regras específicas de domínio.
ISSUE_BODY

# [BE-IAM-002] Cadastro OWNER, password reset e invitations
create_issue '[BE-IAM-002] Cadastro OWNER, password reset e invitations' 'type:capability,layer:backend,surface:shared,domain:auth,priority:P0' 'M1 — Public & Auth' <<'ISSUE_BODY'
## Responsabilidade
Implementar lifecycle de identidade que não pertence ao login.

## Escopo
- register OWNER;
- normalização;
- hash;
- reset token one-time;
- invitation token one-time;
- expiração;
- ativação;
- revogação.

## Fora de escopo
- PartnerOrganization;
- UI.
ISSUE_BODY

# [BE-VEH-001] Vehicle lookup público e sanitização de resposta
create_issue '[BE-VEH-001] Vehicle lookup público e sanitização de resposta' 'type:capability,layer:backend,surface:public,domain:vehicles,priority:P0' 'M1 — Public & Auth' <<'ISSUE_BODY'
## Responsabilidade
Expor lookup público seguro sem vazar ownership/PII.

## Escopo
- normalizar placa;
- consultar adapter;
- cache/stale timestamp;
- mapear resposta pública;
- rate limiting específico;
- não retornar CPF/RENAVAM completo/owner.

## Dependência
`INT-GOV-001`
ISSUE_BODY

# [FE-OWN-001] Minha Área do Proprietário
create_issue '[FE-OWN-001] Minha Área do Proprietário' 'type:screen,layer:frontend,surface:owner,domain:dashboard,priority:P0' 'M2 — Owner' <<'ISSUE_BODY'
## Rota
`/owner`

## Responsabilidade
Mostrar o que está acontecendo e o que exige ação.

## Escopo
- pendências do owner;
- veículos;
- solicitações recentes;
- últimas atualizações;
- empty first access;
- CTA consultar veículo.

## Fora de escopo
- gráficos;
- regras de backend.
ISSUE_BODY

# [FE-OWN-002] Veículos do Proprietário
create_issue '[FE-OWN-002] Veículos do Proprietário' 'type:screen,layer:frontend,surface:owner,domain:vehicles,priority:P0' 'M2 — Owner' <<'ISSUE_BODY'
## Rotas
- `/owner/veiculos`
- `/owner/veiculos/novo`
- `/owner/veiculos/:id`

## Responsabilidade
Implementar lista, inclusão e detalhe de veículo do owner.

## Escopo
- situação geral;
- multas/licenciamento/IPVA;
- stale timestamp;
- serviços em andamento;
- documentos/histórico resumidos.

## Dependência
`BE-OWN-001`
ISSUE_BODY

# [FE-OWN-003] Detalhe da multa do Proprietário
create_issue '[FE-OWN-003] Detalhe da multa do Proprietário' 'type:screen,layer:frontend,surface:owner,domain:fines,priority:P0' 'M2 — Owner' <<'ISSUE_BODY'
## Rota
`/owner/veiculos/:vehicleId/multas/:fineId`

## Responsabilidade
Explicar a multa e permitir a próxima ação compatível com seu estado.

## Estados
- pendente;
- pagamento em andamento;
- pagamento confirmado/processando baixa;
- concluída.

## Regra
Nunca mostrar “Paga” antes da confirmação válida do provider.
ISSUE_BODY

# [FE-OWN-004] Solicitações do Proprietário
create_issue '[FE-OWN-004] Solicitações do Proprietário' 'type:screen,layer:frontend,surface:owner,domain:service-request,priority:P0' 'M2 — Owner' <<'ISSUE_BODY'
## Rotas
- `/owner/solicitacoes`
- `/owner/solicitacoes/:id`

## Responsabilidade
Implementar lista e acompanhamento detalhado de ServiceRequests.

## Escopo
- status;
- timeline;
- próxima etapa;
- ação necessária;
- documentos;
- pagamento relacionado.

## Regra
Case técnico/interno não aparece para OWNER.
ISSUE_BODY

# [FE-OWN-005] Documentos e pendências do Proprietário
create_issue '[FE-OWN-005] Documentos e pendências do Proprietário' 'type:screen,layer:frontend,surface:owner,domain:documents,priority:P1' 'M2 — Owner' <<'ISSUE_BODY'
## Rota
`/owner/documentos`

## Responsabilidade
Mostrar documentos por veículo/solicitação e permitir resolver pendências.

## Estados
- required;
- uploading;
- received;
- rejected;
- replace requested;
- download authorized.
ISSUE_BODY

# [FE-OWN-006] Pagamentos e comprovantes do Proprietário
create_issue '[FE-OWN-006] Pagamentos e comprovantes do Proprietário' 'type:screen,layer:frontend,surface:owner,domain:payments,priority:P0' 'M2 — Owner' <<'ISSUE_BODY'
## Rotas
- `/owner/pagamentos`
- `/owner/pagamentos/:id`

## Responsabilidade
Implementar leitura financeira do owner.

## Escopo
- lista;
- detalhe;
- breakdown;
- status;
- confirmação;
- comprovante;
- separação visual entre pagamento e regularização.

## Fora de escopo
- reconciliação interna;
- provider.
ISSUE_BODY

# [FE-OWN-007] Checkout do Proprietário
create_issue '[FE-OWN-007] Checkout do Proprietário' 'type:screen,layer:frontend,surface:owner,domain:payments,priority:P0' 'M2 — Owner' <<'ISSUE_BODY'
## Rota
`/checkout/:id`

## Responsabilidade
Implementar somente a experiência de checkout.

## Estados
- resumo;
- loading;
- pending;
- provider error;
- expired;
- payment already in progress;
- redirect/processing.

## Regra
Success de checkout não significa PAID.
ISSUE_BODY

# [BE-OWN-001] Owner read model e ownership scope
create_issue '[BE-OWN-001] Owner read model e ownership scope' 'type:capability,layer:backend,surface:owner,domain:owner,priority:P0' 'M2 — Owner' <<'ISSUE_BODY'
## Responsabilidade
Fornecer dados autorizados das telas OWNER.

## Escopo
- dashboard/home;
- veículos;
- fines/licensing summary;
- solicitações;
- documentos;
- pagamentos;
- timeline sanitizada;
- ownership checks.

## Segurança
Testar cross-owner IDOR/BOLA.

## Fora de escopo
- mutações financeiras;
- provider externo.
ISSUE_BODY

# [BE-SRV-001] ServiceRequest lifecycle do B2C
create_issue '[BE-SRV-001] ServiceRequest lifecycle do B2C' 'type:capability,layer:backend,surface:owner,domain:service-request,priority:P0' 'M2 — Owner' <<'ISSUE_BODY'
## Responsabilidade
Criar e acompanhar trabalho normal do owner.

## Escopo
- create;
- source `PUBLIC_WEB`;
- status transitions;
- timeline;
- next action;
- cancel quando permitido;
- vínculo com vehicle/order/payment.

## Regra
Criar ServiceRequest não cria Case automaticamente.
ISSUE_BODY

# [BE-PAY-001] Order/Payment core e invariantes financeiras
create_issue '[BE-PAY-001] Order/Payment core e invariantes financeiras' 'type:capability,layer:backend,surface:shared,domain:payments,priority:P0' 'M2 — Owner' <<'ISSUE_BODY'
## Responsabilidade
Ser fonte da verdade comercial/financeira.

## Escopo
- Order;
- Payment PENDING;
- duplicate protection;
- breakdown snapshot;
- status transitions;
- leitura owner-safe.

## Regra
Somente evento válido do provider confirma PAID.

## Dependências
- `INT-PAY-001`
- `INT-PAY-002`
ISSUE_BODY

# [FE-PRT-001] Dashboard do Parceiro
create_issue '[FE-PRT-001] Dashboard do Parceiro' 'type:screen,layer:frontend,surface:partner,domain:dashboard,priority:P0' 'M3 — Partner' <<'ISSUE_BODY'
## Rota
`/partner`

## Responsabilidade
Mostrar o que está acontecendo com as solicitações da organização e se existe ação pendente.

## Escopo
- em andamento;
- aguardando parceiro;
- concluídas recentes;
- pendências;
- solicitações recentes;
- CTA `Nova solicitação`.

## Regra
Sem gráficos decorativos.
ISSUE_BODY

# [FE-PRT-002] Solicitações do Parceiro
create_issue '[FE-PRT-002] Solicitações do Parceiro' 'type:screen,layer:frontend,surface:partner,domain:service-request,priority:P0' 'M3 — Partner' <<'ISSUE_BODY'
## Rotas
- `/partner/solicitacoes`
- `/partner/solicitacoes/:id`

## Responsabilidade
Implementar lista e detalhe partner-safe.

## Escopo
- busca/filtros;
- veículo;
- serviço;
- solicitante;
- status;
- timeline;
- documentos;
- pending action.

## Regra
Sem notas internas, stack trace ou dados de outra organização.
ISSUE_BODY

# [FE-PRT-003] Nova solicitação B2B
create_issue '[FE-PRT-003] Nova solicitação B2B' 'type:screen,layer:frontend,surface:partner,domain:service-request,priority:P0' 'M3 — Partner' <<'ISSUE_BODY'
## Rota
`/partner/solicitacoes/nova`

## Wizard
1. Veículo
2. Serviço
3. Documentos
4. Observações
5. Revisão
6. Enviar

## Responsabilidade
Implementar somente o fluxo frontend e validação de UX.

## Fora de escopo
- regra de domínio;
- WhatsApp;
- storage.
ISSUE_BODY

# [FE-PRT-004] Veículos do Parceiro
create_issue '[FE-PRT-004] Veículos do Parceiro' 'type:screen,layer:frontend,surface:partner,domain:vehicles,priority:P1' 'M3 — Partner' <<'ISSUE_BODY'
## Rotas
- `/partner/veiculos`
- `/partner/veiculos/:id`

## Responsabilidade
Mostrar veículos e histórico autorizado no contexto da PartnerOrganization.

## Regra
A mesma placa em outro contexto não pode vazar dados.
ISSUE_BODY

# [FE-PRT-005] Documentos e pendências do Parceiro
create_issue '[FE-PRT-005] Documentos e pendências do Parceiro' 'type:screen,layer:frontend,surface:partner,domain:documents,priority:P0' 'M3 — Partner' <<'ISSUE_BODY'
## Rota
`/partner/documentos`

## Responsabilidade
Consolidar documentos faltantes/enviados e ações de complemento.

## Escopo
- filtro por veículo/request;
- upload;
- replace;
- rejected reason amigável;
- status do upload;
- deep link para solicitação.
ISSUE_BODY

# [FE-PRT-006] Equipe do Parceiro
create_issue '[FE-PRT-006] Equipe do Parceiro' 'type:screen,layer:frontend,surface:partner,domain:partners,priority:P1' 'M3 — Partner' <<'ISSUE_BODY'
## Rota
`/partner/equipe`

## Responsabilidade
Implementar gestão visual da equipe autorizada.

## Escopo
- membros;
- roles;
- status;
- convidar;
- reenviar convite;
- suspender/remover quando permitido.

## Fora de escopo
- authorization rules;
- envio de e-mail real.
ISSUE_BODY

# [BE-PRT-001] PartnerOrganization, memberships e authorization scope
create_issue '[BE-PRT-001] PartnerOrganization, memberships e authorization scope' 'type:capability,layer:backend,surface:partner,domain:partners,priority:P0' 'M3 — Partner' <<'ISSUE_BODY'
## Responsabilidade
Ser fonte da verdade para organização e acesso B2B.

## Escopo
- PartnerOrganization;
- membership;
- status;
- roles mínimos;
- scoped queries;
- revoked membership;
- invitation linkage.

## Segurança
Partner A nunca acessa Partner B.
ISSUE_BODY

# [BE-PRT-002] Intake e tracking de ServiceRequests B2B
create_issue '[BE-PRT-002] Intake e tracking de ServiceRequests B2B' 'type:capability,layer:backend,surface:partner,domain:service-request,priority:P0' 'M3 — Partner' <<'ISSUE_BODY'
## Responsabilidade
Criar/listar/detalhar solicitações da organização.

## Escopo
- source `PARTNER_PORTAL`;
- create idempotente;
- organization/requester context;
- timeline partner-safe;
- status;
- pending action;
- vínculo com documentos.

## Fora de escopo
- WhatsApp provider;
- Case lifecycle.
ISSUE_BODY

# [BE-DOC-001] Documentos, pendências e autorização de arquivo
create_issue '[BE-DOC-001] Documentos, pendências e autorização de arquivo' 'type:capability,layer:backend,surface:shared,domain:documents,priority:P0' 'M3 — Partner' <<'ISSUE_BODY'
## Responsabilidade
Modelar documento e pendência sem acoplar ao storage provider.

## Escopo
- metadata;
- required/missing/received/rejected;
- ownership/scope;
- upload intent;
- download authorization;
- audit events;
- MIME/size policy.

## Dependência
`INT-DOC-001`
ISSUE_BODY

# [FE-OPS-001] Dashboard Operacional
create_issue '[FE-OPS-001] Dashboard Operacional' 'type:screen,layer:frontend,surface:admin,domain:dashboard,priority:P0' 'M4 — Operations' <<'ISSUE_BODY'
## Rota
`/admin`

## Responsabilidade
Implementar a visão do trabalho que precisa ser resolvido agora.

## Escopo
- solicitações;
- Cases críticos;
- não atribuídos;
- aguardando cliente/parceiro/órgão;
- itens antigos;
- partial failure/stale.
ISSUE_BODY

# [FE-OPS-002] Solicitações da Operação
create_issue '[FE-OPS-002] Solicitações da Operação' 'type:screen,layer:frontend,surface:admin,domain:service-request,priority:P0' 'M4 — Operations' <<'ISSUE_BODY'
## Rotas
- `/admin/solicitacoes`
- `/admin/solicitacoes/:id`

## Responsabilidade
Implementar lista e detalhe do trabalho normal.

## Escopo
- source B2C/B2B/manual;
- PartnerOrganization quando existir;
- cliente/veículo;
- serviço;
- processamento;
- docs;
- timeline;
- Case relacionado somente quando existir.
ISSUE_BODY

# [FE-OPS-003] Cases da Operação
create_issue '[FE-OPS-003] Cases da Operação' 'type:screen,layer:frontend,surface:admin,domain:cases,priority:P0' 'M4 — Operations' <<'ISSUE_BODY'
## Rotas
- `/admin/casos`
- `/admin/casos/:id`

## Responsabilidade
Implementar fila de exceções e detalhe para resolução.

## Escopo
- filtros/prioridade/age;
- claim;
- assignee;
- motivo;
- contexto;
- notas internas;
- timeline;
- ações permitidas.
ISSUE_BODY

# [FE-OPS-004] Clientes da Operação
create_issue '[FE-OPS-004] Clientes da Operação' 'type:screen,layer:frontend,surface:admin,domain:customers,priority:P0' 'M4 — Operations' <<'ISSUE_BODY'
## Rotas
- `/admin/clientes`
- `/admin/clientes/:id`

## Responsabilidade
Implementar lista e visão 360 operacional do cliente.

## Tabs do detalhe
Visão geral, Veículos, Solicitações/Pedidos, Pagamentos, Cases, Documentos, Histórico, Notas.
ISSUE_BODY

# [FE-OPS-005] Veículos da Operação
create_issue '[FE-OPS-005] Veículos da Operação' 'type:screen,layer:frontend,surface:admin,domain:vehicles,priority:P0' 'M4 — Operations' <<'ISSUE_BODY'
## Rotas
- `/admin/veiculos`
- `/admin/veiculos/:id`

## Responsabilidade
Implementar busca/lista e detalhe operacional.

## Escopo
situação, stale, multas, licenciamento, solicitações, pagamentos, documentos, Cases e histórico.
ISSUE_BODY

# [FE-OPS-006] Pedidos da Operação
create_issue '[FE-OPS-006] Pedidos da Operação' 'type:screen,layer:frontend,surface:admin,domain:orders,priority:P1' 'M4 — Operations' <<'ISSUE_BODY'
## Rotas
- `/admin/pedidos`
- `/admin/pedidos/:id`

## Responsabilidade
Implementar leitura comercial do pedido.

## Regra
Order é transação comercial; não substituir ServiceRequest.
ISSUE_BODY

# [FE-OPS-007] Pagamentos da Operação
create_issue '[FE-OPS-007] Pagamentos da Operação' 'type:screen,layer:frontend,surface:admin,domain:payments,priority:P1' 'M4 — Operations' <<'ISSUE_BODY'
## Rotas
- `/admin/pagamentos`
- `/admin/pagamentos/:id`

## Responsabilidade
Implementar leitura operacional do Payment.

## Escopo
local status, provider status, amount, timestamps, order/service request, divergence/case link quando houver.
ISSUE_BODY

# [BE-OPS-001] Read models da Operação
create_issue '[BE-OPS-001] Read models da Operação' 'type:capability,layer:backend,surface:admin,domain:operations,priority:P0' 'M4 — Operations' <<'ISSUE_BODY'
## Responsabilidade
Alimentar dashboard/listas sem N+1 e com scope correto.

## Escopo
- dashboard;
- solicitacoes;
- clientes;
- veículos;
- pedidos;
- pagamentos;
- filtros/paginação;
- read models agregados onde necessário.

## Fora de escopo
- Case mutations;
- provider integrations.
ISSUE_BODY

# [BE-CASE-001] Case lifecycle, claim concorrente e notas
create_issue '[BE-CASE-001] Case lifecycle, claim concorrente e notas' 'type:capability,layer:backend,surface:admin,domain:cases,priority:P0' 'M4 — Operations' <<'ISSUE_BODY'
## Responsabilidade
Ser fonte da verdade para exceções operacionais.

## Escopo
- criação por regra/exceção;
- list/detail;
- claim atômico;
- assignee;
- state transitions;
- notes;
- timeline;
- links para entidades relacionadas.

## Regra
Resolver Case não implica concluir ServiceRequest.
ISSUE_BODY

# [FE-ADM-001] Dashboard Administrativo
create_issue '[FE-ADM-001] Dashboard Administrativo' 'type:screen,layer:frontend,surface:admin,domain:dashboard,priority:P0' 'M5 — Admin & Finance' <<'ISSUE_BODY'
## Rota
`/admin`

## Responsabilidade
Mostrar saúde operacional/financeira do negócio e gargalos.

## Regra
Diferente do dashboard da Operação; não virar parede de KPIs decorativos.
ISSUE_BODY

# [FE-ADM-002] Visão Financeira
create_issue '[FE-ADM-002] Visão Financeira' 'type:screen,layer:frontend,surface:admin,domain:payments,priority:P0' 'M5 — Admin & Finance' <<'ISSUE_BODY'
## Rota
`/admin/financeiro`

## Responsabilidade
Implementar visão financeira consolidada.

## Separar
amount processed, government amount, service fee, provider fee, discounts/refunds e net revenue quando aplicável.
ISSUE_BODY

# [FE-ADM-003] Pedidos e Pagamentos — Admin
create_issue '[FE-ADM-003] Pedidos e Pagamentos — Admin' 'type:screen,layer:frontend,surface:admin,domain:payments,priority:P0' 'M5 — Admin & Finance' <<'ISSUE_BODY'
## Rotas
- `/admin/financeiro/pedidos`
- `/admin/financeiro/pedidos/:id`
- `/admin/financeiro/pagamentos`
- `/admin/financeiro/pagamentos/:id`

## Responsabilidade
Implementar listas/detalhes financeiros com escopo Admin.

## Fora de escopo
- reconciliação;
- B2B invoices.
ISSUE_BODY

# [FE-ADM-004] Reconciliação Financeira
create_issue '[FE-ADM-004] Reconciliação Financeira' 'type:screen,layer:frontend,surface:admin,domain:reconciliation,priority:P0' 'M5 — Admin & Finance' <<'ISSUE_BODY'
## Rota
`/admin/financeiro/reconciliacao`

## Responsabilidade
Implementar fila e investigação de divergências.

## Escopo
- local x provider;
- eventos;
- age;
- filtros;
- detalhe em drawer/página;
- abrir/ligar Case.

## Regra
Não corrigir status automaticamente só por interação da UI.
ISSUE_BODY

# [FE-ADM-005] Gestão de Parceiros
create_issue '[FE-ADM-005] Gestão de Parceiros' 'type:screen,layer:frontend,surface:admin,domain:partners,priority:P0' 'M5 — Admin & Finance' <<'ISSUE_BODY'
## Rotas
- `/admin/parceiros`
- `/admin/parceiros/:id`

## Responsabilidade
Implementar lista, criação e detalhe da PartnerOrganization.

## Detalhe
usuários, solicitações, volume, pendências, serviços habilitados, preços, notificações, auditoria.

## Fora de escopo
billing B2B final ainda não decidido.
ISSUE_BODY

# [FE-ADM-006] Serviços e Preços
create_issue '[FE-ADM-006] Serviços e Preços' 'type:screen,layer:frontend,surface:admin,domain:catalog,priority:P1' 'M5 — Admin & Finance' <<'ISSUE_BODY'
## Rotas
- `/admin/servicos`
- detalhe/edição via página ou drawer

## Responsabilidade
Implementar gestão visual do catálogo e preço padrão.

## Regra
Alterar preço não reescreve histórico.
ISSUE_BODY

# [FE-ADM-007] Gestão de usuários internos
create_issue '[FE-ADM-007] Gestão de usuários internos' 'type:screen,layer:frontend,surface:admin,domain:internal-users,priority:P1' 'M5 — Admin & Finance' <<'ISSUE_BODY'
## Rotas
- `/admin/usuarios`
- `/admin/usuarios/:id`

## Responsabilidade
Implementar lista, convite, detalhe, suspensão e reativação.
ISSUE_BODY

# [FE-ADM-008] Auditoria
create_issue '[FE-ADM-008] Auditoria' 'type:screen,layer:frontend,surface:admin,domain:audit,priority:P1' 'M5 — Admin & Finance' <<'ISSUE_BODY'
## Rota
`/admin/auditoria`

## Responsabilidade
Implementar consulta append-only do audit trail.

## Escopo
ator, ação, recurso, data, filtros, contexto seguro.

## Regra
Audit log não possui editar/excluir.
ISSUE_BODY

# [FE-ADM-009] Configurações Administrativas
create_issue '[FE-ADM-009] Configurações Administrativas' 'type:screen,layer:frontend,surface:admin,domain:settings,priority:P1' 'M5 — Admin & Finance' <<'ISSUE_BODY'
## Rota
`/admin/configuracoes`

## Responsabilidade
Implementar configurações da empresa/tenant, separadas de preferências pessoais.

## Seções candidatas
dados do despachante, notificações, defaults operacionais, integrações exibíveis e segurança.
ISSUE_BODY

# [FE-SHARED-002] Minha conta e configurações pessoais
create_issue '[FE-SHARED-002] Minha conta e configurações pessoais' 'type:screen,layer:frontend,surface:shared,domain:settings,priority:P1' 'M5 — Admin & Finance' <<'ISSUE_BODY'
## Rotas
- `/conta`
- `/configuracoes`

## Responsabilidade
Implementar dados do usuário e preferências pessoais para todos os contextos.

## Escopo
perfil, role/contexto informativo, senha, sessões quando aplicável, preferências de notificação.

## Fora de escopo
configurações administrativas da empresa.
ISSUE_BODY

# [FE-SHARED-003] Busca global e Central de Notificações
create_issue '[FE-SHARED-003] Busca global e Central de Notificações' 'type:screen,layer:frontend,surface:shared,domain:navigation,priority:P1' 'M5 — Admin & Finance' <<'ISSUE_BODY'
## Responsabilidade
Implementar overlays transversais sem virar páginas principais.

## Busca
cliente, placa, ServiceRequest, Case, Order e Payment conforme autorização.

## Notificações
não lidas, recentes, deep link, marcar como lida, empty/error.

## Fora de escopo
mecanismo de envio;
WhatsApp.
ISSUE_BODY

# [BE-ADM-001] Admin dashboard e financial read models
create_issue '[BE-ADM-001] Admin dashboard e financial read models' 'type:capability,layer:backend,surface:admin,domain:admin,priority:P0' 'M5 — Admin & Finance' <<'ISSUE_BODY'
## Responsabilidade
Fornecer agregações administrativas e financeiras sem cálculo crítico no frontend.

## Escopo
dashboard, finance overview, revenue breakdown, volume, gargalos, period filters.

## Regra
amount processed não é revenue.
ISSUE_BODY

# [BE-REC-001] Reconciliação financeira
create_issue '[BE-REC-001] Reconciliação financeira' 'type:capability,layer:backend,surface:admin,domain:reconciliation,priority:P0' 'M5 — Admin & Finance' <<'ISSUE_BODY'
## Responsabilidade
Detectar/consultar divergências entre estado local e provider.

## Escopo
reconciliation query, divergence detail, events, resolution workflow controlado, Case linkage.

## Fora de escopo
provider webhook;
UI.
ISSUE_BODY

# [BE-ADM-002] Gestão administrativa de parceiros, catálogo e usuários internos
create_issue '[BE-ADM-002] Gestão administrativa de parceiros, catálogo e usuários internos' 'type:capability,layer:backend,surface:admin,domain:admin,priority:P1' 'M5 — Admin & Finance' <<'ISSUE_BODY'
## Responsabilidade
Implementar mutations administrativas não financeiras.

## Escopo
- PartnerOrganization create/suspend/reactivate;
- partner users;
- catalog enable/disable;
- price snapshots;
- admin provisioning/suspend/reactivate;
- admin settings autorizadas.

## Fora de escopo
- billing B2B final;
- audit storage.
ISSUE_BODY

# [BE-AUD-001] Audit trail imutável
create_issue '[BE-AUD-001] Audit trail imutável' 'type:capability,layer:backend,surface:admin,domain:audit,priority:P1' 'M5 — Admin & Finance' <<'ISSUE_BODY'
## Responsabilidade
Registrar ações relevantes de segurança/negócio separadas de application logs.

## Escopo
actor, action, resource, scope/context, timestamp, safe metadata.

## Regra
Sem edição/exclusão via produto.
ISSUE_BODY

# [INT-GOV-001] Government/Detran adapter e mock controlado
create_issue '[INT-GOV-001] Government/Detran adapter e mock controlado' 'type:integration,layer:integration,domain:government,priority:P0' 'M6 — Integrations & Async' <<'ISSUE_BODY'
## Responsabilidade
Isolar dependência governamental atrás de uma porta estável.

## Escopo
- contract;
- mock determinístico;
- lookup;
- submission;
- latency/timeout/failure simulados;
- mapping para domínio.

## Fora de escopo
- UI;
- regra financeira;
- retries da fila.
ISSUE_BODY

# [INT-PAY-001] Payment Provider adapter e sandbox
create_issue '[INT-PAY-001] Payment Provider adapter e sandbox' 'type:integration,layer:integration,domain:payments,priority:P0' 'M6 — Integrations & Async' <<'ISSUE_BODY'
## Responsabilidade
Encapsular criação/consulta de checkout no provider.

## Escopo
- interface;
- sandbox/fake;
- create checkout;
- provider refs;
- errors/timeouts;
- contract tests.

## Regra
Resposta de checkout não confirma PAID.
ISSUE_BODY

# [INT-PAY-002] Webhook assinado, idempotente e out-of-order aware
create_issue '[INT-PAY-002] Webhook assinado, idempotente e out-of-order aware' 'type:integration,layer:integration,domain:payments,priority:P0' 'M6 — Integrations & Async' <<'ISSUE_BODY'
## Responsabilidade
Processar eventos do provider com segurança.

## Escopo
- assinatura/HMAC;
- raw body quando necessário;
- provider event ID unique;
- replay idempotente;
- event ordering awareness;
- transação com mudança de estado/outbox quando aplicável.

## Testes
assinatura inválida, duplicata, replay e ordem inesperada.
ISSUE_BODY

# [PLAT-ASYNC-001] Transactional Outbox, queue, worker e DLQ
create_issue '[PLAT-ASYNC-001] Transactional Outbox, queue, worker e DLQ' 'type:platform,layer:platform,domain:async,priority:P0' 'M6 — Integrations & Async' <<'ISSUE_BODY'
## Responsabilidade
Criar infraestrutura assíncrona comum sem acoplar domínio ao broker.

## Escopo
- outbox persistida;
- publisher;
- queue abstraction;
- consumer idempotente;
- retry/backoff;
- DLQ;
- correlation propagation.

## Fora de escopo
- lógica específica do WhatsApp/provider.
ISSUE_BODY

# [INT-DOC-001] Object storage privado e URLs temporárias
create_issue '[INT-DOC-001] Object storage privado e URLs temporárias' 'type:integration,layer:integration,domain:documents,priority:P0' 'M6 — Integrations & Async' <<'ISSUE_BODY'
## Responsabilidade
Integrar storage mantendo autorização na API.

## Escopo
- private bucket/container;
- upload/download;
- presigned URLs curtas;
- object key não previsível;
- content type/size;
- lifecycle hooks.

## Regra
Signed URL não substitui authorization check.
ISSUE_BODY

# [INT-NOT-001] Notification engine, outbox consumer e delivery status
create_issue '[INT-NOT-001] Notification engine, outbox consumer e delivery status' 'type:integration,layer:integration,domain:notifications,priority:P1' 'M6 — Integrations & Async' <<'ISSUE_BODY'
## Responsabilidade
Transformar eventos de domínio em notificações deduplicadas.

## Escopo
- channels abstraction;
- recipient rules;
- dedup;
- status sent/delivered/read/failed;
- retries;
- in-app notifications.

## Fora de escopo
- UI da central;
- WhatsApp provider específico.
ISSUE_BODY

# [INT-WA-001] WhatsApp outbound para solicitações B2B
create_issue '[INT-WA-001] WhatsApp outbound para solicitações B2B' 'type:integration,layer:integration,surface:partner,domain:whatsapp,priority:P1' 'M6 — Integrations & Async' <<'ISSUE_BODY'
## Responsabilidade
Implementar WhatsApp somente como canal assíncrono de notificação no MVP.

## Regras
- falha de WhatsApp não desfaz ServiceRequest;
- não enviar documentos/PII sensível;
- deep link exige auth;
- templates/provider isolados;
- delivery callbacks observáveis.

## Fora de escopo
WhatsApp inbound/LLM criando solicitação.
ISSUE_BODY

# [QA-001] Estratégia e baseline de testes
create_issue '[QA-001] Estratégia e baseline de testes' 'type:quality,layer:quality,domain:testing,priority:P0' 'M7 — Quality, Security & Delivery' <<'ISSUE_BODY'
## Responsabilidade
Definir pirâmide/scope e tooling sem duplicar teste em todas as camadas.

## Escopo
- unit;
- component;
- API/integration;
- test data/factories;
- coverage útil;
- comandos locais/CI;
- convenções.

## Fora de escopo
E2E completo.
ISSUE_BODY

# [QA-002] E2E dos fluxos críticos
create_issue '[QA-002] E2E dos fluxos críticos' 'type:quality,layer:quality,domain:testing,priority:P0' 'M7 — Quality, Security & Delivery' <<'ISSUE_BODY'
## Fluxos
- Landing → consulta → cadastro/login;
- Owner → checkout → processing;
- Partner → nova solicitação;
- Operator → solicitação → Case;
- Admin → reconciliação.

## Regras
Testes estáveis, dados isolados e sem depender de serviços reais.
ISSUE_BODY

# [QA-003] Acessibilidade end-to-end
create_issue '[QA-003] Acessibilidade end-to-end' 'type:quality,layer:quality,domain:accessibility,priority:P1' 'M7 — Quality, Security & Delivery' <<'ISSUE_BODY'
## Responsabilidade
Validar WCAG baseline no produto real.

## Cobrir
landmarks, heading order, keyboard, focus, dialogs/drawers, forms, contrast, status não dependente de cor, reduced motion e mobile.
ISSUE_BODY

# [QA-004] Performance, Core Web Vitals e regressões
create_issue '[QA-004] Performance, Core Web Vitals e regressões' 'type:quality,layer:quality,domain:performance,priority:P1' 'M7 — Quality, Security & Delivery' <<'ISSUE_BODY'
## Responsabilidade
Medir e proteger performance real.

## Cobrir
bundle, waterfalls, queries, N+1, images/fonts, LCP/INP/CLS, Lighthouse no público, budgets e regressões.
ISSUE_BODY

# [SEC-001] Authorization test suite — IDOR/BOLA e isolamento
create_issue '[SEC-001] Authorization test suite — IDOR/BOLA e isolamento' 'type:security,layer:security,domain:security,priority:P0' 'M7 — Quality, Security & Delivery' <<'ISSUE_BODY'
## Responsabilidade
Provar que autorização funciona independentemente da UI.

## Cenários
- Owner A → recurso Owner B;
- Partner A → Partner B;
- Operator → Admin route/action;
- revoked membership;
- guessed IDs/deep links;
- documentos;
- AI tools quando existirem.
ISSUE_BODY

# [SEC-002] Hardening da aplicação
create_issue '[SEC-002] Hardening da aplicação' 'type:security,layer:security,domain:security,priority:P0' 'M7 — Quality, Security & Delivery' <<'ISSUE_BODY'
## Escopo
- security headers;
- CSRF strategy quando aplicável;
- rate limiting;
- brute force protection;
- upload validation;
- PII redaction;
- error sanitization;
- secure cookies;
- dependency boundaries.

## Fora de escopo
Threat model — definido em SD-006.
ISSUE_BODY

# [SEC-003] Secret scanning, dependency scanning e supply-chain baseline
create_issue '[SEC-003] Secret scanning, dependency scanning e supply-chain baseline' 'type:security,layer:security,domain:devsecops,priority:P1' 'M7 — Quality, Security & Delivery' <<'ISSUE_BODY'
## Responsabilidade
Detectar vazamentos/vulnerabilidades cedo.

## Escopo
- secret scan;
- dependency alerts;
- lockfile policy;
- CI check;
- documentação de rotação quando secret for exposto.
ISSUE_BODY

# [OBS-001] OpenTelemetry, structured logs, metrics e traces
create_issue '[OBS-001] OpenTelemetry, structured logs, metrics e traces' 'type:quality,layer:platform,domain:observability,priority:P1' 'M7 — Quality, Security & Delivery' <<'ISSUE_BODY'
## Responsabilidade
Instrumentar a baseline definida no System Design.

## Traces prioritários
- lookup;
- checkout → webhook;
- outbox → worker;
- government submission;
- partner request → notification;
- Case claim.

## Regras
Sem PII/secrets em logs e sem high-cardinality labels desnecessárias.
ISSUE_BODY

# [DEVOPS-001] CD, ambientes e deploy reproduzível
create_issue '[DEVOPS-001] CD, ambientes e deploy reproduzível' 'type:platform,layer:platform,domain:devops,priority:P1' 'M7 — Quality, Security & Delivery' <<'ISSUE_BODY'
## Responsabilidade
Implementar entrega contínua separada da CI de PR.

## Escopo
- staging;
- production quando habilitado;
- build artifact;
- migrations controladas;
- health checks;
- rollback;
- environment protection;
- deploy via OIDC/credenciais seguras;
- IaC se o deploy target exigir.

## Fora de escopo
Feature de produto.
ISSUE_BODY

# [FE-AI-001] EMR Copilot — painel e ações contextuais
create_issue '[FE-AI-001] EMR Copilot — painel e ações contextuais' 'type:screen,layer:frontend,surface:shared,domain:ai,priority:P1' 'M8 — EMR Copilot' <<'ISSUE_BODY'
## Responsabilidade
Implementar IA como parte do fluxo, não como chatbot genérico.

## Escopo
- trigger no header;
- side panel;
- suggested prompts;
- streaming/loading;
- tool cards;
- links para entidades;
- partial failure;
- write confirmation;
- unavailable state.

## Regra
Mutação sensível nunca ocorre sem confirmação explícita.
ISSUE_BODY

# [BE-AI-001] AI Gateway, tool router e authorization
create_issue '[BE-AI-001] AI Gateway, tool router e authorization' 'type:capability,layer:backend,domain:ai,priority:P1' 'M8 — EMR Copilot' <<'ISSUE_BODY'
## Responsabilidade
Expor tools autorizadas sem dar acesso direto do LLM ao banco.

## Escopo
- provider abstraction;
- tool schemas;
- auth/context propagation;
- read tools;
- write tools com confirmation token/flow;
- timeouts/fallback;
- telemetry/cost.

## Regra
API/domínio continuam fonte da verdade.
ISSUE_BODY

# [QA-AI-001] Evals, guardrails e RAG de procedimentos
create_issue '[QA-AI-001] Evals, guardrails e RAG de procedimentos' 'type:quality,layer:quality,domain:ai,priority:P1' 'M8 — EMR Copilot' <<'ISSUE_BODY'
## Responsabilidade
Validar factualidade, autorização, segurança e utilidade antes de confiar no Copilot.

## Cobrir
- RAG somente para conhecimento documental;
- tool calling para dados transacionais;
- prompt injection;
- cross-tenant/org tests;
- pagamento nunca inventado;
- prazo do órgão nunca inventado;
- eval dataset;
- fallback quando provider falha.
ISSUE_BODY
echo ""
ok "Backlog v2 concluído."
echo "Repo:    $REPO"
if [ -n "$PROJECT_NUMBER" ]; then
  echo "Project: #$PROJECT_NUMBER — $PROJECT_TITLE"
fi
echo ""
echo "Princípio mantido: FE ≠ BE ≠ INT."
