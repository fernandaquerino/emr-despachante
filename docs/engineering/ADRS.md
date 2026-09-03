# EMR Despachante — Architecture Decision Records

## ADR-000 — Monorepo pnpm com apps e packages compartilhados

### Contexto
O produto terá web (Next.js), API (NestJS) e worker assíncrono, além de código compartilhado (tipos, UI, configuração). Times pequenos e um único ciclo de release inicial não justificam múltiplos repositórios.

### Decisão
Usar um monorepo gerenciado por pnpm workspaces, com `apps/web`, `apps/api`, `apps/worker` e `packages/ui`, `packages/types`, `packages/config`. Dependências internas usam `workspace:*`. Apps não dependem uns dos outros; packages podem ser consumidos por qualquer app.

### Por que
Um único `pnpm install` e `pnpm typecheck` cobrem todo o workspace, com compartilhamento de tipos e UI sem publicar pacotes em registry. Deploy de cada app permanece independente (build por `--filter`). Separação em repositórios distintos só deve ocorrer com necessidade operacional demonstrada (times separados, ciclos de release incompatíveis).

---

## ADR-001 — Prevenção de pagamento duplicado

### Contexto
Duas requisições podem tentar pagar a mesma multa.

### Decisão
Constraint no banco impede mais de um pagamento ativo por multa.

### Por que
Lock em memória falha com múltiplas instâncias.

---

## ADR-002 — Idempotência de webhook

### Contexto
Provedores reenviam webhooks.

### Decisão
Persistir `provider + event_id` antes/na transação de processamento e retornar sucesso em replay.

### Segurança
Validar HMAC antes de processar.

---

## ADR-003 — Transactional Outbox

### Contexto
Pagamento confirmado precisa disparar submissão externa.

### Problema
DB commit + publish separado pode perder evento.

### Decisão
Pagamento e outbox na mesma transação.

---

## ADR-004 — DetranClient como adapter

### Contexto
Não existe integração pública uniforme disponível para este projeto.

### Decisão
Toda dependência governamental passa por uma interface.

### Implementação de estudo
Mock com:
- latência;
- timeout;
- falha;
- inconsistência controlada.

---

## ADR-005 — Dashboard com agregações antes de CQRS pesado

### Contexto
Despachante precisa de dashboard rápido.

### Decisão
V1:
- queries agregadas;
- índices;
- cache curto.

Read model separado só quando métricas justificarem.

---

## ADR-006 — Consentimento no vínculo despachante-cliente

### Decisão
Despachante inicia vínculo, proprietário aceita.

Sem aceite:
- acesso a dados fica limitado;
- veículo não entra como gerenciado ativo.

---

## ADR-007 — State machine financeira

Estados não podem ser alterados livremente.

Exemplos:
- PENDING -> PAID
- PENDING -> FAILED
- PAID -> REFUND_PENDING
- REFUND_PENDING -> REFUNDED

Transições inválidas são rejeitadas.

---

## ADR-008 — Política de abertura de caso manual

Criar caso quando:
- mensagem vai para DLQ;
- tentativa externa excede threshold;
- reconciliação diverge;
- baixa demora além do SLA interno;
- documento falha;
- webhook não pode ser reconciliado.

---

## ADR-009 — Cache com staleness explícita

Dados governamentais em cache precisam apresentar `lastUpdatedAt`.

O sistema nunca deve transformar cache antigo em “estado atual” sem indicar timestamp.

---

## ADR-010 — Documentos privados no S3

Bucket privado.

Download:
- autorização na API;
- presigned GET curta.

Upload/geração:
- worker;
- object key não previsível.


---

## ADR-011 — IA via tool calling, não SQL

### Contexto
Copilot precisa consultar dados transacionais.

### Decisão
LLM chama tools controladas da API.

### Consequência
Mais trabalho de schemas/tools, mas autorização e domínio permanecem sob controle.

---

## ADR-012 — Write tools com confirmação

### Contexto
Ações via IA podem ter efeitos operacionais/financeiros.

### Decisão
Toda mutação sensível requer confirmação explícita no frontend.

---

## ADR-013 — RAG separado de dados transacionais

### Contexto
Procedimentos internos são texto; pagamentos/casos são dados estruturados.

### Decisão
RAG é usado para conhecimento documental.
Tool calling é usado para estado transacional.

---

## ADR-014 — IA degradável

### Decisão
Falha de provider de IA não afeta funções essenciais do EMR Despachante.
