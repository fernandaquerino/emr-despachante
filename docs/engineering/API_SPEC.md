# EMR Despachante — API Surface

## Auth
POST /auth/register
POST /auth/login
POST /auth/logout
POST /operators/invitations
POST /operators/invitations/:token/accept

## Customers
GET /customers
POST /customers
GET /customers/:id
GET /customers/:id/history
POST /customers/:id/notes

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

## Dashboard
GET /ops/dashboard
GET /admin/dashboard

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
