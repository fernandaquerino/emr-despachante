#!/bin/bash
set -euo pipefail

# ============================================================
# EMR Despachante — System Design & Architecture Issues
# Cria somente o épico/milestone/issues de System Design.
# O repositório deve existir antes de rodar este script.
# NÃO usa jq externo — usa apenas filtros --jq do GitHub CLI.
#
# Uso:
#   1. gh auth login
#   2. chmod +x create-system-design-issues.sh
#   3. ./create-system-design-issues.sh
#
# Para outro repositório:
#   REPO=owner/repo ./create-system-design-issues.sh
#
# PROJECT_ID é opcional. Se informado, adiciona as issues ao Project.
# Exemplo:
#   PROJECT_ID=7 ./create-system-design-issues.sh
#
# Observação:
# - M0.3 — System Design = desenho arquitetural ANTES da implementação.
# - M15 — Scale & System Design = validação posterior com load/incident drills.
# ============================================================

REPO="${REPO:-fernandaquerino/emr-despachante}"
OWNER="${OWNER:-${REPO%%/*}}"
PROJECT_ID="${PROJECT_ID:-}"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log()  { echo -e "${GREEN}✓${NC} $1"; }
info() { echo -e "${YELLOW}→${NC} $1"; }
fail() { echo -e "${RED}✗${NC} $1"; }

validate_environment() {
  command -v gh >/dev/null 2>&1 || {
    fail "GitHub CLI não encontrado. Instale com: brew install gh"
    exit 1
  }

  gh auth status >/dev/null 2>&1 || {
    fail "Você precisa autenticar com: gh auth login"
    exit 1
  }

  gh repo view "$REPO" >/dev/null 2>&1 || {
    fail "Repositório não encontrado ou sem permissão: $REPO"
    echo "Use, por exemplo:"
    echo "  REPO=seu-user/emr-despachante ./create-system-design-issues.sh"
    exit 1
  }

  if [ -n "$PROJECT_ID" ]; then
    gh auth refresh -s project >/dev/null 2>&1 || true
  fi
}

create_label() {
  local name="$1"
  local color="$2"
  local description="$3"

  local existing
  existing=$(LABEL_NAME="$name" gh label list \
    --repo "$REPO" \
    --limit 200 \
    --json name \
    --jq '.[] | select(.name == env.LABEL_NAME) | .name' \
    2>/dev/null | head -n 1 || true)

  if [ -n "$existing" ]; then
    info "Label já existe: $name"
    return
  fi

  gh label create "$name" \
    --repo "$REPO" \
    --color "$color" \
    --description "$description" >/dev/null

  log "Label criada: $name"
}

create_milestone() {
  local title="$1"
  local existing

  existing=$(MILESTONE_TITLE="$title" gh api \
    "repos/$REPO/milestones?state=all&per_page=100" \
    --jq '.[] | select(.title == env.MILESTONE_TITLE) | .title' \
    2>/dev/null | head -n 1 || true)

  if [ -n "$existing" ]; then
    info "Milestone já existe: $title"
    return
  fi

  gh api "repos/$REPO/milestones" \
    --method POST \
    -f title="$title" \
    -f state="open" >/dev/null

  log "Milestone criada: $title"
}

create_issue() {
  local title="$1"
  local labels="$2"
  local milestone="$3"

  local body
  body="$(cat)"

  local existing_issue_url
  existing_issue_url=$(TITLE="$title" gh issue list \
    --repo "$REPO" \
    --state all \
    --limit 500 \
    --json title,url \
    --jq '.[] | select(.title == env.TITLE) | .url' \
    2>/dev/null | head -n 1 || true)

  if [ -n "$existing_issue_url" ]; then
    info "Issue já existe, pulando → $title"
    return
  fi

  info "Criando: $title"

  local issue_url
  if issue_url=$(gh issue create \
    --repo "$REPO" \
    --title "$title" \
    --body "$body" \
    --label "$labels" \
    --milestone "$milestone"); then

    log "Criada → $issue_url"

    if [ -n "$PROJECT_ID" ]; then
      if ! gh project item-add "$PROJECT_ID" \
        --owner "$OWNER" \
        --url "$issue_url" >/dev/null 2>&1; then
        info "Não consegui adicionar automaticamente ao Project $PROJECT_ID."
      fi
    fi
  else
    fail "Erro ao criar: $title"
  fi

  sleep 0.25
}

validate_environment

# ============================================================
# Labels
# ============================================================
info "Criando/verificando labels..."

# Labels já usadas pelo projeto são recriadas apenas se estiverem ausentes.
create_label 'epic' '5319e7' 'Épico'
create_label 'user-story' '1d76db' 'User Story'
create_label 'study' 'fbca04' 'Estudo dirigido'
create_label 'architecture' '006b75' 'Arquitetura'
create_label 'system-design' '0e8a16' 'System Design / decisões sistêmicas'
create_label 'docs' 'cfd3d7' 'Documentação'
create_label 'backend' 'e4e669' 'Backend / API'
create_label 'database' '0e8a16' 'Banco de dados'
create_label 'payments' '0052cc' 'Pagamentos'
create_label 'async' 'd93f0b' 'Filas / Workers'
create_label 'security' 'b60205' 'Segurança / LGPD'
create_label 'observability' '7057ff' 'Observabilidade'
create_label 'performance' '0e8a16' 'Performance'
create_label 'aws' 'ff9900' 'AWS'
create_label 'ai' 'a371f7' 'Inteligência Artificial'
create_label 'testing' 'bfe5bf' 'Testes'
create_label 'P0' 'b60205' 'Prioridade P0'
create_label 'P1' 'fbca04' 'Prioridade P1'

# ============================================================
# Milestone
# ============================================================
info "Criando/verificando milestone..."
create_milestone 'M0.3 — System Design'

# ============================================================
# Epic
# ============================================================
info "=== M0.3 — System Design ==="

create_issue '[EPIC-SD] System Design & Architecture' 'epic,architecture,system-design,docs,P0' 'M0.3 — System Design' <<'ISSUE_BODY'
## Contexto
O EMR Despachante será utilizado por despachantes reais. Antes de implementar fluxos críticos, precisamos transformar requisitos de produto em decisões arquiteturais explícitas e revisáveis.

Este milestone representa o **System Design de pré-implementação**. O milestone `M15 — Scale & System Design` continua reservado para validação posterior com load tests, incident drills e revisão baseada no sistema implementado.

