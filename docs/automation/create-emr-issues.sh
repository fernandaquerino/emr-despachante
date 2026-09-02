#!/bin/bash
set -euo pipefail

# ============================================================
# EMR Despachante — Criar labels, milestones e issues
# O repositório deve existir antes de rodar este script.
# NÃO usa jq.
#
# Uso:
#   1. Crie o repo manualmente no GitHub
#   2. Ajuste REPO abaixo se necessário
#   3. gh auth login
#   4. chmod +x docs/automation/create-emr-issues.sh
#   5. ./docs/automation/create-emr-issues.sh
#
# PROJECT_ID é opcional. Se vazio, cria somente labels/milestones/issues.
# ============================================================

REPO="fernandaquerino/emr-despachante"
OWNER="fernandaquerino"
PROJECT_ID="10"

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
    echo "Crie o repositório manualmente e/ou rode:"
    echo "  REPO=seu-user/emr-despachante ./docs/automation/create-emr-issues.sh"
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
  existing=$(LABEL_NAME="$name" gh label list     --repo "$REPO"     --limit 200     --json name     --jq '.[] | select(.name == env.LABEL_NAME) | .name'     2>/dev/null | head -n 1 || true)

  if [ -n "$existing" ]; then
    info "Label já existe: $name"
    return
  fi

  gh label create "$name"     --repo "$REPO"     --color "$color"     --description "$description" >/dev/null

  log "Label criada: $name"
}

create_milestone() {
  local title="$1"

  local existing
  existing=$(MILESTONE_TITLE="$title" gh api     "repos/$REPO/milestones?state=all&per_page=100"     --jq '.[] | select(.title == env.MILESTONE_TITLE) | .title'     2>/dev/null | head -n 1 || true)

  if [ -n "$existing" ]; then
    info "Milestone já existe: $title"
    return
  fi

  gh api "repos/$REPO/milestones"     --method POST     -f title="$title"     -f state="open" >/dev/null

  log "Milestone criada: $title"
}

