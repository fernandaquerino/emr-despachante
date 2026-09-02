# CLAUDE.md

## Project: EMR Despachante

Este arquivo contém instruções específicas para o Claude Code ao trabalhar neste repositório.

Leia também obrigatoriamente:

- `AGENTS.md`
- `README.md`
- `docs/product/PRODUCT_DESCRIPTION.md`
- `docs/product/REQUIREMENTS.md`
- `docs/engineering/ARCHITECTURE.md`
- `docs/engineering/ADRS.md`
- `docs/product/STATUS_MODEL.md`
- `docs/engineering/SECURITY_AND_LGPD.md`

Quando a tarefa envolver UI:

- `docs/product/SCREEN_SPECS.md`
- `docs/product/DASHBOARD_SPEC.md`
- `docs/product/INFORMATION_ARCHITECTURE.md`
- `docs/product/FIGMA_MAKE_BRIEF.md`
- documentação em `docs/design-system/`

Quando envolver IA:

- `docs/ai/AI_PRODUCT_SPEC.md`
- `docs/ai/AI_ARCHITECTURE.md`
- `docs/ai/AI_TOOLS_AND_GUARDRAILS.md`
- `docs/ai/AI_EVALS.md`

---

# 1. Como trabalhar

Antes de escrever código:

1. localize a issue/User Story;
2. leia os critérios de aceite;
3. identifique arquivos relacionados;
4. verifique padrões existentes;
5. proponha um plano curto;
6. implemente a menor solução que satisfaça os requisitos.

Não comece alterando arquivos imediatamente quando a tarefa possui impacto arquitetural.

---

# 2. Modo Plan

Use Plan Mode quando a tarefa envolver:

- arquitetura;
- schema;
- pagamentos;
- webhook;
- outbox;
- filas;
- concorrência;
- autenticação;
- autorização;
- Design System;
- IA/tool calling;
- refactor amplo;
- mudanças em múltiplos módulos.

No plano, incluir:

- arquivos esperados;
- abordagem;
- invariantes;
- testes;
- riscos;
- dependências;
- se ADR precisa ser criado/alterado.

---

# 3. Não inventar requisitos

Se a documentação já define o comportamento, siga-a.

Não mudar silenciosamente:

- nomes de status;
- fluxo de pagamento;
- roles;
- regras de licenciamento;
- fluxo de cases;
- tool permissions;
- Design System.

Quando encontrar conflito entre documentos:

1. sinalize;
2. cite os arquivos conflitantes;
3. prefira a documentação mais específica/recente;
4. não invente uma terceira regra.

---

# 4. Arquivos pequenos e focados

Evite gerar:

```text
500+ linhas
```

em um único service/component quando houver separação natural.

Extraia apenas quando existir:

- responsabilidade distinta;
- reutilização real;
- testabilidade;
- clareza.

Não abstraia prematuramente.

---

# 5. Alterações mínimas

Não “limpe” todo o repositório ao implementar uma task.

Evite:

- renomear arquivos não relacionados;
- reformatar centenas de linhas;
- atualizar dependências sem necessidade;
- trocar biblioteca;
- reorganizar pastas sem requisito.

Mantenha diff pequeno.

---

# 6. TypeScript

Nunca resolver erro usando:

```ts
any;
```

ou:

```ts
// @ts-ignore
```

sem explicar por que isso é inevitável.

Sempre rodar ou instruir rodar:

```bash
pnpm lint
pnpm typecheck
pnpm test
```

quando disponíveis.

---

# 7. Componentes React

Priorize:

- composição;
- responsabilidade única;
- props explícitas;
- dados derivados em vez de estado duplicado;
- acessibilidade.

Evite:

- components que fazem fetch + business rule + render + mutation complexa;
- `useEffect` para derivar estado que poderia ser calculado;
- `useEffect` para sincronizar server state com store local;
- prop drilling extremo quando composição resolve.

---

# 8. Next.js

Preferir Server Components quando eles simplificarem:

