# EMR Despachante — Domain Model

> Documento de System Design para definir fonte da verdade, ownership de escrita e invariantes mínimas dos principais conceitos do domínio.

## 1. Objetivo

Este documento define quem é fonte da verdade para cada entidade central do EMR Despachante e quais regras não podem ser quebradas por UI, integrações, workers, IA ou notificações.

Ele é conceitual. Não substitui migrations, schemas finais, contratos de API ou ADRs.

## 2. Princípios de ownership

- O banco transacional é a fonte da verdade para estado de negócio, financeiro, vínculos, documentos, auditoria e filas operacionais.
- A API é o ponto obrigatório de autorização, validação e escrita de regras de domínio.
- Frontend pode esconder ou destacar ações, mas nunca é fonte de autorização.
- Worker executa processamento assíncrono e integrações, mas não decide regras críticas fora dos use cases definidos.
- Payment provider é fonte do evento externo de pagamento, mas o estado interno do `Payment` continua persistido no EMR.
- DetranClient ou adapter governamental é fonte externa de resposta/submissão, mas não é fonte da verdade financeira.
- WhatsApp, email, in-app notification e IA não são fonte da verdade.
- EMR Copilot acessa dados por tools autorizadas; não lê banco diretamente e não executa ações sensíveis sem confirmação humana.

## 3. Tabela resumo

| Entidade | Fonte da verdade | Owner de escrita | Consumidores principais |
| --- | --- | --- | --- |
| `User/Membership` | Banco transacional | API de auth/IAM | Frontend, API de autorização, auditoria, IA via tools |
| `PartnerOrganization` | Banco transacional | API admin/partner management | Partner Portal, Admin, ServiceRequest, billing futuro |
| `Vehicle` | Banco transacional + snapshots normalizados | API vehicles + worker de consulta | Owner, Partner, Admin, ServiceRequest, Case |
| `Order` | Banco transacional | API orders/checkout | Owner, Partner quando aplicável, Admin, Payment |
| `Payment` | Banco transacional, atualizado por webhook válido | API payments/webhooks | Order, Admin financeiro, reconciliação, worker |
| `ServiceRequest` | Banco transacional | API service requests | Owner, Partner, Admin, Case, Notification |
| `Submission` | Banco transacional | Worker/API de integração governamental | ServiceRequest, Case, Admin, timeline |
| `Case` | Banco transacional | API cases | Admin, ServiceRequest, Payment, Vehicle, IA via tools |
| `Document` | Banco transacional para metadata + storage privado para objeto | API documents | Owner, Partner, Admin, ServiceRequest, Case |
| `Notification` | Banco transacional/outbox | API/worker de notificações | Usuários autorizados, Notification Center, canais externos |

## 4. Modelo por entidade

### User/Membership

**Fonte da verdade:** banco transacional.

**Criação/alteração:**

- `OWNER` nasce por cadastro público.
- `PARTNER` nasce por convite/membership em `PartnerOrganization`.
- `ADMIN` nasce por provisionamento administrativo.
- Mudança de status, senha, sessão e memberships passa pela API.

**Invariantes:**

- MVP possui apenas `OWNER`, `PARTNER` e `ADMIN`.
- Um usuário pode ter mais de um contexto autorizado.
- Autorização nunca depende apenas do frontend.
- Membership desativada não deve conceder acesso, mesmo que a sessão ainda exista.

**Eventos/efeitos colaterais:**

- Convite aceito pode ativar membership.
- Suspensão/desativação deve gerar auditoria.
- Login resolve contexto autorizado; não existe seletor público de papel.

**Perguntas abertas:**

- Quais permissões internas existirão dentro de `ADMIN` no futuro?
- `ADMIN` pertence a um tenant específico ou pode ser global?

### PartnerOrganization

**Fonte da verdade:** banco transacional.

**Criação/alteração:**

- Criada e administrada por `ADMIN`.
- Usuários parceiros entram por membership.
- Preferências de notificação e catálogo habilitado são administrados por API autorizada.

**Invariantes:**

- `PartnerOrganization` não é `Customer`.
- Usuário parceiro só acessa dados da própria organização parceira.
- Dados de parceiro não podem escapar para outra organização.

**Eventos/efeitos colaterais:**

- Criação/alteração relevante deve gerar auditoria.
- Convites de parceiro dependem da organização existir e estar ativa.
- ServiceRequests de parceiro devem referenciar a organização correta.

**Perguntas abertas:**

- `PartnerOrganization` é apenas organização atendida ou também boundary de tenant?
- Billing B2B será por parceiro, por solicitação, mensal ou híbrido?

### Vehicle

**Fonte da verdade:** banco transacional para veículo normalizado e snapshots; adapter externo apenas informa estado consultado.

**Criação/alteração:**

- `OWNER`, `PARTNER` ou `ADMIN` podem criar/associar veículo conforme escopo autorizado.
- Atualizações de situação governamental passam por API/worker e são normalizadas antes de persistir.