## Objetivo do épico
Definir uma arquitetura de produção defensável para o EMR, cobrindo requisitos, escala, domínios, dados, fluxos críticos, resiliência, segurança/LGPD, observabilidade e IA.

## Princípios
- Começar por requisitos e invariantes, não por serviços AWS.
- Diferenciar fatos confirmados de premissas/estimativas.
- Não introduzir complexidade sem requisito que a justifique.
- Decisões difíceis de reverter devem gerar ADR.
- Segurança, LGPD e isolamento de dados fazem parte da arquitetura, não são melhorias futuras.
- Falhas externas devem degradar de forma previsível e nunca corromper a verdade financeira.

## Escopo
- [ ] Requirements, Constraints & Scale
- [ ] Domain Boundaries & Invariants
- [ ] High-Level Architecture
- [ ] Data Model & Data Ownership
- [ ] Critical Flow Design
- [ ] Failure Modes & Resilience
- [ ] Security & LGPD Architecture
- [ ] Observability & Operations
- [ ] AI Architecture Review
- [ ] Architecture Review & ADRs

## Entregáveis principais
- `docs/architecture/SYSTEM_DESIGN.md`
- `docs/architecture/REQUIREMENTS_AND_SCALE.md`
- `docs/architecture/DOMAIN_MODEL.md`
- `docs/architecture/DATA_MODEL.md`
- `docs/architecture/CRITICAL_FLOWS.md`
- `docs/architecture/FAILURE_MODES.md`
- `docs/architecture/SECURITY_ARCHITECTURE.md`
- `docs/architecture/OBSERVABILITY_ARCHITECTURE.md`
- `docs/architecture/AI_ARCHITECTURE_REVIEW.md`
- `docs/architecture/OPEN_QUESTIONS.md`
- `docs/architecture/RISK_REGISTER.md`
- diagramas C4 e sequence diagrams
- ADRs necessários

## Definition of Done
- [ ] SD-001 a SD-010 concluídas
- [ ] C1 e C2 do C4 Model revisados
- [ ] Domínios e ownership de dados definidos
- [ ] Multi-tenancy decidido ou explicitamente registrado como open question bloqueante
- [ ] ERD conceitual revisado
- [ ] Fluxos críticos possuem sequence diagrams
- [ ] Strong consistency vs eventual consistency está documentado
- [ ] Failure modes possuem estratégia de recuperação
- [ ] Segurança/LGPD revisadas antes da implementação
- [ ] Observabilidade dos fluxos críticos está desenhada
- [ ] ADRs relevantes concluídos
- [ ] Open questions e riscos possuem owner/próximo passo
- [ ] Arquitetura validada com pelo menos um stakeholder de negócio/despachante antes de congelar decisões críticas
ISSUE_BODY

# ============================================================
# SD-001
# ============================================================
create_issue '[SD-001] Requirements, Constraints & Scale' 'user-story,study,architecture,system-design,docs,performance,P0' 'M0.3 — System Design' <<'ISSUE_BODY'
## Contexto
System Design começa pelos requisitos e restrições. Como o EMR será usado por empresas reais, não devemos desenhar a arquitetura sobre números fictícios sem distinguir hipótese de fato.

## User Story
> Como equipe de produto e engenharia, queremos documentar requisitos, restrições e ordem de grandeza esperada para tomar decisões arquiteturais compatíveis com o negócio real.

## Objetivo
Criar a baseline de requisitos funcionais, requisitos não funcionais, escala e constraints que orientarão todo o System Design.

## Tasks
### Produto e negócio
- [ ] Confirmar se o produto será single-tenant ou SaaS multi-tenant
- [ ] Definir o conceito de `Tenant/Despachante/Organização`, se aplicável
- [ ] Levantar quantidade esperada de despachantes na entrada e horizontes de crescimento
- [ ] Levantar quantidade média/máxima de operadoras por despachante
- [ ] Estimar clientes e veículos por tenant
- [ ] Identificar sazonalidades: IPVA, licenciamento, campanhas e vencimentos
- [ ] Identificar jornadas críticas e jornadas que podem degradar

### Escala
- [ ] Estimar consultas de veículos/dia
- [ ] Estimar pedidos/dia
- [ ] Estimar pagamentos/dia
- [ ] Estimar webhooks/dia e possibilidade de bursts/replays
- [ ] Estimar documentos armazenados/mês e tamanho médio
- [ ] Estimar cases operacionais/dia
- [ ] Estimar volume de notificações
- [ ] Criar uma estimativa de RPS médio e pico, explicitando premissas
- [ ] Separar baseline atual, 12 meses e cenário de crescimento quando houver dados

### Requisitos não funcionais
- [ ] Definir SLO inicial de disponibilidade por superfície crítica
- [ ] Definir targets de latência para API, busca e dashboard
- [ ] Definir requisitos de durabilidade para dados financeiros e documentos
- [ ] Definir RPO esperado com o negócio
- [ ] Definir RTO esperado com o negócio
- [ ] Definir necessidades de auditoria
- [ ] Definir necessidades de retenção de dados/documentos
- [ ] Identificar requisitos de região/residência de dados

### Integrações e constraints
- [ ] Mapear payment provider previsto
- [ ] Mapear integrações governamentais reais planejadas e limitações conhecidas
- [ ] Registrar que o `DetranClient` mock é um adapter de desenvolvimento, não uma integração real
- [ ] Mapear e-mail/SMS/WhatsApp se previstos
- [ ] Mapear restrições legais/contratuais conhecidas
- [ ] Registrar decisões ainda não confirmadas como `OPEN QUESTION`

## Regras de documentação
Cada número deve ser marcado como uma das categorias:
- `CONFIRMED` — validado com negócio/dado real
- `ASSUMPTION` — premissa para projeto
- `TARGET` — meta de engenharia
- `OPEN` — ainda precisa de decisão

Não apresentar estimativas como fatos.

## Critérios de aceite
- [ ] Multi-tenancy está decidido ou marcado como bloqueio explícito
- [ ] Existe tabela de volume/carga com origem de cada premissa
- [ ] Requisitos não funcionais possuem valores ou perguntas abertas claras
- [ ] RPO/RTO não foram inventados unilateralmente pela engenharia
- [ ] Picos sazonais foram considerados
- [ ] Integrações externas e dependências críticas estão listadas
- [ ] Open questions possuem responsável/próximo passo

