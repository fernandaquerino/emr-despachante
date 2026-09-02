# EMR Despachante — Observability

## Objetivo

Responder rapidamente:
- uma solicitação foi criada?
- qual é a origem da solicitação?
- um pagamento foi confirmado?
- webhook chegou?
- evento outbox foi publicado?
- worker processou?
- DetranClient respondeu?
- baixa foi reconhecida?
- caso manual foi aberto?
- notificação WhatsApp falhou sem bloquear o fluxo?

## Trace principal

```text
Webhook
  ↓
PaymentService
  ↓
Transaction
  ↓
Outbox
  ↓
Publisher
  ↓
SQS
  ↓
Worker
  ↓
DetranClient
```

Propagar:
- traceId;
- correlationId;
- paymentId;
- vehicleId quando seguro;
- providerEventId.
- serviceRequestId;
- partnerOrganizationId quando seguro.

## Trace de ServiceRequest

```text
Partner/Public/Ops intake
  ↓
ServiceRequestService
  ↓
Authorization
  ↓
Transaction
  ↓
NotificationOutbox
  ↓
In-app notification
  ↓
WhatsApp provider quando configurado
```

## Métricas

### API
- http_request_duration
- http_error_rate
- dashboard_duration
- search_duration

### Payment
- payment_created_total
- payment_confirmed_total
- payment_failed_total
- webhook_received_total
- webhook_duplicate_total
- reconciliation_pending_total

### External integration
- detran_request_total
- detran_error_total
- detran_timeout_total
- detran_latency

### Queue
- queue_depth
- oldest_message_age
- dlq_depth
- worker_processing_duration
- worker_failure_total

### Dashboard
- critical_cases_count
- service_requests_open_count
- service_requests_waiting_partner_count
- service_requests_waiting_external_count
- stale_vehicles_count
- manual_cases_open
- payment_processing_count

## Alertas iniciais

1. DLQ > 0 por X minutos
2. taxa de falha DetranClient acima do baseline
3. webhook error rate acima do threshold
4. backlog de casos críticos crescendo
5. p95 dashboard acima da meta
6. oldest message age alto
7. falha de notificação WhatsApp acima do baseline
8. solicitações aguardando parceiro acima do baseline

## Logs

Formato estruturado.

Exemplo:

```json
{
  "level": "info",
  "event": "payment_webhook_processed",
  "paymentId": "...",
  "providerEventId": "...",
  "traceId": "...",
  "durationMs": 84
}
```

Nunca logar payload financeiro bruto.
Nunca logar documentos, CPF/RENAVAM completos ou conteúdo sensível em notificação WhatsApp.


---

# AI Observability

## Métricas
- ai_request_total
- ai_error_total
- ai_latency_ms
- ai_input_tokens
- ai_output_tokens
- ai_estimated_cost
- ai_tool_call_total
- ai_tool_error_total
- ai_authorization_denied_total
- ai_fallback_total
- ai_structured_validation_failure_total
- ai_write_confirmation_total
- ai_case_summary_usage
- ai_message_draft_usage

## Trace
Chat request → AI Gateway → LLM → tool → domain service → database.

## Alertas
- spike de tool errors;
- custo diário fora do budget;
- autorização negada anormalmente alta;
- provider indisponível;
- validation failures acima do baseline.
