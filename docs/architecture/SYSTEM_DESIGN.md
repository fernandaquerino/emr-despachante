# EMR Despachante — System Design

> Visão inicial de arquitetura para C4 C1/C2 e comunicação síncrona/assíncrona.

## 1. Decisão arquitetural inicial

O EMR Despachante começa como um **modular monolith** com:

- frontend em Next.js;
- API em NestJS modular;
- worker para tarefas assíncronas;
- PostgreSQL como fonte da verdade;
- object storage para arquivos privados;
- outbox transacional para publicar efeitos assíncronos;
- queue/DLQ para processamento confiável;
- observability para logs, métricas e traces;
- AI boundary para EMR Copilot via API/tools autorizadas.

Não há necessidade demonstrada para microservices neste momento. Separações internas devem ser feitas por módulos, boundaries de domínio e contratos claros dentro do monolith.

Diagramas:

- [System Context — C4 C1](./system-context.md)
- [Container Diagram — C4 C2](./container-diagram.md)

Referências:

- [Requirements and Scale](./REQUIREMENTS_AND_SCALE.md)
- [Domain Model](./DOMAIN_MODEL.md)
- [Architecture existente](../engineering/ARCHITECTURE.md)
- [Data Model](../engineering/DATA_MODEL.md)
- [Observability](../engineering/OBSERVABILITY.md)

## 2. Containers principais

| Container | Responsabilidade | Fonte da verdade? |
| --- | --- | --- |
| Next.js Web | UI pública, owner, partner e admin; roteamento e experiência visual. | Não |
| NestJS API modular monolith | Autorização, validação, use cases, regras de domínio e transações. | Não diretamente; escreve no PostgreSQL |
| Worker | Jobs assíncronos, retries, integrações, notificações, documentos e reconciliação. | Não |
| PostgreSQL | Estado transacional de negócio, financeiro, vínculos, metadata, outbox e auditoria. | Sim |
| Queue/DLQ | Transporte assíncrono e isolamento de falhas. | Não |
| Object storage | Arquivos privados; documentos, comprovantes e artefatos. | Parcial: objeto binário; metadata/autorização ficam no PostgreSQL |
| Redis | Cache curto quando houver medição/justificativa. | Não |
| Observability backend | Logs, métricas, traces e alertas. | Não |
| AI Gateway/Boundary | Orquestra EMR Copilot, tools autorizadas, guardrails e telemetry. | Não |

## 3. Comunicação síncrona vs assíncrona

| Fluxo | Comunicação | Justificativa |
| --- | --- | --- |
| Browser → Next.js | Síncrona | Renderização, navegação e interação do usuário. |
| Next.js → NestJS API | Síncrona | Leitura/escrita de use cases com resposta imediata para UX. |
| API → PostgreSQL | Síncrona | Transações e leitura da fonte da verdade. |
| API → payment checkout/provider | Síncrona quando iniciar checkout | Usuário precisa receber a intenção/URL de checkout. |
| Payment provider → API webhook | Síncrona de entrada | Provider entrega evento; API valida, persiste e responde idempotentemente. |
| API → outbox | Síncrona na mesma transação | Garante que mudança de estado e efeito assíncrono sejam atômicos. |
| Outbox → queue → worker | Assíncrona | Processamento externo/retry não deve bloquear transação principal. |
| Worker → DetranClient/mock | Assíncrona para submissões/jobs; síncrona dentro do job | Integração externa pode falhar, demorar ou exigir retry. |
| Worker → WhatsApp/provider externo | Assíncrona | Falha de canal não reverte fato de domínio já persistido. |
| Scheduler/jobs → queue | Assíncrona | Jobs periódicos entram no mesmo modelo de retry/DLQ. |
| API/AI Gateway → LLM provider | Síncrona quando usuário aciona Copilot | A resposta da IA é interativa, mas não substitui regras de domínio. |

## 4. Regras arquiteturais

- PostgreSQL continua fonte da verdade para estados de negócio, financeiro, vínculos, auditoria e metadata.
- Redis só deve ser usado para cache curto quando medição justificar; nunca como fonte da verdade.
- Queue/DLQ transporta trabalho, mas não decide estado oficial.
- Object storage guarda arquivos; metadata, autorização e vínculo ficam no banco/API.
- Outbox é padrão transacional dentro do monolith, não serviço separado obrigatório.
- Worker não vira domínio separado; ele executa use cases assíncronos definidos pela aplicação.
- Observability recebe logs/traces/métricas, mas não decide estado de negócio.
- EMR Copilot usa API/tools autorizadas; não acessa banco diretamente.
- Escritas sensíveis sugeridas pela IA exigem confirmação humana e nova validação server-side.
- Não introduzir microservices sem volume, boundary organizacional, deploy independente ou requisito operacional demonstrável.

## 5. Redis condicionado

Redis não entra como requisito obrigatório do MVP.

Uso aceitável quando houver justificativa:

- cache curto de dashboard ou consulta externa;
- rate limiting;
- locks temporários não críticos, desde que invariantes reais estejam no PostgreSQL;
- deduplicação temporária complementar, nunca substituindo constraint/idempotência persistida.

Antes de adotar Redis em um fluxo, registrar:

- problema medido;
- dado cacheado;
- TTL;
- comportamento quando Redis estiver indisponível;
- por que PostgreSQL ou índice adequado não resolve sozinho.

## 6. AI boundary

O EMR Copilot fica atrás de um boundary explícito:

```text
Usuário
  ↓
Next.js
  ↓
NestJS API
  ↓
AI Gateway / Tool Router
  ↓
Domain Services autorizados
  ↓
PostgreSQL / serviços internos
```

Regras:

- prompt não concede autorização;
- tools aplicam policy server-side;
- LLM não acessa SQL;
- dados transacionais vêm de tools;
- RAG é para procedimentos, FAQ, políticas e documentação interna;
- ações de escrita sensíveis exigem confirmação humana.

## 7. Decisões adiadas

- Multi-tenancy definitivo.
- Billing B2B/B2B2C profundo.
- Read models dedicados para dashboard.
- Uso obrigatório de Redis.
- Separação em microservices.
- Integrações governamentais reais além do adapter/mock.
- SLAs/SLOs formais, RPO e RTO.
