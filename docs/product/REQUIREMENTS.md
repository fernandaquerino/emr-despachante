# EMR Despachante — Requirements v2

## Requisitos Funcionais

### Epic 1 — Autenticação e perfis

**RF-001 Cadastro de proprietário**
Criar conta com nome, CPF, email, telefone e senha.

**RF-002 Login e sessão**
Sessão segura, expiração e logout.

**RF-003 Provisionamento de admin interno**
Usuário interno ADMIN é criado/provisionado administrativamente.

**RF-004 Ativação por convite**
Convite de PARTNER e acessos internos provisionados possuem expiração e uso único quando aplicável.

**RF-005 RBAC**
PROPRIETÁRIO, PARCEIRO e ADMIN no MVP.

**RF-005A Convite/ativação de usuário parceiro**
Gestor ou admin convida usuário parceiro para uma PartnerOrganization com expiração e uso único.

**RF-005B Permissões de parceiro**
Usuário parceiro acessa apenas dados, solicitações, veículos, documentos e equipe vinculados à própria PartnerOrganization.

### Epic 2 — Clientes

**RF-006 Cadastro/gestão de cliente pela operação**
Operação pode criar registro mínimo, convidar cliente e acompanhar status do cadastro.

**RF-007 Lista de clientes**
Busca, filtros, paginação e indicadores.

**RF-008 Detalhe do cliente**
Veículos, pedidos, pagamentos, casos, histórico, documentos e notas internas.

**RF-009 Busca global**
Cliente, placa e demais identificadores permitidos.

### Epic 3 — Veículos

**RF-010 Cadastro de veículo**
Placa, RENAVAM, proprietário.

**RF-011 Consulta de situação**
Multas, licenciamento e status geral via DetranClient.

**RF-012 Cache de consulta**
TTL + lastUpdatedAt.

**RF-013 Atualização periódica**
Scheduler + fila + worker.

**RF-014 Detecção de mudança**
Só gerar evento quando estado normalizado mudar.

### Epic 4 — Multas

**RF-015 Listagem de multas**
Por veículo, status e vencimento.

**RF-016 Detalhe de multa**
Valor, desconto, órgão, vencimento, histórico.

**RF-017 Pagamento de multa**

**RF-018 Prevenção de pagamento duplicado**

**RF-019 Baixa assíncrona pós pagamento**

### Epic 5 — Licenciamento

**RF-020 Solicitação anual**

**RF-021 Bloqueio por multa pendente**

**RF-022 Pagamento de licenciamento**

**RF-023 CRLV simulado**

**RF-024 Download seguro**

### Epic 6 — Pagamentos

**RF-025 Checkout sandbox**

**RF-026 HMAC webhook**

**RF-027 Idempotência de webhook**

**RF-028 Reconciliação**

**RF-029 Estorno**

**RF-030 Timeline financeira**

### Epic 7 — Fila operacional

**RF-031 Criar caso automático**

**RF-032 Meus casos**

**RF-033 Casos não atribuídos**

**RF-034 Atribuição condicional**

**RF-035 Status de caso**
OPEN, IN_PROGRESS, WAITING_CLIENT, WAITING_EXTERNAL, RESOLVED, CANCELLED.

**RF-036 Prioridade**
LOW, MEDIUM, HIGH, CRITICAL.

**RF-037 Notas internas**

**RF-038 Histórico do caso**

**RF-039 Métricas operacionais do admin**

### Epic 7A — Partner Portal & B2B Intake

**RF-039A Organização parceira**
Admin cadastra PartnerOrganization para concessionárias, revendas, lojas de seminovos, locadoras, empresas com frota e outros parceiros comerciais.

**RF-039B Usuário parceiro e membership**
Usuários parceiros pertencem a uma PartnerOrganization e possuem permissões como gestor, vendas/solicitante ou financeiro.

**RF-039C Dashboard do parceiro**
Parceiro visualiza solicitações em andamento, aguardando ação do parceiro, concluídas recentemente e com pendência.

**RF-039D Criar solicitação**
Parceiro cria ServiceRequest informando veículo, serviço, documentos pertinentes, observações e revisão final.

**RF-039E Lista de solicitações do parceiro**
Busca por placa/request id, filtros por status/serviço/solicitante e paginação.

**RF-039F Detalhe/acompanhamento da solicitação**
Parceiro visualiza status, timeline pública, documentos, histórico e próxima ação quando necessária.

