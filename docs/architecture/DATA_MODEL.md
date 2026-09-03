# EMR Despachante — Data Model

> Modelo de dados arquitetural derivado dos boundaries de domínio, não das telas.

## 1. Objetivo

Definir entidades persistidas, chaves, relacionamentos, escopo de autorização, PII, constraints críticas, idempotência, price snapshots e trilhas append-only/audit.

Este documento orienta migrations futuras, mas não é uma migration nem um schema final.

Referências:

- [Requirements and Scale](./REQUIREMENTS_AND_SCALE.md)
- [Domain Model](./DOMAIN_MODEL.md)
- [System Design](./SYSTEM_DESIGN.md)
- [ERD](./diagrams/erd.md)
- [Status Model](../product/STATUS_MODEL.md)

## 2. Princípios de persistência

- PostgreSQL é a fonte da verdade para estado transacional, financeiro, vínculos, metadata, idempotência e auditoria.
- Object storage guarda binários privados; metadata, ownership e autorização ficam no banco.
- Queue, DLQ, Redis, WhatsApp, provider de pagamento, adapter governamental e LLM não são fonte da verdade.
- Dados sensíveis devem ser minimizados, criptografados/mascarados quando aplicável e evitados em logs.
- Constraints críticas devem ser garantidas no banco quando possível, não apenas em código.
- Índices devem derivar de queries reais de produto/operação, não de adivinhação.
- Histórico financeiro e price snapshots não devem ser reescritos quando preço atual muda.
- Audit log é append-only quando aplicável.

## 3. Boundaries e entidades

| Boundary | Entidades principais | Observação |
| --- | --- | --- |
| Identity & Access | `users`, `partner_memberships`, `admin_memberships`, `sessions/invitations` | Autorização server-side; MVP usa `OWNER`, `PARTNER`, `ADMIN`. |
| Partner | `partner_organizations`, `partner_memberships`, `partner_notification_preferences` | PartnerOrganization não é Customer. |
| Customer/Vehicle | `customers`, `vehicles`, `vehicle_status_snapshots`, `fines`, `licensings` | Veículo e status governamental normalizado. |
| Commerce | `orders`, `order_items`, `service_price_snapshots` | Order é comercial; snapshot preserva preço histórico. |
| Payments | `payments`, `processed_webhook_events`, `reconciliation_items` | Payment só vira `PAID` por evento válido/idempotente. |
| Operations | `service_requests`, `service_request_documents`, `government_submissions`, `manual_cases`, `case_notes` | ServiceRequest é trabalho normal; Case é exceção. |
| Documents | `documents`, `document_access_events` | Metadata no banco; arquivo em object storage privado. |
| Notifications | `notifications`, `notification_deliveries`, `notification_outbox` | Canal não é fonte da verdade. |
| Audit | `audit_log` | Append-only para eventos relevantes. |
| Async | `outbox_events` | Publicação assíncrona após transação. |

## 4. Entidades e relacionamentos

### Identity & Access

**users**

- `id` PK
- `name`
- `email`
- `password_hash`
- `role`: `OWNER`, `PARTNER`, `ADMIN`
- `status`
- `created_at`, `updated_at`

Constraints:

- unique `email`
- `role` restrito aos papéis do MVP

PII:

- `name`, `email`
- nunca logar `password_hash`

Queries/índices:

- login por `email`
- listagem/admin por `status`, se gestão de usuários internos estiver habilitada

**partner_memberships**

- `id` PK
- `partner_organization_id` FK
- `user_id` FK
- `role`
- `status`
- `invited_at`, `accepted_at`, `disabled_at`

Constraints:

- unique parcial para vínculo ativo por `partner_organization_id + user_id`

Scope:

- partner só acessa dados da própria `partner_organization_id`

**admin_memberships**

- `id` PK
- `user_id` FK
- `status`
- `created_at`, `disabled_at`

Observação:

- Se o produto virar multi-despachante, este vínculo pode precisar de `tenant_id`. Até a decisão de tenancy, manter a pergunta explícita.

### Partner

**partner_organizations**

