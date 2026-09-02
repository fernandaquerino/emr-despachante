# EMR Despachante — AI Architecture

## Arquitetura

```mermaid
flowchart TD
    U[Operadora/Admin/Proprietário] --> WEB[Next.js]
    WEB --> API[NestJS API]
    API --> AIG[AI Gateway / Orchestrator]
    AIG --> LLM[LLM Provider]
    AIG --> TOOLS[Tool Router]
    TOOLS --> CORE[EMR Domain Services]
    CORE --> DB[(PostgreSQL)]
    CORE --> REDIS[(Redis)]
    AIG --> RET[Retrieval Service]
    RET --> VEC[(pgvector)]
    AIG --> OTel[AI Telemetry]
```

## AI Gateway

Responsável por:
- autenticação contextual;
- role;
- feature;
- prompt version;
- tools disponíveis;
- structured output;
- token budget;
- fallback;
- telemetry.

## Tools

O modelo recebe tools diferentes por perfil.

### OPERADORA
- searchCustomers
- getCustomerSummary
- getVehicleStatus
- listCases
- getCaseDetail
- getCaseTimeline
- getPaymentSummary
- getServiceRequest
- searchInternalKnowledge

### ADMIN
Tudo da OPERADORA +
- getAdminDashboardMetrics
- getReconciliationIssues
- getOperatorMetrics

### PROPRIETÁRIO
- getMyVehicles
- getMyVehicleStatus
- getMyFines
- getMyLicensing
- getMyOrder
- getMyPayment
- searchPublicHelp

## Read tools x Write tools

### Read
Podem executar automaticamente após autorização.

### Write
Exigem confirmação humana.

Exemplos:
- assignCase
- changeCaseStatus
- createRefundRequest
- resendCustomerNotification
- sendCustomerMessage

## RAG

### Fontes
- FAQ;
- runbooks;
- procedimentos;
- políticas;
- catálogo;
- documentação operacional.

### Pipeline

```text
Documento
  ↓
normalização/chunk
  ↓
embedding
  ↓
pgvector

Pergunta
  ↓
hybrid retrieval
  ↓
tenant/role filters
  ↓
top chunks
  ↓
LLM
```

## Regra de autorização

A autorização não fica no prompt.

Cada tool aplica policy server-side.

Mesmo que o modelo solicite:
`getVehicle(vehicleId=outroUsuario)`

a tool deve negar.

## Structured Outputs

Resumos operacionais usam schema.

Exemplo:

```json
{
  "summary": "...",
  "currentState": "...",
  "risk": "HIGH",
  "recommendedNextAction": "...",
  "facts": [
    {"type": "PAYMENT_STATUS", "value": "PAID"}
  ]
}
```

## Fallback

Se o LLM cair:
- mostrar “Copilot temporariamente indisponível”;
- preservar navegação normal;
- manter busca global;
- manter regras operacionais.