- leitura;
- auth;
- data loading inicial.

Usar Client Components apenas quando necessário para:

- interação;
- browser API;
- hooks;
- mutations;
- local UI state.

Não marcar árvore inteira com:

```ts
"use client";
```

sem necessidade.

---

# 9. Backend NestJS

Controllers devem:

- parsear request;
- chamar application service;
- mapear resposta/erro.

Não colocar regra de negócio em controllers.

Separar:

- controller;
- service/use case;
- repository;
- external adapter;
- domain policy.

---

# 10. Banco

Antes de mudar schema:

1. descrever a mudança;
2. identificar invariantes;
3. criar migration;
4. criar constraints;
5. criar índices justificáveis;
6. criar testes.

Para concorrência, banco deve proteger o invariant quando possível.

---

# 11. Pagamentos

Nunca alterar esta regra:

```text
checkout success != payment confirmation
```

Claude deve rejeitar qualquer implementação que marque `PAID` pelo frontend/redirect.

Para webhook:

- HMAC;
- idempotência;
- transaction;
- processed event;
- outbox.

---

# 12. Cases

Claim precisa ser atomicamente seguro.

Não implementar:

```ts
const case = await findCase();
if (!case.assigneeId) {
  await updateCase(...)
}
```

sem controle de concorrência.

Preferir conditional update ou optimistic lock.

---

# 13. IA

## Rules first

Antes de usar LLM para algo, pergunte:

> Isso pode ser resolvido deterministicamente?

Se sim, não delegar ao LLM.

---

## Tools

Tools devem possuir:

- Zod/schema;
- authorization;
- explicit output;
- minimal PII.

Nunca permitir:

- raw SQL tool;
- arbitrary HTTP tool;
- arbitrary shell tool exposto ao usuário do produto.

---

## Write tools

Claude nunca deve implementar write tool que execute imediatamente a partir da mensagem.

Fluxo obrigatório:

```text
user request
  ↓
AI proposes action
  ↓
UI confirmation
  ↓
server revalidates authorization
  ↓
mutation
  ↓
audit log
```

---

# 14. AI Evals

Toda feature de IA significativa deve receber ao menos fixtures para:

- happy path;
- missing data;
- authorization failure;
- wrong tool temptation;
- factuality;
- fallback.

Para financeiro:

```text
unsupported_financial_claim_rate = 0
```

como objetivo.

---

# 15. Design System

Antes de criar componente visual:

1. verificar `packages/ui`;
2. verificar Design System;
3. verificar tokens;
4. verificar componentes de domínio.

Não criar componente duplicado com outro nome.

Exemplo:

Se já existe:

```text
StatusBadge
```

não criar:

```text
StateChip
```

para resolver a mesma função.

---

# 16. UI UX Pro Max

Quando a skill estiver instalada e a tarefa for de design:

- use a skill antes de escolher direção visual;
- pesquise paleta;
- tipografia;
- layout;
- dashboard patterns;
- accessibility;
- anti-patterns.

Psicologia das cores é heurística, não verdade absoluta.

Sempre comparar opções antes de definir foundation.

---

# 17. Design tasks

Para Design System, seguir:

```text
Research
→ Direction
→ Foundations
→ Tokens
→ Components
→ Domain Components
→ Prototype
→ Design QA
→ Implementation
```

Não começar implementando tela final antes da direção visual estar aprovada.

---

# 18. Estados visuais

Ao implementar tela baseada no protótipo, não esquecer:

- loading;
- empty;
- error;
- stale;
- partial failure;
- unauthorized;
- disabled;
- conflict.

Se a task não especificar todos, verificar `SCREEN_SPECS.md`.

---

# 19. Copilot UI

EMR Copilot deve parecer extensão natural do produto.

Evitar:

- gradientes chamativos;
- purple glow;
- IA como “personagem”;
- excesso de animação.

Preferir:

- painel lateral;
- tool result cards;
- entity links;
- references;
- clear confirmation;
- factual tone.

