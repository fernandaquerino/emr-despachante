# EMR Despachante — Data Model

## Entidades principais

### users
- id
- name
- email
- password_hash
- role
- status
- created_at

Roles conceituais:
- OWNER / PROPRIETARIO
- PARTNER / PARCEIRO
- OPERATOR / OPERADORA
- ADMIN

### dispatcher_profiles
- id
- user_id
- cpf_or_cnpj_encrypted
- phone
- approval_status
- commission_model
- commission_value

### dispatcher_clients
- id
- dispatcher_id
- owner_id
- status
- invited_at
- accepted_at
- revoked_at

Unique sugerida:
`dispatcher_id + owner_id` para vínculo ativo.

### vehicles
- id
- owner_id
- dispatcher_id nullable
- plate_normalized
- renavam_encrypted
- make
- model
- year
- overall_status
- last_checked_at
- active

### vehicle_status_snapshots
- id
- vehicle_id
- source
- payload_hash
- normalized_status
- checked_at

### fines
- id
- vehicle_id
- external_reference
- amount
- due_date
- discount_amount
- agency
- status
- detected_at
- updated_at

Unique:
`vehicle_id + external_reference`.

### licensings
- id
- vehicle_id
- year
- amount
- due_date
- status
- government_submission_status
- document_id nullable

Unique:
`vehicle_id + year`.

### partner_organizations
- id
- legal_name
- trade_name
- type
- status
- created_at
- updated_at

PartnerOrganization representa a empresa parceira atendida pelo despachante. Não modelar conceitualmente como Customer.

Open question:
o tenant será a empresa despachante e PartnerOrganization uma organização atendida por ela?

### partner_memberships
- id
- partner_organization_id
- user_id
- role
- status
- invited_at
- accepted_at
- disabled_at

Unique sugerida:
`partner_organization_id + user_id` para vínculo ativo.

### service_requests
- id
- request_number
- source
- partner_organization_id nullable
- requester_user_id nullable
- owner_id nullable
- vehicle_id
- service_type
- status
- notes_public nullable
- created_at
- updated_at
- completed_at nullable

ServiceRequest é trabalho normal solicitado por proprietário, parceiro ou operação. Não usar CaseStatus para ServiceRequest.

### service_request_documents
- id
- service_request_id
- document_id
- requested_type
- status
- requested_at
- submitted_at nullable

### partner_notification_preferences
- id
- partner_organization_id
- channel
- target
- enabled
- created_at
- updated_at

### partner_prices futuro
- id
- partner_organization_id
- service_type
- price_snapshot_strategy
- active_from
- active_until nullable

Preço negociado deve preservar histórico/snapshot na ServiceRequest/Order/Payment aplicável.

### payments
- id
- fine_id nullable
- licensing_id nullable
- payer_id
- amount
- status
- provider
- provider_reference
- checkout_reference
- created_at
- confirmed_at

Constraint:
exatamente um alvo entre fine/licensing.

### processed_webhook_events
- provider
- event_id
- received_at
- processed_at

Unique:
`provider + event_id`.

### outbox_events
- id
- type
- aggregate_type
- aggregate_id
- payload
- created_at
- processed_at
- attempts

### government_submissions
- id
- type
- fine_id/licensing_id
- status
- attempts
- last_error
- requested_at
- confirmed_at

### documents
- id
- owner_id
- vehicle_id
- type
- object_key
- status
- created_at

### manual_cases
- id
- dispatcher_id
- owner_id
- service_request_id nullable
- vehicle_id nullable
- payment_id nullable
- type
- priority
- status
- reason
- assignee_id nullable
- opened_at
- resolved_at

### case_notes
- id
- case_id
- author_id
- text
- created_at

### notifications
- id
- user_id
- type
- dedup_key
- status
- created_at
- sent_at

Unique:
`user_id + dedup_key`.

Canal de notificação é diferente de ServiceRequestSource.

Exemplo:
`source = PARTNER_PORTAL`, notification channels = `IN_APP`, `WHATSAPP`.

WhatsApp outbound não é fonte da verdade e não deve carregar documentos sensíveis.

### audit_log
- id
- actor_id
- action
- entity_type
- entity_id
- metadata_redacted
- created_at

Append-only.

## Índices importantes

### dashboard
- vehicles(dispatcher_id, overall_status)
- vehicles(dispatcher_id, last_checked_at)
- fines(vehicle_id, status, due_date)
- licensings(vehicle_id, status, due_date)
- manual_cases(dispatcher_id, status, priority, opened_at)
- dispatcher_clients(dispatcher_id, status)
- payments(status, created_at)
- service_requests(status, updated_at)
- service_requests(partner_organization_id, status, updated_at)
- partner_memberships(user_id, status)
- partner_organizations(status, updated_at)

### busca
- vehicles(plate_normalized)
- owner normalized name/search field
- phone normalized quando aplicável

## Dados sensíveis

Criptografar ou proteger adequadamente:
- CPF/CNPJ;
- RENAVAM;
- provider references sensíveis.

Não logar:
- password;
- payment token;
- full CPF;
- full RENAVAM quando desnecessário.
- documentos sensíveis ou deep links completos enviados por WhatsApp.

## Futuro / decisões abertas

### invoices / invoice_items
Billing B2B, faturas, descontos, ajustes, refunds e reconciliação são capacidades futuras dependentes de validação comercial.

### multi-tenancy
Não há decisão definitiva de isolamento multi-tenant neste documento.


---

# Entidades de IA

## ai_conversations
- id
- user_id
- role_context
- created_at

## ai_messages
- id
- conversation_id
- role
- content_redacted
- created_at

## ai_executions
- id
- user_id
- feature
- provider
- model
- prompt_version
- latency_ms
- input_tokens
- output_tokens
- estimated_cost
- status
- fallback_reason
- created_at

## ai_tool_calls
- id
- ai_execution_id
- tool_name
- arguments_hash
- authorization_result
- duration_ms
- status

## knowledge_documents
- id
- title
- source
- version
- visibility_scope
- active

## knowledge_chunks
- id
- document_id
- content
- embedding
- metadata

## Índices
- ai_executions(feature, created_at)
- ai_tool_calls(tool_name, status)
- knowledge_chunks vector index
