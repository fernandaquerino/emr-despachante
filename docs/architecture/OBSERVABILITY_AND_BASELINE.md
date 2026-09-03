# EMR Despachante — Observability and Architecture Baseline

> Baseline arquitetural antes do desenvolvimento funcional.

## 1. Objetivo

Fechar a baseline mínima para desenvolvimento começar sem decisões arquiteturais implícitas sobre observabilidade, rastreabilidade, alertas, runbooks e ADRs.

Esta baseline complementa:

- [Requirements and Scale](./REQUIREMENTS_AND_SCALE.md)
- [Domain Model](./DOMAIN_MODEL.md)
- [System Design](./SYSTEM_DESIGN.md)
- [Data Model](./DATA_MODEL.md)
- [Critical Flows](./CRITICAL_FLOWS.md)
- [Failure Modes](./FAILURE_MODES.md)
- [Security Architecture](./SECURITY_ARCHITECTURE.md)
- [ADRs](./ADRS.md)

## 2. Logs, metrics e traces

### Logs

Logs devem ser estruturados e orientados a eventos.

Campos mínimos:

- `timestamp`
- `level`
- `event`
- `traceId`
- `correlationId`
- `actorId` quando seguro
- `resourceType`
- `resourceId`
- `status`
- `errorCode` quando houver erro conhecido

Regras:

- Não logar CPF/CNPJ completo, RENAVAM completo, documentos, authorization headers, secrets, payload financeiro bruto ou prompts completos com PII.
- Logs operacionais devem explicar o que aconteceu sem expor dados desnecessários.
- Eventos financeiros, webhooks, documentos, Case claim e AI write confirmations exigem rastreabilidade suficiente para investigação.

### Metrics

Métricas iniciais devem medir saúde do sistema e dos fluxos críticos, sem alta cardinalidade.

APIs:

- `http_request_duration`
- `http_error_total`
- `http_request_total`
- `auth_login_failure_total`
- `rate_limit_block_total`

Pagamentos/webhooks:

- `payment_created_total`
- `payment_confirmed_total`
- `payment_failed_total`
- `webhook_received_total`
- `webhook_invalid_total`
- `webhook_duplicate_total`

Assíncrono:

- `outbox_pending_total`
- `outbox_publish_failure_total`
- `queue_depth`
- `oldest_message_age`
- `dlq_depth`
- `worker_job_duration`
- `worker_job_failure_total`

Operação:

- `service_requests_open_total`
- `service_requests_waiting_partner_total`
- `cases_open_total`
- `cases_critical_total`
- `case_claim_conflict_total`
- `stale_vehicle_snapshot_total`

Documentos/notificações:

- `document_upload_failure_total`
- `document_download_denied_total`
- `notification_delivery_failure_total`
- `whatsapp_delivery_failure_total`

IA:

- `ai_request_total`
- `ai_error_total`
- `ai_latency`
- `ai_tool_call_total`
- `ai_tool_authorization_denied_total`
- `ai_write_confirmation_total`
- `ai_fallback_total`

### Traces

Traces devem cobrir:

- request HTTP do frontend até API;
- transações críticas no banco;
- webhook de pagamento;
- outbox publish;
- queue consume;
- worker job;
- DetranClient/mock;
- envio de notificação;
- upload/download de documento;
- AI Gateway → tool → domain service.

## 3. Correlation e trace IDs

### Regras

- Todo request externo recebe ou cria `traceId`.
- Todo fluxo de negócio relevante recebe `correlationId`.
- `correlationId` deve atravessar API, banco, outbox, queue, worker e integrações.
- Webhook deve registrar `provider`, `providerEventId`, `paymentId` quando conhecido e `correlationId`.
- Jobs devem manter referência ao `outboxEventId` ou `jobId`.
- Logs não devem usar CPF, RENAVAM, email ou telefone como correlation id.

### Identificadores por fluxo

