# EMR Despachante — Roadmap

## M0 — Foundation
Monorepo, Docker, Postgres, Redis, CI.

## M1 — Auth & Roles
Proprietário, operadora, admin, convite.

Impacto B2B:
adicionar PARCEIRO, convite de usuário parceiro e permissões por PartnerOrganization.

## M2 — Customers
Lista, detalhe, busca global.

## M3 — Vehicles & Detran Adapter
Cadastro, cache, snapshot, scheduler, worker.

## M4 — Fines
Lista, detalhe, detecção, status.

## M5 — Licensing
Elegibilidade, pagamento, processamento, documento.

## M6 — Payments & Webhooks
Sandbox, duplicate prevention, HMAC, idempotência, outbox, reconciliação.

## M7 — Operator Cases
Criação automática, atribuição concorrente, notas, timeline.

Preservar distinção:
ServiceRequest é trabalho normal; Case é exceção/problema.

## M8 — Operational Dashboard
Cards, fila, casos antigos, clientes em atenção.

Adicionar fila de ServiceRequests normais sem reduzir protagonismo de Cases críticos.

## M9 — Admin Panel
Receita, volume, catálogo, operadoras, fila consolidada, reconciliação.

Adicionar gestão de parceiros em `/admin/parceiros` e `/admin/parceiros/:id`.

## M10 — Notifications, History & Documents
Dedup, timelines, S3.

WhatsApp outbound pode notificar solicitação, mas não é fonte da verdade. WhatsApp inbound fica como discovery futuro.

## M11 — Observability & Security
OTel, metrics, alerts, LGPD, IDOR.

## M12 — AI Copilot
AI Gateway, tools, chat, case summary, admin brief, customer chatbot, RAG, message draft, confirmation.

## M13 — AI Quality
Evals, telemetry, cost control, fallback, authorization tests.

## M14 — AWS & Delivery
VPC, ECS, RDS, Redis, SQS, S3, CloudFront, OIDC, Terraform.

## M15 — Scale & System Design
10k/100k vehicles, webhook storm, Detran outage, AI outage, queue backlog, p95 regression.

Perguntas abertas:
- B2C + B2B2C e limites de PartnerOrganization;
- se PartnerOrganization é ou não Tenant;
- organization isolation;
- billing B2B;
- source da solicitação versus canal de notificação.

## M16 — Partner Portal & B2B Intake
Portal do parceiro, ServiceRequests B2B/B2B2C, dashboard do parceiro, solicitações, documentos, equipe, operação de solicitações e admin de parceiros.