## Entregável
`docs/architecture/REQUIREMENTS_AND_SCALE.md`

## Conceitos para estudar
- functional vs non-functional requirements
- capacity estimation
- RPS / throughput
- latency percentiles (p50/p95/p99)
- availability / SLO / SLA
- RPO / RTO
- multi-tenancy

## Perguntas técnicas
- Quais números realmente mudam a arquitetura?
- Qual a diferença entre pico de tráfego e volume diário?
- Por que p95 é mais útil que média em muitos endpoints?
- O que RPO e RTO protegem?
- Que decisão muda se o sistema tiver 5 tenants ou 5.000?

## Dependências
- Product requirements existentes
- Conversa com stakeholder(s) de negócio/despachante

## ADR
Pode gerar ADR sobre multi-tenancy caso a decisão seja tomada aqui.

## Definition of Done
- [ ] Documento criado
- [ ] Premissas e fatos estão diferenciados
- [ ] Open questions registradas
- [ ] Revisão com negócio realizada ou agendada com blockers explícitos
- [ ] Consigo explicar como a escala influencia as próximas decisões
ISSUE_BODY

# ============================================================
# SD-002
# ============================================================
create_issue '[SD-002] Domain Boundaries & Invariants' 'user-story,study,architecture,system-design,backend,docs,P0' 'M0.3 — System Design' <<'ISSUE_BODY'
## Contexto
O EMR possui estados financeiros, processamento externo e trabalho operacional. Se `Order`, `Payment`, `ServiceRequest`, `Submission` e `Case` forem tratados como a mesma coisa, o sistema ficará acoplado e permitirá estados inválidos.

## User Story
> Como equipe de engenharia, queremos definir domínios, responsabilidades e invariantes para que regras críticas tenham um único owner e não se espalhem entre frontend, controllers e integrações.

## Objetivo
Definir os principais módulos/bounded contexts do EMR e catalogar regras que nunca podem ser quebradas.

## Tasks
### Domínios
- [ ] Definir `Identity & Access`
- [ ] Definir `Tenancy / Organizations`, se aplicável
- [ ] Definir `Customers`
- [ ] Definir `Vehicles`
- [ ] Definir `Catalog & Pricing`
- [ ] Definir `Orders`
- [ ] Definir `Service Requests`
- [ ] Definir `Payments`
- [ ] Definir `Government Processing / Submissions`
- [ ] Definir `Cases`
- [ ] Definir `Documents`
- [ ] Definir `Notifications`
- [ ] Definir `Audit`
- [ ] Definir `AI / Copilot`

### Ownership
- [ ] Documentar o que cada domínio é fonte de verdade
- [ ] Documentar quais domínios podem ler dados de outros domínios
- [ ] Identificar eventos/comandos entre domínios
- [ ] Evitar shared database logic implícita sem owner

### Invariantes
- [ ] Pagamento só vira `PAID` após confirmação confiável do provider
- [ ] Mesmo evento de webhook não pode causar dois efeitos financeiros
- [ ] Pagamento duplicado precisa ser impedido por invariant persistente
- [ ] `PAID` não significa serviço governamental concluído
- [ ] Apenas uma operadora pode assumir um case por vez
- [ ] Transições de status inválidas devem ser rejeitadas
- [ ] OWNER não acessa dados pertencentes a outro tenant/owner
- [ ] Tenant A nunca acessa dados do Tenant B
- [ ] Audit trail crítico não pode ser apagado silenciosamente
- [ ] IA nunca confirma verdade financeira nem ignora autorização

### State ownership
- [ ] Separar claramente estados de Order
- [ ] Separar estados de Payment
- [ ] Separar estados de ServiceRequest
- [ ] Separar estados de Submission
- [ ] Separar estados de Case
- [ ] Mapear dependências entre state machines sem fundi-las

## Critérios de aceite
- [ ] Cada entidade crítica possui domínio owner
- [ ] Invariantes possuem local de enforcement esperado (DB/domain/service)
- [ ] `Order`, `Payment`, `ServiceRequest`, `Submission` e `Case` não são tratados como um único status
- [ ] Boundaries fazem sentido para modular monolith e permitem evolução futura
- [ ] Não existem regras financeiras críticas pertencendo ao frontend
- [ ] Tenant isolation aparece como invariant caso o sistema seja multi-tenant

## Entregável
`docs/architecture/DOMAIN_MODEL.md`

## Conceitos para estudar
- bounded context
- aggregate
- invariants
- domain boundaries
- state machine
- data ownership
- coupling/cohesion

## Perguntas técnicas
- Qual módulo pode mudar o estado de Payment?
- Quem é fonte da verdade sobre processamento governamental?
- Case é erro técnico ou trabalho operacional?
- Por que `Payment = PAID` não deve concluir automaticamente Licensing?
- Que invariantes devem ser garantidos pelo banco?

## Dependências
- SD-001
- STATUS_MODEL existente

## ADR
Criar ADR apenas para boundaries/decisões com impacto relevante e difícil reversão.

## Definition of Done
- [ ] Domain map criado
- [ ] Ownership documentado
- [ ] Catálogo de invariantes criado
- [ ] State ownership revisado
- [ ] Conflitos com documentação atual corrigidos ou registrados
- [ ] Consigo explicar os boundaries sem depender do diagrama de classes
ISSUE_BODY

# ============================================================
# SD-003
# ============================================================
create_issue '[SD-003] High-Level Architecture' 'user-story,study,architecture,system-design,backend,aws,docs,P0' 'M0.3 — System Design' <<'ISSUE_BODY'
## Contexto
Após entender requisitos e boundaries, precisamos definir os grandes componentes do sistema e como eles se comunicam. O objetivo não é desenhar caixas AWS por estética, mas justificar cada componente por uma necessidade.

## User Story
> Como equipe de engenharia, queremos uma arquitetura de alto nível simples, escalável e operável que suporte os fluxos síncronos e assíncronos do EMR.

## Objetivo
Criar C4 Context (C1), C4 Container (C2) e a primeira versão consolidada do `SYSTEM_DESIGN.md`.