create_issue() {
  local title="$1"
  local labels="$2"
  local milestone="$3"

  local body
  body="$(cat)"

  local existing_issue_url
  existing_issue_url=$(TITLE="$title" gh issue list     --repo "$REPO"     --state all     --limit 500     --json title,url     --jq '.[] | select(.title == env.TITLE) | .url'     2>/dev/null | head -n 1 || true)

  if [ -n "$existing_issue_url" ]; then
    info "Issue já existe, pulando → $title"
    return
  fi

  info "Criando: $title"

  local issue_url
  if issue_url=$(gh issue create     --repo "$REPO"     --title "$title"     --body "$body"     --label "$labels"     --milestone "$milestone"); then

    log "Criada → $issue_url"

    if [ -n "$PROJECT_ID" ]; then
      if ! gh project item-add "$PROJECT_ID"         --owner "$OWNER"         --url "$issue_url" >/dev/null 2>&1; then
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
info "Criando labels..."
create_label 'epic' '5319e7' 'Épico'
create_label 'user-story' '1d76db' 'User Story'
create_label 'study' 'fbca04' 'Estudo dirigido'
create_label 'prototype' 'bfd4f2' 'Protótipo / UX'
create_label 'design-system' 'd93f0b' 'Design System'
create_label 'frontend' '0075ca' 'Frontend / UI'
create_label 'backend' 'e4e669' 'Backend / API'
create_label 'database' '0e8a16' 'Banco de dados'
create_label 'payments' '0052cc' 'Pagamentos'
create_label 'async' 'd93f0b' 'Filas / Workers'
create_label 'security' 'b60205' 'Segurança / LGPD'
create_label 'observability' '7057ff' 'Observabilidade'
create_label 'performance' '0e8a16' 'Performance'
create_label 'aws' 'ff9900' 'AWS'
create_label 'devops' '006b75' 'DevOps / CI/CD'
create_label 'testing' 'bfe5bf' 'Testes'
create_label 'architecture' '006b75' 'Arquitetura'
create_label 'ai' 'a371f7' 'Inteligência Artificial'
create_label 'copilot' 'bf8700' 'EMR Copilot'
create_label 'rag' '8250df' 'RAG / Retrieval'
create_label 'evals' '1f6feb' 'AI Evals'
create_label 'docs' 'cfd3d7' 'Documentação'
create_label 'P0' 'b60205' 'Prioridade P0'
create_label 'P1' 'fbca04' 'Prioridade P1'
create_label 'P2' '0e8a16' 'Prioridade P2'

# ============================================================
# Milestones
# ============================================================
info "Criando milestones..."
create_milestone 'M0.1 — Design System'
create_milestone 'M0.2 — Product Prototype'
create_milestone 'M0 — Foundation'
create_milestone 'M1 — Auth & Roles'
create_milestone 'M2 — Customers'
create_milestone 'M3 — Vehicles & Detran Adapter'
create_milestone 'M4 — Fines'
create_milestone 'M5 — Licensing'
create_milestone 'M6 — Payments & Webhooks'
create_milestone 'M7 — Operator Cases'
create_milestone 'M8 — Operational Dashboard'
create_milestone 'M9 — Admin Panel'
create_milestone 'M10 — Notifications, History & Documents'
create_milestone 'M11 — Observability & Security'
create_milestone 'M12 — AI Copilot'
create_milestone 'M13 — AI Quality'
create_milestone 'M14 — AWS & Delivery'
create_milestone 'M15 — Scale & System Design'

# ============================================================
# Issues
# ============================================================

# ------------------------------------------------------------
# M0.1 — Design System
# ------------------------------------------------------------
info "=== M0.1 — Design System ==="

create_issue '[EPIC-DS] Design System & UI Foundation' 'epic,design-system,prototype,P0' 'M0.1 — Design System' <<'ISSUE_BODY'
## Objetivo
Definir a linguagem visual e as regras de UI do EMR Despachante antes da implementação das telas.

## Escopo
- direção visual;
- cores e psicologia das cores como heurística;
- tipografia;
- hierarchy;
- tokens;
- componentes;
- domain components;
- accessibility;
- documentação visual.

## Definition of Done
- [ ] US-DS-001 a US-DS-006 concluídas
- [ ] Design System aprovado para iniciar protótipo
ISSUE_BODY

create_issue '[US-DS-001] Pesquisa e direção visual' 'user-story,design-system,prototype,docs,P0' 'M0.1 — Design System' <<'ISSUE_BODY'
## Objetivo
Definir uma direção visual defensável para o EMR Despachante antes de desenhar as telas.

## Tasks
- [ ] Instalar/configurar a skill UI UX Pro Max no Claude Code
- [ ] Analisar docs/product/PRODUCT_DESCRIPTION.md, docs/product/SCREEN_SPECS.md, docs/product/DASHBOARD_SPEC.md e docs/product/STATUS_MODEL.md
- [ ] Pesquisar product type, UI styles, dashboard patterns e anti-patterns com a skill
- [ ] Comparar 3 direções visuais
- [ ] Comparar 3 paletas usando psicologia das cores como heurística
- [ ] Comparar 3 opções tipográficas
- [ ] Definir direção recomendada e documentar trade-offs
- [ ] Registrar anti-patterns específicos do EMR Despachante

## Critérios de aceite
- [ ] Existem 3 alternativas documentadas
- [ ] Existe 1 direção escolhida com justificativa
- [ ] Cores e tipografia não foram escolhidas apenas por preferência estética
- [ ] A direção transmite confiança, segurança, clareza, controle e eficiência

## Entregável
`docs/design-system/DESIGN_DIRECTION.md`
ISSUE_BODY

create_issue '[US-DS-002] Foundations: cores, tipografia e hierarquia' 'user-story,design-system,prototype,frontend,P0' 'M0.1 — Design System' <<'ISSUE_BODY'
## Objetivo
Definir os foundations visuais do produto.

## Tasks
- [ ] Primitive color palette
- [ ] Semantic color palette
- [ ] Success / Warning / Error / Info / Processing / Neutral
- [ ] Typography scale
- [ ] Regras para KPIs e números tabulares
- [ ] Hierarquia: page title, section title, body, metadata, label e caption
- [ ] Iconografia
- [ ] Spacing scale
- [ ] Radius scale
- [ ] Elevation
- [ ] Motion
- [ ] Breakpoints
- [ ] Grid/layout
- [ ] Contraste WCAG
- [ ] Focus states
- [ ] Reduced motion

## Critérios de aceite
- [ ] Status não dependem apenas de cor
- [ ] Texto comum atende contraste esperado
- [ ] Sistema funciona para dashboard denso e para área do proprietário

## Entregável
`docs/design-system/DESIGN_SYSTEM.md`
ISSUE_BODY

create_issue '[US-DS-003] Design Tokens e naming convention' 'user-story,design-system,frontend,P0' 'M0.1 — Design System' <<'ISSUE_BODY'
## Objetivo
Transformar decisões visuais em tokens implementáveis.

## Tasks
- [ ] Tokens primitivos de cor
- [ ] Tokens semânticos
- [ ] Tokens de texto
- [ ] Tokens de border
- [ ] Tokens de action
- [ ] Tokens de status
- [ ] Tokens de spacing
- [ ] Tokens de radius
- [ ] Tokens de elevation
- [ ] Tokens de motion
- [ ] Definir naming convention
- [ ] Propor CSS variables
- [ ] Propor mapeamento Tailwind

## Critérios de aceite
- [ ] Componentes não dependem diretamente de HEX
- [ ] Tokens semânticos têm intenção clara
- [ ] Status operacionais/financeiros possuem tokens próprios quando necessário

## Entregável
`docs/design-system/TOKENS.md`
ISSUE_BODY

create_issue '[US-DS-004] Componentes base do Design System' 'user-story,design-system,frontend,prototype,P0' 'M0.1 — Design System' <<'ISSUE_BODY'
## Objetivo
Definir anatomia, variantes e estados dos componentes reutilizáveis.

## Tasks
- [ ] Button / IconButton / Link
- [ ] Input / Textarea
- [ ] Select / Combobox / Search
- [ ] Checkbox / Radio / Switch
- [ ] Tabs / Breadcrumb
- [ ] Alert / Toast / Tooltip
- [ ] Skeleton / Spinner / Progress
- [ ] Modal / Drawer / Popover / Dropdown
- [ ] Badge / StatusBadge / PriorityBadge
- [ ] Table / Pagination / FilterBar
- [ ] EmptyState / ErrorState / StaleDataBanner
- [ ] Timeline / KPI Card
- [ ] Documentar hover, focus, active, selected, loading, disabled e error

## Critérios de aceite
- [ ] Cada componente prioritário possui variants e states
- [ ] Componentes críticos possuem comportamento de teclado documentado

## Entregável
`docs/design-system/COMPONENTS.md`
ISSUE_BODY

create_issue '[US-DS-005] Componentes de domínio do EMR Despachante' 'user-story,design-system,frontend,prototype,P0' 'M0.1 — Design System' <<'ISSUE_BODY'
## Objetivo
Definir componentes específicos do domínio sem espalhar padrões inconsistentes pelas telas.

## Tasks
- [ ] CustomerSummary
- [ ] VehicleSummary
- [ ] CaseCard
- [ ] CaseTimeline
- [ ] PaymentSummary
- [ ] PaymentStatus
- [ ] ServiceStatusStepper
- [ ] ReconciliationStatus
- [ ] ProcessingState
- [ ] GlobalSearch result item
- [ ] CopilotPanel
- [ ] AI tool result card
- [ ] AI write-confirmation card

## Critérios de aceite
- [ ] Mesmos estados de negócio aparecem visualmente iguais em todas as telas
- [ ] Componentes de IA seguem a linguagem do produto, sem estética genérica “AI purple”

## Entregável
`docs/design-system/DOMAIN_COMPONENTS.md`
ISSUE_BODY

create_issue '[US-DS-006] Documentação e página visual do Design System' 'user-story,design-system,docs,prototype,P1' 'M0.1 — Design System' <<'ISSUE_BODY'
## Objetivo
Ter uma fonte visual única antes de multiplicar telas.

## Tasks
- [ ] Criar página Foundations no Claude Design/Figma
- [ ] Exibir paleta e semantic colors
- [ ] Exibir escala tipográfica
- [ ] Exibir spacing/radius/elevation
- [ ] Exibir componentes prioritários
- [ ] Exibir todos os principais states
- [ ] Exibir exemplos de tabelas densas
- [ ] Exibir status financeiros e operacionais
- [ ] Revisar consistência

## Critérios de aceite
- [ ] É possível construir uma tela nova sem inventar novo estilo
- [ ] Tokens documentados batem com o que está no protótipo
ISSUE_BODY

# ------------------------------------------------------------
# M0.2 — Product Prototype
# ------------------------------------------------------------
info "=== M0.2 — Product Prototype ==="

create_issue '[EPIC-PT] Product Prototype' 'epic,prototype,design-system,P0' 'M0.2 — Product Prototype' <<'ISSUE_BODY'
## Objetivo
Criar um protótipo navegável do produto antes de implementar as features.

## Definition of Done
- [ ] US-PT-001 a US-PT-011 concluídas
- [ ] Fluxos Proprietário, Operadora, Admin e Copilot navegáveis
- [ ] Handoff pronto
ISSUE_BODY

create_issue '[US-PT-001] Arquitetura do protótipo e App Shell' 'user-story,prototype,design-system,frontend,P0' 'M0.2 — Product Prototype' <<'ISSUE_BODY'
## Objetivo
Criar a estrutura navegável comum das áreas internas.

## Tasks
- [ ] Sidebar Operadora
- [ ] Sidebar Admin
- [ ] Header
- [ ] Busca global
- [ ] Notificações
- [ ] User menu
- [ ] Content layout
- [ ] Desktop 1440
- [ ] Tablet
- [ ] Mobile simplificado
- [ ] Definir padrões de breadcrumb/page header

## Critérios de aceite
- [ ] Navegação principal está consistente
- [ ] Área Operadora e Admin são diferenciadas por conteúdo, não por um design completamente diferente
ISSUE_BODY

create_issue '[US-PT-002] Protótipo do Dashboard Operacional' 'user-story,prototype,frontend,P0' 'M0.2 — Product Prototype' <<'ISSUE_BODY'
## Objetivo
Validar a tela principal da operadora.

## Tasks
- [ ] Cards: casos abertos, meus casos, críticos, aguardando cliente/órgão
- [ ] Fila prioritária
- [ ] Casos sem responsável
- [ ] Casos mais antigos
- [ ] Clientes com pendência
- [ ] Performance pessoal sem ranking punitivo
- [ ] Loading
- [ ] Empty
- [ ] Partial failure
- [ ] Stale state quando aplicável
- [ ] Copilot fechado e aberto
- [ ] Desktop + mobile simplificado

## Critérios de aceite
- [ ] Em poucos segundos fica claro o que precisa ser resolvido agora
- [ ] A fila tem mais destaque que gráficos decorativos
ISSUE_BODY

create_issue '[US-PT-003] Protótipo da fila e detalhe de Casos' 'user-story,prototype,frontend,P0' 'M0.2 — Product Prototype' <<'ISSUE_BODY'
## Objetivo
Validar o principal workflow humano da operação.

## Tasks
- [ ] Tabs Meus casos / Não atribuídos / Todos admin
- [ ] Filtros
- [ ] Priority/status badges
- [ ] Caso sem responsável
- [ ] Fluxo Assumir
- [ ] Estado de conflito: outra operadora assumiu
- [ ] Detalhe do caso
- [ ] Motivo
- [ ] Próxima ação
- [ ] Contexto de cliente/veículo/pagamento
- [ ] Timeline
- [ ] Notas
- [ ] Alteração de status
- [ ] Resolver/escalar
- [ ] Resumo por IA
- [ ] Gerar mensagem por IA

## Critérios de aceite
- [ ] Dashboard → caso → cliente/veículo é navegável
- [ ] Estado concorrente de atribuição está representado
ISSUE_BODY

create_issue '[US-PT-004] Protótipo de Clientes' 'user-story,prototype,frontend,P0' 'M0.2 — Product Prototype' <<'ISSUE_BODY'
## Objetivo
Criar a visão operacional de clientes.

## Tasks
- [ ] Lista de clientes
- [ ] Cards de resumo
- [ ] Busca
- [ ] Filtros
- [ ] Paginação
- [ ] Próxima ação na tabela
- [ ] Detalhe do cliente
- [ ] Tabs Visão geral / Veículos / Pedidos / Pagamentos / Casos / Documentos / Histórico / Notas
- [ ] Empty/loading/error
- [ ] Cliente com caso crítico
- [ ] Cliente regular

## Critérios de aceite
- [ ] A operadora identifica rapidamente por que cada cliente requer ou não atenção
ISSUE_BODY

create_issue '[US-PT-005] Protótipo de Veículos, multas e licenciamento' 'user-story,prototype,frontend,P0' 'M0.2 — Product Prototype' <<'ISSUE_BODY'
## Objetivo
Validar a navegação por veículo e seus serviços.

## Tasks
- [ ] Lista operacional de veículos
- [ ] Detalhe do veículo
- [ ] Status geral
- [ ] StaleDataBanner
- [ ] Multas
- [ ] Detalhe da multa
- [ ] Licenciamento elegível
- [ ] Licenciamento bloqueado
- [ ] Pedidos em andamento
- [ ] Documentos
- [ ] Histórico
- [ ] Estado pagamento confirmado + baixa processando

## Critérios de aceite
- [ ] Status intermediários são claros
- [ ] Licenciamento bloqueado explica o motivo e oferece próxima ação
ISSUE_BODY

create_issue '[US-PT-006] Protótipo financeiro: Checkout, Pedido e Reconciliação' 'user-story,prototype,frontend,payments,P0' 'M0.2 — Product Prototype' <<'ISSUE_BODY'
## Objetivo
Representar o fluxo financeiro sem confundir checkout com pagamento confirmado.

## Tasks
- [ ] Checkout
- [ ] Breakdown valor/taxa/total
- [ ] Pending
- [ ] Paid
- [ ] Failed
- [ ] Expired
- [ ] Pedido com stepper
- [ ] Processando baixa
- [ ] Concluído
- [ ] Reconciliação Admin
- [ ] Payment local x provider
- [ ] Drawer de divergência
- [ ] Fluxo criar/abrir caso

## Critérios de aceite
- [ ] Nenhuma tela chama de “Pago” antes da confirmação adequada
- [ ] Divergência financeira possui caminho de investigação
ISSUE_BODY

create_issue '[US-PT-007] Protótipo do Dashboard Admin' 'user-story,prototype,frontend,P0' 'M0.2 — Product Prototype' <<'ISSUE_BODY'
## Objetivo
Validar a visão executiva e operacional do negócio.

## Tasks
- [ ] Cards financeiros
- [ ] Cards operacionais
- [ ] Receita por período
- [ ] Volume por serviço
- [ ] Funil operacional
- [ ] Casos abertos x resolvidos
- [ ] Problemas que exigem atenção
- [ ] Atividade recente
- [ ] Filtro de período
- [ ] CTA Resumir operação com IA

## Critérios de aceite
- [ ] Dashboard Admin responde “como está a operação e onde está o gargalo?”
- [ ] É claramente diferente do Dashboard da Operadora
ISSUE_BODY

create_issue '[US-PT-008] Protótipo de Serviços, Operadoras e Auditoria' 'user-story,prototype,frontend,P1' 'M0.2 — Product Prototype' <<'ISSUE_BODY'
## Objetivo
Cobrir administração secundária do negócio.

## Tasks
- [ ] Serviços e preços
- [ ] Editar serviço
- [ ] Ativar/desativar
- [ ] Lista de operadoras
- [ ] Convidar
- [ ] Suspender/reativar
- [ ] Detalhe da operadora
- [ ] Auditoria
- [ ] Filtros de audit log

## Critérios de aceite
- [ ] Ações administrativas possuem confirmação quando destrutivas
- [ ] Audit log não possui ações de editar/excluir
ISSUE_BODY

create_issue '[US-PT-009] Protótipo da área do Proprietário' 'user-story,prototype,frontend,P0' 'M0.2 — Product Prototype' <<'ISSUE_BODY'
## Objetivo
Validar o fluxo cliente final.

## Tasks
- [ ] Login
- [ ] Cadastro
- [ ] Meus veículos
- [ ] Cadastrar veículo
- [ ] Detalhe do veículo
- [ ] Detalhe da multa
- [ ] Checkout
- [ ] Acompanhamento do pedido
- [ ] Histórico
- [ ] Documentos
- [ ] Chatbot do proprietário
- [ ] Loading/empty/error/stale

## Critérios de aceite
- [ ] Fluxo Login → Veículo → Multa → Checkout → Pedido é navegável
ISSUE_BODY

create_issue '[US-PT-010] Protótipo do EMR Copilot' 'user-story,prototype,ai,frontend,P0' 'M0.2 — Product Prototype' <<'ISSUE_BODY'
## Objetivo
Validar IA integrada ao fluxo, não como chatbot genérico.

## Tasks
- [ ] Trigger no header
- [ ] Side panel
- [ ] Suggested prompts
- [ ] Streaming/loading
- [ ] Tool result cards
- [ ] Links para cliente/veículo/caso
- [ ] Partial tool failure
- [ ] RAG references
- [ ] Resumo de caso
- [ ] Resumo da operação
- [ ] Draft de mensagem
- [ ] Modal de write confirmation
- [ ] Estado Copilot indisponível

## Critérios de aceite
- [ ] IA parece parte do EMR
- [ ] Write action nunca acontece sem confirmação explícita
ISSUE_BODY

create_issue '[US-PT-011] Protótipo navegável e Design QA' 'user-story,prototype,design-system,docs,P0' 'M0.2 — Product Prototype' <<'ISSUE_BODY'
## Objetivo
Conectar os principais fluxos e validar consistência antes da implementação.

## Tasks
- [ ] Conectar fluxo Proprietário
- [ ] Conectar fluxo Operadora
- [ ] Conectar fluxo Admin
- [ ] Conectar fluxo IA
- [ ] Revisar hierarquia
- [ ] Revisar componentes duplicados
- [ ] Revisar status
- [ ] Revisar contraste
- [ ] Revisar teclado/focus conceitualmente
- [ ] Revisar responsive
- [ ] Corrigir inconsistências no Design System
- [ ] Preparar handoff

## Critérios de aceite
- [ ] 5 fluxos principais do SCREEN_SPECS estão navegáveis
- [ ] Nenhuma tela cria novo padrão visual sem necessidade
- [ ] Design System é atualizado quando o protótipo revela problema
ISSUE_BODY

# ------------------------------------------------------------
# M0 — Foundation
# ------------------------------------------------------------
info "=== M0 — Foundation ==="

create_issue '[E0] Foundation' 'epic,architecture,P0' 'M0 — Foundation' <<'ISSUE_BODY'
## Objetivo do épico
Entregar **Foundation** com regras, UX, testes e documentação suficientes para demonstrar o fluxo.

## Definition of Done
- [ ] User Stories P0 concluídas
- [ ] Fluxo demonstrável no frontend
- [ ] Regras de negócio testadas
- [ ] Estados de erro/empty/loading tratados
- [ ] ADRs relevantes concluídos
- [ ] Perguntas técnicas do épico respondidas
ISSUE_BODY

# ------------------------------------------------------------
# M1 — Auth & Roles
# ------------------------------------------------------------
info "=== M1 — Auth & Roles ==="

create_issue '[E1] Authentication & Roles' 'epic,architecture,P0' 'M1 — Auth & Roles' <<'ISSUE_BODY'
## Objetivo do épico
Entregar **Authentication & Roles** com regras, UX, testes e documentação suficientes para demonstrar o fluxo.

## Definition of Done
- [ ] User Stories P0 concluídas
- [ ] Fluxo demonstrável no frontend
- [ ] Regras de negócio testadas
- [ ] Estados de erro/empty/loading tratados
- [ ] ADRs relevantes concluídos
- [ ] Perguntas técnicas do épico respondidas
ISSUE_BODY

# ------------------------------------------------------------
# M2 — Customers
# ------------------------------------------------------------
info "=== M2 — Customers ==="

create_issue '[E2] Customers' 'epic,architecture,P0' 'M2 — Customers' <<'ISSUE_BODY'
## Objetivo do épico
Entregar **Customers** com regras, UX, testes e documentação suficientes para demonstrar o fluxo.

## Definition of Done
- [ ] User Stories P0 concluídas
- [ ] Fluxo demonstrável no frontend
- [ ] Regras de negócio testadas
- [ ] Estados de erro/empty/loading tratados
- [ ] ADRs relevantes concluídos
- [ ] Perguntas técnicas do épico respondidas
ISSUE_BODY

# ------------------------------------------------------------
# M3 — Vehicles & Detran Adapter
# ------------------------------------------------------------
info "=== M3 — Vehicles & Detran Adapter ==="

create_issue '[E3] Vehicles & Detran Adapter' 'epic,architecture,P0' 'M3 — Vehicles & Detran Adapter' <<'ISSUE_BODY'
## Objetivo do épico
Entregar **Vehicles & Detran Adapter** com regras, UX, testes e documentação suficientes para demonstrar o fluxo.

## Definition of Done
- [ ] User Stories P0 concluídas
- [ ] Fluxo demonstrável no frontend
- [ ] Regras de negócio testadas
- [ ] Estados de erro/empty/loading tratados
- [ ] ADRs relevantes concluídos
- [ ] Perguntas técnicas do épico respondidas
ISSUE_BODY

# ------------------------------------------------------------
# M4 — Fines
# ------------------------------------------------------------
info "=== M4 — Fines ==="

create_issue '[E4] Fines' 'epic,architecture,P0' 'M4 — Fines' <<'ISSUE_BODY'
## Objetivo do épico
Entregar **Fines** com regras, UX, testes e documentação suficientes para demonstrar o fluxo.

## Definition of Done
- [ ] User Stories P0 concluídas
- [ ] Fluxo demonstrável no frontend
- [ ] Regras de negócio testadas
- [ ] Estados de erro/empty/loading tratados
- [ ] ADRs relevantes concluídos
- [ ] Perguntas técnicas do épico respondidas
ISSUE_BODY

# ------------------------------------------------------------
# M5 — Licensing
# ------------------------------------------------------------
info "=== M5 — Licensing ==="

create_issue '[E5] Licensing' 'epic,architecture,P0' 'M5 — Licensing' <<'ISSUE_BODY'
## Objetivo do épico
Entregar **Licensing** com regras, UX, testes e documentação suficientes para demonstrar o fluxo.

## Definition of Done
- [ ] User Stories P0 concluídas
- [ ] Fluxo demonstrável no frontend
- [ ] Regras de negócio testadas
- [ ] Estados de erro/empty/loading tratados
- [ ] ADRs relevantes concluídos
- [ ] Perguntas técnicas do épico respondidas
ISSUE_BODY

# ------------------------------------------------------------
# M6 — Payments & Webhooks
# ------------------------------------------------------------
info "=== M6 — Payments & Webhooks ==="

create_issue '[E6] Payments & Webhooks' 'epic,architecture,P0' 'M6 — Payments & Webhooks' <<'ISSUE_BODY'
## Objetivo do épico
Entregar **Payments & Webhooks** com regras, UX, testes e documentação suficientes para demonstrar o fluxo.

## Definition of Done
- [ ] User Stories P0 concluídas
- [ ] Fluxo demonstrável no frontend
- [ ] Regras de negócio testadas
- [ ] Estados de erro/empty/loading tratados
- [ ] ADRs relevantes concluídos
- [ ] Perguntas técnicas do épico respondidas
ISSUE_BODY

# ------------------------------------------------------------
# M7 — Operator Cases
# ------------------------------------------------------------
info "=== M7 — Operator Cases ==="

create_issue '[E7] Operator Cases' 'epic,architecture,P0' 'M7 — Operator Cases' <<'ISSUE_BODY'
## Objetivo do épico
Entregar **Operator Cases** com regras, UX, testes e documentação suficientes para demonstrar o fluxo.

## Definition of Done
- [ ] User Stories P0 concluídas
- [ ] Fluxo demonstrável no frontend
- [ ] Regras de negócio testadas
- [ ] Estados de erro/empty/loading tratados
- [ ] ADRs relevantes concluídos
- [ ] Perguntas técnicas do épico respondidas
ISSUE_BODY

# ------------------------------------------------------------
# M8 — Operational Dashboard
# ------------------------------------------------------------
info "=== M8 — Operational Dashboard ==="

create_issue '[E8] Operational Dashboard' 'epic,architecture,P0' 'M8 — Operational Dashboard' <<'ISSUE_BODY'
## Objetivo do épico
Entregar **Operational Dashboard** com regras, UX, testes e documentação suficientes para demonstrar o fluxo.

## Definition of Done
- [ ] User Stories P0 concluídas
- [ ] Fluxo demonstrável no frontend
- [ ] Regras de negócio testadas
- [ ] Estados de erro/empty/loading tratados
- [ ] ADRs relevantes concluídos
- [ ] Perguntas técnicas do épico respondidas
ISSUE_BODY

# ------------------------------------------------------------
# M9 — Admin Panel
# ------------------------------------------------------------
info "=== M9 — Admin Panel ==="

create_issue '[E9] Admin Panel' 'epic,architecture,P0' 'M9 — Admin Panel' <<'ISSUE_BODY'
## Objetivo do épico
Entregar **Admin Panel** com regras, UX, testes e documentação suficientes para demonstrar o fluxo.

## Definition of Done
- [ ] User Stories P0 concluídas
- [ ] Fluxo demonstrável no frontend
- [ ] Regras de negócio testadas
- [ ] Estados de erro/empty/loading tratados
- [ ] ADRs relevantes concluídos
- [ ] Perguntas técnicas do épico respondidas
ISSUE_BODY

# ------------------------------------------------------------
# M10 — Notifications, History & Documents
# ------------------------------------------------------------
info "=== M10 — Notifications, History & Documents ==="

create_issue '[E10] Notifications, History & Documents' 'epic,architecture,P0' 'M10 — Notifications, History & Documents' <<'ISSUE_BODY'
## Objetivo do épico
Entregar **Notifications, History & Documents** com regras, UX, testes e documentação suficientes para demonstrar o fluxo.

## Definition of Done
- [ ] User Stories P0 concluídas
- [ ] Fluxo demonstrável no frontend
- [ ] Regras de negócio testadas
- [ ] Estados de erro/empty/loading tratados
- [ ] ADRs relevantes concluídos
- [ ] Perguntas técnicas do épico respondidas
ISSUE_BODY

# ------------------------------------------------------------
# M11 — Observability & Security
# ------------------------------------------------------------
info "=== M11 — Observability & Security ==="

create_issue '[E11] Observability & Security' 'epic,architecture,P0' 'M11 — Observability & Security' <<'ISSUE_BODY'
## Objetivo do épico
Entregar **Observability & Security** com regras, UX, testes e documentação suficientes para demonstrar o fluxo.

## Definition of Done
- [ ] User Stories P0 concluídas
- [ ] Fluxo demonstrável no frontend
- [ ] Regras de negócio testadas
- [ ] Estados de erro/empty/loading tratados
- [ ] ADRs relevantes concluídos
- [ ] Perguntas técnicas do épico respondidas
ISSUE_BODY

# ------------------------------------------------------------
# M14 — AWS & Delivery
# ------------------------------------------------------------
info "=== M14 — AWS & Delivery ==="

create_issue '[E12] AWS & Delivery' 'epic,architecture,P0' 'M14 — AWS & Delivery' <<'ISSUE_BODY'
## Objetivo do épico
Entregar **AWS & Delivery** com regras, UX, testes e documentação suficientes para demonstrar o fluxo.

## Definition of Done
- [ ] User Stories P0 concluídas
- [ ] Fluxo demonstrável no frontend
- [ ] Regras de negócio testadas
- [ ] Estados de erro/empty/loading tratados
- [ ] ADRs relevantes concluídos
- [ ] Perguntas técnicas do épico respondidas
ISSUE_BODY

# ------------------------------------------------------------
# M15 — Scale & System Design
# ------------------------------------------------------------
info "=== M15 — Scale & System Design ==="

create_issue '[E13] Scale & System Design' 'epic,architecture,P0' 'M15 — Scale & System Design' <<'ISSUE_BODY'
## Objetivo do épico
Entregar **Scale & System Design** com regras, UX, testes e documentação suficientes para demonstrar o fluxo.

## Definition of Done
- [ ] User Stories P0 concluídas
- [ ] Fluxo demonstrável no frontend
- [ ] Regras de negócio testadas
- [ ] Estados de erro/empty/loading tratados
- [ ] ADRs relevantes concluídos
- [ ] Perguntas técnicas do épico respondidas
ISSUE_BODY

# ------------------------------------------------------------
# M0 — Foundation
# ------------------------------------------------------------
info "=== M0 — Foundation ==="

create_issue '[US-001] Inicializar monorepo' 'user-story,study,P0,frontend,backend,devops' 'M0 — Foundation' <<'ISSUE_BODY'
## Contexto
A solução terá web, API, worker e packages compartilhados.

## User Story
> Como desenvolvedora, quero uma estrutura base consistente para evoluir o produto sem duplicar configuração.

## Regras de negócio
- TypeScript strict obrigatório.
- Nenhum segredo no repositório.

## Frontend
- [ ] Criar apps/web em Next.js.
- [ ] Criar AppShell inicial.
- [ ] Criar rota health visual simples opcional.

## Backend
- [ ] Criar apps/api NestJS.
- [ ] Criar apps/worker.

## Banco / Persistência
_Não se aplica._

## Protótipo / UX
- [ ] Criar frame inicial de login e shell interno apenas para validar navegação.

## Testes
- [ ] Configurar test runner.
- [ ] Adicionar teste smoke.

## Critérios de aceite
- `pnpm dev` sobe os apps principais.
- `pnpm typecheck` cobre workspace.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- monorepo
- workspace
- dependency boundaries

## Perguntas técnicas
- Por que monorepo aqui?
- Quando polyrepo seria melhor?

## Dependências
_Não se aplica._

## ADR
ADR-000 monorepo.

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

create_issue '[US-002] Ambiente local com Postgres e Redis' 'user-story,study,P0,database,devops' 'M0 — Foundation' <<'ISSUE_BODY'
## Contexto
Banco e cache precisam ser reproduzíveis.

## User Story
> Como desenvolvedora, quero subir as dependências locais com um único comando.

## Regras de negócio
_Não se aplica._

## Frontend
_Não se aplica._

## Backend
- [ ] Configurar conexão por env validada.

## Banco / Persistência
- [ ] Criar compose Postgres.
- [ ] Criar Redis.
- [ ] Adicionar healthchecks e volumes.

## Protótipo / UX
_Não se aplica._

## Testes
- [ ] Teste de conexão da aplicação.

## Critérios de aceite
- Compose fica healthy.
- Reset local documentado.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- Docker
- volumes
- networks

## Perguntas técnicas
- Volume e bind mount são a mesma coisa?

## Dependências
_Não se aplica._

## ADR
_Não obrigatório._

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

create_issue '[US-003] CI e quality gates' 'user-story,study,P0,devops,testing' 'M0 — Foundation' <<'ISSUE_BODY'
## Contexto
PR quebrada precisa falhar antes de merge.

## User Story
> Como desenvolvedora, quero lint, typecheck, tests e build automatizados.

## Regras de negócio
_Não se aplica._

## Frontend
_Não se aplica._

## Backend
_Não se aplica._

## Banco / Persistência
_Não se aplica._

## Protótipo / UX
_Não se aplica._

## Testes
- [ ] Adicionar workflow de PR.
- [ ] Lint.
- [ ] Typecheck.
- [ ] Unit tests.
- [ ] Build.

## Critérios de aceite
- Erro de TS deixa check vermelho.
- Pipeline limpo fica verde.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- CI
- quality gates

## Perguntas técnicas
- Build e typecheck separados ajudam em quê?

## Dependências
_Não se aplica._

## ADR
_Não obrigatório._

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

# ------------------------------------------------------------
# M1 — Auth & Roles
# ------------------------------------------------------------
info "=== M1 — Auth & Roles ==="

create_issue '[US-101] Cadastro do proprietário' 'user-story,study,P0,frontend,backend,security' 'M1 — Auth & Roles' <<'ISSUE_BODY'
## Contexto
Cliente final precisa entrar no produto sem intervenção da operação.

## User Story
> Como proprietário, quero criar minha conta para cadastrar veículos.

## Regras de negócio
- CPF único conforme política.
- Email único.
- Senha nunca armazenada em texto puro.

## Frontend
- [ ] Tela cadastro.
- [ ] Validação inline.
- [ ] Consentimento termos.
- [ ] Success redirect para primeiro veículo.

## Backend
- [ ] POST /auth/register.
- [ ] Normalizar email/CPF.
- [ ] Hash.
- [ ] Tratar duplicidade.

## Banco / Persistência
- [ ] Tabela users.
- [ ] Campos PII protegidos.

## Protótipo / UX
- [ ] Protótipo da tela Cadastro com erro de CPF/email duplicado.

## Testes
- [ ] Cadastro válido.
- [ ] Email duplicado.
- [ ] Senha inválida.

## Critérios de aceite
- Conta criada sem expor hash.
- Cliente segue para cadastrar veículo.

## Observabilidade
_Não se aplica._

## Segurança
- Não logar senha.
- Mascarar CPF em logs.

## Conceitos para estudar
- hash
- validation
- PII

## Perguntas técnicas
- Hash e criptografia são iguais?

## Dependências
_Não se aplica._

## ADR
_Não obrigatório._

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

create_issue '[US-102] Login, sessão e logout' 'user-story,study,P0,frontend,backend,security' 'M1 — Auth & Roles' <<'ISSUE_BODY'
## Contexto
Todos os papéis acessam por login, mas recebem áreas diferentes.

## User Story
> Como usuário, quero autenticar com sessão segura.

## Regras de negócio
- Role define área disponível.
- Conta desativada não autentica.

## Frontend
- [ ] Tela login.
- [ ] Loading.
- [ ] Credencial inválida.
- [ ] Conta suspensa.
- [ ] Redirect por role.

## Backend
- [ ] POST /auth/login.
- [ ] Criar sessão/cookie.
- [ ] Guard.
- [ ] Logout.

## Banco / Persistência
- [ ] Session store se estratégia stateful for escolhida.

## Protótipo / UX
- [ ] Criar variações Login proprietário / operação apenas pelo redirect, não layouts diferentes.

## Testes
- [ ] Login válido.
- [ ] Senha inválida.
- [ ] Conta suspensa.
- [ ] Acesso protegido.

## Critérios de aceite
- OPERADORA não acessa rota admin.
- PROPRIETÁRIO não acessa /ops.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- AuthN
- AuthZ
- cookies
- CSRF

## Perguntas técnicas
- Por que esconder menu não protege API?

## Dependências
_Não se aplica._

## ADR
ADR auth/session strategy.

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

create_issue '[US-103] Convite e ativação de operadora' 'user-story,study,P0,frontend,backend,security' 'M1 — Auth & Roles' <<'ISSUE_BODY'
## Contexto
Operadoras são criadas pelo admin.

## User Story
> Como admin, quero convidar uma operadora sem definir a senha por ela.

## Regras de negócio
- Token uso único.
- Convite expira.
- Desativar acesso não apaga histórico.

## Frontend
- [ ] Tela convite admin.
- [ ] Tela ativação.
- [ ] Estados expirado/usado.

## Backend
- [ ] Criar invitation.
- [ ] Enviar email mock.
- [ ] Aceitar convite.
- [ ] Definir senha.

## Banco / Persistência
- [ ] operator_invitations.

## Protótipo / UX
- [ ] Modal Convidar operadora.
- [ ] Tela Ativar conta.

## Testes
- [ ] Token válido.
- [ ] Expirado.
- [ ] Reutilizado.

## Critérios de aceite
- Convite usado não funciona de novo.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- one-time token
- invitation lifecycle

## Perguntas técnicas
- Guardar token puro ou hash?

## Dependências
_Não se aplica._

## ADR
_Não obrigatório._

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

# ------------------------------------------------------------
# M2 — Customers
# ------------------------------------------------------------
info "=== M2 — Customers ==="

create_issue '[US-201] Lista de clientes da operação' 'user-story,study,P0,frontend,backend,database' 'M2 — Customers' <<'ISSUE_BODY'
## Contexto
Admin e operação precisam acompanhar clientes sem depender de planilha.

## User Story
> Como operadora, quero localizar rapidamente clientes e sua situação.

## Regras de negócio
- Somente clientes da operação.
- Paginação server-side.

## Frontend
- [ ] Tela Clientes.
- [ ] Busca.
- [ ] Filtros.
- [ ] Tabela.
- [ ] Badges.
- [ ] Próxima ação.
- [ ] Pagination.
- [ ] Loading/empty/error.

## Backend
- [ ] GET /customers.
- [ ] Filtros server-side.
- [ ] Busca normalizada.

## Banco / Persistência
- [ ] Índices de busca.
- [ ] Query agregando contagem de veículos/casos.

## Protótipo / UX
- [ ] Criar tela conforme SCREEN_SPECS: cards de resumo + tabela de clientes.

## Testes
- [ ] Busca.
- [ ] Filtro pendência.
- [ ] Paginação.

## Critérios de aceite
- Cliente com caso crítico é identificável sem abrir detalhe.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- pagination
- search UX
- aggregation

## Perguntas técnicas
- Por que não carregar todos e filtrar em React?

## Dependências
_Não se aplica._

## ADR
_Não obrigatório._

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

create_issue '[US-202] Detalhe do cliente' 'user-story,study,P0,frontend,backend' 'M2 — Customers' <<'ISSUE_BODY'
## Contexto
A operação precisa entender contexto completo do cliente.

## User Story
> Como operadora, quero ver veículos, pedidos, pagamentos, casos e histórico do cliente.

## Regras de negócio
- Notas internas não aparecem ao proprietário.
- CPF exibido mascarado.

## Frontend
- [ ] Header cliente.
- [ ] Cards resumo.
- [ ] Tabs Visão geral/Veículos/Pedidos/Pagamentos/Casos/Documentos/Histórico/Notas.
- [ ] Ações rápidas.

## Backend
- [ ] GET customer summary.
- [ ] Endpoints/queries por tab.
- [ ] POST internal note.

## Banco / Persistência
- [ ] customer_notes append-only ou versionadas conforme decisão.

## Protótipo / UX
- [ ] Prototipar todas as tabs, mesmo que algumas usem dados mockados.

## Testes
- [ ] Acesso.
- [ ] Notas internas.
- [ ] Timeline.

## Critérios de aceite
- A operadora chega do cliente ao veículo/pedido/caso em até 1 clique dentro da página.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- information architecture
- timeline UX

## Perguntas técnicas
- O que é dado interno vs cliente?

## Dependências
_Não se aplica._

## ADR
_Não obrigatório._

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

create_issue '[US-203] Busca global' 'user-story,study,P0,frontend,backend,database,performance' 'M2 — Customers' <<'ISSUE_BODY'
## Contexto
Operação precisa encontrar entidade em segundos.

## User Story
> Como operadora, quero buscar por cliente ou placa em qualquer tela interna.

## Regras de negócio
- Limite de resultados.
- Não retornar PII desnecessária.

## Frontend
- [ ] Campo no header.
- [ ] Dropdown agrupado Cliente/Veículo/Pedido.
- [ ] Keyboard navigation.
- [ ] Debounce.

## Backend
- [ ] GET /search?q=.
- [ ] Normalização.

## Banco / Persistência
- [ ] Índice placa.
- [ ] Estratégia nome.

## Protótipo / UX
- [ ] Componente GlobalSearch aberto com resultados de diferentes tipos.

## Testes
- [ ] Busca placa formatada/não formatada.
- [ ] Busca nome.

## Critérios de aceite
- Placa ABC1D23 e ABC-1D23 encontram o mesmo veículo.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- debounce
- indexing
- trigram awareness

## Perguntas técnicas
- Quando ILIKE deixa de servir?

## Dependências
_Não se aplica._

## ADR
_Não obrigatório._

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

# ------------------------------------------------------------
# M3 — Vehicles & Detran Adapter
# ------------------------------------------------------------
info "=== M3 — Vehicles & Detran Adapter ==="

create_issue '[US-301] Cadastro de veículo' 'user-story,study,P0,frontend,backend,database' 'M3 — Vehicles & Detran Adapter' <<'ISSUE_BODY'
## Contexto
Veículo é a entidade central do fluxo.

## User Story
> Como proprietário ou operadora autorizada, quero cadastrar veículo.

## Regras de negócio
- Placa normalizada.
- RENAVAM protegido.
- Owner obrigatório.

## Frontend
- [ ] Tela cadastro.
- [ ] Form states.
- [ ] Consultando após salvar.

## Backend
- [ ] POST /vehicles.
- [ ] Validação ownership.

## Banco / Persistência
- [ ] vehicles.
- [ ] Unique plate conforme regra de produto.

## Protótipo / UX
- [ ] Tela Cadastrar veículo + loading de primeira consulta.

## Testes
- [ ] Formato inválido.
- [ ] Owner.

## Critérios de aceite
- Após cadastro inicia primeira consulta.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- normalization
- ownership

## Perguntas técnicas
- Placa é identificador imutável?

## Dependências
_Não se aplica._

## ADR
_Não obrigatório._

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

create_issue '[US-302] DetranClient adapter mock resiliente' 'user-story,study,P0,backend,architecture,testing' 'M3 — Vehicles & Detran Adapter' <<'ISSUE_BODY'
## Contexto
Integração oficial real não faz parte do projeto.

## User Story
> Como sistema, quero isolar a dependência governamental por interface.

## Regras de negócio
- Core não conhece mock.
- Mock pode simular sucesso, timeout e erro.

## Frontend
_Não se aplica._

## Backend
- [ ] Interface DetranClient.
- [ ] Mock configurável.
- [ ] Timeout.
- [ ] Fake determinístico tests.

## Banco / Persistência
_Não se aplica._

## Protótipo / UX
_Não se aplica._

## Testes
- [ ] Timeout.
- [ ] Erro.
- [ ] Sucesso.

## Critérios de aceite
- Trocar implementação não muda domínio.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- ports/adapters
- timeouts
- resilience

## Perguntas técnicas
- Adapter e service são a mesma coisa?

## Dependências
_Não se aplica._

## ADR
ADR-004 DetranClient.

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

create_issue '[US-303] Consulta com cache e stale state' 'user-story,study,P0,frontend,backend,database,performance' 'M3 — Vehicles & Detran Adapter' <<'ISSUE_BODY'
## Contexto
Consultas repetidas devem reutilizar snapshot.

## User Story
> Como usuário, quero ver situação recente mesmo quando a integração estiver instável.

## Regras de negócio
- Cache não é fonte da verdade.
- Resposta traz lastUpdatedAt.

## Frontend
- [ ] StaleDataBanner.
- [ ] Atualizar situação.
- [ ] Estado falha parcial.

## Backend
- [ ] Cache-aside.
- [ ] Fallback snapshot.
- [ ] Persistir normalized snapshot.

## Banco / Persistência
- [ ] vehicle_status_snapshots.

## Protótipo / UX
- [ ] Detalhe do veículo com banner stale.

## Testes
- [ ] Cache hit.
- [ ] Miss.
- [ ] Detran down + snapshot.

## Critérios de aceite
- Segunda consulta no TTL evita mock.
- Falha externa com snapshot não derruba tela.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- cache-aside
- TTL
- graceful degradation

## Perguntas técnicas
- Quando invalidate cache?

## Dependências
_Não se aplica._

## ADR
ADR cache/staleness.

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

create_issue '[US-304] Checagem periódica em fila' 'user-story,study,P0,async,backend,performance' 'M3 — Vehicles & Detran Adapter' <<'ISSUE_BODY'
## Contexto
Operação precisa de dados atualizados sem consulta manual.

## User Story
> Como admin, quero checagem automática dos veículos ativos.

## Regras de negócio
- Veículo sem mudança não gera notificação.
- Jobs precisam ser idempotentes.

## Frontend
- [ ] Mostrar última atualização e atualização automática.

## Backend
- [ ] Scheduler.
- [ ] Batch.
- [ ] SQS adapter.
- [ ] Worker.
- [ ] Diff.

## Banco / Persistência
- [ ] Job id/dedup se necessário.

## Protótipo / UX
- [ ] Na tabela de veículos, coluna Última consulta e status de atualização.

## Testes
- [ ] Batch.
- [ ] Retry.
- [ ] No change.

## Critérios de aceite
- Worker escalável horizontalmente.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- scheduler
- queue
- batching

## Perguntas técnicas
- Como evitar thundering herd às 00:00?

## Dependências
_Não se aplica._

## ADR
_Não obrigatório._

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

# ------------------------------------------------------------
# M4 — Fines
# ------------------------------------------------------------
info "=== M4 — Fines ==="

create_issue '[US-401] Lista de multas por veículo' 'user-story,study,P0,frontend,backend,database' 'M4 — Fines' <<'ISSUE_BODY'
## Contexto
Multas são serviço principal.

## User Story
> Como proprietário, quero entender todas as multas do meu veículo.

## Regras de negócio
- Não duplicar mesma referência externa.

## Frontend
- [ ] Tabela multas.
- [ ] Status.
- [ ] Valor.
- [ ] Vencimento.
- [ ] Ação.

## Backend
- [ ] GET fines.
- [ ] Mapear status.

## Banco / Persistência
- [ ] fines + unique external reference.

## Protótipo / UX
- [ ] Seção Multas no detalhe do veículo.

## Testes
- [ ] Lista vazia.
- [ ] Pendente/paga.

## Critérios de aceite
- Ordenação por urgência/vencimento.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- sync external ids

## Perguntas técnicas
- Como tratar multa que some da fonte?

## Dependências
_Não se aplica._

## ADR
_Não obrigatório._

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

create_issue '[US-402] Detalhe e timeline da multa' 'user-story,study,P0,frontend,backend' 'M4 — Fines' <<'ISSUE_BODY'
## Contexto
Cliente precisa entender valor e andamento.

## User Story
> Como proprietário, quero abrir a multa e acompanhar o processo.

## Regras de negócio
- CTA depende do status.

## Frontend
- [ ] Tela detalhe multa.
- [ ] Bloco financeiro.
- [ ] CTA.
- [ ] Timeline.

## Backend
- [ ] GET fine detail + related payment/submission.

## Banco / Persistência
_Não se aplica._

## Protótipo / UX
- [ ] Prototipar estados: pendente / aguardando pagamento / processando baixa / concluída.

## Testes
- [ ] Cada state mapping.

## Critérios de aceite
- Nunca mostrar Paga antes de webhook.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- state-driven UI

## Perguntas técnicas
- Backend ou frontend deriva display status?

## Dependências
_Não se aplica._

## ADR
_Não obrigatório._

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

# ------------------------------------------------------------
# M5 — Licensing
# ------------------------------------------------------------
info "=== M5 — Licensing ==="

create_issue '[US-501] Solicitação de licenciamento' 'user-story,study,P0,frontend,backend,testing' 'M5 — Licensing' <<'ISSUE_BODY'
## Contexto
Licenciamento é segundo fluxo completo.

## User Story
> Como proprietário, quero solicitar licenciamento anual.

## Regras de negócio
- Multa pendente bloqueia no cenário do projeto.

## Frontend
- [ ] Card licenciamento.
- [ ] CTA.
- [ ] Bloqueio com motivo.
- [ ] CTA Ver multas.

## Backend
- [ ] Create licensing request.
- [ ] Domain rule.

## Banco / Persistência
- [ ] licensings.

## Protótipo / UX
- [ ] Estado elegível e bloqueado.

## Testes
- [ ] Com multa.
- [ ] Sem multa.

## Critérios de aceite
- Erro de domínio específico.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- domain invariants

## Perguntas técnicas
- Regra deve estar no controller?

## Dependências
_Não se aplica._

## ADR
_Não obrigatório._

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

create_issue '[US-502] Pagamento e processamento de licenciamento' 'user-story,study,P0,frontend,backend,payments,async' 'M5 — Licensing' <<'ISSUE_BODY'
## Contexto
Licenciamento reutiliza padrões do pagamento de multa.

## User Story
> Como proprietário, quero pagar e acompanhar licenciamento.

## Regras de negócio
- Mesmo princípio webhook-first.
- Processamento assíncrono.

## Frontend
- [ ] Checkout.
- [ ] Pedido stepper.

## Backend
- [ ] Payment target licensing.
- [ ] Outbox.
- [ ] Submission.

## Banco / Persistência
_Não se aplica._

## Protótipo / UX
- [ ] Tela Pedido de licenciamento com stepper.

## Testes
- [ ] Webhook.
- [ ] Submission.

## Critérios de aceite
- Fluxo completo até documento.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- reusable domain patterns

## Perguntas técnicas
- Generalizar Payment cedo demais é risco?

## Dependências
_Não se aplica._

## ADR
_Não obrigatório._

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

# ------------------------------------------------------------
# M6 — Payments & Webhooks
# ------------------------------------------------------------
info "=== M6 — Payments & Webhooks ==="

create_issue '[US-601] Criar checkout sandbox' 'user-story,study,P0,frontend,backend,security' 'M6 — Payments & Webhooks' <<'ISSUE_BODY'
## Contexto
Precisamos exercitar fluxo financeiro realista sem dinheiro real.

## User Story
> Como proprietário, quero iniciar pagamento de uma pendência.

## Regras de negócio
- Criar Payment PENDING antes do redirect.
- Taxa EMR Despachante aparece separada.

## Frontend
- [ ] Tela Checkout.
- [ ] Resumo.
- [ ] Método.
- [ ] Loading.
- [ ] Expirado.

## Backend
- [ ] PaymentProvider port.
- [ ] Create checkout.
- [ ] Persist references.

## Banco / Persistência
- [ ] payments.

## Protótipo / UX
- [ ] Checkout com breakdown valor órgão + taxa + total.

## Testes
- [ ] Create.
- [ ] Provider error.

## Critérios de aceite
- Sucesso do checkout não muda para PAID.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- payment providers
- tokenization

## Perguntas técnicas
- Redirect success é confiável?

## Dependências
_Não se aplica._

## ADR
_Não obrigatório._

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

create_issue '[US-602] Prevenir pagamento duplicado' 'user-story,study,P0,database,testing,architecture' 'M6 — Payments & Webhooks' <<'ISSUE_BODY'
## Contexto
Duas abas podem tentar pagar a mesma pendência.

## User Story
> Como sistema, quero garantir um pagamento ativo por alvo.

## Regras de negócio
- Segunda tentativa retorna conflito de negócio.

## Frontend
- [ ] Mostrar “Pagamento já em andamento”.

## Backend
- [ ] Mapear constraint para domain error.

## Banco / Persistência
- [ ] Partial unique constraint/estratégia equivalente.

## Protótipo / UX
- [ ] Estado de conflito no detalhe multa.

## Testes
- [ ] Teste concorrente real com duas requests.

## Critérios de aceite
- Somente uma cria Payment ativo.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- race condition
- partial index
- transactions

## Perguntas técnicas
- Lock em memória resolve com ECS escalado?

## Dependências
_Não se aplica._

## ADR
ADR-001 duplicate payment.

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

create_issue '[US-603] Webhook assinado e idempotente' 'user-story,study,P0,backend,security,database,testing' 'M6 — Payments & Webhooks' <<'ISSUE_BODY'
## Contexto
Provider reenvia webhooks até receber 2xx.

## User Story
> Como sistema, quero validar e processar o evento uma única vez.

## Regras de negócio
- HMAC antes de mutação.
- Replay retorna sucesso sem efeito.

## Frontend
_Não se aplica._

## Backend
- [ ] Webhook endpoint.
- [ ] Raw body se necessário.
- [ ] HMAC.
- [ ] Process event.

## Banco / Persistência
- [ ] processed_webhook_events unique provider/eventId.

## Protótipo / UX
_Não se aplica._

## Testes
- [ ] Assinatura inválida.
- [ ] 5 duplicatas.
- [ ] Out-of-order awareness.

## Critérios de aceite
- 5 webhooks = 1 transição.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- HMAC
- idempotency
- webhook delivery

## Perguntas técnicas
- Por que provider envia duplicado?

## Dependências
_Não se aplica._

## ADR
ADR-002 webhook idempotency.

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

create_issue '[US-604] Transactional outbox para submissão' 'user-story,study,P0,backend,database,async' 'M6 — Payments & Webhooks' <<'ISSUE_BODY'
## Contexto
Pagamento confirmado e job precisam ser atomicamente persistidos.

## User Story
> Como sistema, quero nunca perder a submissão após pagamento.

## Regras de negócio
- Payment permanece PAID mesmo se integração estiver fora.

## Frontend
- [ ] Status “Pagamento confirmado — processando baixa”.

## Backend
- [ ] Criar outbox publisher.
- [ ] SQS.
- [ ] Worker.

## Banco / Persistência
- [ ] outbox_events.
- [ ] government_submissions.

## Protótipo / UX
- [ ] Pedido mostrando estado intermediário.

## Testes
- [ ] Crash após DB commit.
- [ ] Redelivery.

## Critérios de aceite
- Evento sobrevive restart.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- transactional outbox
- at-least-once

## Perguntas técnicas
- Outbox é exactly-once?

## Dependências
_Não se aplica._

## ADR
ADR-003 outbox.

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

create_issue '[US-605] Reconciliação financeira' 'user-story,study,P0,frontend,backend,observability' 'M6 — Payments & Webhooks' <<'ISSUE_BODY'
## Contexto
Admin precisa achar divergências entre estado local e provider.

## User Story
> Como admin, quero uma tela de reconciliação.

## Regras de negócio
- Divergência nunca é corrigida silenciosamente sem audit.

## Frontend
- [ ] Tela Reconciliação.
- [ ] Cards.
- [ ] Filtros.
- [ ] Tabela.
- [ ] Drawer detalhe.

## Backend
- [ ] Query reconciliation.
- [ ] Provider status adapter opcional.
- [ ] Criar case.

## Banco / Persistência
- [ ] Indexes payment status/provider reference.

## Protótipo / UX
- [ ] Tela completa conforme SCREEN_SPECS.

## Testes
- [ ] Pending antigo.
- [ ] Provider paid/local pending.

## Critérios de aceite
- Admin identifica divergência e abre caso.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- reconciliation
- financial ops

## Perguntas técnicas
- Webhook elimina necessidade de reconciliação?

## Dependências
_Não se aplica._

## ADR
_Não obrigatório._

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

# ------------------------------------------------------------
# M7 — Operator Cases
# ------------------------------------------------------------
info "=== M7 — Operator Cases ==="

create_issue '[US-701] Criar caso manual automaticamente' 'user-story,study,P0,backend,async,observability' 'M7 — Operator Cases' <<'ISSUE_BODY'
## Contexto
Falha automática precisa se transformar em item de trabalho.

## User Story
> Como operação, quero que exceções relevantes apareçam na fila sem alguém criar manualmente.

## Regras de negócio
- Não criar case duplicado para mesmo incidente ativo.
- DLQ pode abrir case.

## Frontend
- [ ] Caso aparece na fila.

## Backend
- [ ] CasePolicy.
- [ ] Criar case por thresholds.

## Banco / Persistência
- [ ] case_queue/manual_cases + dedup key.

## Protótipo / UX
- [ ] Fila com casos de tipos diferentes.

## Testes
- [ ] DLQ.
- [ ] Repeated failures.
- [ ] Dedup.

## Critérios de aceite
- Caso aparece automaticamente.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- exception workflow
- dedup

## Perguntas técnicas
- Toda falha merece caso?

## Dependências
_Não se aplica._

## ADR
ADR case creation policy.

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

create_issue '[US-702] Fila Meus casos / Não atribuídos' 'user-story,study,P0,frontend,backend' 'M7 — Operator Cases' <<'ISSUE_BODY'
## Contexto
Operadora precisa trabalhar uma fila objetiva.

## User Story
> Como operadora, quero separar meus casos dos ainda disponíveis.

## Regras de negócio
- ADMIN pode ver todos.
- OPERADORA vê seus e não atribuídos.

## Frontend
- [ ] Tabs.
- [ ] Filtros.
- [ ] Tabela.
- [ ] Priority badge.
- [ ] Age.

## Backend
- [ ] Query por assignedTo/status.

## Banco / Persistência
- [ ] Index status/assigned_to/priority.

## Protótipo / UX
- [ ] Tela Casos com tabs e filtros.

## Testes
- [ ] Role queries.

## Critérios de aceite
- Caso atribuído sai de Não atribuídos para todas.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- operational queues

## Perguntas técnicas
- Polling ou realtime é necessário no MVP?

## Dependências
_Não se aplica._

## ADR
_Não obrigatório._

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

create_issue '[US-703] Assumir caso com concorrência' 'user-story,study,P0,frontend,backend,database,testing' 'M7 — Operator Cases' <<'ISSUE_BODY'
## Contexto
Duas operadoras podem clicar Assumir ao mesmo tempo.

## User Story
> Como operadora, quero assumir um caso somente se ainda estiver livre.

## Regras de negócio
- Primeira operação vence.
- Segunda recebe estado atualizado.

## Frontend
- [ ] CTA Assumir.
- [ ] Erro “acabou de ser atribuído”.

## Backend
- [ ] Conditional update.

## Banco / Persistência
- [ ] UPDATE WHERE assigned_to IS NULL ou optimistic version.

## Protótipo / UX
- [ ] Variação de conflito.

## Testes
- [ ] Duas requests concorrentes.

## Critérios de aceite
- Nunca dois owners simultâneos.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- atomic conditional update
- optimistic locking

## Perguntas técnicas
- SELECT depois UPDATE é suficiente?

## Dependências
_Não se aplica._

## ADR
_Não obrigatório._

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

create_issue '[US-704] Detalhe do caso e notas' 'user-story,study,P0,frontend,backend' 'M7 — Operator Cases' <<'ISSUE_BODY'
## Contexto
Caso precisa reunir todo o contexto para resolução.

## User Story
> Como operadora, quero resolver sem abrir cinco telas diferentes.

## Regras de negócio
- Notas internas.
- Timeline imutável de eventos.

## Frontend
- [ ] Header.
- [ ] Motivo.
- [ ] Próxima ação.
- [ ] Contexto técnico amigável.
- [ ] Timeline.
- [ ] Sidebar.
- [ ] Notas.
- [ ] Ações.

## Backend
- [ ] Case detail aggregate.
- [ ] POST note.
- [ ] Transitions.

## Banco / Persistência
- [ ] case_notes.
- [ ] case_events.

## Protótipo / UX
- [ ] Tela detalhada conforme SCREEN_SPECS.

## Testes
- [ ] Transitions.
- [ ] Note.

## Critérios de aceite
- Links para cliente, veículo e pedido.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- case management UX
- state machine

## Perguntas técnicas
- Nota deve ser editável?

## Dependências
_Não se aplica._

## ADR
_Não obrigatório._

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

# ------------------------------------------------------------
# M8 — Operational Dashboard
# ------------------------------------------------------------
info "=== M8 — Operational Dashboard ==="

create_issue '[US-801] Dashboard operacional agregado' 'user-story,study,P0,backend,database,performance' 'M8 — Operational Dashboard' <<'ISSUE_BODY'
## Contexto
Dashboard não pode executar uma chamada por card.

## User Story
> Como operadora, quero um resumo rápido da minha fila e clientes que precisam de ação.

## Regras de negócio
- OPERADORA recebe métricas próprias.
- ADMIN pode receber operação total em endpoint distinto.

## Frontend
_Não se aplica._

## Backend
- [ ] DashboardQueryService.
- [ ] Aggregations.
- [ ] Oldest cases.
- [ ] Unassigned count.
- [ ] Customers needing action.

## Banco / Persistência
- [ ] Índices adequados.
- [ ] Cache curto opcional.

## Protótipo / UX
_Não se aplica._

## Testes
- [ ] Dataset de volume.
- [ ] Scope.

## Critérios de aceite
- Sem N+1.
- Latência medida.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- SQL aggregation
- read models

## Perguntas técnicas
- Materialized view já é necessária?

## Dependências
_Não se aplica._

## ADR
ADR dashboard read strategy.

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

create_issue '[US-802] Tela Dashboard operacional' 'user-story,study,P0,frontend,performance' 'M8 — Operational Dashboard' <<'ISSUE_BODY'
## Contexto
É a home de trabalho da operadora.

## User Story
> Como operadora, quero enxergar imediatamente prioridades e meus casos.

## Regras de negócio
- Não usar ranking competitivo público.

## Frontend
- [ ] Cards.
- [ ] Fila prioritária.
- [ ] Sem responsável.
- [ ] Mais antigos.
- [ ] Performance pessoal.
- [ ] Links filtrados.

## Backend
_Não se aplica._

## Banco / Persistência
_Não se aplica._

## Protótipo / UX
- [ ] Criar versão desktop completa.
- [ ] Criar versão mobile simplificada.

## Testes
- [ ] Render states.
- [ ] Accessibility.

## Critérios de aceite
- A principal fila aparece sem scroll excessivo em desktop.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- information hierarchy
- dashboard UX
- accessibility

## Perguntas técnicas
- Quais cards viram ação e quais são só informação?

## Dependências
_Não se aplica._

## ADR
_Não obrigatório._

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

# ------------------------------------------------------------
# M9 — Admin Panel
# ------------------------------------------------------------
info "=== M9 — Admin Panel ==="

create_issue '[US-901] Dashboard admin' 'user-story,study,P0,frontend,backend,database,performance' 'M9 — Admin Panel' <<'ISSUE_BODY'
## Contexto
Admin precisa ver saúde financeira e operacional do negócio.

## User Story
> Como admin, quero enxergar receita, volume, conversão e gargalos.

## Regras de negócio
- Período selecionável.
- Métricas derivadas no servidor.

## Frontend
- [ ] Cards financeiros.
- [ ] Cards operacionais.
- [ ] Receita.
- [ ] Volume por serviço.
- [ ] Funil.
- [ ] Casos.
- [ ] Problemas críticos.

## Backend
- [ ] AdminDashboardQueryService.

## Banco / Persistência
- [ ] Aggregation queries.

## Protótipo / UX
- [ ] Prototipar dashboard completo, não só cards.

## Testes
- [ ] Cálculos com fixture conhecida.

## Critérios de aceite
- Filtros de período atualizam métricas coerentemente.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- analytics dashboard
- SQL aggregation

## Perguntas técnicas
- Receita e GMV são a mesma coisa?

## Dependências
_Não se aplica._

## ADR
_Não obrigatório._

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

create_issue '[US-902] Gestão do catálogo e preços' 'user-story,study,P0,frontend,backend' 'M9 — Admin Panel' <<'ISSUE_BODY'
## Contexto
Admin controla serviços oferecidos.

## User Story
> Como admin, quero ativar serviços e editar taxa.

## Regras de negócio
- Desativar não cancela pedido existente.

## Frontend
- [ ] Tabela serviços.
- [ ] Drawer editar.
- [ ] Status.

## Backend
- [ ] CRUD catalog.

## Banco / Persistência
- [ ] services.
- [ ] pricing.

## Protótipo / UX
- [ ] Tela Serviços e preços.

## Testes
- [ ] Deactivate with active request.

## Critérios de aceite
- Novo pedido não usa serviço inativo.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- configuration vs transaction snapshot

## Perguntas técnicas
- Preço do pedido deve depender do preço atual depois de criado?

## Dependências
_Não se aplica._

## ADR
_Não obrigatório._

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

create_issue '[US-903] Gestão de operadoras' 'user-story,study,P0,frontend,backend,security' 'M9 — Admin Panel' <<'ISSUE_BODY'
## Contexto
Negócio precisa crescer equipe sem redesenhar permissões.

## User Story
> Como admin, quero convidar, suspender e acompanhar operadoras.

## Regras de negócio
- Suspender não apaga histórico.

## Frontend
- [ ] Cards.
- [ ] Tabela.
- [ ] Convite.
- [ ] Detalhe.

## Backend
- [ ] List operators.
- [ ] Suspend/reactivate.

## Banco / Persistência
_Não se aplica._

## Protótipo / UX
- [ ] Tela Operadoras + detalhe.

## Testes
- [ ] Suspended login/access.

## Critérios de aceite
- Histórico permanece.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- RBAC lifecycle

## Perguntas técnicas
- Hard delete de usuário interno faz sentido?

## Dependências
_Não se aplica._

## ADR
_Não obrigatório._

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

create_issue '[US-904] Fila consolidada admin' 'user-story,study,P0,frontend,backend' 'M9 — Admin Panel' <<'ISSUE_BODY'
## Contexto
Admin precisa ver todo o trabalho manual.

## User Story
> Como admin, quero uma fila com todos os casos e responsáveis.

## Regras de negócio
- Todos os assigned/unassigned.

## Frontend
- [ ] Tabela.
- [ ] Filtro operadora.
- [ ] Prioridade.
- [ ] Age.

## Backend
- [ ] Admin case query.

## Banco / Persistência
_Não se aplica._

## Protótipo / UX
- [ ] Reusar tela Casos com visão Todos.

## Testes
- [ ] Admin scope.

## Critérios de aceite
- Caso atribuído mostra responsável atual.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- shared component design

## Perguntas técnicas
- Mesma tela ou duas telas?

## Dependências
_Não se aplica._

## ADR
_Não obrigatório._

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

# ------------------------------------------------------------
# M10 — Notifications, History & Documents
# ------------------------------------------------------------
info "=== M10 — Notifications, History & Documents ==="

create_issue '[US-1001] Notificações deduplicadas' 'user-story,study,P0,async,backend' 'M10 — Notifications, History & Documents' <<'ISSUE_BODY'
## Contexto
Mudança automática deve chegar ao usuário sem spam.

## User Story
> Como usuário, quero ser avisado de multa nova, vencimento e caso relevante.

## Regras de negócio
- Mesmo evento não duplica notificação.

## Frontend
- [ ] Central simples de notificações opcional.

## Backend
- [ ] Notification worker.
- [ ] Dedup key.

## Banco / Persistência
- [ ] notifications unique dedup.

## Protótipo / UX
- [ ] Ícone de notificações no header com dropdown mock.

## Testes
- [ ] Dedup.

## Critérios de aceite
- Evento repetido não envia novamente.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- notification dedup

## Perguntas técnicas
- Como construir uma dedup key estável?

## Dependências
_Não se aplica._

## ADR
_Não obrigatório._

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

create_issue '[US-1002] Histórico por veículo e cliente' 'user-story,study,P0,frontend,backend,database' 'M10 — Notifications, History & Documents' <<'ISSUE_BODY'
## Contexto
Operação precisa recuperar contexto passado.

## User Story
> Como usuário autorizado, quero uma timeline unificada.

## Regras de negócio
- Owner só vê informação permitida.
- Operação pode ver eventos internos conforme role.

## Frontend
- [ ] Timeline.
- [ ] Filtros.

## Backend
- [ ] History read model.

## Banco / Persistência
- [ ] event/audit sources.

## Protótipo / UX
- [ ] Tela Histórico veículo e tab Histórico cliente.

## Testes
- [ ] Visibility.

## Critérios de aceite
- Ordenação determinística.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- timeline/read model

## Perguntas técnicas
- Quais eventos pertencem à timeline de negócio e quais só ao audit log?

## Dependências
_Não se aplica._

## ADR
_Não obrigatório._

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

create_issue '[US-1003] Documentos privados em S3' 'user-story,study,P0,backend,aws,security' 'M10 — Notifications, History & Documents' <<'ISSUE_BODY'
## Contexto
CRLV e comprovantes não podem ser públicos.

## User Story
> Como cliente, quero baixar documento autorizado.

## Regras de negócio
- Bucket privado.
- URL expira.

## Frontend
- [ ] Lista documentos.
- [ ] Loading download.

## Backend
- [ ] Generate/store.
- [ ] Presigned GET after auth.

## Banco / Persistência
- [ ] documents.

## Protótipo / UX
- [ ] Seção documentos.

## Testes
- [ ] Third-party access denied.

## Critérios de aceite
- Sem URL pública persistente.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- S3
- presigned URL

## Perguntas técnicas
- Por que autorização deve acontecer antes do presign?

## Dependências
_Não se aplica._

## ADR
_Não obrigatório._

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

# ------------------------------------------------------------
# M11 — Observability & Security
# ------------------------------------------------------------
info "=== M11 — Observability & Security ==="

create_issue '[US-1101] OpenTelemetry ponta a ponta' 'user-story,study,P0,observability,backend,async' 'M11 — Observability & Security' <<'ISSUE_BODY'
## Contexto
Pagamento precisa ser rastreado até submissão externa.

## User Story
> Como operadora técnica, quero investigar uma transação ponta a ponta.

## Regras de negócio
_Não se aplica._

## Frontend
_Não se aplica._

## Backend
- [ ] OTel API.
- [ ] Propagar trace na fila.
- [ ] Worker spans.

## Banco / Persistência
_Não se aplica._

## Protótipo / UX
_Não se aplica._

## Testes
- [ ] Trace context propagation.

## Critérios de aceite
- Webhook e DetranClient aparecem correlacionados.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- traces
- spans
- sampling

## Perguntas técnicas
- Trace e correlation ID são iguais?

## Dependências
_Não se aplica._

## ADR
_Não obrigatório._

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

create_issue '[US-1102] Métricas e alertas' 'user-story,study,P0,observability,performance' 'M11 — Observability & Security' <<'ISSUE_BODY'
## Contexto
Problemas precisam ser detectados antes de cliente reclamar.

## User Story
> Como operação técnica, quero métricas de pagamento, fila, integração e dashboard.

## Regras de negócio
_Não se aplica._

## Frontend
_Não se aplica._

## Backend
- [ ] Counters/histograms.
- [ ] Queue metrics.
- [ ] Dashboard p95.

## Banco / Persistência
_Não se aplica._

## Protótipo / UX
_Não se aplica._

## Testes
- [ ] Metric emission.

## Critérios de aceite
- DLQ e adapter failure possuem alertas definidos.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- SLI
- p95
- alert fatigue

## Perguntas técnicas
- Por que userId não deve ser label?

## Dependências
_Não se aplica._

## ADR
_Não obrigatório._

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

create_issue '[US-1103] LGPD, IDOR e hardening' 'user-story,study,P0,security,testing' 'M11 — Observability & Security' <<'ISSUE_BODY'
## Contexto
Placa, CPF, RENAVAM e financeiro exigem proteção.

## User Story
> Como plataforma, quero impedir acesso indevido e vazamento.

## Regras de negócio
_Não se aplica._

## Frontend
- [ ] 403 amigável.

## Backend
- [ ] Policies.
- [ ] Rate limit.
- [ ] Security headers.
- [ ] Webhook validation.

## Banco / Persistência
- [ ] Encryption strategy.

## Protótipo / UX
- [ ] Tela permission denied.

## Testes
- [ ] Owner A vehicle B.
- [ ] Operator direct URL admin.
- [ ] Document third party.

## Critérios de aceite
- Todos cross-user tests negados.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- BOLA/IDOR
- LGPD principles
- OWASP

## Perguntas técnicas
- Frontend pode ser fonte de autorização?

## Dependências
_Não se aplica._

## ADR
_Não obrigatório._

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

# ------------------------------------------------------------
# M14 — AWS & Delivery
# ------------------------------------------------------------
info "=== M14 — AWS & Delivery ==="

create_issue '[US-1201] Arquitetura AWS e IAM' 'user-story,study,P0,aws,architecture,security' 'M14 — AWS & Delivery' <<'ISSUE_BODY'
## Contexto
Infra deve refletir workloads reais.

## User Story
> Como engenheira, quero mapear serviços e permissões mínimas.

## Regras de negócio
_Não se aplica._

## Frontend
_Não se aplica._

## Backend
_Não se aplica._

## Banco / Persistência
_Não se aplica._

## Protótipo / UX
_Não se aplica._

## Testes
_Não se aplica._

## Critérios de aceite
- Diagrama e matriz IAM revisáveis.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- IAM
- ECS
- RDS
- SQS
- S3

## Perguntas técnicas
- Task role e execution role?

## Dependências
_Não se aplica._

## ADR
ADR target AWS.

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

create_issue '[US-1202] Deploy ECS/RDS/Redis/SQS/S3' 'user-story,study,P0,aws,devops' 'M14 — AWS & Delivery' <<'ISSUE_BODY'
## Contexto
Aplicação precisa sair do local.

## User Story
> Como plataforma, quero workloads gerenciados na AWS.

## Regras de negócio
_Não se aplica._

## Frontend
_Não se aplica._

## Backend
- [ ] Container API/worker.

## Banco / Persistência
- [ ] RDS.
- [ ] ElastiCache.

## Protótipo / UX
_Não se aplica._

## Testes
- [ ] Health.

## Critérios de aceite
- API no ALB e worker sem endpoint público.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- VPC
- subnets
- Fargate
- connection pools

## Perguntas técnicas
- Escalar API pode saturar DB?

## Dependências
_Não se aplica._

## ADR
_Não obrigatório._

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

create_issue '[US-1203] CI/CD OIDC + Terraform' 'user-story,study,P0,aws,devops,security' 'M14 — AWS & Delivery' <<'ISSUE_BODY'
## Contexto
Deploy e infra precisam ser reproduzíveis.

## User Story
> Como desenvolvedora, quero pipeline sem access keys long-lived.

## Regras de negócio
_Não se aplica._

## Frontend
_Não se aplica._

## Backend
_Não se aplica._

## Banco / Persistência
_Não se aplica._

## Protótipo / UX
_Não se aplica._

## Testes
- [ ] terraform validate/plan.

## Critérios de aceite
- Deploy rastreável por SHA.
- Infra sandbox recriável.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- OIDC
- Terraform state
- rollback

## Perguntas técnicas
- Por que state é sensível?

## Dependências
_Não se aplica._

## ADR
_Não obrigatório._

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

# ------------------------------------------------------------
# M15 — Scale & System Design
# ------------------------------------------------------------
info "=== M15 — Scale & System Design ==="

create_issue '[US-1301] Load test dashboard e busca' 'user-story,study,P0,performance,testing' 'M15 — Scale & System Design' <<'ISSUE_BODY'
## Contexto
Painel administrativo precisa suportar milhares de veículos.

## User Story
> Como engenheira, quero identificar gargalos antes de otimizar.

## Regras de negócio
_Não se aplica._

## Frontend
_Não se aplica._

## Backend
- [ ] Load endpoints.

## Banco / Persistência
- [ ] Seed 10k/100k synthetic rows.
- [ ] EXPLAIN ANALYZE.

## Protótipo / UX
_Não se aplica._

## Testes
- [ ] k6/artillery.

## Critérios de aceite
- Documento com p95, bottleneck e mudanças.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- load testing
- query plans
- capacity

## Perguntas técnicas
- Milhares de veículos significam quantos RPS?

## Dependências
_Não se aplica._

## ADR
_Não obrigatório._

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

create_issue '[US-1302] Incident drill DetranClient indisponível' 'user-story,study,P0,architecture,observability' 'M15 — Scale & System Design' <<'ISSUE_BODY'
## Contexto
Dependência externa falhará em algum momento.

## User Story
> Como operação, quero degradar de forma previsível.

## Regras de negócio
_Não se aplica._

## Frontend
- [ ] Stale banner.
- [ ] Processing state.

## Backend
- [ ] Timeout/retry/case policy.

## Banco / Persistência
_Não se aplica._

## Protótipo / UX
- [ ] Estados offline externo.

## Testes
- [ ] Outage scenario.

## Critérios de aceite
- Pagamento PAID nunca volta atrás.
- Dashboard segue com snapshot.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- graceful degradation
- circuit breaker

## Perguntas técnicas
- Quando falhar fechado?

## Dependências
_Não se aplica._

## ADR
_Não obrigatório._

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

create_issue '[US-1303] Incident drill webhook duplicado e case race' 'user-story,study,P0,payments,testing,database' 'M15 — Scale & System Design' <<'ISSUE_BODY'
## Contexto
Concorrência aparece em financeiro e operação.

## User Story
> Como engenheira, quero validar os dois invariantes sob carga.

## Regras de negócio
_Não se aplica._

## Frontend
_Não se aplica._

## Backend
_Não se aplica._

## Banco / Persistência
_Não se aplica._

## Protótipo / UX
_Não se aplica._

## Testes
- [ ] Webhook duplicate storm.
- [ ] 100 concurrent case claims.

## Critérios de aceite
- 1 efeito financeiro por evento.
- 1 operadora por case.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- contention
- idempotency under load

## Perguntas técnicas
- Onde o banco garante a regra?

## Dependências
_Não se aplica._

## ADR
_Não obrigatório._

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

create_issue '[US-1304] Final architecture review' 'user-story,study,P0,architecture' 'M15 — Scale & System Design' <<'ISSUE_BODY'
## Contexto
Projeto deve virar case de entrevista.

## User Story
> Como candidata Senior/Staff, quero defender produto, arquitetura e trade-offs.

## Regras de negócio
_Não se aplica._

## Frontend
_Não se aplica._

## Backend
_Não se aplica._

## Banco / Persistência
_Não se aplica._

## Protótipo / UX
- [ ] Apresentação também inclui mapa de telas e fluxos.

## Testes
_Não se aplica._

## Critérios de aceite
- Apresentação de 15 min cobre dashboard, pagamentos, fila, integração e escala.

## Observabilidade
_Não se aplica._

## Segurança
_Não se aplica._

## Conceitos para estudar
- system design communication

## Perguntas técnicas
- Onde há strong consistency?
- Onde aceitamos eventual consistency?
- Qual primeiro gargalo?

## Dependências
_Não se aplica._

## ADR
_Não obrigatório._

## Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Estados loading/empty/error tratados
- [ ] Critérios de aceite demonstráveis
- [ ] Documentação atualizada
- [ ] Consigo explicar as decisões técnicas
ISSUE_BODY

# ------------------------------------------------------------
# M12 — AI Copilot
# ------------------------------------------------------------
info "=== M12 — AI Copilot ==="

create_issue '[E14] AI Copilot' 'epic,architecture,ai,copilot,P0' 'M12 — AI Copilot' <<'ISSUE_BODY'
## Objetivo
Adicionar inteligência útil à operação sem transformar o LLM em fonte da verdade.

## Definition of Done
- [ ] US P0 concluídas
- [ ] Fluxo demonstrável
- [ ] Autorização testada
- [ ] Evals relevantes criados
- [ ] Fallback documentado
- [ ] Observabilidade disponível
ISSUE_BODY

# ------------------------------------------------------------
# M13 — AI Quality
# ------------------------------------------------------------
info "=== M13 — AI Quality ==="

create_issue '[E15] AI Quality & Safety' 'epic,architecture,ai,evals,security,P0' 'M13 — AI Quality' <<'ISSUE_BODY'
## Objetivo
Garantir factualidade, autorização, custo controlado, evals e fallback.

## Definition of Done
- [ ] US P0 concluídas
- [ ] Fluxo demonstrável
- [ ] Autorização testada
- [ ] Evals relevantes criados
- [ ] Fallback documentado
- [ ] Observabilidade disponível
ISSUE_BODY

# ------------------------------------------------------------
# M12 — AI Copilot
# ------------------------------------------------------------
info "=== M12 — AI Copilot ==="

create_issue '[US-1401] Criar AI Gateway e orchestrator' 'user-story,study,ai,P0,backend,architecture,copilot' 'M12 — AI Copilot' <<'ISSUE_BODY'
## Contexto
LLM precisa de uma fronteira controlada antes de acessar qualquer dado.

## User Story
> Como plataforma, quero centralizar provider, prompts, tools, budgets e fallback.

## Tasks
- [ ] Criar package/service ai-gateway
- [ ] Criar interface de provider
- [ ] Criar prompt versioning
- [ ] Criar structured output validation
- [ ] Criar timeout/fallback
- [ ] Registrar AIExecution

## Critérios de aceite
- Provider pode ser trocado por adapter
- Falha do LLM não quebra fluxo normal

## Segurança / Guardrails
_Não se aplica._

## Conceitos para estudar
- AI orchestration
- structured outputs
- prompt versioning

## Perguntas técnicas
- Por que não chamar provider direto de cada controller?
- Que dados pertencem ao AI Gateway?

## Dependências
_Nenhuma._

## Definition of Done
- [ ] Implementado
- [ ] Structured outputs validados quando aplicável
- [ ] Testes passando
- [ ] Telemetria adicionada
- [ ] Fallback validado
ISSUE_BODY

create_issue '[US-1402] Implementar tools read-only com autorização' 'user-story,study,ai,P0,backend,security,copilot' 'M12 — AI Copilot' <<'ISSUE_BODY'
## Contexto
Copilot precisa consultar dados reais sem acesso direto ao banco.

## User Story
> Como operadora, quero que o Copilot consulte somente dados que eu poderia abrir manualmente.

## Tasks
- [ ] Implementar tool registry
- [ ] searchCustomers
- [ ] getCustomerSummary
- [ ] getVehicleStatus
- [ ] listCases
- [ ] getCaseDetail
- [ ] getPaymentSummary
- [ ] getDashboardMetrics
- [ ] Aplicar policies server-side

## Critérios de aceite
- Operadora sem permissão recebe deny
- LLM nunca recebe SQL credential

## Segurança / Guardrails
- Policy em toda tool
- Minimizar PII

## Conceitos para estudar
- tool calling
- authorization
- least privilege

## Perguntas técnicas
- Prompt pode substituir autorização?
- Como impedir IDOR via tool arguments?

## Dependências
_Nenhuma._

## Definition of Done
- [ ] Implementado
- [ ] Structured outputs validados quando aplicável
- [ ] Testes passando
- [ ] Telemetria adicionada
- [ ] Fallback validado
ISSUE_BODY

create_issue '[US-1403] Criar painel de chat EMR Copilot' 'user-story,study,ai,P0,frontend,copilot' 'M12 — AI Copilot' <<'ISSUE_BODY'
## Contexto
Copilot precisa estar dentro do contexto operacional.

## User Story
> Como operadora, quero perguntar sobre minha operação sem sair da tela.

## Tasks
- [ ] Criar botão no header
- [ ] Criar side panel
- [ ] Streaming opcional
- [ ] Renderizar tool/result cards
- [ ] Links para entidades
- [ ] Loading/partial error
- [ ] Histórico curto da conversa

## Critérios de aceite
- Chat não bloqueia navegação
- Resposta pode linkar caso/cliente/veículo

## Segurança / Guardrails
_Não se aplica._

## Conceitos para estudar
- chat UX
- streaming
- tool result rendering

## Perguntas técnicas
- Side panel ou rota dedicada?
- Quanto histórico enviar ao modelo?

## Dependências
- US-1401
- US-1402

## Definition of Done
- [ ] Implementado
- [ ] Structured outputs validados quando aplicável
- [ ] Testes passando
- [ ] Telemetria adicionada
- [ ] Fallback validado
ISSUE_BODY

create_issue '[US-1404] Resumo inteligente do caso' 'user-story,study,ai,P0,frontend,backend,copilot' 'M12 — AI Copilot' <<'ISSUE_BODY'
## Contexto
Caso manual frequentemente exige ler uma timeline longa.

## User Story
> Como operadora, quero um resumo factual com próxima ação sugerida.

## Tasks
- [ ] Criar tool/context builder de case
- [ ] Criar schema summary/currentState/risk/nextAction
- [ ] Adicionar CTA Resumir caso
- [ ] Mostrar fatos usados
- [ ] Adicionar feedback útil/não útil

## Critérios de aceite
- Resumo não inventa pagamento/status
- Próxima ação não executa mutação

## Segurança / Guardrails
_Não se aplica._

## Conceitos para estudar
- context construction
- factual summarization

## Perguntas técnicas
- Como medir factualidade do resumo?
- O que fazer quando dados conflitam?

## Dependências
- US-1402
- US-1403

## Definition of Done
- [ ] Implementado
- [ ] Structured outputs validados quando aplicável
- [ ] Testes passando
- [ ] Telemetria adicionada
- [ ] Fallback validado
ISSUE_BODY

create_issue '[US-1405] Resumo da operação no dashboard' 'user-story,study,ai,P0,frontend,backend,copilot' 'M12 — AI Copilot' <<'ISSUE_BODY'
## Contexto
Admin e operadora precisam interpretar métricas sem substituir os números brutos.

## User Story
> Como admin, quero um brief da operação baseado em métricas reais.

## Tasks
- [ ] Criar getAdminDashboardMetrics tool
- [ ] Criar template de brief
- [ ] CTA Resumir operação
- [ ] Links para filtros/casos relacionados
- [ ] Proibir causalidade sem evidência

## Critérios de aceite
- Resumo usa métricas estruturadas
- Números permanecem visíveis no dashboard

## Segurança / Guardrails
_Não se aplica._

## Conceitos para estudar
- data-to-text
- operational analytics

## Perguntas técnicas
- Como diferenciar correlação de causa?

## Dependências
- US-1402

## Definition of Done
- [ ] Implementado
- [ ] Structured outputs validados quando aplicável
- [ ] Testes passando
- [ ] Telemetria adicionada
- [ ] Fallback validado
ISSUE_BODY

create_issue '[US-1406] RAG de procedimentos internos' 'user-story,study,ai,P0,rag,backend,database' 'M12 — AI Copilot' <<'ISSUE_BODY'
## Contexto
Perguntas sobre processo vêm de documentação, não de tabelas transacionais.

## User Story
> Como operadora, quero consultar procedimentos internos pelo Copilot.

## Tasks
- [ ] Modelar knowledge_documents/chunks
- [ ] Habilitar pgvector
- [ ] Criar ingestion
- [ ] Embeddings
- [ ] Hybrid retrieval
- [ ] Filtros de visibilidade
- [ ] Retornar fontes internas

## Critérios de aceite
- RAG não concede permissões
- Procedimento desativado não entra no retrieval ativo

## Segurança / Guardrails
- Tratar prompt injection em documentos

## Conceitos para estudar
- RAG
- embeddings
- pgvector
- chunking
- hybrid search

## Perguntas técnicas
- Quando RAG é melhor que tool?
- Como versionar procedimentos?

## Dependências
_Nenhuma._

## Definition of Done
- [ ] Implementado
- [ ] Structured outputs validados quando aplicável
- [ ] Testes passando
- [ ] Telemetria adicionada
- [ ] Fallback validado
ISSUE_BODY

create_issue '[US-1407] Gerar rascunho de mensagem ao cliente' 'user-story,study,ai,P0,frontend,copilot' 'M12 — AI Copilot' <<'ISSUE_BODY'
## Contexto
Operadora repete mensagens parecidas para pedir documento ou explicar andamento.

## User Story
> Como operadora, quero gerar um rascunho baseado no caso.

## Tasks
- [ ] CTA Gerar mensagem
- [ ] Contexto mínimo
- [ ] Tom neutro
- [ ] Editor antes do envio
- [ ] Nunca enviar automaticamente

## Critérios de aceite
- Mensagem é draft
- Operadora pode editar/cancelar

## Segurança / Guardrails
- Não incluir informação interna/erro técnico desnecessário

## Conceitos para estudar
- human-in-the-loop
- controlled generation

## Perguntas técnicas
- Quais dados pessoais realmente precisam entrar no prompt?

## Dependências
_Nenhuma._

## Definition of Done
- [ ] Implementado
- [ ] Structured outputs validados quando aplicável
- [ ] Testes passando
- [ ] Telemetria adicionada
- [ ] Fallback validado
ISSUE_BODY

create_issue '[US-1408] Chatbot do proprietário' 'user-story,study,ai,P0,frontend,backend,security,copilot' 'M12 — AI Copilot' <<'ISSUE_BODY'
## Contexto
Cliente pode ter dificuldade em interpretar status do veículo.

## User Story
> Como proprietário, quero perguntar sobre meus próprios veículos e pedidos.

## Tasks
- [ ] Criar UI chatbot cliente
- [ ] Registrar toolset restrito
- [ ] getMyVehicles
- [ ] getMyVehicleStatus
- [ ] getMyPayment
- [ ] getMyOrder
- [ ] searchPublicHelp
- [ ] Criar CTA para telas relevantes

## Critérios de aceite
- Nunca retorna entidade de terceiro
- Não executa reembolso/pagamento automaticamente

## Segurança / Guardrails
- Owner scope obrigatório

## Conceitos para estudar
- scoped agents
- authorization

## Perguntas técnicas
- Mesmo modelo pode usar toolsets por role?

## Dependências
_Nenhuma._

## Definition of Done
- [ ] Implementado
- [ ] Structured outputs validados quando aplicável
- [ ] Testes passando
- [ ] Telemetria adicionada
- [ ] Fallback validado
ISSUE_BODY

create_issue '[US-1409] Write tools com confirmação humana' 'user-story,study,ai,P0,backend,frontend,security,copilot' 'M12 — AI Copilot' <<'ISSUE_BODY'
## Contexto
Algumas ações podem futuramente ser iniciadas pelo Copilot.

## User Story
> Como usuário, quero revisar exatamente o que será alterado antes da execução.

## Tasks
- [ ] Criar action proposal
- [ ] Persistir actionId expiring
- [ ] Mostrar modal confirmação
- [ ] Revalidar autorização no confirm
- [ ] Executar tool
- [ ] Audit log

## Critérios de aceite
- Texto do chat sozinho nunca executa write
- Action expirada não executa

## Segurança / Guardrails
- Financeiro crítico exige confirmação explícita

## Conceitos para estudar
- human approval
- TOCTOU
- authorization recheck

## Perguntas técnicas
- Por que revalidar autorização após confirmação?

## Dependências
- US-1401
- US-1402

## Definition of Done
- [ ] Implementado
- [ ] Structured outputs validados quando aplicável
- [ ] Testes passando
- [ ] Telemetria adicionada
- [ ] Fallback validado
ISSUE_BODY

# ------------------------------------------------------------
# M13 — AI Quality
# ------------------------------------------------------------
info "=== M13 — AI Quality ==="

create_issue '[US-1501] AI telemetry e cost control' 'user-story,study,ai,P0,observability,copilot' 'M13 — AI Quality' <<'ISSUE_BODY'
## Contexto
IA tem custo, latência e modos de falha próprios.

## User Story
> Como plataforma, quero medir uso e custo por feature.

## Tasks
- [ ] Persistir AIExecution
- [ ] Métricas tokens/cost/latency
- [ ] Tool errors
- [ ] Fallback
- [ ] Budget por feature
- [ ] Dashboard técnico simples

## Critérios de aceite
- Custo estimado por feature disponível
- Provider outage observável

## Segurança / Guardrails
_Não se aplica._

## Conceitos para estudar
- AI observability
- cost control

## Perguntas técnicas
- Quais labels geram cardinalidade excessiva?

## Dependências
_Nenhuma._

## Definition of Done
- [ ] Implementado
- [ ] Structured outputs validados quando aplicável
- [ ] Testes passando
- [ ] Telemetria adicionada
- [ ] Fallback validado
ISSUE_BODY

create_issue '[US-1502] Criar evals de tool selection e factualidade' 'user-story,study,ai,P0,testing,evals,copilot' 'M13 — AI Quality' <<'ISSUE_BODY'
## Contexto
Resposta bonita não garante resposta correta.

## User Story
> Como equipe, quero dataset versionado para evitar regressões.

## Tasks
- [ ] Criar fixtures
- [ ] Tool selection cases
- [ ] Financial factuality cases
- [ ] Case summary cases
- [ ] Authorization cases
- [ ] Write-confirmation cases
- [ ] Executar em CI opcional/quality job

## Critérios de aceite
- Payment PENDING nunca vira 'pago'
- Tool fora do role nunca é executada

## Segurança / Guardrails
_Não se aplica._

## Conceitos para estudar
- AI evals
- golden datasets
- factuality

## Perguntas técnicas
- Como avaliar resposta não determinística?

## Dependências
_Nenhuma._

## Definition of Done
- [ ] Implementado
- [ ] Structured outputs validados quando aplicável
- [ ] Testes passando
- [ ] Telemetria adicionada
- [ ] Fallback validado
ISSUE_BODY

create_issue '[US-1503] Testar prompt injection e tool abuse' 'user-story,study,ai,P0,security,testing,rag' 'M13 — AI Quality' <<'ISSUE_BODY'
## Contexto
RAG e inputs podem tentar manipular o modelo.

## User Story
> Como plataforma, quero garantir que texto externo não aumente privilégio.

## Tasks
- [ ] Criar malicious document fixtures
- [ ] Testar instructions dentro de RAG
- [ ] Testar tool argument injection
- [ ] Testar unauthorized entity ids

## Critérios de aceite
- Documento não consegue liberar tool
- Policy server-side sempre vence

## Segurança / Guardrails
- Authorization independente do modelo

## Conceitos para estudar
- prompt injection
- confused deputy

## Perguntas técnicas
- Por que system prompt não basta?

## Dependências
_Nenhuma._

## Definition of Done
- [ ] Implementado
- [ ] Structured outputs validados quando aplicável
- [ ] Testes passando
- [ ] Telemetria adicionada
- [ ] Fallback validado
ISSUE_BODY

create_issue '[US-1504] AI outage drill e fallback' 'user-story,study,ai,P0,testing,observability' 'M13 — AI Quality' <<'ISSUE_BODY'
## Contexto
Provider de IA pode ficar indisponível.

## User Story
> Como operação, quero continuar usando o produto normalmente.

## Tasks
- [ ] Simular provider 500/timeout
- [ ] UI de indisponibilidade
- [ ] Validar dashboard/casos sem IA
- [ ] Registrar fallback metric

## Critérios de aceite
- Nenhuma função core depende do LLM

## Segurança / Guardrails
_Não se aplica._

## Conceitos para estudar
- graceful degradation

## Perguntas técnicas
- Qual é o SLA real necessário da IA?

## Dependências
_Nenhuma._

## Definition of Done
- [ ] Implementado
- [ ] Structured outputs validados quando aplicável
- [ ] Testes passando
- [ ] Telemetria adicionada
- [ ] Fallback validado
ISSUE_BODY

echo ""
log "Concluído."
echo "Repo: https://github.com/$REPO"
if [ -n "$PROJECT_ID" ]; then
  echo "Project ID: $PROJECT_ID"
fi
