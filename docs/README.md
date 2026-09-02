# Documentação — EMR Despachante

Documentação de produto, engenharia, design, inteligência artificial e planejamento do EMR Despachante.

## Comece por aqui

- [Visão e catálogo do produto](../README.md)
- [Descrição do produto](product/PRODUCT_DESCRIPTION.md)
- [Requisitos](product/REQUIREMENTS.md)
- [Partner Portal, ServiceRequest e B2B Intake](product/PRODUCT_DESCRIPTION.md)
- [Arquitetura](engineering/ARCHITECTURE.md)
- [Roadmap](planning/ROADMAP.md)

## Produto e protótipo

- [Catálogo do produto](../README.md)
- [Descrição do produto](product/PRODUCT_DESCRIPTION.md)
- [Requisitos](product/REQUIREMENTS.md)
- [Dashboard](product/DASHBOARD_SPEC.md)
- [Arquitetura da informação](product/INFORMATION_ARCHITECTURE.md)
- [Mapa completo de telas, rotas e issues FE](EMR-SCREEN-MAP.md)
- [Especificações de telas](product/SCREEN_SPECS.md)
- [Fluxos de usuário](product/USER_FLOWS.md)
- [Brief do protótipo no Figma](product/FIGMA_MAKE_BRIEF.md)
- [Dados do protótipo](product/PROTOTYPE_DATA.md)
- [Modelos de status](product/STATUS_MODEL.md)

Conceitos importantes:
- ServiceRequest é trabalho normal solicitado por proprietário, parceiro ou operação.
- Case é exceção/problema que exige intervenção humana especial.
- WhatsApp é canal outbound no MVP, não fonte da verdade.

## Design system

- [Direção e decisões](design-system/DESIGN_SYSTEM.md)
- [Tokens](design-system/TOKENS.md)
- [Componentes](design-system/COMPONENTS.md)
- [Regras de UX](design-system/UX_RULES.md)
- [Interface do Copilot](design-system/AI_COPILOT_UI.md)

## Engenharia

- [Arquitetura](engineering/ARCHITECTURE.md)
- [Modelo de dados](engineering/DATA_MODEL.md)
- [API](engineering/API_SPEC.md)
- [Decisões de arquitetura](engineering/ADRS.md)
- [Segurança e LGPD](engineering/SECURITY_AND_LGPD.md)
- [Observabilidade](engineering/OBSERVABILITY.md)

## Inteligência artificial

- [Especificação de produto](ai/AI_PRODUCT_SPEC.md)
- [Arquitetura](ai/AI_ARCHITECTURE.md)
- [Tools e guardrails](ai/AI_TOOLS_AND_GUARDRAILS.md)
- [Evals](ai/AI_EVALS.md)

## Planejamento

- [Roadmap](planning/ROADMAP.md)
- [Guia de detalhamento de tarefas](planning/TASKS_DETAILED.md)
- [Backlog](planning/BACKLOG.md)

## Automação

- [Script de criação de issues](automation/create-emr-issues.sh)
- [Cobertura de telas por issues](automation/SCREEN_TASK_COVERAGE.md)
- [Payload das issues](automation/emr-despachante-issues.json)

## Convenções

- Documentos ficam agrupados pelo assunto principal.
- Novos documentos devem ser adicionados a este índice.
- Links internos devem ser relativos ao arquivo de origem.
- Artefatos executáveis e dados auxiliares ficam em `automation/`, não junto às especificações.