**Invariantes:**

- Placa normalizada deve ser usada para busca e deduplicação.
- RENAVAM e identificadores sensíveis não devem aparecer em logs ou respostas sem necessidade.
- Acesso ao veículo exige ownership, PartnerOrganization autorizada ou permissão admin.

**Eventos/efeitos colaterais:**

- Consulta externa pode gerar snapshot.
- Mudança normalizada pode gerar notificação ou abrir análise, conforme regra documentada.

**Perguntas abertas:**

- Veículo pode estar vinculado simultaneamente a owner e PartnerOrganization?
- Qual é a política de deduplicação quando B2C e B2B informam o mesmo veículo?

### Order

**Fonte da verdade:** banco transacional.

**Criação/alteração:**

- Criado pela API quando um usuário autorizado contrata serviço ou quando fluxo autorizado gera cobrança.
- Pode referenciar veículo, serviço, preço aplicado e contexto de origem.

**Invariantes:**

- `Order` representa transação comercial; não substitui `ServiceRequest`.
- Preço histórico/snapshot não é reescrito quando preço atual muda.
- Alterações financeiras relevantes devem ser auditáveis.

**Eventos/efeitos colaterais:**

- Criação de `Order` pode iniciar `Payment`.
- Cancelamento ou ajuste pode exigir regra financeira específica.

**Perguntas abertas:**

- Em B2B2C, o pagador do `Order` será parceiro, proprietário final ou ambos dependendo do serviço?
- Billing B2B futuro criará invoices a partir de Orders ou de ServiceRequests concluídas?

### Payment

**Fonte da verdade:** banco transacional do EMR para estado interno; provider é fonte do evento externo validado.

**Criação/alteração:**

- API cria pagamento em estado inicial apropriado.
- Somente webhook/evento válido, assinado e idempotente do provider pode promover `Payment` para `PAID`.
- Reembolso e cancelamento seguem fluxo explícito e auditável.

**Invariantes:**

- Checkout iniciado não confirma pagamento.
- `Payment` só vira `PAID` via evento válido do provider.
- `Payment PAID` não conclui `ServiceRequest` automaticamente.
- Provider event deve ser idempotente.
- Não confiar em redirect, frontend, IA ou mensagem de usuário para confirmar pagamento.

**Eventos/efeitos colaterais:**

- Webhook válido pode atualizar `Payment`.
- Confirmação pode publicar outbox para submissão ou processamento posterior.
- Replay de webhook já processado deve ser seguro.

**Perguntas abertas:**

- Qual provider real substituirá ou complementará o sandbox?
- Quais estados de chargeback/refund entram no MVP?

### ServiceRequest

**Fonte da verdade:** banco transacional.

**Criação/alteração:**

- Criada por `OWNER`, `PARTNER` ou `ADMIN`, sempre via API autorizada.
- Status é alterado por use case explícito, não por inferência automática de pagamento ou notificação.

**Invariantes:**

- `ServiceRequest` representa trabalho normal solicitado.
- `ServiceRequest` não cria `Case` sem exceção operacional documentada.
- `Payment PAID` não conclui `ServiceRequest` automaticamente.
- Origem da solicitação é diferente de canal de notificação.

**Eventos/efeitos colaterais:**

- Criação pode gerar notificação in-app e WhatsApp outbound quando configurado.
- Pendências podem solicitar documentos.
- Falha persistente, timeout esgotado, divergência ou exceção pode criar/relacionar `Case`.

**Perguntas abertas:**

- Quais mudanças de status exigem notificação para owner/parceiro?
- Quais exceções devem abrir `Case` automaticamente?

### Submission

**Fonte da verdade:** banco transacional para tentativa, status e resultado interno da submissão.

**Criação/alteração:**

- Criada por API/worker quando uma solicitação ou pagamento confirmado exige interação governamental.
- Worker atualiza tentativas, erros, status e resultado normalizado.

**Invariantes:**

- Adapter governamental não sobrescreve estado financeiro.
- Retry deve ser idempotente e limitado.
- Falha permanente ou retry esgotado deve virar exceção operacional, não loop infinito.

**Eventos/efeitos colaterais:**

- Submissão confirmada pode atualizar status operacional relacionado.
- Timeout, erro externo ou resposta inconsistente pode abrir/relacionar `Case`.
- DLQ ou erro esgotado deve aparecer para operação.

**Perguntas abertas:**

- Quais tipos de submissão entram no MVP além de multas e licenciamento?
- Qual contrato real existirá com integração governamental?

### Case

**Fonte da verdade:** banco transacional.

**Criação/alteração:**

- Criado por regra de exceção ou por `ADMIN` autorizado.
- Claim, notas e mudança de status passam pela API.

**Invariantes:**

- `Case` representa exceção/problema que exige intervenção humana especial.
- Resolver `Case` não conclui automaticamente `ServiceRequest`.
- Claim precisa ser concorrente-safe.
- Notas internas não devem vazar para owner/parceiro.

