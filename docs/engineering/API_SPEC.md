# EMR Despachante — API Surface

## Auth
POST /auth/register
POST /auth/login
POST /auth/logout
POST /partners/invitations
POST /partners/invitations/:token/accept

## Customers
GET /customers
POST /customers
GET /customers/:id
GET /customers/:id/history
POST /customers/:id/notes

## Public Vehicle Lookup

> ⚠️ **PENDENTE DE CONFIRMAÇÃO.** Proposta do frontend (`FE-PUB-002`/#151),
> registrada em `ADR-019`, para a capability `BE-VEH-001`/#159 — que está
> aberta e não define contrato. Confirmar ou corrigir ao implementar o backend.
> Implementação do cliente: `apps/web/src/lib/consult/`.

```text
POST /public/vehicle-lookups
GET  /public/vehicle-lookups/:id
```

Não autenticada (`EMR-SCREEN-MAP.md` §2.2: "não obrigatória para a consulta
inicial segura"), com rate limit próprio.

`POST` — e não `GET` com query string — porque o RENAVAM é dado sensível e não
pode aparecer em access log, Referer ou histórico do navegador
(`SECURITY_ARCHITECTURE.md`: não logar RENAVAM).

Request:

```ts
{ plate: string;      // normalizada: uppercase, sem hífen
  renavam?: string }  // somente quando o servidor sinalizou precisar
```

Respostas:

| HTTP | Corpo | Significado |
|---|---|---|
| `200` | `{ status: "completed", consultationId, vehicle, pendings[], lastUpdatedAt, unavailableSources? }` | Consulta concluída. `pendings` vazio = sem pendência **nesta consulta**, nunca atestado de regularidade. |
| `200` | `{ status: "renavam_required" }` | Etapa do fluxo, não erro. |
| `404` | `{ code: "VEHICLE_NOT_FOUND" }` | |
| `422` | `{ code: "VEHICLE_LOOKUP_INVALID_PLATE" }` | |
| `429` | `{ code: "VEHICLE_LOOKUP_RATE_LIMITED" }` | |
| `502/503/504` | `{ code: "VEHICLE_LOOKUP_UNAVAILABLE" }` | |

`lastUpdatedAt` é obrigatório no corpo (ADR-009: staleness explícita).
A resposta nunca inclui CPF, RENAVAM completo ou dados do proprietário.

`GET /public/vehicle-lookups/:id` serve `/consultar/:id` (`FE-PUB-003`/#152) —
é o que permite ao resultado ser recuperado sem reenviar o RENAVAM. Ainda não
consumido pelo frontend.

## Vehicles
POST /vehicles
GET /vehicles
GET /vehicles/:id
POST /vehicles/:id/refresh
GET /vehicles/:id/history

## Fines
GET /vehicles/:id/fines
GET /fines/:id

## Licensing
POST /vehicles/:id/licensing
GET /licensings/:id

## Payments
POST /payments
GET /payments/:id
POST /webhooks/payments/:provider
POST /payments/:id/refund-request

## Cases
GET /cases
GET /cases/:id
POST /cases/:id/claim
POST /cases/:id/notes
PATCH /cases/:id/status

## Service Requests
GET /service-requests
POST /service-requests
GET /service-requests/:id
PATCH /service-requests/:id/status
POST /service-requests/:id/documents

## Partner Portal
GET /partner/dashboard
GET /partner/service-requests
POST /partner/service-requests
GET /partner/service-requests/:id
GET /partner/vehicles
GET /partner/vehicles/:id
GET /partner/documents
GET /partner/team

## Admin Partners
GET /admin/partners
POST /admin/partners
GET /admin/partners/:id
PATCH /admin/partners/:id
GET /admin/partners/:id/service-requests
GET /admin/partners/:id/notification-preferences
PATCH /admin/partners/:id/notification-preferences

## Dashboard
GET /admin/dashboard
GET /admin/operation-dashboard

## Reconciliation
GET /admin/reconciliation
GET /admin/reconciliation/:paymentId

## Documents
GET /documents/:id/download-url

## AI
POST /ai/chat
POST /ai/case-summary
POST /ai/admin-brief
POST /ai/customer-message-draft
POST /ai/customer-chat
POST /ai/actions/:actionId/confirm

## AI tool boundary
Tools are internal server functions/endpoints, not necessarily public HTTP routes.

## Conceitos

ServiceRequestSource:
- PUBLIC_WEB
- PARTNER_PORTAL
- ADMIN
- WHATSAPP futuro
- API futuro

Origem da solicitação não é canal de notificação.
