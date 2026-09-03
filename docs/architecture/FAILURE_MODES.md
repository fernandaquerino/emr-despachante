# EMR Despachante — Failure Modes

> Modos de falha críticos e comportamento esperado.

## 1. Princípios

- Falha externa não pode corromper fonte da verdade interna.
- Usuário não deve receber falso sucesso para pagamento, submissão governamental ou upload.
- Retry precisa ser limitado, idempotente e observável.
- DLQ precisa ser visível para Admin/operação.
- Frontend melhora UX, mas backend/API/banco garantem invariantes.
- Dados stale podem ser exibidos quando marcados com `lastUpdatedAt` e estado adequado.

## 2. Matriz de failure modes

| Failure mode | Onde acontece | Comportamento esperado | Invariante protegida | Observabilidade |
| --- | --- | --- | --- | --- |
| Provider timeout | API ao criar checkout ou worker/provider financeiro | Não marcar Payment como `PAID`; retornar estado processando/erro recuperável conforme etapa. | Checkout iniciado não confirma pagamento. | log com provider, payment/order id seguro, traceId, duração e erro. |
| Duplicate webhook | Webhook de pagamento | Detectar por `provider + event_id`; retornar 2xx idempotente sem duplicar efeitos. | Payment só vira `PAID` uma vez por evento válido. | métrica `webhook_duplicate_total`; audit/event log seguro. |
| Retry/DLQ | Queue/worker | Retry com backoff para erro recuperável; mover para DLQ ao esgotar; criar visibilidade operacional. | Worker idempotente; sem retry infinito. | `queue_depth`, `oldest_message_age`, `dlq_depth`, `worker_failure_total`. |
| WhatsApp outage | Worker/notificação outbound | Registrar delivery failed/retry; não reverter ServiceRequest nem bloquear domínio. | Notificação não é fonte da verdade. | taxa de falha por canal/provider; alerta acima do baseline. |
| Upload failure | Web/object storage/API documents | Manter documento como `PENDING_UPLOAD` expirável ou `FAILED`; permitir novo upload autorizado. | Metadata/autorização ficam no banco; arquivo privado. | evento de falha com document id, tipo, tamanho seguro e traceId. |
| Double submit | UI/API em criação de pagamento, solicitação, claim ou upload confirm | Usar idempotency key/constraint/update condicional; retornar recurso existente ou conflict seguro. | Constraints críticas ficam no banco/API. | contadores de conflito/idempotência; logs sem PII. |
| Stale data | Consulta veicular/dashboard/cache | Exibir `lastUpdatedAt`; permitir refresh quando autorizado; não apagar snapshot válido por falha externa. | Cache/adapter não são fonte da verdade. | métrica de idade do dado, falha de refresh e cache miss/hit quando houver cache. |

## 3. Provider timeout

### Cenários

- Timeout ao iniciar checkout.
- Timeout ao consultar provider financeiro.
- Timeout após provider ter criado checkout, mas antes da API receber resposta.

### Comportamento esperado

- Não marcar `Payment` como `PAID`.
- Persistir tentativa e estado recuperável quando a transação local já existir.
- Se houver `idempotency_key`, nova tentativa deve reutilizar ou resolver o estado anterior.
- Mostrar ao usuário mensagem de processamento/erro sem confirmar pagamento.
- Continuar aceitando webhook posterior como fonte de confirmação.

### Não fazer

- Não confirmar pagamento por redirect.
- Não criar múltiplos pagamentos ativos para o mesmo alvo quando constraint/política impedir.
- Não esconder erro em fallback silencioso.

## 4. Duplicate webhook

### Cenários

- Provider reenvia evento por retry.
- API recebe mesmo evento em concorrência.
- Worker/outbox recebe efeito duplicado derivado do mesmo evento.

### Comportamento esperado

- Validar assinatura antes de processar.
- Persistir `processed_webhook_events(provider, event_id)` com unique constraint.
- Em replay já processado, retornar 2xx.
- Não duplicar outbox, submissão, notificação ou transição financeira.

### Não fazer

