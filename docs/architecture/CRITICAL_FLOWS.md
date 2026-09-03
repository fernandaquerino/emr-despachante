# EMR Despachante — Critical Flows

> Sequence diagrams dos fluxos críticos do System Design.

## 1. Vehicle lookup

```mermaid
sequenceDiagram
    actor User as Owner/Partner/Admin
    participant Web as Next.js
    participant API as NestJS API
    participant DB as PostgreSQL
    participant Cache as Redis opcional
    participant Gov as DetranClient/mock

    User->>Web: consulta veículo por placa/id
    Web->>API: GET/POST vehicle lookup
    API->>API: autentica e valida escopo
    API->>DB: busca veículo/snapshot existente
    alt cache curto justificado e disponível
        API->>Cache: lookup status recente
        Cache-->>API: hit/miss
    end
    alt snapshot suficiente
        API-->>Web: status + lastUpdatedAt
    else refresh necessário
        API->>Gov: consulta via adapter
        Gov-->>API: resposta normalizada ou erro
        API->>DB: persiste snapshot/status normalizado
        API-->>Web: status + lastUpdatedAt
    end
    Web-->>User: mostra status, stale/loading/error quando aplicável
```

Regras:

- PostgreSQL mantém snapshot e estado normalizado.
- Redis, se existir, é cache curto e dispensável.
- Dados stale devem mostrar `lastUpdatedAt`.
- Falha externa não deve apagar último snapshot conhecido.

## 2. Checkout/payment

```mermaid
sequenceDiagram
    actor User as Owner/Partner/Admin
    participant Web as Next.js
    participant API as NestJS API
    participant DB as PostgreSQL
    participant Provider as Payment provider

    User->>Web: inicia contratação/pagamento
    Web->>API: POST /payments ou checkout
    API->>API: valida autorização, alvo e preço snapshot
    API->>DB: cria Order/Payment PENDING em transação
    API->>Provider: cria checkout/intenção
    Provider-->>API: checkout_reference/url
    API->>DB: salva referência de checkout
    API-->>Web: retorna checkout
    Web-->>User: redireciona/exibe checkout
```

Regras:

- Checkout iniciado não confirma pagamento.
- Preço usado no Order/Payment vem de snapshot histórico.
- Duplicidade deve ser bloqueada por idempotency key/constraint quando aplicável.

## 3. Webhook de pagamento

```mermaid
sequenceDiagram
    participant Provider as Payment provider
    participant API as NestJS API
    participant DB as PostgreSQL
    participant Outbox as Outbox table

    Provider->>API: POST webhook assinado
    API->>API: valida assinatura e schema
    API->>DB: verifica processed_webhook_events(provider,event_id)
    alt evento duplicado
        API-->>Provider: 2xx idempotente
    else evento novo válido
        API->>DB: inicia transação
        API->>DB: grava processed_webhook_events
        API->>DB: atualiza Payment para PAID quando evento confirmar pagamento
        API->>Outbox: grava evento assíncrono necessário
        API->>DB: commit
        API-->>Provider: 2xx
    end
```

Regras:

- Payment só vira `PAID` via evento válido/idempotente do provider.
- Redirect/frontend nunca confirma pagamento.
- Payment `PAID` não conclui ServiceRequest automaticamente.

## 4. Outbox → queue → worker

```mermaid
sequenceDiagram
    participant DB as PostgreSQL
    participant Publisher as Outbox publisher
    participant Queue as Queue
    participant Worker as Worker
    participant DLQ as DLQ

    Publisher->>DB: busca outbox_events pendentes
    Publisher->>Queue: publica mensagem com eventId
    Publisher->>DB: marca published_at/status
    Worker->>Queue: consome mensagem
    Worker->>Worker: valida idempotência do job
    alt sucesso
        Worker->>DB: persiste resultado/status
        Worker-->>Queue: ack
    else falha recuperável
        Worker-->>Queue: retry com backoff
    else falha esgotada/permanente
        Queue->>DLQ: move mensagem
        Worker->>DB: registra erro visível para operação quando aplicável
    end
```

Regras:

- Outbox nasce na mesma transação do fato de domínio.
- Worker deve ser idempotente.
- DLQ exige visibilidade operacional.

## 5. Government submission

```mermaid
sequenceDiagram
    participant Worker as Worker
    participant DB as PostgreSQL
    participant Gov as DetranClient/mock
    participant API as Domain services

    Worker->>DB: carrega GovernmentSubmission pendente
    Worker->>API: valida estado relacionado
    Worker->>Gov: envia submissão via adapter
    alt confirmado
        Gov-->>Worker: resultado confirmado
        Worker->>DB: atualiza Submission CONFIRMED
        Worker->>DB: atualiza status operacional relacionado
    else erro recuperável
        Gov-->>Worker: timeout/erro temporário
        Worker->>DB: incrementa attempts/last_error
        Worker-->>Worker: retry via queue
    else erro permanente ou retry esgotado
        Worker->>DB: marca Submission FAILED/MANUAL_REVIEW
        Worker->>DB: cria/relaciona Case se regra de exceção aplicar
    end
```

Regras:

- Submission não sobrescreve estado financeiro.
- Erro externo não deve virar loop infinito.
- Case nasce apenas quando houver exceção documentada.

## 6. Partner request + notification

```mermaid
sequenceDiagram
    actor Partner as Partner user
    participant Web as Partner Portal
    participant API as NestJS API
    participant DB as PostgreSQL
    participant Outbox as Outbox
    participant Worker as Worker
    participant Wpp as WhatsApp provider

    Partner->>Web: cria solicitação
    Web->>API: POST /partner/service-requests
    API->>API: valida membership e PartnerOrganization
    API->>DB: inicia transação
    API->>DB: cria ServiceRequest NEW
    API->>Outbox: grava notificação in-app/outbound
    API->>DB: commit
    API-->>Web: solicitação criada
    Worker->>Outbox: publica/consome evento
    Worker->>DB: cria notification
    Worker->>Wpp: envia WhatsApp outbound quando configurado
    Wpp-->>Worker: entregue/falhou
    Worker->>DB: registra delivery status
```

Regras:

- Partner só acessa sua PartnerOrganization.
- WhatsApp não é fonte da verdade.
- Falha de notificação não desfaz ServiceRequest.

## 7. Case claim concorrente

```mermaid
sequenceDiagram
    actor AdminA as Admin A
    actor AdminB as Admin B
    participant API as NestJS API
    participant DB as PostgreSQL

    AdminA->>API: POST /cases/:id/claim
    AdminB->>API: POST /cases/:id/claim
    API->>DB: UPDATE case SET assignee=A WHERE id=:id AND assignee IS NULL
    DB-->>API: rowCount=1
    API-->>AdminA: claim confirmado
    API->>DB: UPDATE case SET assignee=B WHERE id=:id AND assignee IS NULL
    DB-->>API: rowCount=0
    API-->>AdminB: conflict / já atribuído
```

Regras:

- Claim é concorrente-safe por update condicional ou optimistic locking.
- UI pode prevenir duplo clique, mas banco/API garantem a regra.
- Conflito deve retornar estado atual para refresh seguro.

## 8. Documentos

```mermaid
sequenceDiagram
    actor User as Owner/Partner/Admin
    participant Web as Next.js
    participant API as NestJS API
    participant DB as PostgreSQL
    participant Storage as Object storage

    User->>Web: seleciona documento
    Web->>API: solicita upload intent
    API->>API: valida autorização, tipo e vínculo
    API->>DB: cria metadata PENDING_UPLOAD
    API-->>Web: upload target/token temporário
    Web->>Storage: upload arquivo
    Storage-->>Web: sucesso/falha
    Web->>API: confirma upload
    API->>Storage: valida presença/checksum quando aplicável
    API->>DB: marca document AVAILABLE ou FAILED
    API-->>Web: resultado
```

Regras:

- Object storage guarda arquivo; metadata/autorização ficam no banco/API.
- Documentos são privados.
- Download exige autorização server-side antes de URL temporária.
- Upload failure deve deixar estado recuperável.