## Tasks
### C1 — System Context
- [ ] Proprietário
- [ ] Operadora
- [ ] Admin
- [ ] EMR Despachante
- [ ] Payment Provider
- [ ] Integração governamental/Detran adapter
- [ ] Provider de notificações, se aplicável
- [ ] LLM provider, se aplicável

### C2 — Containers
- [ ] Web / Next.js
- [ ] API / NestJS
- [ ] Worker
- [ ] PostgreSQL
- [ ] Redis
- [ ] S3/object storage
- [ ] SQS/queue
- [ ] DLQ
- [ ] Outbox publisher/processing strategy
- [ ] Observability pipeline
- [ ] AI Gateway / tool orchestration boundary

### Decisões arquiteturais
- [ ] Avaliar modular monolith vs microservices
- [ ] Documentar por que a opção escolhida atende a escala atual
- [ ] Definir boundaries sync vs async
- [ ] Identificar source of truth por storage
- [ ] Definir trust boundaries
- [ ] Definir responsabilidades do web/API/worker
- [ ] Documentar onde Redis é cache e nunca fonte da verdade
- [ ] Documentar onde LLM nunca é fonte da verdade

### Deployment view inicial
- [ ] Definir região inicial
- [ ] Definir edge/TLS/entry point conceitual
- [ ] Definir rede pública vs privada conceitualmente
- [ ] Definir serviços stateful vs stateless
- [ ] Não detalhar Terraform ainda

## Critérios de aceite
- [ ] C1 compreensível por pessoa não técnica
- [ ] C2 mostra responsabilidades sem virar diagrama de classes
- [ ] Cada componente existe por uma necessidade documentada
- [ ] Sync vs async está explícito
- [ ] Fonte da verdade está explícita
- [ ] Modular monolith/microservices possui decisão e trade-offs
- [ ] Não existe dependência direta `LLM → database`
- [ ] Não existe regra financeira dependendo de Redis

## Entregáveis
- `docs/architecture/SYSTEM_DESIGN.md`
- `docs/architecture/diagrams/system-context.md`
- `docs/architecture/diagrams/container-diagram.md`

## Conceitos para estudar
- C4 Model
- modular monolith
- synchronous vs asynchronous communication
- stateless services
- horizontal scaling
- trust boundaries

## Perguntas técnicas
- Por que não começar com microservices?
- O que precisa ser assíncrono e por quê?
- Qual componente pode escalar independentemente?
- Se Redis cair, o que continua funcionando?
- Qual componente é stateful?

## Dependências
- SD-001
- SD-002

## ADR
- ADR: arquitetura modular monolith vs microservices
- ADR adicional se houver decisão estrutural difícil de reverter

## Definition of Done
- [ ] C1 criado
- [ ] C2 criado
- [ ] Arquitetura descrita em texto
- [ ] Trade-offs registrados
- [ ] ADR principal criado
- [ ] Revisão de consistência com domain boundaries concluída
ISSUE_BODY

# ============================================================
# SD-004
# ============================================================
create_issue '[SD-004] Data Model & Data Ownership' 'user-story,study,architecture,system-design,database,security,docs,P0' 'M0.3 — System Design' <<'ISSUE_BODY'
## Contexto
O banco precisa representar relações e invariantes reais do negócio. Antes de criar migrations, precisamos de um modelo conceitual que deixe claro ownership, tenant isolation, PII e consistência.

## User Story
> Como equipe de engenharia, queremos um modelo de dados conceitual que preserve relações, invariantes e isolamento entre despachantes antes de implementar o schema físico.

## Objetivo
Criar ERD conceitual e documentar data ownership, constraints e estratégia inicial de tenancy.

## Tasks
### Entidades principais
- [ ] Tenant/Organization, se multi-tenant
- [ ] User
- [ ] Operator/Admin membership
- [ ] Customer
- [ ] Vehicle
- [ ] Vehicle ownership/link
- [ ] Catalog/Service
- [ ] Order
- [ ] ServiceRequest
- [ ] Payment
- [ ] PaymentEvent
- [ ] Submission
- [ ] SubmissionAttempt
- [ ] Case
- [ ] CaseNote
- [ ] Document
- [ ] Notification
- [ ] AuditLog
- [ ] OutboxEvent
- [ ] AIConversation/AIMessage quando necessário
- [ ] KnowledgeDocument/KnowledgeChunk quando necessário

### Relações e constraints
- [ ] Definir PKs e identidade conceitual
- [ ] Definir onde `tenant_id` é obrigatório
- [ ] Definir unique constraints críticas
- [ ] Definir foreign keys críticas
- [ ] Definir ownership de PII
- [ ] Definir soft delete vs hard delete por entidade
- [ ] Definir quais registros devem ser imutáveis/auditáveis
- [ ] Definir timestamps e estratégia de versionamento quando necessária

### Concorrência e consistência
- [ ] Mapear constraint de webhook idempotency
- [ ] Mapear invariant de duplicate payment
- [ ] Mapear case claim concorrente
- [ ] Mapear outbox na mesma transação do estado de negócio

### Índices iniciais
- [ ] Listar queries críticas esperadas
- [ ] Propor índices apenas a partir dessas queries
- [ ] Considerar tenant-first indexing quando aplicável
- [ ] Considerar busca por placa/CPF/case ID

### PII e retenção
- [ ] Classificar CPF, RENAVAM, placa, e-mail, telefone e documentos
- [ ] Registrar masking esperado em leitura/logs
- [ ] Marcar requisitos de retenção ainda não definidos

## Critérios de aceite
- [ ] ERD representa boundaries definidos em SD-002
- [ ] Tenant isolation é estrutural se o produto for multi-tenant
- [ ] Invariantes críticos possuem apoio do banco quando aplicável
- [ ] PII está identificada
- [ ] Não existe JSONB usado apenas para evitar modelagem sem justificativa
- [ ] Índices estão associados a queries reais
- [ ] Modelo não depende de uma única coluna `status` para representar todo o processo

## Entregáveis
- `docs/architecture/DATA_MODEL.md`
- `docs/architecture/diagrams/erd.md`

## Conceitos para estudar
- relational modeling
- normalization
- constraints
- indexes
- optimistic locking
- multi-tenant data isolation
- immutable audit log

## Perguntas técnicas
- Quando `tenant_id` deve entrar na unique constraint?
- O banco deve impedir duplicate payment ou apenas a aplicação?
- Quando soft delete é perigoso?
- Quais consultas precisam de composite index?
- Por que modelar SubmissionAttempt separadamente?