---

# 20. Segurança

Sempre revisar:

```text
AuthN
AuthZ
Ownership
PII
Secrets
Audit
Rate limit
```

em qualquer endpoint novo.

Para rota por ID:

```text
GET /resource/:id
```

perguntar:

> O usuário autenticado pode acessar ESTE id?

Não basta estar logado.

---

# 21. Error codes

Criar erros de domínio estáveis.

Exemplos:

```text
PAYMENT_ALREADY_IN_PROGRESS
LICENSING_BLOCKED_BY_OPEN_FINES
CASE_ALREADY_ASSIGNED
PAYMENT_WEBHOOK_INVALID_SIGNATURE
DOCUMENT_ACCESS_DENIED
```

Frontend deve tratar códigos, não comparar mensagens textuais.

---

# 22. Testes

Ao implementar bug:

1. reproduzir;
2. criar teste falhando;
3. corrigir;
4. confirmar teste passando.

Ao implementar invariant:

testar no nível que realmente protege o invariant.

Concorrência → integration/database test.

Não fingir concorrência com dois `Promise.resolve()` sobre mock.

---

# 23. Comandos de validação

Antes de finalizar uma implementação, executar quando disponíveis:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Para alterações específicas:

```bash
pnpm test:integration
pnpm test:e2e
```

Não afirmar que passaram se não foram executados.

Se não puder executar, diga explicitamente.

---

# 24. Banco

Ao criar query potencialmente pesada:

- considerar índice;
- medir;
- evitar N+1;
- paginar.

Dashboard:

não fazer request/query por card se uma aggregate query/read model for mais adequada.

---

# 25. Observabilidade

Fluxos críticos precisam de evento/log claro.

Exemplos:

```text
payment_created
payment_webhook_received
payment_confirmed
outbox_published
submission_started
submission_failed
manual_case_created
```

Não logar dados sensíveis.

---

# 26. Git

Não executar:

```bash
git reset --hard
git clean -fd
git push --force
```

sem solicitação explícita.

Não apagar alterações do usuário.

Antes de alterações grandes:

```bash
git status
```

---

# 27. Commits

Quando solicitado, sugerir commits no padrão:

```text
feat(scope): ...
fix(scope): ...
test(scope): ...
docs(scope): ...
refactor(scope): ...
chore(scope): ...
```

Exemplos:

```text
feat(cases): add atomic case claiming
fix(payments): make webhook processing idempotent
feat(ai): add authorized case summary tools
```

---

# 28. Review antes de concluir

Antes de informar que terminou:

- revisar diff;
- procurar duplicação;
- checar imports;
- checar TypeScript;
- checar estados;
- checar auth;
- checar error handling;
- checar testes;
- checar docs.

---

# 29. Quando criar ADR

Criar ADR se a decisão:

- afeta múltiplas features;
- é difícil de reverter;
- muda consistência;
- muda modelo de dados;
- introduz infraestrutura;
- adiciona provider;
- muda estratégia de auth;
- muda cache;
- muda filas;
- muda arquitetura de IA.

Não criar ADR para detalhe trivial de UI.

---

# 30. Quando fazer perguntas

Evite perguntar quando a documentação já responde.

Pergunte somente se:

- existem requisitos realmente conflitantes;
- falta dado externo indispensável;
- existem duas alternativas com impacto grande e não há preferência registrada.

Caso contrário:

- faça best effort;
- explique suposição;
- prossiga.

---

# 31. Resposta final ao usuário

Após implementar, informar de forma objetiva:

### Alterado

- arquivos modificados;

### Implementado

- comportamento;

### Validado

- testes/comandos executados;

### Pendências

- qualquer limitação real.

Não dizer apenas:

> Done.

---

# 32. Regra principal do Claude

O objetivo não é produzir mais código.

O objetivo é produzir:

```text
a menor mudança correta,
segura,
testável,
compreensível
e consistente com o sistema.
```