**Eventos/efeitos colaterais:**

- Criação de `Case` pode notificar admins.
- Mudança de status deve ser auditada.
- Resolução pode permitir retomada de fluxo, mas não substitui regra da entidade relacionada.

**Perguntas abertas:**

- Quais motivos de Case serão automáticos no MVP?
- Haverá SLA interno por prioridade?

### Document

**Fonte da verdade:** banco transacional para metadata e storage privado para o arquivo.

**Criação/alteração:**

- Upload, vínculo, revisão e download passam pela API.
- Download deve usar autorização server-side antes de emitir URL temporária ou equivalente.

**Invariantes:**

- Documento sensível nunca deve ser público por padrão.
- Partner só acessa documentos vinculados à própria organização e solicitação autorizada.
- Metadata e objeto armazenado não podem divergir silenciosamente.

**Eventos/efeitos colaterais:**

- Documento enviado pode satisfazer pendência.
- Documento rejeitado pode notificar solicitante.
- Acesso relevante deve ser auditável quando aplicável.

**Perguntas abertas:**

- Quais tipos documentais entram no MVP?
- Qual política de retenção e expiração será exigida?

### Notification

**Fonte da verdade:** banco transacional/outbox de notificações.

**Criação/alteração:**

- API ou worker cria notificação a partir de evento de domínio.
- Worker entrega em canal externo quando configurado.
- Usuário pode marcar notificação como lida via API.

**Invariantes:**

- Notification não é fonte da verdade de `ServiceRequest`, `Payment`, `Case` ou `Document`.
- Falha de WhatsApp/email não deve apagar ou reverter evento de domínio já persistido.
- Deep links exigem login e autorização.
- Mensagens não devem transportar documentos sensíveis.

**Eventos/efeitos colaterais:**

- Evento de domínio pode gerar notificação in-app.
- Entrega externa pode falhar e ser reprocessada.
- Deduplicação deve evitar spam por replay ou retry.

**Perguntas abertas:**

- Quais eventos notificam owner, partner e admin no MVP?
- WhatsApp terá apenas outbound ou também inbound em fase futura?

## 5. Invariantes transversais

- `Payment` só vira `PAID` via evento válido do provider.
- `Payment PAID` não conclui `ServiceRequest` automaticamente.
- `ServiceRequest` não cria `Case` sem exceção operacional documentada.
- Preço histórico/snapshot não é reescrito quando preço atual muda.
- Autorização verdadeira fica no backend/API, nunca apenas no frontend.
- WhatsApp/notificações não são fonte da verdade.
- Adapter governamental/`Submission` não deve sobrescrever estado financeiro.
- `PartnerOrganization` continua separada de `Customer`.
- MVP usa `OWNER`, `PARTNER` e `ADMIN`; operação interna pertence ao `ADMIN`.
- IA não substitui validação, autorização, cálculo financeiro ou estado transacional.

## 6. Limites entre conceitos parecidos

| Conceitos | Separação |
| --- | --- |
| `ServiceRequest` vs `Case` | Solicitação é trabalho normal; Case é exceção/intervenção humana especial. |
| `Order` vs `ServiceRequest` | Order é transação comercial; ServiceRequest é execução/andamento do serviço. |
| `Payment` vs `Order` | Payment representa tentativa/estado financeiro; Order representa compra/cobrança. |
| `Submission` vs `Payment` | Submission é interação governamental/externa; Payment é confirmação financeira. |
| `PartnerOrganization` vs `Customer` | Parceiro é organização comercial atendida; Customer é cliente/proprietário/entidade do serviço. |
| `Notification` vs evento de domínio | Notification comunica fato; não cria o fato nem substitui o estado oficial. |
| Frontend vs API | Frontend orienta UX; API decide autorização e regra de domínio. |

## 7. Perguntas abertas

- O tenant será a empresa despachante, a PartnerOrganization, ambos ou outro boundary?
- Quais permissões internas existirão dentro de `ADMIN` quando houver granularidade?
- Como deduplicar veículo em jornadas B2C e B2B/B2B2C?
- Quais eventos de `ServiceRequest`, `Case`, `Payment`, `Submission` e `Document` geram notificação no MVP?
- Qual política define criação automática de `Case`?
- Como billing B2B/B2B2C afetará `Order`, `Payment`, invoices e preço histórico?
- Quais documentos e prazos de retenção são obrigatórios?
- Quais integrações governamentais reais substituirão o mock e com quais garantias?

## 8. Referências

- [`REQUIREMENTS_AND_SCALE.md`](./REQUIREMENTS_AND_SCALE.md)
- [`../../README.md`](../../README.md)
- [`../engineering/DATA_MODEL.md`](../engineering/DATA_MODEL.md)
- [`../product/STATUS_MODEL.md`](../product/STATUS_MODEL.md)
- [`../engineering/ARCHITECTURE.md`](../engineering/ARCHITECTURE.md)