## Dependências
- SD-001
- SD-002
- SD-003

## ADR
- PostgreSQL como primary relational store, se ainda não formalizado
- Estratégia de multi-tenancy/data isolation

## Definition of Done
- [ ] ERD criado
- [ ] Constraints críticas identificadas
- [ ] PII classificada
- [ ] Estratégia de tenancy documentada
- [ ] Queries/índices críticos mapeados
- [ ] Conflitos com DATA_MODEL existente reconciliados
ISSUE_BODY

# ============================================================
# SD-005
# ============================================================
create_issue '[SD-005] Critical Flow Design' 'user-story,study,architecture,system-design,payments,async,backend,docs,P0' 'M0.3 — System Design' <<'ISSUE_BODY'
## Contexto
Os principais riscos do EMR estão nas transições entre pagamento, processamento externo e operação manual. Diagramas de alto nível não são suficientes; precisamos desenhar os fluxos passo a passo e seus pontos de consistência.

## User Story
> Como equipe de engenharia, queremos sequence diagrams dos fluxos críticos para saber onde validar, persistir, publicar eventos, responder ao usuário e tratar falhas.

## Objetivo
Documentar os fluxos que mais influenciam arquitetura, consistência e UX antes da implementação.

## Tasks
### Vehicle lookup
- [ ] Request do usuário
- [ ] Cache hit/miss
- [ ] DetranClient/external adapter
- [ ] Normalização/persistência
- [ ] stale timestamp
- [ ] timeout/error behavior

### Checkout e criação do pagamento
- [ ] Order/ServiceRequest pré-condições
- [ ] criação de Payment
- [ ] idempotency/duplicate protection
- [ ] chamada ao provider
- [ ] resposta ao frontend
- [ ] deixar explícito que checkout success != payment confirmation

### Payment webhook
- [ ] receber evento
- [ ] validar assinatura
- [ ] validar/rejeitar evento inválido
- [ ] deduplicar provider event
- [ ] atualizar Payment
- [ ] gravar audit/event
- [ ] criar OutboxEvent na mesma transaction
- [ ] responder replay com comportamento idempotente

### Outbox → Queue → Worker → External submission
- [ ] publisher
- [ ] SQS
- [ ] consumer idempotente
- [ ] Submission/SubmissionAttempt
- [ ] timeout/retry/backoff
- [ ] sucesso
- [ ] falhas transitórias
- [ ] falhas permanentes
- [ ] DLQ/manual case

### Case creation e claim
- [ ] política de criação automática
- [ ] case aberto
- [ ] duas operadoras tentando assumir
- [ ] conditional update/optimistic locking
- [ ] loser recebe `CASE_ALREADY_ASSIGNED`

### Outros fluxos críticos
- [ ] refund: desenhar pelo menos boundary/confirmation path
- [ ] document upload/access: desenhar boundary de segurança
- [ ] notifications: desenhar async path conceitual

### Para cada fluxo
Documentar:
- [ ] source of truth
- [ ] strong vs eventual consistency
- [ ] idempotency strategy
- [ ] failure points
- [ ] user-visible states
- [ ] correlation identifiers

## Critérios de aceite
- [ ] Payment nunca vira `PAID` pelo redirect do frontend
- [ ] Payment update + outbox estão na mesma transaction conceitual
- [ ] Consumers assumem entrega at-least-once
- [ ] Case claim é concurrency-safe
- [ ] Falha externa não exige manter HTTP request aberto indefinidamente
- [ ] Estados mostrados no frontend refletem estados reais do processo
- [ ] Cada fluxo possui happy path e failure path principal

## Entregáveis
- `docs/architecture/CRITICAL_FLOWS.md`
- `docs/architecture/diagrams/vehicle-lookup-flow.md`
- `docs/architecture/diagrams/payment-webhook-flow.md`
- `docs/architecture/diagrams/submission-flow.md`
- `docs/architecture/diagrams/case-claim-flow.md`

## Conceitos para estudar
- sequence diagrams
- idempotency
- transactional outbox
- at-least-once delivery
- eventual consistency
- optimistic concurrency
- retries/backoff

## Perguntas técnicas
- O que acontece se a API cair depois do commit e antes da publicação?
- Por que SQS pode entregar a mesma mensagem mais de uma vez?
- Como o consumer sabe que já executou um efeito?
- Onde exatamente está a strong consistency do pagamento?
- Como a UI deve representar `PAID` + `Submission PROCESSING`?

## Dependências
- SD-002
- SD-003
- SD-004

## ADR
ADRs podem ser necessários para:
- transactional outbox
- queue/async processing
- concurrency strategy

## Definition of Done
- [ ] Sequence diagrams criados
- [ ] Happy/failure paths documentados
- [ ] Consistency model explícito por fluxo
- [ ] Idempotency explícita por boundary
- [ ] ADRs relevantes criados
- [ ] Fluxos revisados contra UX/status model
ISSUE_BODY

# ============================================================
# SD-006
# ============================================================
create_issue '[SD-006] Failure Modes & Resilience' 'user-story,study,architecture,system-design,observability,async,docs,P1' 'M0.3 — System Design' <<'ISSUE_BODY'
## Contexto
Dependências externas, filas e workers vão falhar. O projeto precisa definir previamente quais falhas são toleradas, quando fazer retry, quando degradar e quando transformar falha em trabalho manual.

## User Story
> Como operação e engenharia, queremos um comportamento previsível diante de falhas para proteger dados, dinheiro e continuidade operacional.

## Objetivo
Criar um failure-mode catalog com detecção, impacto, recuperação e estado visível ao usuário.

## Tasks
### Criar matriz de falhas
Para cada dependência/componente documentar:
- [ ] modo de falha
- [ ] impacto
- [ ] detecção
- [ ] retry permitido?
- [ ] timeout
- [ ] backoff
- [ ] max attempts
- [ ] DLQ/manual intervention
- [ ] idempotency requirement
- [ ] user-facing state
- [ ] alert esperado

### Cobrir no mínimo
- [ ] PostgreSQL indisponível
- [ ] Redis indisponível
- [ ] SQS indisponível
- [ ] Worker crash/restart
- [ ] Payment provider indisponível
- [ ] Webhook atrasado
- [ ] Webhook duplicado
- [ ] Detran/external API lenta
- [ ] Detran/external API fora
- [ ] Resposta externa inválida
- [ ] S3/object storage indisponível
- [ ] Provider de notificação indisponível
- [ ] AI provider indisponível

