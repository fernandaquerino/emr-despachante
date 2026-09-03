# EMR Despachante — Architecture Decision Records

> ADRs da baseline de System Design. Registrar aqui apenas decisões relevantes e difíceis de reverter.

## ADR-001 — Modular monolith antes de microservices

### Status

Aceita para baseline inicial.

### Contexto

O produto precisa cobrir B2C, B2B/B2B2C, pagamentos, documentos, operação, integrações assíncronas e EMR Copilot. Ainda não existem volumes/picos validados nem boundaries organizacionais que justifiquem deploys independentes.

### Decisão

Começar com Next.js + NestJS modular monolith + worker assíncrono.

Módulos internos devem separar domínio e responsabilidade, mas não serão microservices.

### Consequências

- Menor complexidade operacional no início.
- Transações e consistência ficam mais simples.
- Separação futura só deve ocorrer com necessidade demonstrável.

## ADR-002 — PostgreSQL como fonte da verdade transacional

### Status

Aceita para baseline inicial.

### Contexto

Pagamentos, ServiceRequests, Cases, Documents metadata, memberships, audit e idempotência exigem consistência e rastreabilidade.

### Decisão

PostgreSQL é a fonte da verdade para estado transacional, financeiro, vínculos, auditoria, outbox e metadata.

### Consequências

- Constraints críticas devem ficar no banco quando possível.
- Redis, queue, DLQ, object storage, provider externo e LLM não substituem o estado oficial.
- Índices devem derivar de queries reais.

## ADR-003 — Transactional outbox para efeitos assíncronos

### Status

Aceita para baseline inicial.

### Contexto

Pagamentos confirmados, criação de ServiceRequest, notificações, submissões externas e documentos podem disparar efeitos assíncronos. Publicar mensagem fora da transação pode perder evento.

### Decisão

Registrar outbox na mesma transação da mudança de domínio e publicar posteriormente para queue/worker.

### Consequências

- Evita perda de eventos após commit.
- Workers precisam ser idempotentes.
- DLQ precisa de visibilidade operacional.

## ADR-004 — AI boundary via API/tools autorizadas

### Status

Aceita para baseline inicial.

### Contexto

EMR Copilot precisa consultar dados transacionais e sugerir ações, mas IA não pode substituir autorização, validação ou estado oficial.

### Decisão

LLM não acessa banco diretamente. Copilot usa AI Gateway/Tool Router e tools autorizadas server-side.

Write tools sensíveis exigem confirmação humana e nova validação de autorização.

### Consequências

- Mais trabalho em contracts/tools.
- Menor risco de data leak, prompt injection e ação não autorizada.
- Falha de IA deve degradar sem bloquear fluxos essenciais.

## ADR-005 — Redis condicionado a justificativa/medição

### Status

Aceita para baseline inicial.

### Contexto

Há cenários possíveis para cache curto e rate limiting, mas não há volumes/picos validados.

### Decisão

Redis não é obrigatório no MVP. Usar apenas quando houver problema medido ou requisito claro.

### Consequências

- Evita complexidade prematura.
- PostgreSQL e índices resolvem a primeira versão sempre que suficiente.
- Qualquer uso de Redis deve ter TTL, fallback e comportamento de indisponibilidade documentados.