- `id` PK
- `legal_name`
- `trade_name`
- `document_encrypted`
- `type`
- `status`
- `created_at`, `updated_at`

Constraints:

- unique para documento normalizado quando aplicável

PII/dados sensíveis:

- CNPJ/documento empresarial pode ser sensível; mascarar em logs e respostas desnecessárias

Queries/índices:

- busca admin por nome/status
- lookup por documento normalizado quando necessário

**partner_notification_preferences**

- `id` PK
- `partner_organization_id` FK
- `channel`
- `target`
- `enabled`
- `created_at`, `updated_at`

Constraints:

- unique `partner_organization_id + channel + target`

### Customer/Vehicle

**customers**

- `id` PK
- `user_id` FK nullable
- `name`
- `cpf_cnpj_encrypted`
- `email`
- `phone`
- `status`
- `created_at`, `updated_at`

PII:

- CPF/CNPJ, email e telefone exigem minimização, criptografia/mascaramento e logs seguros

Queries/índices:

- busca admin por nome/documento mascarado ou normalizado seguro
- lookup por `user_id`

**vehicles**

- `id` PK
- `owner_customer_id` FK nullable
- `partner_organization_id` FK nullable
- `plate_normalized`
- `renavam_encrypted`
- `make`, `model`, `year`
- `overall_status`
- `last_checked_at`
- `active`
- `created_at`, `updated_at`

Constraints:

- índice/unique de deduplicação de placa deve aguardar decisão de ownership B2C/B2B
- se houver vínculo ativo com partner, validar `partner_organization_id`

PII:

- RENAVAM é sensível; não logar valor completo

Queries/índices:

- busca por `plate_normalized`
- listagem por `owner_customer_id`
- listagem por `partner_organization_id`
- filtros admin por `overall_status`, `last_checked_at`

**vehicle_status_snapshots**

- `id` PK
- `vehicle_id` FK
- `source`
- `payload_hash`
- `normalized_status`
- `checked_at`

Constraints:

- índice por `vehicle_id + checked_at desc`
- evitar duplicar snapshot com mesmo `vehicle_id + payload_hash`, quando útil

**fines**

- `id` PK
- `vehicle_id` FK
- `external_reference`
- `amount`
- `due_date`
- `discount_amount`
- `agency`
- `status`
- `detected_at`, `updated_at`

Constraints:

- unique `vehicle_id + external_reference`

Queries/índices:

- multas abertas por veículo
- vencimento próximo

**licensings**

- `id` PK
- `vehicle_id` FK
- `year`
- `amount`
- `due_date`
- `status`
- `government_submission_status`
- `document_id` FK nullable

Constraints:

- unique `vehicle_id + year`

### Commerce

**orders**

- `id` PK
- `order_number`
- `customer_id` FK nullable
- `partner_organization_id` FK nullable
- `service_request_id` FK nullable
- `vehicle_id` FK
- `status`
- `total_amount`
- `currency`
- `created_at`, `updated_at`, `cancelled_at`

Constraints:

- unique `order_number`
- não concluir automaticamente `ServiceRequest` só por alteração financeira

Queries/índices:

- pedidos por customer
- pedidos por partner
- pedidos por status/data

**order_items**

- `id` PK
- `order_id` FK
- `service_type`
- `description`
- `quantity`
- `unit_amount`
- `total_amount`
- `price_snapshot_id` FK nullable

**service_price_snapshots**

- `id` PK
- `source_price_id` nullable
- `partner_organization_id` FK nullable
- `service_type`
- `amount`
- `government_amount`
- `service_fee`
- `provider_fee`
- `discount_amount`
- `currency`
- `captured_at`

Constraints:

- snapshot é imutável após capturado
- preço atual pode mudar sem reescrever histórico

### Payments

**payments**

- `id` PK
- `order_id` FK
- `payer_user_id` FK nullable
- `amount`
- `currency`
- `status`
- `provider`
- `provider_reference`
- `checkout_reference`
- `idempotency_key`
- `created_at`, `confirmed_at`, `updated_at`

Constraints:

- unique `provider + provider_reference`, quando provider_reference existir
- unique `idempotency_key`, quando fornecida pelo cliente/use case
- garantir política de pagamento ativo por alvo quando aplicável

