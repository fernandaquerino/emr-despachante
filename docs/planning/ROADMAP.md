# EMR Despachante — Roadmap

## M0 — Foundation
Monorepo, Docker, Postgres, Redis, CI.

## M1 — Auth & Roles
Proprietário, operadora, admin, convite.

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

## M8 — Operational Dashboard
Cards, fila, casos antigos, clientes em atenção.

## M9 — Admin Panel
Receita, volume, catálogo, operadoras, fila consolidada, reconciliação.

## M10 — Notifications, History & Documents
Dedup, timelines, S3.

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
