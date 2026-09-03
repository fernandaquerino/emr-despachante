# EMR Despachante — ERD

> ERD conceitual derivado dos boundaries de domínio.

## Diagrama

```mermaid
erDiagram
    USERS ||--o{ PARTNER_MEMBERSHIPS : has
    USERS ||--o{ ADMIN_MEMBERSHIPS : has
    USERS ||--o{ PAYMENTS : pays
    USERS ||--o{ CASE_NOTES : writes
    USERS ||--o{ NOTIFICATIONS : receives
    USERS ||--o{ AUDIT_LOG : acts

    PARTNER_ORGANIZATIONS ||--o{ PARTNER_MEMBERSHIPS : grants
    PARTNER_ORGANIZATIONS ||--o{ PARTNER_NOTIFICATION_PREFERENCES : configures
    PARTNER_ORGANIZATIONS ||--o{ SERVICE_REQUESTS : scopes
    PARTNER_ORGANIZATIONS ||--o{ VEHICLES : references
    PARTNER_ORGANIZATIONS ||--o{ ORDERS : bills
    PARTNER_ORGANIZATIONS ||--o{ SERVICE_PRICE_SNAPSHOTS : captures

    CUSTOMERS ||--o{ VEHICLES : owns
    CUSTOMERS ||--o{ ORDERS : places
    CUSTOMERS ||--o{ SERVICE_REQUESTS : requests
    CUSTOMERS ||--o{ DOCUMENTS : owns
    CUSTOMERS ||--o{ MANUAL_CASES : relates

    VEHICLES ||--o{ VEHICLE_STATUS_SNAPSHOTS : records
    VEHICLES ||--o{ FINES : has
    VEHICLES ||--o{ LICENSINGS : has
    VEHICLES ||--o{ ORDERS : used_in
    VEHICLES ||--o{ SERVICE_REQUESTS : used_in
    VEHICLES ||--o{ GOVERNMENT_SUBMISSIONS : submitted_for
    VEHICLES ||--o{ DOCUMENTS : attaches
    VEHICLES ||--o{ MANUAL_CASES : relates

    SERVICE_REQUESTS ||--o{ ORDERS : may_generate
    SERVICE_REQUESTS ||--o{ SERVICE_REQUEST_DOCUMENTS : requires
    SERVICE_REQUESTS ||--o{ GOVERNMENT_SUBMISSIONS : submits
    SERVICE_REQUESTS ||--o{ MANUAL_CASES : escalates_to
    SERVICE_REQUESTS ||--o{ DOCUMENTS : attaches

    ORDERS ||--o{ ORDER_ITEMS : contains
    ORDERS ||--o{ PAYMENTS : paid_by
    ORDER_ITEMS }o--|| SERVICE_PRICE_SNAPSHOTS : uses

    PAYMENTS ||--o{ RECONCILIATION_ITEMS : reconciles
    PAYMENTS ||--o{ GOVERNMENT_SUBMISSIONS : may_trigger
    PAYMENTS ||--o{ MANUAL_CASES : may_escalate

    DOCUMENTS ||--o{ SERVICE_REQUEST_DOCUMENTS : satisfies
    DOCUMENTS ||--o{ DOCUMENT_ACCESS_EVENTS : audited_by

    MANUAL_CASES ||--o{ CASE_NOTES : has

    NOTIFICATIONS ||--o{ NOTIFICATION_DELIVERIES : delivers

    OUTBOX_EVENTS ||--o{ NOTIFICATION_DELIVERIES : may_create
```

## Notas de leitura

- `PartnerOrganization` não é `Customer`.
- `ServiceRequest` é trabalho normal; `ManualCase` é exceção.
- `Order` é comercial; `Payment` é financeiro; `GovernmentSubmission` é integração externa.
- `Document` guarda metadata no banco; binário fica em object storage privado.
- `OutboxEvents` representa efeitos assíncronos publicados depois da transação.

## Constraints críticas no ERD

- `Payment` só vira `PAID` por webhook/evento válido e idempotente do provider.
- `Payment PAID` não conclui `ServiceRequest` automaticamente.
- `ServiceRequest` não cria `ManualCase` sem exceção documentada.
- `ServicePriceSnapshot` é imutável após capturado.
- Autorização é server-side e baseada em ownership/organization scope.
- Webhook idempotente exige unique `provider + event_id`.
- Submissões externas exigem idempotency key quando houver retry.
- Audit log, quando aplicável, é append-only.
