# EMR Despachante — Security & LGPD

## Dados sensíveis

- CPF/CNPJ;
- RENAVAM;
- placa quando associada a pessoa;
- dados financeiros;
- documentos;
- histórico de pagamentos.

## Princípios

### Minimização
Guardar somente o necessário.

### Mascaramento
Logs:
- CPF parcialmente mascarado;
- RENAVAM mascarado;
- provider tokens nunca aparecem.

### Autorização
Despachante só acessa:
- clientes vinculados;
- veículos vinculados;
- casos da própria carteira.

ADMIN:
acesso operacional controlado e auditado.

### BOLA / IDOR
Testes obrigatórios:
- dispatcher A tenta owner B;
- dispatcher A tenta vehicle B;
- owner tenta vehicle alheio;
- download de documento de terceiro.

### Webhooks
- validar assinatura;
- validar timestamp se provider permitir;
- rate limiting;
- idempotência;
- raw body quando necessário para assinatura.

### Payment
Nunca armazenar:
- PAN;
- CVV;
- cartão bruto.

### Documents
- S3 privado;
- presigned URL curta;
- autorização antes de emitir URL.

### Secrets
Produção:
- Secrets Manager/SSM;
- GitHub Actions por OIDC.

## Auditoria

Registrar:
- acesso administrativo a veículo;
- pagamento;
- estorno;
- mudança manual de status;
- vínculo/revogação;
- abertura/resolução de case.

## Retenção
Definir por tipo:
- audit financeiro;
- webhook dedup;
- documentos;
- logs.

## Checklist

- [ ] HTTPS
- [ ] secure cookies
- [ ] CSRF strategy
- [ ] CORS restritivo
- [ ] HMAC webhook
- [ ] rate limiting
- [ ] secret scanning
- [ ] dependency scanning
- [ ] SAST opcional
- [ ] tests cross-tenant
- [ ] logs redacted


---

# Segurança da IA

## Minimização
Não enviar CPF/RENAVAM completo quando a tarefa não exigir.

## Prompt injection
Conteúdo recuperado via RAG não pode:
- conceder acesso;
- criar tool;
- mudar role;
- ignorar confirmação.

## Tool authorization
Toda tool recebe identity/role no servidor.

## Logging
Evitar armazenar conversas brutas contendo PII quando não necessário.
Preferir conteúdo redigido/hash para telemetria.

## Provider
Documentar retenção, região e política de dados do provedor escolhido antes de produção real.
