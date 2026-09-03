# EMR Despachante

> Operação veicular, pagamentos, exceções e inteligência em um só lugar.

`emr-despachante` é uma plataforma digital para uma empresa de despachante operar clientes, veículos e serviços veiculares em escala.

O produto combina:

- portal do proprietário;
- portal do parceiro para intake B2B/B2B2C;
- operação interna por fila de exceções;
- dashboard administrativo;
- pagamentos em sandbox;
- integração governamental simulada por adapter;
- filas e workers;
- documentos privados;
- observabilidade;
- AWS;
- **EMR Copilot com IA** para explicar casos, consultar a operação, resumir histórico e orientar próximos passos.

## Perfis

### PROPRIETÁRIO

Consulta o próprio veículo, pendências, serviços, pagamentos, pedidos e documentos.

### PARCEIRO

Cria e acompanha solicitações de serviços para veículos vinculados a uma organização parceira, como concessionária, revenda, loja de seminovos, locadora ou empresa com frota.

### ADMIN

Usuário interno do despachante. Trabalha solicitações normais, Cases de exceção, clientes, parceiros, veículos, financeiro, catálogo, auditoria e configurações.

## Catálogo

- Multas
- Licenciamento
- IPVA
- Transferência
- Dívida ativa

### Implementação profunda no projeto

- Multas
- Licenciamento

### Implementação estrutural / exercício

- IPVA
- Transferência
- Dívida ativa

## Regra financeira principal

```text
Checkout iniciado ≠ pagamento confirmado.

Somente um webhook válido e idempotente do provedor
pode confirmar o pagamento.
```

## Regra operacional principal

```text
ServiceRequest = trabalho normal solicitado por proprietário, parceiro ou operação.
Case = exceção/problema que exige intervenção humana especial.
```

Uma solicitação criada por parceiro não vira Case automaticamente. Case nasce apenas quando há falha persistente, divergência, timeout esgotado ou outra exceção operacional documentada.

## WhatsApp no MVP

WhatsApp é canal de notificação outbound, não fonte da verdade.

O registro oficial da solicitação fica no EMR. Mensagens podem conter dados mínimos e deep link autenticado, mas não devem transportar documentos sensíveis.

## Regra da integração governamental

```text
Domínio
  ↓
DetranClient
  ↓
Mock controlado / futura implementação real
```

A inexistência de uma API pública uniforme não é escondida. O adapter mock simula:

- latência;
- timeout;
- falha;
- retry;
- DLQ;
- status intermediário;
- eventual consistency.

## IA: EMR Copilot

A IA não acessa o banco diretamente.

```text
Chat / AI action
      ↓
AI Gateway
      ↓
Tool Router
      ↓
EMR API
      ↓
PostgreSQL / serviços
```

### IA pode

- buscar clientes e veículos autorizados;
- consultar casos;
- consultar pagamentos;
- resumir timelines;
- explicar pendências;
- gerar resumo da operação;
- pesquisar procedimentos internos via RAG;
- redigir mensagem para cliente;
- sugerir próxima ação.

### IA não pode executar sem confirmação

- reembolso;
- alteração financeira;
- cancelamento;
- resolução de caso;
- alteração de status sensível;
- envio de mensagem;
- atribuição de caso quando houver efeito operacional relevante.

## Stack sugerida

```text
TypeScript
Next.js
NestJS
PostgreSQL
pgvector
Redis
SQS
S3
OpenTelemetry
AWS ECS/Fargate
RDS
ElastiCache
CloudFront
GitHub Actions
Terraform
LLM provider via AI Gateway
```

## Estrutura do repositório

```text
apps/
  web/      # Next.js — portal proprietário/parceiro/admin
  api/      # NestJS — API e regras de domínio
  worker/   # jobs assíncronos, consumers de fila

packages/
  ui/       # componentes compartilhados (Design System, ainda vazio)
  types/    # tipos compartilhados entre apps
  config/   # tsconfig base compartilhado
```

## Como rodar

Pré-requisitos: Node 20+, pnpm via corepack.

```bash
corepack enable
pnpm install
pnpm dev        # sobe web, api e worker em paralelo
pnpm typecheck  # cobre todo o workspace
pnpm build
```

## Documentação

Consulte o [índice da documentação](docs/README.md).

## Fluxo de trabalho sugerido

```text
Backlog
  ↓
Ready to Prototype
  ↓
Ready to Study
  ↓
Ready to Develop
  ↓
In Progress
  ↓
Testing
  ↓
Architecture Review
  ↓
Done
```