### Políticas
- [ ] Diferenciar erro transitório vs permanente
- [ ] Definir retry policy por categoria
- [ ] Definir DLQ policy
- [ ] Definir circuit breaker somente onde houver necessidade
- [ ] Definir stale data strategy
- [ ] Definir partial-failure behavior
- [ ] Definir quando criar Case operacional automaticamente
- [ ] Definir comportamento após recuperação

## Critérios de aceite
- [ ] Retry infinito não existe
- [ ] Validation error permanente não entra em retry cego
- [ ] Redis outage não corrompe fonte de verdade
- [ ] AI outage não bloqueia fluxo principal do produto
- [ ] Detran outage preserva estado financeiro já confirmado
- [ ] DLQ possui owner/processo de tratamento
- [ ] Usuário não vê sucesso falso durante degradação
- [ ] Estratégia é compatível com RPO/RTO definidos

## Entregável
`docs/architecture/FAILURE_MODES.md`

## Conceitos para estudar
- failure mode analysis
- graceful degradation
- timeout
- exponential backoff
- jitter
- circuit breaker
- bulkhead
- DLQ

## Perguntas técnicas
- Quando retry piora uma indisponibilidade?
- Qual erro deve abrir Case em vez de continuar tentando?
- O que significa fail-open vs fail-closed neste domínio?
- O que acontece com mensagens em processamento quando um worker morre?

## Dependências
- SD-001
- SD-003
- SD-005

## ADR
Apenas se alguma política de resiliência for estrutural/difícil de reverter.

## Definition of Done
- [ ] Failure matrix criada
- [ ] Retry/DLQ policies documentadas
- [ ] User-visible degradation documentada
- [ ] Alert/recovery expectations definidas
- [ ] Critical failure scenarios revisados com operação
ISSUE_BODY

# ============================================================
# SD-007
# ============================================================
create_issue '[SD-007] Security & LGPD Architecture' 'user-story,study,architecture,system-design,security,database,docs,P0' 'M0.3 — System Design' <<'ISSUE_BODY'
## Contexto
O EMR manipulará dados pessoais, dados veiculares, documentos e informações financeiras. Segurança e LGPD precisam influenciar arquitetura, schema, logs, storage e autorização desde o início.

## User Story
> Como empresa e usuário, queremos que acesso, armazenamento e tratamento de dados sejam projetados com isolamento, rastreabilidade e minimização desde a primeira versão.

## Objetivo
Definir threat model inicial, controles de AuthN/AuthZ, tenant isolation, classificação de dados, acesso a documentos e requisitos arquiteturais de LGPD.

## Tasks
### Threat model / trust boundaries
- [ ] Identificar ativos críticos
- [ ] Identificar atores e roles
- [ ] Identificar trust boundaries
- [ ] Mapear principais ameaças: IDOR/BOLA, privilege escalation, credential abuse, webhook spoofing, document leakage, cross-tenant access

### Authentication
- [ ] Definir estratégia de sessão/token
- [ ] Definir cookies/CSRF quando aplicável
- [ ] Definir reset/recuperação de senha
- [ ] Definir convite de operadora
- [ ] Definir revogação/desativação de acesso

### Authorization
- [ ] RBAC OWNER/OPERADORA/ADMIN
- [ ] Ownership validation
- [ ] Tenant scoping em todo access path
- [ ] Garantir que UI hiding não seja controle de segurança
- [ ] Definir policy de acesso para AI tools

### PII/LGPD
- [ ] Classificar CPF
- [ ] Classificar RENAVAM
- [ ] Classificar placa quando associada a pessoa
- [ ] Classificar e-mail/telefone
- [ ] Classificar documentos
- [ ] Definir minimização
- [ ] Definir masking
- [ ] Definir logging/redaction
- [ ] Definir retenção/exclusão como requisito a validar com jurídico/negócio
- [ ] Registrar bases legais/consentimentos como tema para validação jurídica, sem inventar resposta técnica

### Encryption e secrets
- [ ] TLS in transit
- [ ] encryption at rest
- [ ] secrets management
- [ ] KMS/key management conceitual
- [ ] rotation strategy

### Documents
- [ ] S3 privado
- [ ] signed URLs/controlled download
- [ ] authorization antes de gerar acesso
- [ ] metadata/audit
- [ ] considerar malware scanning para uploads reais

### Payments
- [ ] Não armazenar dados de cartão
- [ ] Minimizar PCI scope usando provider
- [ ] Webhook signature verification
- [ ] Audit trail financeiro

### Backups e logs
- [ ] Definir tratamento de PII em backup
- [ ] Definir acesso administrativo
- [ ] Definir audit vs operational logs

## Critérios de aceite
- [ ] Cross-tenant access possui mitigação explícita
- [ ] IDOR/BOLA está coberto por backend authorization
- [ ] Document access é privado por padrão
- [ ] Secrets não ficam em código/env versionado
- [ ] Dados de cartão não são armazenados pelo EMR
- [ ] Logs não recebem PII completa sem necessidade
- [ ] AI tools obedecem os mesmos scopes de autorização do sistema
- [ ] Pontos que exigem validação jurídica estão marcados como tal
- [ ] Não há alegações de conformidade LGPD sem validação adequada

## Entregáveis
- `docs/architecture/SECURITY_ARCHITECTURE.md`
- seção/data map LGPD no mesmo documento ou arquivo complementar

## Conceitos para estudar
- AuthN vs AuthZ
- RBAC / ABAC
- IDOR / BOLA
- tenant isolation
- encryption at rest/in transit
- KMS/secrets management
- data minimization
- privacy by design
- OWASP

## Perguntas técnicas
- Como impedir que um ID válido de outro tenant seja acessado?
- Por que signed URL sozinha não resolve autorização?
- O que deve ser mascarado em logs?
- Como revogar acesso de operadora sem perder histórico?
- Que dados o LLM realmente precisa receber?

## Dependências
- SD-001
- SD-002
- SD-004

## ADR
Pode gerar ADRs sobre:
- sessão/auth strategy
- tenant isolation
- document access pattern