| Fluxo | IDs mínimos |
| --- | --- |
| Vehicle lookup | `traceId`, `correlationId`, `vehicleId` quando seguro |
| Checkout/payment | `traceId`, `correlationId`, `orderId`, `paymentId` |
| Webhook | `traceId`, `correlationId`, `provider`, `providerEventId`, `paymentId` |
| Outbox/worker | `traceId`, `correlationId`, `outboxEventId`, `jobId`, `aggregateId` |
| Government submission | `traceId`, `correlationId`, `submissionId`, `serviceRequestId` |
| Partner request | `traceId`, `correlationId`, `partnerOrganizationId`, `serviceRequestId` |
| Case claim | `traceId`, `correlationId`, `caseId`, `actorId` |
| Document upload/download | `traceId`, `correlationId`, `documentId`, `actorId` |
| AI tool call | `traceId`, `correlationId`, `aiRequestId`, `toolName`, `actorId` |

## 4. SLIs/SLOs iniciais

Não há SLO formal aprovado em [Requirements and Scale](./REQUIREMENTS_AND_SCALE.md). Portanto, esta baseline define **SLIs iniciais** e deixa metas como `TBD` até haver requisito real.

| Área | SLI inicial | SLO inicial |
| --- | --- | --- |
| API | latência e taxa de erro por rota crítica | TBD |
| Auth | taxa de login falho, sessão expirada e bloqueio por rate limit | TBD |
| Webhook | taxa de webhooks válidos, inválidos, duplicados e processados | TBD |
| Payment | tempo entre criação e confirmação por webhook | TBD |
| Outbox | idade do evento pendente mais antigo e falha de publicação | TBD |
| Queue/worker | profundidade da fila, idade da mensagem mais antiga, falhas por job | TBD |
| DLQ | quantidade de mensagens em DLQ por tipo | TBD |
| DetranClient/mock | taxa de timeout/erro e latência da integração | TBD |
| ServiceRequest | solicitações abertas por status e idade | TBD |
| Case | cases abertos/críticos e conflitos de claim | TBD |
| Document | falhas de upload/download negado | TBD |
| Notification/WhatsApp | falhas de entrega por canal | TBD |
| AI | latência, erro, fallback, tool failures e authorization denied | TBD |

Regra: não transformar estes SLIs em SLOs numéricos sem aprovação de produto/operação.

## 5. Alert principles

Alertas devem indicar ação necessária, não apenas ruído.

Princípios:

- Alertar quando houver impacto real ou risco iminente em fluxo crítico.
- Preferir alertas por sintoma antes de alertas por causa interna.
- Evitar thresholds inventados; usar `TBD` até baseline operacional existir.
- Todo alerta precisa de owner, severidade, runbook e critério de resolução.
- PII e secrets nunca entram na mensagem de alerta.
- DLQ, webhook inválido/erro, falha de payment e indisponibilidade de provider merecem visibilidade alta.

Alertas candidatos:

| Alerta | Condição inicial | Severidade inicial | Runbook |
| --- | --- | --- | --- |
| DLQ não vazia | TBD | Alta | `RUNBOOK-DLQ` |
| Webhook error/invalid spike | TBD | Alta | `RUNBOOK-WEBHOOK` |
| Payment confirmation delay | TBD | Alta | `RUNBOOK-PAYMENT` |
| Outbox backlog | TBD | Média/Alta | `RUNBOOK-OUTBOX` |
| Queue oldest message age elevado | TBD | Média/Alta | `RUNBOOK-WORKER` |
| DetranClient timeout spike | TBD | Média | `RUNBOOK-GOVERNMENT` |
| WhatsApp outage | TBD | Média | `RUNBOOK-NOTIFICATION` |
| Document upload failure spike | TBD | Média | `RUNBOOK-DOCUMENTS` |
| AI provider unavailable | TBD | Baixa/Média | `RUNBOOK-AI` |
| Security authorization denied spike | TBD | Média/Alta | `RUNBOOK-SECURITY` |

## 6. Runbook template

Cada alerta deve ter um runbook neste formato:

```md
# RUNBOOK-<ID> — <Nome do alerta>

## Sintoma

O que o alerta significa em linguagem operacional.

## Impacto provável

Quem é afetado: owner, partner, admin, pagamento, documentos, integrações ou IA.

## Primeira triagem

- Verificar dashboard/métrica principal.
- Verificar logs por `traceId`/`correlationId`.
- Verificar erros recentes por `event` e `errorCode`.
- Verificar fila/DLQ quando houver assíncrono.

## Ações seguras

- Ações que podem ser tomadas sem risco de corromper estado.
- Reprocessamento permitido, se idempotente.
- Como comunicar status para operação/produto.

## Ações proibidas

- Não alterar status financeiro manualmente sem procedimento aprovado.
- Não apagar audit log.
- Não reenviar documentos/notificações sem autorização quando houver PII.
- Não ignorar idempotência.

## Critério de resolução

Como saber que o incidente terminou.

## Pós-incidente

- Registrar causa.
- Registrar impacto.
- Criar issue/ADR se a correção mudar arquitetura.
```

## 7. ADRs necessárias

ADRs são usadas apenas para decisões relevantes e difíceis de reverter.

Criadas nesta baseline:

- [ADR-001 — Modular monolith antes de microservices](./ADRS.md#adr-001--modular-monolith-antes-de-microservices)
- [ADR-002 — PostgreSQL como fonte da verdade transacional](./ADRS.md#adr-002--postgresql-como-fonte-da-verdade-transacional)
- [ADR-003 — Transactional outbox para efeitos assíncronos](./ADRS.md#adr-003--transactional-outbox-para-efeitos-assíncronos)
- [ADR-004 — AI boundary via API/tools autorizadas](./ADRS.md#adr-004--ai-boundary-via-apitools-autorizadas)
- [ADR-005 — Redis condicionado a justificativa/medição](./ADRS.md#adr-005--redis-condicionado-a-justificativamedição)

Não criar ADR para:

- nomenclatura de telas;
- detalhes reversíveis de UI;
- thresholds ainda `TBD`;
- serviços externos ainda não escolhidos;
- decisões que dependem de tenancy/billing B2B em aberto.

## 8. Open questions bloqueadoras

Estas perguntas bloqueiam decisões arquiteturais específicas, mas não bloqueiam início de implementação funcional quando o escopo respeitar os defaults documentados.

| Pergunta | Bloqueia | Default seguro até resposta |
| --- | --- | --- |
| Qual é o tenant real? | Modelo multi-tenant definitivo, particionamento e isolamento físico/lógico avançado. | Tratar PartnerOrganization como organization scope e manter tenancy como pergunta explícita. |
| Haverá múltiplos despachantes no mesmo deploy? | Tenant global, chaves de escopo obrigatórias e operação multi-empresa. | Não assumir multi-despachante sem requisito. |
| Billing B2B será mensal/postpaid, por solicitação ou híbrido? | Invoices, fechamento mensal e financeiro do parceiro. | Manter billing B2B profundo fora do MVP. |
| Quais volumes/picos reais? | Read models dedicados, cache obrigatório e escala de workers. | Usar PostgreSQL + índices derivados de queries reais; Redis apenas se medido. |
| Quais SLOs/RPO/RTO formais? | Metas numéricas, DR e HA específicos. | Registrar SLIs sem metas inventadas. |
| Quais integrações governamentais reais entram? | Contratos de adapter real, retry, rate limit externo e DLQ detalhada. | Usar DetranClient/mock controlado. |
| Qual provider de pagamento real? | Detalhes de assinatura, payload e reconciliação provider-specific. | Manter contrato genérico com assinatura/idempotência. |

## 9. Baseline para início de desenvolvimento

Implementação funcional pode começar se seguir:

- modular monolith com boundaries internos claros;
- PostgreSQL como fonte da verdade;
- autorização server-side em todos os use cases;
- idempotência persistida em webhooks, payments e jobs críticos;
- outbox para efeitos assíncronos após transação;
- queue/DLQ para workers e integrações;
- object storage privado com metadata/autorização no banco;
- logs estruturados com `traceId` e `correlationId`;
- SLIs instrumentáveis desde o início, mesmo com SLOs `TBD`;
- audit para eventos sensíveis;
- AI boundary sem acesso direto ao banco.

## 10. Definition of Done da baseline

- [ ] Baseline aprovada por pessoa responsável do projeto.
- [x] Open questions bloqueadoras explícitas.
- [x] ADRs necessárias criadas.
- [x] Implementação pode começar sem decisões arquiteturais implícitas, respeitando defaults seguros.

Observação: aprovação humana da baseline não pode ser feita por este documento automaticamente.