**RF-039G Pendência do parceiro**
Sistema destaca documentos ou informações faltantes e registra resposta auditável.

**RF-039H Origem da solicitação**
ServiceRequest registra source separado dos canais de notificação.

**RF-039I Notificação in-app**
Criação e mudanças relevantes geram notificação in-app para responsáveis autorizados.

**RF-039J WhatsApp outbound**
Quando configurado, o EMR envia notificação WhatsApp com organização parceira, placa mascarada quando necessário, serviço, solicitante, request id e deep link autenticado.

**RF-039K WhatsApp inbound futuro**
Mensagem recebida pelo WhatsApp para criar draft de solicitação fica como discovery/evolução futura, não requisito MVP.

**RF-039L Solicitações administrativas**
ADMIN possui fila de ServiceRequests normais além da fila de Cases.

**RF-039M Gestão admin de parceiros**
Admin lista parceiros, acessa detalhe e gerencia status, usuários, solicitações, preferências de notificação e catálogo habilitado.

**RF-039N Preços por parceiro**
Preço específico por parceiro é capacidade futura/importante e deve preservar snapshot histórico quando aplicado.

**RF-039O Billing B2B futuro**
Faturamento mensal/postpaid, invoices, invoice items, descontos, ajustes, refunds e reconciliação são capacidades futuras dependentes de validação comercial.

### Epic 8 — Dashboard operacional

**RF-040 Dashboard operacional/admin**

**RF-041 Clientes com pendência**

**RF-042 Casos mais antigos**

**RF-043 Próximos vencimentos**

**RF-044 Mudanças recentes**

### Epic 9 — Painel administrativo

**RF-045 Dashboard admin**

**RF-046 Receita e volume**

**RF-047 Catálogo de serviços**

**RF-048 Gestão de preços/taxa**

**RF-049 Gestão de usuários internos futura**

**RF-050 Fila consolidada**

**RF-051 Reconciliação financeira**

**RF-052 Auditoria**

### Epic 10 — Notificações

**RF-053 Multa nova**

**RF-054 Vencimento**

**RF-055 Pagamento pendente**

**RF-056 Caso manual**

**RF-056A Notificação de ServiceRequest**
Nova solicitação e alteração de status relevante notificam os responsáveis autorizados.

### Epic 11 — Histórico e documentos

**RF-057 Histórico por veículo**

**RF-058 Histórico por cliente**

**RF-059 Documentos privados**

**RF-060 Audit log append-only**

## Requisitos Não Funcionais

**RNF-001 Segurança e LGPD**
PII minimizada, mascarada e protegida.

**RNF-002 Consistência financeira**
Pagamento não duplica e só é confirmado por evento confiável.

**RNF-003 Resiliência**
Falha de integração externa não reverte pagamento confirmado.

**RNF-004 Observabilidade**
Trace webhook → payment → outbox → worker → DetranClient.

**RNF-005 Performance**
Dashboard operacional e administrativo precisam suportar milhares de veículos.

**RNF-006 Escalabilidade**
Checagem periódica via fila.

**RNF-007 Testabilidade**
Concorrência, idempotência e RBAC possuem testes.

**RNF-008 Auditabilidade**
Financeiro e ações operacionais rastreáveis.

**RNF-009 Acessibilidade**
Telas internas e cliente navegáveis por teclado.

**RNF-010 Paginação**
Listas grandes nunca carregam tudo.

**RNF-011 Degradação parcial**
Falha de feed ou integração não derruba dashboard inteiro.

**RNF-012 Staleness explícita**
Última atualização sempre disponível.

**RNF-013 Reprodutibilidade**
Infra as code + CI/CD.

**RNF-014 Segurança de documentos**
S3 privado e presigned URLs.

**RNF-015 Performance target inicial**
- busca global < 300 ms no cenário de teste;
- dashboard < 500 ms para aggregate endpoint em dataset-alvo;
- tabelas paginadas.

**RNF-016 Isolamento por organização**
PartnerOrganization deve impedir organization escape: parceiro não acessa dados de outro parceiro.

**RNF-017 Autorização B2B**
Deep links, documentos, veículos, solicitações e ações de parceiro exigem login e autorização server-side.

**RNF-018 Auditabilidade B2B**
Criação de solicitação, mudança de status, resposta de pendência, upload/download de documento e mudanças de permissão devem ser auditáveis.

