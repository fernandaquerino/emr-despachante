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