Invariantes:

- Payment só vira `PAID` via evento válido do provider
- checkout/redirect/frontend não confirma pagamento
- Payment `PAID` não conclui `ServiceRequest` automaticamente

Queries/índices:

- payment por `order_id`
- payment por `status + created_at`
- lookup por `provider_reference`

**processed_webhook_events**

- `id` PK
- `provider`
- `event_id`
- `payload_hash`
- `received_at`
- `processed_at`

Constraints:

- unique `provider + event_id`

**reconciliation_items**

- `id` PK
- `payment_id` FK nullable
- `provider`
- `provider_reference`
- `status`
- `reason`
- `opened_at`, `resolved_at`

Queries/índices:

- divergências abertas por status/idade

### Operations

**service_requests**

- `id` PK
- `request_number`
- `source`
- `partner_organization_id` FK nullable
- `requester_user_id` FK nullable
- `customer_id` FK nullable
- `vehicle_id` FK
- `order_id` FK nullable
- `service_type`
- `status`
- `public_notes` nullable
- `created_at`, `updated_at`, `completed_at`

Constraints:

- unique `request_number`
- `source` restrito aos valores do MVP e evoluções documentadas
- `partner_organization_id` obrigatório quando `source = PARTNER_PORTAL`

Invariantes:

- ServiceRequest não cria Case sem exceção documentada
- origem da solicitação não é canal de notificação

Queries/índices:

- fila admin por `status + created_at`
- lista partner por `partner_organization_id + status + created_at`
- histórico por `vehicle_id`

**service_request_documents**

- `id` PK
- `service_request_id` FK
- `document_id` FK
- `requested_type`
- `status`
- `requested_at`, `submitted_at`

Constraints:

- evitar duplicidade de pendência ativa para mesmo `service_request_id + requested_type`

**government_submissions**

- `id` PK
- `service_request_id` FK nullable
- `payment_id` FK nullable
- `vehicle_id` FK
- `type`
- `status`
- `attempts`
- `idempotency_key`
- `last_error`
- `requested_at`, `confirmed_at`, `updated_at`

Constraints:

- unique `idempotency_key`
- retries limitados

Invariantes:

- Submission não sobrescreve estado financeiro
- falha esgotada deve virar exceção operacional visível

**manual_cases**

- `id` PK
- `case_number`
- `service_request_id` FK nullable
- `vehicle_id` FK nullable
- `payment_id` FK nullable
- `customer_id` FK nullable
- `partner_organization_id` FK nullable
- `type`
- `priority`
- `status`
- `reason`
- `assignee_user_id` FK nullable
- `opened_at`, `resolved_at`, `updated_at`

Constraints:

- unique `case_number`
- claim concorrente deve ser feito com update condicional ou optimistic locking

Queries/índices:

- cases abertos por prioridade/idade
- cases por assignee
- cases por service_request/payment/vehicle

**case_notes**

- `id` PK
- `case_id` FK
- `author_user_id` FK
- `text`
- `visibility`
- `created_at`

PII:

- notas internas podem conter dados sensíveis; evitar exposição para owner/partner

### Documents

**documents**

- `id` PK
- `owner_customer_id` FK nullable
- `partner_organization_id` FK nullable
- `vehicle_id` FK nullable
- `service_request_id` FK nullable
- `case_id` FK nullable
- `type`
- `object_key`
- `status`
- `content_type`
- `size_bytes`
- `checksum`
- `created_at`, `deleted_at`

Constraints:

- `object_key` único
- download exige autorização server-side

PII:

- documentos são privados; não expor object key diretamente ao usuário final sem mediação autorizada

**document_access_events**

- `id` PK
- `document_id` FK
- `actor_user_id` FK
- `action`
- `created_at`
- `metadata`

Observação:

- registrar quando houver exigência de auditoria ou investigação.

### Notifications

**notifications**

- `id` PK
- `user_id` FK
- `type`
- `dedup_key`
- `title`
- `body`
- `status`
- `created_at`, `read_at`

Constraints:

- unique `user_id + dedup_key`, quando dedup_key existir

