# AGENTS.md

## 1. Propósito

Este arquivo define as regras obrigatórias para qualquer agente de código, copiloto ou automação que trabalhe no projeto **EMR Despachante**.

O objetivo é manter consistência arquitetural, qualidade de código, segurança, rastreabilidade e previsibilidade.

Antes de alterar código:

1. leia este arquivo;
2. leia `README.md`;
3. leia os documentos relevantes em `docs/` ou na raiz do projeto;
4. identifique a User Story / issue sendo implementada;
5. entenda dependências, critérios de aceite e riscos;
6. só então proponha ou implemente mudanças.

---

# 2. Contexto do produto

EMR Despachante é uma plataforma para operação de serviços veiculares.

Perfis principais:

- `OWNER` / `PROPRIETARIO`
- `PARTNER` / `PARCEIRO`
- `ADMIN`

No MVP, `ADMIN` representa o usuário interno do despachante e concentra operação diária + gestão administrativa. Permissões internas mais granulares são evolução futura.

O sistema centraliza:

- clientes;
- organizações parceiras;
- veículos;
- multas;
- licenciamento;
- pagamentos;
- pedidos;
- documentos;
- casos manuais;
- solicitações de serviço;
- reconciliação;
- auditoria;
- IA operacional através do EMR Copilot.

Serviços do catálogo:

- multas;
- licenciamento;
- IPVA;
- transferência;
- dívida ativa.

Implementação profunda do projeto:

- multas;
- licenciamento.

---

# 3. Princípios arquiteturais

## 3.1 Regra geral

Tecnologia deve seguir requisito.

Não introduzir:

- fila;
- cache;
- microserviço;
- event sourcing;
- CQRS;
- abstração;
- design pattern;
- framework;
- biblioteca;
- provider de IA;

apenas porque é moderno ou interessante.

Toda nova complexidade precisa resolver um problema real documentado.

---

## 3.2 Separação de responsabilidades

### Frontend

Responsável por:

- apresentação;
- interação;
- accessibility;
- estado visual;
- validação de UX;
- query/mutation orchestration.

Não deve conter regra de negócio crítica.

### API

Responsável por:

- autorização;
- validação;
- regras de domínio;
- transações;
- consistência;
- coordenação de serviços.

### Worker

Responsável por:

- tarefas assíncronas;
- processamento de filas;
- retry;
- integração externa;
- jobs demorados;
- geração de documentos;
- embeddings e processamento de IA assíncrono.

### Banco

É fonte de verdade para:

- financeiro;
- vínculos;
- casos;
- estados transacionais;
- auditoria.

### Redis

Nunca é fonte de verdade.

### LLM

Nunca é fonte de verdade.

---

# 4. Stack alvo

Preferencialmente:

- TypeScript strict;
- Next.js;
- NestJS;
- PostgreSQL;
- pgvector;
- Redis;
- SQS;
- S3;
- OpenTelemetry;
- AWS ECS/Fargate;
- RDS;
- ElastiCache;
- GitHub Actions;
- Terraform.

Não substituir stack sem ADR ou solicitação explícita.

---

# 5. TypeScript

Obrigatório:

```json
{
  "strict": true
}
```

Evitar:

```ts
any;
```

Proibido sem justificativa explícita:

```ts
// @ts-ignore
// @ts-nocheck
as any
```

Preferir:

- `unknown` + narrowing;
- discriminated unions;
- exhaustive checks;
- schemas compartilhados;
- tipos derivados de schemas quando possível.

Exemplo:

```ts
type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "REFUND_PENDING"
  | "REFUNDED";
```

Para unions críticas, utilizar exhaustive checking.

---

# 6. Organização de código

Evitar arquivos gigantes.

Preferir agrupamento por domínio/feature.

Exemplo:

```text
apps/
  web/
    src/
      features/
        customers/
        vehicles/
        cases/
        payments/
        copilot/

  api/
    src/
      modules/
        auth/
        customers/
        vehicles/
        fines/
        licensing/
        payments/
        cases/
        ai/

  worker/
    src/
      jobs/
      consumers/

packages/
  ui/
  types/
  config/
  observability/
  ai/
```

Não criar `utils.ts` genérico com dezenas de funções não relacionadas.

Preferir nomes específicos:

```text
normalizePlate.ts
calculatePaymentTotal.ts
buildCaseSummary.ts
```

---

# 7. Domínio

Controllers devem ser finos.

Não colocar regra de negócio em:

- controller;
- route handler;
- React component;
- hook de UI.

Preferir:

```text
Controller
  ↓
Use Case / Application Service
  ↓
Domain
  ↓
Repository / External Port
```

Exemplo incorreto:

```ts
if (vehicle.fines.length > 0) {
  throw new Error("Cannot license");
}
```

dentro de controller.