## Definition of Done
- [ ] Threat model inicial criado
- [ ] AuthN/AuthZ definidos
- [ ] Tenant isolation documentado
- [ ] PII data map criado
- [ ] Document/payment security definidos
- [ ] Pendências jurídicas separadas de decisões técnicas
- [ ] Security risks registrados no risk register
ISSUE_BODY

# ============================================================
# SD-008
# ============================================================
create_issue '[SD-008] Observability & Operations' 'user-story,study,architecture,system-design,observability,docs,P1' 'M0.3 — System Design' <<'ISSUE_BODY'
## Contexto
Em produção, precisamos responder perguntas como: "o cliente pagou, por que o serviço não concluiu?" sem depender de reproduzir o problema localmente.

## User Story
> Como operação e engenharia, queremos rastrear fluxos críticos ponta a ponta, detectar regressões e responder incidentes com dados suficientes.

## Objetivo
Definir observabilidade, SLIs/SLOs operacionais, correlation strategy, alertas e runbooks antes da instrumentação.

## Tasks
### Logs
- [ ] Definir structured logging
- [ ] Definir campos comuns
- [ ] Definir `traceId`
- [ ] Definir `correlationId`
- [ ] Definir IDs de domínio seguros para correlação
- [ ] Definir redaction de PII/secrets
- [ ] Distinguir audit log de operational log

### Traces
- [ ] Mapear trace checkout → webhook → outbox → queue → worker → external
- [ ] Mapear vehicle lookup
- [ ] Mapear case claim
- [ ] Definir propagação de contexto assíncrono

### Metrics / SLIs
- [ ] HTTP latency p50/p95/p99 quando relevante
- [ ] error rate
- [ ] webhook failure rate
- [ ] duplicate event attempts
- [ ] queue depth
- [ ] DLQ size
- [ ] submission success/failure/retry rate
- [ ] external provider latency/error rate
- [ ] open cases / case age
- [ ] payment processing states
- [ ] AI latency/tool failure/cost metrics

### Alerting
- [ ] Definir quais sinais merecem alerta
- [ ] Evitar alerta por evento isolado sem impacto
- [ ] Definir thresholds a partir de SLO/impacto, não números aleatórios
- [ ] Definir alert owner

### Operations
- [ ] Criar template de runbook
- [ ] Runbook: Detran indisponível
- [ ] Runbook: webhook failures
- [ ] Runbook: DLQ crescendo
- [ ] Runbook: payment reconciliation issue
- [ ] Definir incident evidence necessária

## Critérios de aceite
- [ ] É possível explicar como rastrear um pagamento até a submissão externa
- [ ] Métricas evitam high-cardinality labels como userId
- [ ] Logs não vazam PII/secrets
- [ ] Audit log e app log não são confundidos
- [ ] Alertas são relacionados a impacto/SLO
- [ ] Runbooks possuem primeira ação, diagnóstico e escalonamento

## Entregáveis
- `docs/architecture/OBSERVABILITY_ARCHITECTURE.md`
- `docs/architecture/runbooks/RUNBOOK_TEMPLATE.md`

## Conceitos para estudar
- logs / metrics / traces
- OpenTelemetry
- correlation IDs
- RED / USE methods
- SLI / SLO / error budget
- cardinality
- runbooks

## Perguntas técnicas
- Qual a diferença entre audit log e application log?
- Como trace atravessa SQS?
- Por que userId como label de métrica é ruim?
- Quando um alerta deve acordar alguém?
- Como descobrir em qual etapa um serviço ficou preso?

## Dependências
- SD-001
- SD-003
- SD-005
- SD-006

## ADR
Não obrigatório, salvo decisão estrutural sobre observability stack.

## Definition of Done
- [ ] Observability model documentado
- [ ] Critical traces mapeados
- [ ] SLIs iniciais definidos
- [ ] Alert principles definidos
- [ ] Runbook template criado
- [ ] Redaction rules revisadas com Security
ISSUE_BODY

# ============================================================
# SD-009
# ============================================================
create_issue '[SD-009] AI Architecture Review' 'user-story,study,architecture,system-design,ai,security,docs,P1' 'M0.3 — System Design' <<'ISSUE_BODY'
## Contexto
O EMR Copilot acessará dados operacionais e poderá sugerir ações. A arquitetura de IA precisa obedecer tenant isolation, autorização e regras de domínio, sem transformar o LLM em fonte de verdade ou executor autônomo.

## User Story
> Como equipe de engenharia, queremos validar a arquitetura de IA contra o System Design principal antes de implementar tools, RAG e write actions.

## Objetivo
Revisar AI Gateway, Tool Router, RAG, write confirmations, segurança, fallback, custo e observabilidade com base nos boundaries definidos nas tasks anteriores.

## Tasks
### Boundary
- [ ] Confirmar `UI → API → AI Gateway → LLM/Tool Router`
- [ ] Proibir acesso direto `LLM → SQL`
- [ ] Proibir credenciais de banco no ambiente/tooling do modelo
- [ ] Definir provider abstraction onde fizer sentido

### Tool authorization
- [ ] Definir identity propagada para tools
- [ ] Definir role checks
- [ ] Definir tenant scope
- [ ] Definir ownership checks
- [ ] Validar input/output schemas
- [ ] Minimizar PII retornada ao modelo

### Read vs write
- [ ] Catalogar read tools
- [ ] Catalogar write tools
- [ ] Exigir confirmação humana para write tools
- [ ] Revalidar autorização depois da confirmação
- [ ] Audit log para ações sensíveis
- [ ] Proibir IA de confirmar payment truth

### RAG
- [ ] Usar RAG para procedimentos/FAQ/políticas
- [ ] Não substituir queries relacionais por embeddings sem necessidade
- [ ] Definir ingestion/versioning
- [ ] Definir source citation
- [ ] Definir tenant/private knowledge scope se aplicável

### Segurança
- [ ] Prompt injection threat model
- [ ] Tool abuse
- [ ] Untrusted document content
- [ ] Data exfiltration boundaries
- [ ] Secret/PII minimization

### Resiliência/custo
- [ ] LLM outage fallback
- [ ] Tool timeout behavior
- [ ] Token/cost telemetry
- [ ] Rate limit/quotas
- [ ] Context size strategy

### Quality
- [ ] Definir eval categories
- [ ] Financial factuality target
- [ ] Authorization evals
- [ ] Wrong-tool temptation
- [ ] Confirmation-flow evals