- Não depender apenas de cache/memória para idempotência.
- Não retornar erro para replay válido já processado.
- Não logar payload bruto financeiro.

## 5. Retry/DLQ

### Cenários

- Worker falha chamando DetranClient/mock.
- Provider externo fica indisponível.
- Payload inválido chega ao worker.
- Erro permanente é reenfileirado indevidamente.

### Comportamento esperado

- Classificar erro como recuperável ou permanente.
- Retry com limite e backoff para recuperáveis.
- Enviar para DLQ após esgotar.
- Registrar erro visível para operação.
- Criar/relacionar Case quando regra de exceção documentada aplicar.

### Não fazer

- Não retry infinito.
- Não reprocessar job sem idempotência.
- Não usar DLQ como cemitério invisível.

## 6. WhatsApp outage

### Cenários

- Provider de WhatsApp indisponível.
- Template rejeitado.
- Número inválido.
- Timeout no envio.

### Comportamento esperado

- ServiceRequest permanece criada.
- Criar/atualizar `notification_delivery` com falha.
- Retry apenas quando erro for recuperável.
- Exibir status interno para Admin quando relevante.
- Manter in-app notification como canal oficial dentro do produto.

### Não fazer

- Não transportar documento sensível na mensagem.
- Não considerar mensagem enviada como confirmação de leitura.
- Não bloquear fluxo principal por falha do canal.

## 7. Upload failure

### Cenários

- Usuário abandona upload.
- Object storage falha.
- Arquivo excede política de tamanho/tipo.
- Confirmação chega, mas objeto não existe ou checksum diverge.

### Comportamento esperado

- Criar metadata antes do upload somente após autorização.
- Validar tipo/tamanho conforme política.
- Manter estado recuperável: `PENDING_UPLOAD`, `FAILED` ou expirado.
- Permitir retry autorizado.
- Nunca emitir download sem autorização server-side.

### Não fazer

- Não marcar documento como disponível sem confirmar presença/checksum quando aplicável.
- Não expor object key diretamente como autorização.
- Não vazar documento entre PartnerOrganizations.

## 8. Double submit

### Cenários

- Usuário clica duas vezes em pagar/criar solicitação.
- Browser reenvia request após timeout.
- Dois admins tentam assumir o mesmo Case.
- Worker recebe mensagem duplicada.

### Comportamento esperado

- Usar idempotency key em comandos repetíveis.
- Usar unique constraints para duplicidades críticas.
- Usar update condicional no claim: `WHERE assignee_user_id IS NULL`.
- Retornar recurso existente ou `conflict` com estado atual.
- Worker deve tratar mensagem repetida como no-op seguro quando já processada.

### Não fazer

- Não confiar apenas em botão desabilitado no frontend.
- Não usar lock em memória para invariant crítica.
- Não criar duplicatas silenciosas.

## 9. Stale data

### Cenários

- DetranClient/mock indisponível.
- Cache curto expirado ou ausente.
- Dashboard agregado demora para refletir evento.
- Snapshot veicular está antigo.

### Comportamento esperado

- Exibir `lastUpdatedAt`.
- Diferenciar dado stale de erro total.
- Permitir refresh autorizado quando aplicável.
- Usar último snapshot válido sem fingir atualização recente.
- Dashboard pode ser eventualmente consistente se documentado.

### Não fazer

- Não sobrescrever status conhecido por `UNKNOWN` só por falha temporária.
- Não ocultar idade do dado.
- Não tomar ação financeira baseada em dado stale sem regra explícita.

## 10. Checklist de validação por implementação futura

- Pagamento duplicado tem teste de concorrência/idempotência.
- Webhook duplicado retorna 2xx e não duplica efeitos.
- Worker idempotente resiste a mensagem duplicada.
- DLQ gera alerta/visibilidade operacional.
- Falha de WhatsApp não desfaz ServiceRequest.
- Upload incompleto não libera documento para download.
- Case claim concorrente retorna sucesso para um admin e conflict para outro.
- Dados stale mostram timestamp e não fingem atualização.