Preferir regra explícita no domínio/application layer.

---

# 8. Banco de dados

## 8.1 Fonte de verdade

Invariantes críticas devem ser garantidas pelo banco quando possível.

Exemplo:

- pagamento duplicado;
- webhook duplicado;
- vínculo duplicado;
- referência externa duplicada.

Não confiar apenas em:

```ts
if (!existing) {
  insert();
}
```

para concorrência.

---

## 8.2 Migrations

Toda mudança estrutural requer migration.

Nunca:

- editar schema de produção manualmente;
- apagar migration aplicada;
- alterar migration histórica já compartilhada.

---

## 8.3 Índices

Criar índices orientados a queries reais.

Sempre avaliar:

- filtros;
- ordering;
- joins;
- dashboards;
- busca;
- paginação.

Antes de adicionar índice:

- entender query;
- verificar cardinalidade;
- considerar custo de escrita.

---

## 8.4 Transações

Usar transação quando múltiplas escritas precisam ser atomicamente consistentes.

Casos críticos:

- webhook + payment update + outbox;
- claim de case;
- criação de pedido + payment inicial;
- auditoria financeira quando parte da mesma operação.

---

# 9. Pagamentos

Esta seção é obrigatória.

## 9.1 Regra principal

```text
Checkout iniciado ≠ pagamento confirmado.
```

Somente evento confiável do provider pode confirmar pagamento.

Nunca promover para `PAID` após:

- redirect de checkout;
- retorno do frontend;
- callback não autenticado;
- mensagem do usuário;
- resposta do LLM.

---

## 9.2 Webhooks

Obrigatório:

- validar assinatura;
- idempotência;
- persistir `providerEventId`;
- retornar 2xx em replay já processado;
- logs estruturados;
- audit trail;
- testes com duplicatas.

---

## 9.3 Pagamento duplicado

Não usar lock em memória.

Garantir no banco.

Exemplo conceitual:

```text
one active payment per target
```

Testar concorrência real.

---

## 9.4 Outbox

Quando pagamento confirmado precisa disparar processamento externo:

```text
payment update
+
outbox event
```

devem ocorrer na mesma transação.

Worker processa depois.

---

## 9.5 Reembolso

Reembolso deve possuir state machine explícita.

Nunca executar reembolso automaticamente por sugestão de IA.

---

# 10. Integrações externas

Toda integração externa deve possuir um port/adapter.

Exemplo:

```ts
interface DetranClient {
  getVehicleStatus(...): Promise<...>;
  submitFineClearance(...): Promise<...>;
  submitLicensing(...): Promise<...>;
}
```

Nunca espalhar chamadas HTTP diretamente pelo domínio.

Tratar:

- timeout;
- retry;
- backoff;
- rate limit;
- erro de rede;
- resposta inválida;
- indisponibilidade;
- circuit breaker quando necessário.

---

# 11. Filas, workers e retries

Consumers devem ser idempotentes.

Assuma:

```text
at-least-once delivery
```

Nunca assuma exactly-once.

Retries devem possuir:

- número máximo;
- backoff;
- classificação de erro;
- DLQ.

Não retry:

- validation error permanente;
- autorização;
- payload inválido não recuperável.

---

# 12. Casos operacionais

Caso manual existe para representar exceções.

Não abrir caso para todo erro.

ServiceRequest representa trabalho normal solicitado por proprietário, parceiro ou operação.

Case representa exceção/problema que exige intervenção humana especial.

Uma solicitação de parceiro não cria Case automaticamente.

Case creation deve seguir política explícita.

Exemplos:

- retry esgotado;
- DLQ;
- divergência financeira;
- baixa não confirmada após SLA interno;
- documento falhou;
- inconsistência.

Claim de case precisa ser concorrente-safe.

Preferir:

```sql
UPDATE ...
SET assigned_to = ?
WHERE id = ?
  AND assigned_to IS NULL
```

ou optimistic locking.

---

# 13. Frontend

## 13.1 Estados obrigatórios

Toda tela de dados deve considerar:

- loading;
- empty;
- error;
- partial error;
- stale;
- success;
- forbidden;
- conflict quando aplicável.

Não entregar apenas happy path.

---

## 13.2 Server state

Dados vindos do servidor não devem ser duplicados desnecessariamente em store global.

Preferir:

- React Query / TanStack Query;
- server components quando apropriado;
- URL para filtros navegáveis.

Não usar Zustand/Redux para cache de API sem motivo.

---

## 13.3 Formulários

Usar:

- schema validation;
- mensagens específicas;
- validação no frontend e backend.

Frontend validation melhora UX.

Backend validation garante integridade.

---

## 13.4 Tabelas

Tabelas precisam suportar:

- server-side pagination;
- sorting quando necessário;
- filters;
- loading;
- empty;
- keyboard accessibility;
- truncation segura;
- estados selecionados.

Não carregar milhares de registros no browser para filtrar localmente.

---

# 14. Design System

O Design System é fonte visual de verdade.

Não inventar:

- novo tom de azul;
- radius;
- shadow;
- spacing;
- badge;
- status;
- button variant;

dentro de uma feature.

Primeiro verificar tokens/componentes existentes.

Se novo padrão for necessário:

1. justificar;
2. adicionar ao Design System;
3. documentar;
4. só então usar na tela.

---

## 14.1 Tokens

Componentes não devem usar hex direto quando existir token semântico.

Evitar:

```css
color: #2563eb;
```

Preferir:

```css
color: var(--action-primary);
```

---

## 14.2 Status

Status não pode depender somente de cor.

Usar combinação de:

- texto;
- cor;
- ícone quando útil.

---

## 14.3 IA

Copilot deve seguir o Design System principal.

Não criar visual genérico de IA com:

- gradiente roxo;
- glow;
- glassmorphism;
- estrelas decorativas excessivas.

---

# 15. Accessibility

Meta mínima: WCAG AA onde aplicável.

Obrigatório:

- navegação por teclado;
- focus visível;
- labels;
- semantic HTML;
- aria apenas quando necessário;
- contraste;
- status não somente por cor;
- `prefers-reduced-motion`;
- target sizes adequados;
- tabelas acessíveis;
- modais com focus trap;
- restore focus após fechar modal.

Não remover outline sem substituição acessível.

---

# 16. IA / EMR Copilot

## 16.1 Regra

```text
Rules first.
AI second.
User decides.
```

LLM nunca substitui:

- autorização;
- validação;
- regra de domínio;
- cálculo financeiro;
- estado transacional.

---

## 16.2 Tool calling

LLM não acessa SQL.

Fluxo:

```text
LLM
 ↓
Tool
 ↓
Authorization
 ↓
Application Service
 ↓
Repository
```

Cada tool precisa validar:

- identity;
- role;
- scope;
- input schema.

---

## 16.3 Read vs write tools

### Read

Podem executar após autorização.

### Write

Exigem confirmação humana explícita.

Exemplos:

- refund;
- case assignment;
- case status;
- cancelamento;
- mensagem;
- alteração sensível.

Após confirmação, revalidar autorização.

---

## 16.4 RAG

RAG é para:

- procedimentos;
- FAQ;
- políticas;
- documentação interna.

Dados transacionais usam tools.

Não usar embeddings para substituir query relacional simples.

---

## 16.5 Prompt injection

Nunca confiar em conteúdo vindo de:

- usuário;
- documento;
- descrição;
- PDF;
- banco;
- integração.

Tool authorization deve permanecer server-side.

---

## 16.6 Structured output

Ações e respostas operacionais estruturadas devem usar schema validado.

Não fazer parse frágil de texto livre.

---

# 17. Segurança

## 17.1 Autorização

Sempre no backend.

Nunca considerar isto proteção:

```tsx
{
  user.isAdmin && <AdminButton />;
}
```

Isso é UX, não segurança.

---

## 17.2 IDOR / BOLA

Toda query de entidade deve validar ownership/scope.

Testes obrigatórios:

- owner A → vehicle B;
- owner/partner → admin endpoint;
- usuário → documento de terceiro;
- tool AI → entidade fora do escopo.

---

## 17.3 PII

Minimizar exposição de:

- CPF;
- CNPJ;
- RENAVAM;
- telefone;
- email;
- provider references.

Logs devem usar dados mascarados quando possível.

---

## 17.4 Secrets

Nunca commitar:

- API key;
- token;
- senha;
- credentials AWS;
- webhook secret.

Usar `.env` local e secrets manager em produção.

---

# 18. Observabilidade

Use logs estruturados.

Evitar:

```ts
console.log("deu erro");
```

Preferir eventos:

```json
{
  "event": "payment_webhook_processed",
  "paymentId": "...",
  "providerEventId": "...",
  "traceId": "..."
}
```

Para fluxos distribuídos, propagar:

- traceId;
- correlationId;
- aggregate ID seguro.

Métricas devem possuir baixa cardinalidade.

Nunca usar `userId` como label de métrica.

---

# 19. Testes

## Pirâmide

Priorizar:

1. unit;
2. integration;
3. poucos e2e críticos.

Não testar implementação interna sem valor.

Testar comportamento.

---

## Obrigatórios para fluxos críticos

### Pagamentos

- duplicate payment;
- webhook duplicate;
- invalid signature;
- provider failure;
- outbox consistency.

### Cases

- simultaneous claim;
- invalid transition.

### Security

- IDOR;
- role access;
- document authorization.

### AI

