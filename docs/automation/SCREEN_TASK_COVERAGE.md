# EMR Despachante — Screen Task Coverage

Este arquivo cruza as telas de `docs/product/SCREEN_SPECS.md` com as automações de criação de issues.

## Fonte revisada

- `create-emr-backlog.sh`
- `create-emr-issues.sh`
- `create-emr-new-issues.sh`
- `create-partners-issues.sh`
- `create-system-design-issues.sh`
- `emr-despachante-issues.json`

## Cobertura por tela

Para implementação frontend, a fonte preferida é `create-emr-backlog.sh`, que usa issues `FE-*`. Os scripts antigos `US-*` ficam como histórico/backlog base.

| Tela | Issue(s) de automação | Cobertura |
| --- | --- | --- |
| Login | `US-102`, `US-PT-001` | Coberta |
| Sidebar / App Shell | `US-PT-001`, `US-102` | Protótipo e implementação cobertos |
| Perfil do usuário | `US-PT-012`, `US-104` | Protótipo e implementação cobertos |
| Configurações | `US-PT-012`, `US-104`, `US-102` | Protótipo e implementação cobertos |
| Cadastro do proprietário | `US-101`, `US-PT-009` | Coberta |
| Meus veículos | `US-PT-009`, `US-301`, `US-303` | Coberta |
| Cadastrar veículo | `US-301`, `US-PT-005`, `US-PT-009` | Coberta |
| Dashboard do Parceiro | `US-PRT-003` | Coberta |
| Lista de Solicitações do Parceiro | `US-PRT-005` | Coberta |
| Nova Solicitação | `US-PRT-004`, `US-PRT-007` | Coberta |
| Detalhe/Acompanhamento da Solicitação | `US-PRT-005` | Coberta |
| Documentos/Pendências do Parceiro | `US-PRT-009`, `US-PRT-005` | Coberta |
| Equipe do Parceiro | `US-PRT-002`, `US-PRT-003` | Coberta em nível MVP/protótipo leve |
| Detalhe do veículo | `US-PT-005`, `US-301`, `US-303` | Coberta |
| Detalhe da multa | `US-PT-005`, `US-401`, `US-402` | Coberta |
| Checkout | `US-PT-006`, `US-601` | Coberta |
| Pedido / Acompanhamento | `US-PT-006`, `US-502`, `US-604` | Coberta |
| Histórico do veículo | `US-1002`, `US-PT-005` | Coberta |
| Dashboard Operacional | `US-PT-002`, `US-801`, `US-802`, `US-PRT-006` | Coberta |
| Solicitações da Operadora | `US-PRT-006`, `US-PRT-007` | Coberta |
| Detalhe da Solicitação Operacional | `US-PRT-006`, `US-PRT-007` | Coberta |
| Casos | `US-PT-003`, `US-702`, `US-703` | Coberta |
| Detalhe do caso | `US-PT-003`, `US-704`, `US-1404` | Coberta |
| Clientes | `US-PT-004`, `US-201`, `US-203` | Coberta |
| Detalhe do cliente | `US-PT-004`, `US-202`, `US-1002` | Coberta |
| Veículos da operação | `US-PT-005`, `US-301`, `US-303` | Coberta |
| Dashboard Admin | `US-PT-007`, `US-901`, `US-PRT-010`, `US-PRT-011` | Coberta |
| Admin — Parceiros | `US-PRT-010` | Coberta |
| Admin — Partner Detail | `US-PRT-010`, `US-PRT-012` | Coberta |
| Serviços e preços | `US-PT-008`, `US-902`, `US-PRT-010` | Coberta |
| Operadoras | `US-PT-008`, `US-903` | Coberta |
| Detalhe da operadora | `US-PT-008`, `US-903` | Coberta |
| Reconciliação financeira | `US-PT-006`, `US-605` | Coberta |
| Auditoria | `US-PT-008`, `US-1103`, `US-PRT-002`, `US-PRT-010` | Coberta |
| EMR Copilot da operação | `US-PT-010`, `US-1403` | Coberta |
| IA no detalhe do caso | `US-PT-010`, `US-1404` | Coberta |
| IA no Dashboard Admin | `US-PT-010`, `US-1405` | Coberta |
| Chatbot do proprietário | `US-PT-010`, `US-1408` | Coberta |
| Confirmação de ações via IA | `US-PT-010`, `US-1409` | Coberta |

## Ajustes feitos nesta revisão

- Explicitei no script de parceiros a navegação para solicitações, documentos e equipe.
- Explicitei tarefas para `/ops/solicitacoes` e `/ops/solicitacoes/:id`.
- Explicitei tarefas para `/admin/parceiros` e `/admin/parceiros/:id`.
- Relacionei preferências de notificação ao Partner Detail quando aplicável.
- Explicitei AppShell/sidebar por área no protótipo e na implementação de auth/layout.
- Adicionei `US-104` para implementação de Perfil do usuário e Configurações de conta.

## Observações

- `create-emr-issues.sh` e `create-emr-new-issues.sh` cobrem o produto base e parecem duplicar a mesma geração principal.
- `emr-despachante-issues.json` representa o backlog base, mas ainda não contém as issues do Partner Portal.
- O arquivo `create-partners-issues.sh` é o complemento correto para as telas novas de parceiro.
