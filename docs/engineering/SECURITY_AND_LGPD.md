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

Parceiro só acessa:
- PartnerOrganization própria;
- usuários autorizados da própria organização;
- solicitações da própria organização;
- documentos autorizados;
- cliente/veículo conforme vínculo/autorização.

Parceiro não acessa:
- notas internas;
- dados de outro parceiro;
- stack trace;
- detalhes técnicos desnecessários;
- documentos fora do escopo.

ADMIN:
acesso operacional controlado e auditado.

### BOLA / IDOR
Testes obrigatórios:
- dispatcher A tenta owner B;
- dispatcher A tenta vehicle B;
- owner tenta vehicle alheio;
- download de documento de terceiro.
- partner A tenta service request do partner B;
- partner A tenta documento do partner B;
- partner tenta nota interna operacional;
- deep link de WhatsApp sem login/autorização.

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

### WhatsApp outbound
- não enviar documentos sensíveis;
- evitar PII desnecessária;
- deep links exigem login e autorização;
- falha do provider não impede criação da solicitação.

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
- criação de ServiceRequest;
- resposta de pendência pelo parceiro;
- upload/download de documento;
- alteração de membership/permissão do parceiro;
- mudança de preferência de notificação.

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
- [ ] tests organization isolation
- [ ] tests organization escape / BOLA
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

Tools que consultam ServiceRequests precisam aplicar organization isolation quando o usuário for parceiro.

## Logging
Evitar armazenar conversas brutas contendo PII quando não necessário.
Preferir conteúdo redigido/hash para telemetria.

## Provider
Documentar retenção, região e política de dados do provedor escolhido antes de produção real.