**notification_deliveries**

- `id` PK
- `notification_id` FK
- `channel`
- `target`
- `status`
- `attempts`
- `last_error`
- `sent_at`, `updated_at`

Invariantes:

- entrega externa não é fonte da verdade
- deep link exige login e autorização

**notification_outbox**

- pode ser representado por `outbox_events` com tipo específico ou tabela dedicada se a operação justificar.

### Audit & Async

**audit_log**

- `id` PK
- `actor_user_id` FK nullable
- `action`
- `resource_type`
- `resource_id`
- `scope`
- `safe_metadata`
- `created_at`

Constraints:

- append-only
- não armazenar payload bruto com PII desnecessária

**outbox_events**

- `id` PK
- `type`
- `aggregate_type`
- `aggregate_id`
- `payload`
- `status`
- `attempts`
- `created_at`, `published_at`, `processed_at`

Constraints:

- publicação idempotente por `id`
- payload deve carregar identificadores mínimos, não cópia extensa de PII

## 5. Índices derivados de queries reais

| Query real | Índice candidato |
| --- | --- |
| Login por email | `users(email)` unique |
| Membership ativa de parceiro | `partner_memberships(partner_organization_id, user_id)` unique parcial |
| Lista de solicitações do parceiro | `service_requests(partner_organization_id, status, created_at desc)` |
| Fila admin de solicitações | `service_requests(status, created_at desc)` |
| Fila admin de Cases críticos/antigos | `manual_cases(status, priority, opened_at)` |
| Meus cases | `manual_cases(assignee_user_id, status, opened_at)` |
| Busca por placa | `vehicles(plate_normalized)` |
| Histórico de veículo | índices por `vehicle_id` em snapshots, fines, licensings, service_requests, documents |
| Pagamentos por pedido | `payments(order_id)` |
| Webhook idempotente | `processed_webhook_events(provider, event_id)` unique |
| Divergências abertas | `reconciliation_items(status, opened_at)` |
| Notificações não lidas | `notifications(user_id, status, created_at desc)` |
| Outbox pendente | `outbox_events(status, created_at)` |

Índices devem ser revisados quando volumes reais forem definidos em [Requirements and Scale](./REQUIREMENTS_AND_SCALE.md).

## 6. Constraints críticas

- `users.email` único.
- Membership ativa de parceiro única por organização e usuário.
- Documento normalizado de PartnerOrganization único quando aplicável.
- `fines(vehicle_id, external_reference)` único.
- `licensings(vehicle_id, year)` único.
- `orders.order_number` único.
- `payments(provider, provider_reference)` único quando existir referência do provider.
- `payments.idempotency_key` único quando usado.
- `processed_webhook_events(provider, event_id)` único.
- `government_submissions.idempotency_key` único.
- `manual_cases.case_number` único.
- `notifications(user_id, dedup_key)` único quando usado.
- `documents.object_key` único.
- `audit_log` append-only.

## 7. PII e dados sensíveis

| Dado | Tratamento esperado |
| --- | --- |
| CPF/CNPJ | Criptografar ou proteger em repouso; mascarar em logs e respostas desnecessárias. |
| RENAVAM | Criptografar/proteger; nunca logar completo. |
| Email/telefone | Minimizar exposição; usar apenas quando necessário. |
| Documentos | Armazenar em object storage privado; autorização antes de download. |
| Payment/provider payload | Não logar payload bruto; armazenar somente campos necessários e hash quando útil. |
| Notas internas | Nunca expor para owner/partner sem regra explícita. |
| Prompts/IA | Evitar enviar PII desnecessária ao LLM. |

## 8. Perguntas abertas

- Qual será o tenant real: empresa despachante, PartnerOrganization, ambos ou outro boundary?
- Qual política de deduplicação de veículos entre B2C e B2B/B2B2C?
- Quais preços por parceiro entram no MVP e quais ficam futuros?
- Billing B2B será por Order, ServiceRequest, invoice mensal ou modelo híbrido?
- Quais documentos exigem trilha de acesso append-only?
- Quais eventos precisam de audit log obrigatório?
- Quais queries reais surgirão com volumes/picos definidos?
