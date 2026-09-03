# EMR Despachante — Status Models

## VehicleOverallStatus
- REGULAR
- ATTENTION
- IRREGULAR
- PROCESSING
- MANUAL_REVIEW
- UNKNOWN

## FineStatus
- OPEN
- PAYMENT_PENDING
- PAID
- CLEARANCE_PROCESSING
- CLEARED
- CANCELLED

## LicensingStatus
- ELIGIBLE
- BLOCKED
- PAYMENT_PENDING
- PAID
- PROCESSING
- DOCUMENT_READY
- FAILED

## PaymentStatus
- PENDING
- PAID
- FAILED
- CANCELLED
- REFUND_PENDING
- REFUNDED

## ServiceRequestStatus
- NEW
- IN_PROGRESS
- WAITING_CUSTOMER
- WAITING_PARTNER
- WAITING_EXTERNAL
- COMPLETED
- CANCELLED

ServiceRequestStatus representa o lifecycle do trabalho solicitado. Não reutilizar CaseStatus para solicitações normais.

## ServiceRequestSource
- PUBLIC_WEB
- PARTNER_PORTAL
- ADMIN
- WHATSAPP
- API

MVP:
- PUBLIC_WEB
- PARTNER_PORTAL
- ADMIN

WHATSAPP fica reservado para evolução futura/inbound discovery. A origem da solicitação é diferente do canal de notificação.

Exemplo:

```text
source = PARTNER_PORTAL
notification channels = IN_APP, WHATSAPP
```

## GovernmentSubmissionStatus
- NOT_REQUESTED
- QUEUED
- PROCESSING
- CONFIRMED
- FAILED
- MANUAL_REVIEW

## CaseStatus
- OPEN
- IN_PROGRESS
- WAITING_CLIENT
- WAITING_EXTERNAL
- RESOLVED
- CANCELLED

## CasePriority
- LOW
- MEDIUM
- HIGH
- CRITICAL

## OperatorStatus
- INVITED
- ACTIVE
- SUSPENDED
- DISABLED

## ServiceStatus
- ACTIVE
- INACTIVE

## Regra
Display status pode ser composto, mas source-of-truth statuses devem permanecer explícitos.

Separar explicitamente:
- status da solicitação;
- status do pagamento;
- status da submissão externa;
- status do Case.

```text
ServiceRequest = trabalho normal solicitado por proprietário, parceiro ou operação.
Case = exceção/problema que exige intervenção humana especial.
```