**RNF-019 Resiliência de notificações**
Falha do provider de WhatsApp ou notificação não bloqueia a criação da ServiceRequest.

**RNF-020 Privacidade em notificações**
WhatsApp não transporta documentos sensíveis nem PII desnecessária.

**RNF-021 Rastreabilidade de origem**
ServiceRequestSource deve ser persistido e não confundido com canal de notificação.

**RNF-022 Idempotência operacional**
Criações vindas de canais automatizados futuros, retries de notificação e eventos assíncronos devem ser idempotentes quando aplicável.


---

# Requisitos de IA

## RF-AI-001 — Chat da operação
ADMIN pode abrir o EMR Copilot no ambiente interno.

## RF-AI-002 — Tool calling somente por API autorizada
O modelo não acessa SQL nem credenciais diretamente.

## RF-AI-003 — Buscar clientes
Tool deve respeitar permissões e retornar apenas campos necessários.

## RF-AI-004 — Buscar veículos
Por cliente, placa ou ID autorizado.

## RF-AI-005 — Consultar caso
Retornar status, motivo, responsável, timeline e entidades relacionadas.

## RF-AI-005A — Consultar solicitação
ADMIN pode consultar ServiceRequest autorizado, incluindo status, parceiro quando aplicável, veículo, serviço, solicitante, pendências e timeline pública/interna conforme perfil.

## RF-AI-006 — Consultar pagamento
Retornar timeline financeira e status local/provider quando autorizado.

## RF-AI-007 — Consultar dashboard
Retornar métricas agregadas estruturadas.

## RF-AI-008 — Resumo de caso
No detalhe de um caso, gerar:
- resumo;
- situação atual;
- últimas tentativas;
- possíveis causas;
- próxima ação sugerida.

## RF-AI-009 — Resumo da operação
ADMIN pode gerar um brief do período:
- casos novos;
- casos críticos;
- casos resolvidos;
- principais causas;
- pagamentos em atenção;
- integração degradada.

## RF-AI-010 — RAG de procedimentos internos
Pesquisar:
- FAQ;
- políticas;
- procedimentos;
- catálogo;
- instruções de atendimento;
- política de reembolso.

## RF-AI-011 — Rascunho de mensagem ao cliente
Gerar texto, mas exigir revisão humana antes do envio.

## RF-AI-011A — Rascunho de mensagem ao parceiro
Gerar mensagem para parceiro a partir de uma solicitação autorizada, sem expor notas internas ou PII desnecessária, e exigir revisão humana antes do envio.

## RF-AI-012 — Chatbot do proprietário
Só acessa:
- usuário autenticado;
- próprios veículos;
- próprios pedidos;
- próprios pagamentos;
- conteúdo público/FAQ permitido.

## RF-AI-013 — Write tools com confirmação
Qualquer tool mutável exige confirmação explícita na UI.

## RF-AI-014 — Registro de execução da IA
Persistir:
- feature;
- model/provider;
- prompt version;
- tool calls;
- latency;
- token usage;
- validation;
- fallback.

## RF-AI-015 — Evals
Manter conjunto versionado de cenários para:
- tool selection;
- factuality;
- autorização;
- resumo;
- RAG;
- write confirmation.

## RF-AI-016 — Fallback
Se LLM estiver indisponível:
- dashboard funciona;
- casos funcionam;
- busca normal funciona;
- regras continuam;
- IA mostra indisponibilidade sem quebrar operação.

## RF-AI-017 — Limites para parceiro
Não há chat amplo para parceiro no escopo inicial. Qualquer evolução futura deve restringir tools à própria PartnerOrganization.

## RNF-AI-001 — Autorização
A IA herda exatamente as permissões do usuário.

## RNF-AI-002 — Privacidade
Minimizar PII enviada ao provider.

## RNF-AI-003 — Factualidade
Dados transacionais devem ser citados internamente por tool result, nunca inferidos.

## RNF-AI-004 — Segurança de tools
O modelo só chama tools registradas com schemas fechados.

## RNF-AI-005 — Observabilidade
Medir latência, erros, tokens, custo, tool failures e fallback.

## RNF-AI-006 — Explicabilidade
Quando recomendar um caso, explicar fatores objetivos:
- prioridade;
- tempo aberto;
- status;
- SLA interno;
- dependência.

## RNF-AI-007 — Human in the loop
Nenhuma mutação financeira crítica é autônoma.
