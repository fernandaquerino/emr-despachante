# EMR Despachante — Security Architecture

> Modelo de segurança antes da implementação.

## 1. Objetivo

Definir os controles mínimos de segurança para autenticação, autorização, sessão, isolamento de dados, PII, documentos, webhooks, secrets, rate limiting, auditoria e EMR Copilot.

Este documento é arquitetural. Implementações concretas devem preservar estas regras em API, banco, worker, frontend e integrações.

Referências:

- [Requirements and Scale](./REQUIREMENTS_AND_SCALE.md)
- [Domain Model](./DOMAIN_MODEL.md)
- [Data Model](./DATA_MODEL.md)
- [Critical Flows](./CRITICAL_FLOWS.md)
- [Failure Modes](./FAILURE_MODES.md)
- [Security & LGPD](../engineering/SECURITY_AND_LGPD.md)

## 2. Princípios

- Autorização verdadeira fica no backend/API, nunca apenas no frontend.
- Banco transacional é fonte da verdade para usuários, memberships, vínculos, documentos, pagamentos, audit e idempotência.
- Frontend pode esconder ações por UX, mas backend deve negar acesso indevido.
- Todo acesso a entidade sensível deve validar ownership, organization scope ou permissão administrativa.
- PII deve ser minimizada, mascarada e protegida em repouso/trânsito conforme aplicável.
- Logs, métricas, traces, prompts e notificações não devem carregar PII desnecessária.
- Webhooks precisam de assinatura, idempotência e raw body quando o provider exigir.
- Secrets não entram no repositório nem em logs.
- EMR Copilot opera por tools autorizadas; prompt não concede acesso.

## 3. AuthN e session strategy

### AuthN

- `OWNER` pode nascer por cadastro público.
- `PARTNER` nasce por convite/membership em PartnerOrganization.
- `ADMIN` nasce por provisionamento administrativo.
- Login é único; backend resolve memberships e contextos autorizados.
- Não existe seleção pública de papel para elevar privilégio.

### Session strategy

- Usar sessão/cookie segura ou estratégia equivalente com:
  - HTTPS obrigatório;
  - cookie `HttpOnly`;
  - cookie `Secure`;
  - `SameSite` adequado;
  - expiração;
  - logout;
  - rotação/invalidação quando credenciais ou memberships mudarem.
- Sessão deve carregar identidade mínima; autorização deve consultar contexto/membership server-side quando necessário.
- Membership suspensa/desativada deve bloquear acesso mesmo que exista sessão anterior.

### CSRF/CORS

- Definir estratégia CSRF compatível com cookies.
- CORS deve ser restritivo.
- Endpoints de webhook não usam sessão de usuário, mas exigem validação de assinatura do provider.

## 4. AuthZ: RBAC + ABAC

RBAC define capacidade geral por papel. ABAC restringe acesso por ownership, PartnerOrganization, recurso e estado.

| Papel | RBAC base | ABAC obrigatório |
| --- | --- | --- |
| `OWNER` | Acessar própria área, veículos, solicitações, pedidos, pagamentos e documentos. | `owner_customer_id`/vínculo próprio; nunca acessar dados de outro owner. |
| `PARTNER` | Criar e acompanhar solicitações, veículos/documentos autorizados e equipe da própria organização. | `partner_organization_id` da membership ativa. |
| `ADMIN` | Operação interna, Cases, parceiros, clientes, veículos, financeiro, auditoria e configurações. | Acesso auditado; granularidade futura não deve quebrar boundaries. |

Regras:

- Toda query por id precisa aplicar scope.
- Toda mutation precisa revalidar autorização no momento da escrita.
- Deep links exigem login e autorização.
- IDs em URL não provam acesso.
- Dados internos, notas de Case e stack traces não vazam para owner/partner.

## 5. OWNER ownership

OWNER só pode acessar:

- seu cadastro/perfil;
- veículos vinculados a ele;
- solicitações próprias;
- pedidos/pagamentos próprios;
- documentos próprios ou explicitamente vinculados ao seu fluxo.

OWNER não pode acessar:

- veículos de outro owner;
- documentos de outro usuário;
- notas internas;
- dashboard/admin;
- dados de PartnerOrganization sem vínculo permitido.

Testes obrigatórios:

- owner A tenta acessar veículo de owner B;
- owner A tenta baixar documento de owner B;
- owner A tenta acessar pagamento/order de owner B;
- owner tenta rota ou endpoint admin.

## 6. PartnerOrganization isolation

Partner só pode acessar dados escopados à sua PartnerOrganization ativa:

- solicitações da organização;
- veículos vinculados à organização quando autorizado;
- documentos vinculados às solicitações da organização;
- usuários/equipe da própria organização conforme permissão;
- notificações destinadas ao usuário/contexto.

Partner não pode acessar:

- dados de outra PartnerOrganization;
- notas internas operacionais;
- auditoria global;
- financeiro/admin sem capacidade futura explícita;
- documentos por deep link sem autorização.

Testes obrigatórios:

- partner A tenta acessar ServiceRequest do partner B;
- partner A tenta baixar documento do partner B;
- partner A tenta listar veículos de outra organização;
- partner tenta acessar nota interna de Case;
- usuário parceiro com membership desativada tenta acessar portal.

## 7. IDOR/BOLA

Padrão obrigatório:

- Não buscar entidade somente por `id`.
- Buscar por `id + scope` ou buscar e validar policy antes de retornar.
- Mutations devem validar:
  - identidade;
  - papel;
  - membership/status;
  - ownership/organization scope;
  - estado atual do recurso;
  - permissão para transição.