- tool authorization;
- tool selection;
- financial factuality;
- write confirmation;
- fallback.

---

# 20. Error handling

Não retornar erro genérico quando domínio conhece o motivo.

Exemplo ruim:

```json
{
  "message": "Something went wrong"
}
```

Exemplo melhor:

```json
{
  "code": "LICENSING_BLOCKED_BY_OPEN_FINES",
  "message": "O licenciamento não pode prosseguir enquanto houver multas pendentes."
}
```

Erros devem possuir código estável.

---

# 21. Logging e PII

Nunca logar:

- password;
- authorization header;
- raw payment payload completo;
- card data;
- full CPF;
- full RENAVAM;
- LLM prompts completos contendo PII sem necessidade.

---

# 22. Performance

Não otimizar sem medir.

Antes de otimizar:

1. reproduzir;
2. medir;
3. encontrar gargalo;
4. aplicar mudança;
5. medir novamente.

Para banco:

```text
EXPLAIN ANALYZE
```

Para frontend:

- React Profiler;
- Web Vitals;
- bundle analysis.

Para API:

- p50;
- p95;
- p99 quando necessário.

---

# 23. Git

Branches devem ter escopo pequeno.

Sugestão:

```text
feat/us-602-payment-duplicate
fix/webhook-idempotency
docs/adr-003-outbox
```

Commits devem explicar intenção.

Preferir Conventional Commits:

```text
feat(payments): prevent duplicate active payments
fix(webhooks): make provider event processing idempotent
test(cases): cover concurrent claim
docs(ai): document tool authorization policy
```

---

# 24. Pull Requests

PR deve conter:

- contexto;
- issue;
- solução;
- trade-offs;
- testes;
- screenshots para UI;
- migration;
- observabilidade;
- riscos;
- checklist de segurança quando aplicável.

Não misturar refactor não relacionado com feature.

---

# 25. Refactor

Refactor não deve alterar comportamento.

Separar:

```text
refactor
```

de:

```text
feature
```

quando isso reduzir risco de revisão.

---

# 26. Dependências

Antes de adicionar biblioteca:

1. verificar se é necessária;
2. avaliar manutenção;
3. bundle impact;
4. licenciamento;
5. segurança;
6. compatibilidade;
7. alternativas nativas.

Evitar dependências para funções triviais.

---

# 27. Documentação

Atualizar docs quando mudar:

- arquitetura;
- status;
- API;
- regra de domínio;
- schema;
- tool de IA;
- Design System;
- fluxo financeiro.

ADRs devem registrar decisões com trade-offs reais.

---

# 28. Workflow do GitHub Project

Status:

```text
Backlog
Ready
Study
In Progress
In Review
Done
```

`Study` é usado quando a issue depende de aprendizado técnico relevante.

Não usar `Study` para trabalho trivial.

Limite sugerido:

```text
Study: até 2
In Progress: 1
In Review: até 2
```

Não iniciar outra implementação importante enquanto houver uma principal em `In Progress`.

---

# 29. Ordem de trabalho por issue

Antes de implementar:

1. ler issue;
2. ler docs relacionados;
3. verificar protótipo;
4. identificar regras;
5. identificar riscos;
6. estudar apenas o necessário;
7. implementar menor mudança possível;
8. testar;
9. revisar arquitetura;
10. documentar;
11. mover para review.

---

# 30. O agente NÃO deve

- reescrever a arquitetura sem solicitação;
- instalar dependências desnecessárias;
- alterar várias features ao mesmo tempo;
- ignorar testes quebrados;
- desativar lint;
- usar `any` para “resolver rápido”;
- colocar regra de negócio em React;
- fazer SQL sem escopo de autorização;
- criar status financeiro via IA;
- confiar no frontend para segurança;
- ignorar erro de TypeScript;
- criar fallback silencioso que esconda inconsistência;
- apagar audit log;
- armazenar cartão;
- considerar cache fonte da verdade;
- fazer retry infinito;
- retornar PII desnecessária ao LLM.

---

# 31. Definition of Done

Uma task só está concluída quando aplicável:

- [ ] regra implementada;
- [ ] TypeScript sem erros;
- [ ] lint passa;
- [ ] testes passam;
- [ ] loading tratado;
- [ ] empty tratado;
- [ ] error tratado;
- [ ] accessibility revisada;
- [ ] authorization revisada;
- [ ] logs/métricas adicionados;
- [ ] migration criada;
- [ ] documentação atualizada;
- [ ] screenshots/protótipo consistentes;
- [ ] critérios de aceite demonstráveis.

---

# 32. Regra final

Quando houver dúvida entre:

```text
solução mais inteligente
```

e

```text
solução mais simples que satisfaz os requisitos com segurança
```

prefira a segunda.

Complexidade precisa ser conquistada por necessidade.