## Critérios de aceite
- [ ] LLM nunca acessa banco diretamente
- [ ] Tool authorization acontece server-side
- [ ] Cross-tenant tool access é impedido
- [ ] Write tool exige confirmação humana
- [ ] Payment truth vem do domínio, nunca do modelo
- [ ] AI outage não bloqueia fluxos principais
- [ ] RAG e transactional tools possuem responsabilidades distintas
- [ ] Observabilidade/custo estão definidos

## Entregável
`docs/architecture/AI_ARCHITECTURE_REVIEW.md`

## Conceitos para estudar
- tool calling
- structured outputs
- RAG
- embeddings / pgvector
- prompt injection
- human-in-the-loop
- AI evals
- LLM observability

## Perguntas técnicas
- Por que não dar acesso SQL ao modelo?
- Como um tool call herda autorização do usuário?
- Quando RAG é melhor que tool calling?
- O que acontece se o usuário confirmar uma ação depois de perder permissão?
- Como medir hallucination em informação financeira?

## Dependências
- SD-002
- SD-003
- SD-004
- SD-007
- SD-008
- AI docs existentes

## ADR
Criar/atualizar ADR se a revisão mudar provider, tool boundary, RAG storage ou confirmation strategy.

## Definition of Done
- [ ] Arquitetura AI revisada contra tenancy/security
- [ ] Tool boundary documentada
- [ ] Write flow documentado
- [ ] Threats principais registrados
- [ ] Fallback/cost/observability documentados
- [ ] Conflitos com AI docs existentes corrigidos
ISSUE_BODY

# ============================================================
# SD-010
# ============================================================
create_issue '[SD-010] Architecture Review & ADRs' 'user-story,study,architecture,system-design,docs,P1' 'M0.3 — System Design' <<'ISSUE_BODY'
## Contexto
System Design não termina quando os diagramas estão bonitos. Precisamos reconciliar documentos, registrar trade-offs, riscos e decisões pendentes e transformar a arquitetura em uma base prática para implementação.

## User Story
> Como equipe, queremos revisar o System Design de ponta a ponta e sair com decisões, riscos e ordem de implementação claras.

## Objetivo
Consolidar os documentos produzidos, eliminar contradições, finalizar ADRs e obter validação técnica e de negócio antes das áreas críticas entrarem em implementação.

## Tasks
### Revisão cruzada
- [ ] Conferir requirements vs architecture
- [ ] Conferir domain model vs data model
- [ ] Conferir status model vs critical flows
- [ ] Conferir security vs data model
- [ ] Conferir failure modes vs observability
- [ ] Conferir AI architecture vs authorization/tenancy
- [ ] Conferir protótipos já feitos contra roles/boundaries definidos

### ADRs
- [ ] Criar índice de ADRs
- [ ] Garantir Context / Options / Decision / Consequences
- [ ] Marcar ADRs superseded quando necessário
- [ ] Não criar ADR para detalhes triviais

### Risk register
- [ ] Identificar riscos técnicos
- [ ] Identificar riscos de integração
- [ ] Identificar riscos de segurança/LGPD
- [ ] Identificar riscos operacionais
- [ ] Definir probabilidade/impacto qualitativo
- [ ] Definir mitigation/owner

### Open questions
- [ ] Consolidar todas as open questions
- [ ] Definir blocker vs non-blocker
- [ ] Definir owner
- [ ] Definir prazo/próximo passo quando aplicável

### Implementation readiness
- [ ] Definir ordem recomendada de implementação
- [ ] Identificar decisões que bloqueiam Auth
- [ ] Identificar decisões que bloqueiam Payments
- [ ] Identificar decisões que bloqueiam Cases
- [ ] Identificar decisões que bloqueiam Documents
- [ ] Identificar decisões que bloqueiam AI

### Stakeholder review
- [ ] Revisar assumptions com pelo menos um despachante/stakeholder de negócio
- [ ] Registrar feedback
- [ ] Atualizar decisões afetadas
- [ ] Não confundir validação de negócio com revisão técnica

## Critérios de aceite
- [ ] Não existem contradições críticas conhecidas entre documentos
- [ ] Toda decisão difícil de reverter possui ADR ou justificativa para não possuir
- [ ] Risk register existe
- [ ] Open questions estão consolidadas
- [ ] Blockers de implementação estão identificados
- [ ] System Design foi revisado por negócio e engenharia
- [ ] O documento diferencia claramente decisão atual de possibilidade futura
- [ ] Não há infraestrutura adicionada apenas para "parecer escalável"

## Entregáveis
- `docs/architecture/SYSTEM_DESIGN.md` final/revisado
- `docs/architecture/ADR_INDEX.md`
- `docs/architecture/OPEN_QUESTIONS.md`
- `docs/architecture/RISK_REGISTER.md`
- `docs/architecture/IMPLEMENTATION_ORDER.md`

## Conceitos para estudar
- architecture review
- trade-offs
- ADR lifecycle
- technical risk management
- evolutionary architecture
- architecture fitness functions

## Perguntas técnicas
- Onde exigimos strong consistency?
- Onde aceitamos eventual consistency?
- Qual é o primeiro gargalo provável?
- Qual componente podemos remover hoje sem quebrar invariantes?
- O que mudaria se multiplicássemos a carga por 10?
- Quais decisões são mais difíceis de reverter?
- Qual risco operacional ainda depende de processo humano?

## Dependências
- SD-001 a SD-009

## ADR
Esta issue consolida e revisa ADRs; não cria ADR por padrão para a própria revisão.

## Definition of Done
- [ ] System Design consolidado
- [ ] ADR index concluído
- [ ] Risk register concluído
- [ ] Open questions concluídas
- [ ] Implementation order definida
- [ ] Feedback de stakeholder registrado
- [ ] Blockers claros antes de retomar implementação crítica
- [ ] Consigo defender arquitetura, alternativas e trade-offs sem depender apenas dos diagramas
ISSUE_BODY

echo
log "System Design issues concluídas."
echo "Repo: $REPO"
echo "Milestone: M0.3 — System Design"
echo "Criadas/verificadas: EPIC-SD + SD-001..SD-010"
if [ -n "$PROJECT_ID" ]; then
  echo "Project: $PROJECT_ID"
else
  echo "Project: não informado (issues não adicionadas automaticamente ao Project)"
fi