Endpoints críticos:

- veículos;
- ServiceRequests;
- documentos/download URLs;
- payments/orders;
- partner team;
- Cases;
- AI tools;
- webhooks administrativos internos, se existirem no futuro.

## 8. PII e minimização

Dados sensíveis:

- CPF/CNPJ;
- RENAVAM;
- placa quando associada a pessoa;
- email;
- telefone;
- documentos;
- dados financeiros;
- referências de provider;
- notas internas;
- prompts/respostas com dados transacionais.

Regras:

- Coletar somente o necessário para o fluxo.
- Mascarar em logs e respostas quando valor completo não for necessário.
- Não logar CPF, RENAVAM, documentos, authorization headers, payload financeiro bruto ou prompts completos com PII.
- Criptografar/proteger campos sensíveis em repouso quando aplicável.
- Retenção deve ser definida por tipo de dado antes de produção real.
- Enviar ao LLM apenas o mínimo necessário para a tarefa autorizada.

## 9. Documentos

Regras:

- Object storage privado por padrão.
- Metadata, ownership, vínculo e autorização ficam no PostgreSQL/API.
- Download exige autorização server-side antes de emitir URL temporária.
- Upload exige autorização antes de criar intent/metadata.
- `object_key` não é autorização.
- URL temporária deve ter expiração curta e escopo mínimo.
- Upload incompleto não deve liberar documento.
- PartnerOrganization isolation se aplica a documentos.
- Acesso relevante deve gerar audit/event quando aplicável.

Failure modes cobertos:

- upload abandonado;
- object storage indisponível;
- checksum divergente;
- tipo/tamanho inválido;
- tentativa de download fora do escopo.

## 10. Webhooks

Regras:

- Validar assinatura do provider.
- Usar raw body quando necessário para assinatura.
- Validar timestamp/idade do evento quando provider permitir.
- Validar schema e tipo de evento.
- Garantir idempotência persistida por `provider + event_id`.
- Retornar 2xx para replay válido já processado.
- Não confiar em IP allowlist como único controle.
- Não logar payload bruto financeiro.
- Rate limiting deve proteger abuso sem quebrar retry legítimo do provider.

Invariante:

- Payment só vira `PAID` via evento válido e idempotente do provider.

## 11. Secrets

Regras:

- Nunca commitar API keys, webhook secrets, tokens, credenciais AWS, senhas ou material privado.
- Produção deve usar secret manager/SSM ou mecanismo equivalente.
- GitHub Actions deve usar OIDC quando aplicável, não chave longa persistida.
- Logs nunca devem incluir secrets, authorization headers ou URLs assinadas completas.
- Rotação de secrets deve ser possível sem alteração de código.
- `.env` local não deve ser versionado.

## 12. Rate limiting

Aplicar limites proporcionais ao risco e sempre com observabilidade.

Áreas candidatas:

- login;
- cadastro;
- recuperação/redefinição de senha;
- consulta pública por placa;
- criação de checkout/payment;
- upload/download de documentos;
- webhook endpoints;
- AI chat/tools;
- endpoints de busca global.

Regras:

- Rate limit não substitui autorização.
- Redis pode ser usado para rate limiting se justificado, mas não é fonte da verdade.
- Falhas de rate limit devem retornar erro claro e sem vazar dados.

## 13. Audit

Registrar eventos relevantes de segurança e negócio:

- login/logout quando útil para segurança;
- alteração de senha;
- criação/aceite/revogação de membership;
- criação/suspensão de PartnerOrganization;
- acesso administrativo a dados sensíveis;
- criação e mudança de ServiceRequest;
- claim, nota e mudança de status de Case;
- criação/confirmação/reembolso de Payment;
- webhook processado/duplicado/inválido;
- upload/download/rejeição de Document;
- mudança de preferência de notificação;
- ação de IA confirmada pelo usuário.

Regras:

- Audit log é append-only.
- Metadata deve ser segura e mínima.
- Não armazenar payload bruto com PII desnecessária.
- Eventos financeiros e de autorização devem ter identificadores/correlationId suficientes para investigação.

## 14. AI scope

Regras:

- LLM não acessa banco diretamente.
- Tools aplicam autorização server-side.
- Prompt/RAG não concede role, permissão ou escopo.
- Partner tools devem aplicar PartnerOrganization isolation.
- OWNER tools devem aplicar ownership.
- ADMIN tools devem ser auditáveis quando acessarem dados sensíveis ou executarem ação.
- Write tools exigem confirmação humana explícita e nova validação de autorização.
- IA não confirma pagamento, não calcula estado financeiro oficial, não resolve Case sozinha e não altera status sensível sem confirmação.
- Conteúdo vindo de documento, usuário, banco ou integração é tratado como não confiável contra prompt injection.

Exemplos de ações sensíveis:

- refund;
- mudança de status;
- envio de mensagem;
- atribuição de Case;
- cancelamento;
- alteração financeira;
- acesso amplo a dados de parceiro.

## 15. Checklist de implementação futura

- AuthN possui sessão segura, expiração e logout.
- CSRF/CORS definidos conforme estratégia de sessão.
- Toda query por id aplica ownership/organization scope.
- Testes IDOR/BOLA cobrem owner, partner, admin e documentos.
- Webhook valida assinatura e idempotência persistida.
- Rate limiting aplicado nos endpoints de maior abuso.
- Logs redigem PII/secrets.
- Documentos usam storage privado e URL temporária autorizada.
- Audit log registra eventos críticos.
- AI tools aplicam policy server-side e confirmação para write tools.
- Nenhum controle crítico depende somente do frontend.
