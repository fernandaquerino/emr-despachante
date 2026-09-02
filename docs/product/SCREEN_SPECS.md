# EMR Despachante — Screen & Prototype Specification

Este documento descreve o protótipo funcional do EMR Despachante.

A fonte de verdade para rotas, perfis de acesso e issue FE é [`../EMR-SCREEN-MAP.md`](../EMR-SCREEN-MAP.md). Este arquivo detalha conteúdo, estados e comportamento esperado das telas.

---

# 1. Direção visual

## Personalidade

O produto deve parecer:

- confiável;
- claro;
- operacional;
- financeiro sem ser “banco”;
- profissional;
- simples para quem não é técnico.

Evitar:

- excesso de cards decorativos;
- dashboards cheios de gráficos sem ação;
- cores demais;
- status apenas por cor;
- tabelas sem hierarquia.

## Layout desktop interno

- sidebar fixa à esquerda;
- header superior;
- conteúdo com largura fluida;
- cards de resumo no topo;
- filtros próximos da tabela;
- drawer lateral para ações rápidas quando fizer sentido.

## Status

Sempre combinar:
- texto;
- ícone;
- cor.

Exemplos:

- Regular
- Atenção
- Irregular
- Processando
- Aguardando cliente
- Caso manual
- Falha temporária

---

# 2. Tela — Login

## Objetivo
Autenticar proprietário, parceiro, admin ou admin através de login único.

## Conteúdo
- logo EMR Despachante;
- título “Acesse sua conta”;
- email;
- senha;
- mostrar senha;
- “Esqueci minha senha”;
- botão entrar;
- link cadastro para proprietário.

## Regras
- usuário não escolhe role no login;
- backend resolve memberships/permissões;
- cadastro público cria somente OWNER;
- PARTNER, ADMIN entram por convite/provisionamento.

## Estados
- loading;
- credenciais inválidas;
- conta suspensa;
- convite de admin ainda não ativado.
- convite de parceiro ainda não ativado.

---

# 3. Tela — Cadastro do proprietário

## Objetivo
Criar conta cliente.

## Campos
- nome;
- CPF;
- email;
- telefone;
- senha;
- confirmar senha;
- consentimento LGPD/termos.

## Pós cadastro
CTA:
**Cadastrar meu primeiro veículo**

---

# 4. Tela — Meus veículos

## Objetivo
Dar visão rápida dos veículos do proprietário.

## Header
- título “Meus veículos”;
- CTA “Adicionar veículo”.

## Card por veículo
- placa;
- marca/modelo;
- status geral;
- última atualização;
- multas em aberto;
- situação do licenciamento;
- CTA “Ver veículo”.

## Empty state
“Você ainda não cadastrou nenhum veículo.”

CTA:
**Cadastrar veículo**

---

# 5. Tela — Cadastrar veículo

## Campos
- placa;
- RENAVAM;
- apelido opcional;
- estado de registro opcional.

## Fluxo
1. preencher;
2. validar formato;
3. cadastrar;
4. primeira consulta automática;
5. mostrar loading “Consultando situação do veículo”.

## Resultado
redirecionar para detalhe.

---

# 5A. Tela — Dashboard do Parceiro

## Usuários
PARCEIRO.

## Objetivo
Responder:
**“O que está acontecendo com as solicitações da minha empresa e existe algo que preciso fazer?”**

## Conteúdo
- organização parceira;
- CTA “+ Nova solicitação”;
- indicadores: em andamento, aguardando ação do parceiro, concluídas recentemente, com pendência;
- solicitações recentes.

## Tabela principal
- request id;
- veículo;
- serviço;
- status;
- solicitante;
- última atualização;
- próxima ação quando necessária.

Não criar gráficos decorativos.

## Estados
- loading;
- empty;
- error;
- partial failure;
- stale;
- permission state;
- responsive behavior.

# 5B. Tela — Lista de Solicitações do Parceiro

## Objetivo
Encontrar e acompanhar ServiceRequests da PartnerOrganization.

## Conteúdo
- busca por placa ou request id;
- filtros por status, serviço, solicitante e período;
- lista paginada;
- CTA “+ Nova solicitação”.

## Colunas
- request id;
- veículo;
- serviço;
- status;
- solicitante;
- última atualização;
- ação pendente.

## Estados
- loading;
- empty;
- error;
- stale;
- permission state;
- responsive behavior.

# 5C. Tela — Nova Solicitação

## Objetivo
Criar uma ServiceRequest sem depender de WhatsApp.

## Fluxo
1. Veículo
2. Serviço
3. Documentos
4. Observações
5. Revisão
6. Enviar

## Campos
- placa;
- RENAVAM apenas quando necessário;
- serviço: Multas, Licenciamento, IPVA, Transferência, Dívida ativa;
- documentos pertinentes ao serviço quando a regra estiver disponível;
- observação livre.

Exemplo de observação:
“Cliente retira o veículo amanhã.”

## Revisão
Antes do envio, mostrar resumo completo.

## Pós criação
Mostrar request id, por exemplo `SR-4392`, e direcionar para acompanhamento.

## Estados
- loading;
- erro de validação;
- documento pendente;
- permission state;
- responsive behavior.

# 5D. Tela — Detalhe/Acompanhamento da Solicitação

## Objetivo
Dar tracking claro da ServiceRequest para parceiro.

## Conteúdo
- request id;
- organização parceira;
- veículo;
- serviço;
- status;
- solicitante;
- origem;
- timeline;
- documentos;
- ação pendente do parceiro;
- histórico.

## Timeline do parceiro não mostra
- stack trace;
- notas internas;
- detalhes técnicos desnecessários;
- dados de outros clientes;
- dados de outros parceiros.

## Estados
- loading;
- empty parcial;
- error;
- stale;
- forbidden;
- responsive behavior.

# 5E. Tela — Documentos/Pendências do Parceiro

## Objetivo
Centralizar documentos e ações pendentes.

## Conteúdo
- solicitações com pendência;
- documentos solicitados;
- status de envio/análise;
- upload;
- histórico de ações.

Documentos permanecem privados e downloads exigem autorização.

# 5F. Tela — Equipe do Parceiro

## Objetivo
Permitir gestão básica de usuários quando o papel do usuário permitir.

## Conteúdo
- usuários da PartnerOrganization;
- papel/permissão;
- status do convite;
- último acesso;
- convidar usuário.

Financeiro do parceiro pode ser fase futura quando billing B2B estiver definido.

---

# 6. Tela — Detalhe do veículo

## Objetivo
Centralizar a situação completa.

## Header
- placa;
- marca/modelo;
- status geral;
- última atualização;
- botão “Atualizar situação”.

## Resumo
Cards:
- Multas
- Licenciamento
- IPVA
- Outros serviços

## Seção “O que precisa de atenção”
Exemplo:
“2 multas em aberto impedem o licenciamento.”

CTA:
**Ver multas**

## Multas
Tabela:
- órgão;
- descrição;
- vencimento;
- valor;
- status;
- ação.

## Licenciamento
- ano;
- status;
- vencimento;
- impedimentos;
- CTA solicitar/pagar.

## Pedidos em andamento
- serviço;
- status;
- criado em;
- última atualização.

## Documentos
- tipo;
- data;
- baixar.

## Histórico resumido
últimos 5 eventos + CTA “Ver histórico completo”.

## Estados importantes

### Dado stale
Banner:
“Não conseguimos atualizar agora. Exibindo dados de 02/09/2026 às 10:42.”

### Processando baixa
“Pagamento confirmado. Estamos aguardando a atualização do órgão.”

---

# 7. Tela — Detalhe da multa

## Conteúdo
- órgão;
- identificação;
- veículo;
- vencimento;
- valor original;
- desconto;
- valor atual;
- status.

## Bloco de ação
Se pendente:
**Pagar multa**

Se pagamento em andamento:
“Aguardando confirmação do pagamento.”

Se pago e aguardando baixa:
“Pagamento confirmado — processando baixa.”

Se concluído:
“EMR Despachanteda.”

## Histórico específico
- detectada;
- pagamento iniciado;
- webhook recebido;
- baixa enviada;
- baixa confirmada.

---

# 8. Tela — Checkout

## Objetivo
Mostrar claramente o que está sendo pago.

## Resumo
- serviço;
- veículo;
- valor da pendência;
- taxa EMR Despachante;
- total.

## Métodos
- Pix;
- boleto;
- cartão, se sandbox escolhido.

## Aviso
“O status será atualizado após confirmação do pagamento.”

## Estados
- criando checkout;
- aguardando pagamento;
- pagamento identificado;
- falha;
- expirado.

---

# 9. Tela — Pedido / Acompanhamento

## Objetivo
Ser o tracking do serviço.

## Cabeçalho
- número do pedido;
- serviço;
- veículo;
- valor;
- criado em.

## Stepper

Exemplo multa:

1. Pedido criado
2. Pagamento pendente
3. Pagamento confirmado
4. Enviado para processamento
5. Baixa confirmada
6. Concluído

## Caso com problema
Stepper interrompido com:
“Precisamos revisar este pedido.”

---

# 10. Tela — Histórico do veículo

## Timeline
Filtros:
- Tudo
- Consultas
- Multas
- Pagamentos
- Licenciamento
- Documentos

Evento:
- ícone;
- título;
- descrição;
- timestamp;
- origem.

---

# 11. Tela — Dashboard Operacional

## Usuários
ADMIN.
Admin vê operação inteira.
Admin pode ver seus próprios indicadores e fila.

## Objetivo
Responder:
**“O que precisa ser trabalhado agora?”**

## Linha 1 — cards

- Solicitações novas
- Solicitações em processamento
- Aguardando parceiro
- Aguardando órgão
- Casos abertos
- Meus casos
- Casos críticos
- Aguardando cliente
- Pagamentos em análise
- Clientes com pendência

## Fila prioritária

Tabela:
- prioridade;
- solicitação/case;
- cliente;
- parceiro quando aplicável;
- veículo;
- tipo;
- motivo;
- status;
- tempo parado;
- responsável;
- ação.

Primeira coluna:
indicador de prioridade.

Quando há exceções críticas, a fila de Cases deve permanecer mais proeminente que análises decorativas.

CTA:
**Abrir caso**

## Bloco “Sem responsável”
Destacar casos ainda não assumidos.

## Bloco “Mais antigos”
5 casos com maior tempo aberto.

## Performance pessoal
Para admin:
- resolvidos hoje;
- resolvidos na semana;
- tempo médio;
- casos atuais.

Evitar ranking público entre funcionárias no MVP.

---

# 11A. Tela — Solicitações da Admin

## Objetivo
Trabalhar ServiceRequests normais antes que virem exceção.

## Conteúdo
- busca por placa, request id, cliente ou parceiro;
- filtros por status, serviço, origem, responsável e idade;
- abas ou filtros: novas, em processamento, aguardando parceiro, aguardando órgão.

## Colunas
- request id;
- origem;
- parceiro/cliente;
- veículo;
- serviço;
- status;
- última atualização;
- próxima ação;
- responsável.

## Estados
- loading;
- empty;
- error;
- partial failure;
- stale;
- permission state;
- responsive behavior.

# 11B. Tela — Detalhe da Solicitação Operacional

## Objetivo
Dar contexto completo para a admin executar o trabalho normal ou escalar exceção.

## Conteúdo
- request id;
- source;
- parceiro/cliente;
- solicitante;
- veículo;
- serviço;
- status;
- documentos;
- timeline operacional;
- notas internas;
- ações permitidas;
- botão/fluxo para criar Case quando houver exceção.

Notas internas não aparecem para parceiro.

## Estados
- loading;
- empty parcial;
- error;
- partial failure;
- stale;
- permission state;
- conflict quando outra admin alterar o mesmo item;
- responsive behavior.

---

# 12. Tela — Casos

## Tabs
- Meus casos
- Não atribuídos
- Todos, somente admin

## Filtros
- prioridade;
- status;
- tipo;
- cliente;
- veículo;
- data;
- responsável.

## Tabela
- ID;
- prioridade;
- cliente;
- placa;
- serviço;
- motivo;
- status;
- criado em;
- tempo aberto;
- responsável.

## Ação “Assumir”
Disponível para não atribuídos.

Precisa ser operação condicional.
Se outra pessoa assumiu:
“Este caso acabou de ser atribuído a Ana.”

---

# 13. Tela — Detalhe do caso

## Coluna principal

### Cabeçalho
- ID;
- prioridade;
- status;
- cliente;
- veículo;
- serviço.

### Motivo
Descrição objetiva do porquê o caso existe.

### Próxima ação sugerida
Exemplo:
“Confirmar manualmente a divergência do pagamento.”

### Contexto
- pagamento;
- pedido;
- última resposta externa;
- tentativas;
- erro técnico amigável.

### Timeline
Eventos técnicos e operacionais em ordem.

## Coluna lateral

- responsável;
- prioridade;
- status;
- SLA interno;
- links para cliente/veículo/pedido.

## Notas internas
- adicionar nota;
- histórico append-only preferencialmente.

## Ações
- Assumir
- Alterar status
- Marcar aguardando cliente
- Marcar aguardando órgão
- Resolver
- Escalar

---

# 14. Tela — Clientes

## Objetivo
Dar visão CRM operacional da base.

## Header
- título Clientes;
- busca;
- CTA “Adicionar cliente”.

## Cards de resumo
- clientes ativos;
- com pendências;
- aguardando ação;
- novos no mês.

## Filtros
- situação;
- possui caso;
- possui pagamento pendente;
- possui veículo irregular;
- cadastro incompleto.

## Tabela
- cliente;
- telefone;
- veículos;
- situação;
- pendências;
- casos;
- total em aberto;
- última atualização;
- próxima ação.

## Próxima ação
Exemplos:
- “Enviar convite”
- “Cliente precisa enviar documento”
- “2 multas em aberto”
- “Pagamento processando”
- “Tudo regular”

---

# 15. Tela — Detalhe do cliente

## Header
- nome;
- telefone;
- email;
- CPF mascarado;
- status.

## Cards
- veículos;
- pendências;
- pedidos ativos;
- total em aberto;
- casos abertos.

## Tabs

### Visão geral
Resumo e próximas ações.

### Veículos
Lista completa.

### Pedidos
Serviços solicitados.

### Pagamentos
Histórico financeiro.

### Casos
Casos operacionais ligados ao cliente.

### Documentos
Arquivos.

### Histórico
Timeline.

### Notas internas
Somente operação.

## CTA
- adicionar veículo;
- iniciar serviço;
- entrar em contato, pode ser apenas UI/mock;
- criar caso manual.

---

# 16. Tela — Veículos da operação

## Objetivo
Acompanhar todos os veículos de clientes.

## Filtros
- regular;
- irregular;
- atenção;
- processando;
- stale;
- possui multa;
- licenciamento pendente;
- cliente.

## Tabela
- placa;
- cliente;
- modelo;
- situação;
- multas;
- licenciamento;
- pedido ativo;
- última consulta;
- próxima ação.

## Ações
- ver veículo;
- atualizar;
- abrir cliente.

---

# 17. Tela — Dashboard Admin

## Objetivo
Visão executiva + operacional.

## Cards financeiros
- valor processado;
- receita por taxa;
- pagamentos confirmados;
- reembolsos;
- ticket médio.

## Cards operacionais
- clientes ativos;
- veículos ativos;
- pedidos;
- casos manuais;
- taxa de automação;
- taxa de sucesso da integração.

## Gráficos

### Receita por período
linha ou barras.

### Volume por serviço
Multas / Licenciamento / IPVA / Transferência / Dívida ativa.

### Funil operacional
- pedidos criados;
- checkout iniciado;
- pagos;
- submetidos;
- concluídos.

### Casos manuais
abertos x resolvidos.

## Tabelas

### Problemas que exigem atenção
- reconciliação;
- DLQ;
- integração;
- casos críticos.

### Atividade recente
feed operacional.

---

# 17A. Tela — Admin — Parceiros

## Objetivo
Gerenciar organizações parceiras.

## Conteúdo
- busca;
- filtros por status, volume e pendências;
- lista de PartnerOrganizations;
- CTA “Adicionar parceiro”.

## Colunas
- organização;
- status;
- usuários;
- solicitações abertas;
- pendências;
- última atividade;
- configurações de notificação.

## Estados
- loading;
- empty;
- error;
- partial failure;
- stale;
- permission state;
- responsive behavior.

# 17B. Tela — Admin — Partner Detail

## Objetivo
Concentrar a operação e configuração de uma PartnerOrganization.

## Conteúdo futuro
- dados da organização;
- status;
- usuários;
- solicitações;
- volume;
- pendências;
- configurações de notificação;
- catálogo habilitado;
- preços específicos quando aplicável;
- billing/faturas quando habilitado;
- auditoria.

Billing e financeiro B2B dependem de validação comercial.

---

# 18. Tela — Serviços e preços

## Objetivo
Admin gerencia catálogo.

## Tabela
- serviço;
- descrição;
- taxa;
- status;
- última alteração;
- ação.

## Editar serviço
Drawer/modal:
- nome;
- taxa fixa/percentual;
- ativo;
- descrição pública.

## Regra
Desativar serviço impede novos pedidos, não cancela existentes.

---

# 19. Tela — Usuários internos

## Cards
- ativas;
- convites pendentes;
- casos em andamento.

## Tabela
- nome;
- email;
- status;
- casos atuais;
- resolvidos período;
- tempo médio;
- última atividade.

## Ações
- convidar;
- reenviar convite;
- suspender;
- reativar;
- abrir detalhe.

---

# 20. Tela — Detalhe do usuário interno

## Resumo
- status;
- casos atuais;
- resolvidos;
- tempo médio.

## Casos atuais
Tabela.

## Histórico
casos resolvidos.

## Ações administrativas
- suspender acesso;
- reativar;
- alterar papel se modelo evoluir.

---

# 21. Tela — Reconciliação financeira

## Objetivo
Encontrar divergências.

## Cards
- pagos no provedor;
- confirmados localmente;
- aguardando reconciliação;
- divergências;
- reembolsos pendentes.

## Tabela
- payment ID;
- cliente;
- veículo;
- serviço;
- valor;
- status local;
- status provider;
- submissão;
- idade;
- ação.

## Filtros
- divergente;
- pending antigo;
- refunded;
- provider;
- período.

## Drawer de detalhe
- timeline financeira;
- webhook events;
- provider reference;
- audit;
- ação criar/abrir caso.

---

# 22. Tela — Auditoria

## Admin somente

Filtros:
- usuário;
- ação;
- entidade;
- período.

Tabela:
- timestamp;
- ator;
- ação;
- entidade;
- ID;
- metadata resumida.

Não permitir editar/excluir.

---

# 23. Estados globais do protótipo

Toda lista deve prever:

### Loading
Skeleton correspondente ao layout final.

### Empty
Explicar por que está vazio + ação possível.

### Error
Mensagem específica, não “Algo deu errado” quando houver contexto.

### Stale
Mostrar última atualização.

### Permission denied
403 amigável.

### Partial failure
Exemplo:
cards carregam, feed falha.
Não derrubar página inteira.

---

# 24. Componentes compartilhados

- AppShell
- Sidebar
- Header
- GlobalSearch
- SummaryCard
- StatusBadge
- PriorityBadge
- FilterBar
- DataTable
- EmptyState
- ErrorState
- StaleDataBanner
- Timeline
- CaseCard
- CustomerSummary
- VehicleSummary
- PaymentStatus
- ServiceStatusStepper
- ConfirmDialog
- Drawer
- Pagination
- Toast

---

# 25. Protótipo navegável mínimo

Fluxos que precisam estar clicáveis no Figma:

### Fluxo A — Proprietário paga multa
Login → Meus veículos → Veículo → Multa → Checkout → Pedido processando.

### Fluxo B — Admin resolve exceção
Dashboard operacional → Caso → Assumir → Nota → Resolver.

### Fluxo C — Admin acompanha cliente
Clientes → Detalhe cliente → Veículo → Pedido.

### Fluxo D — Admin investiga financeiro
Dashboard Admin → Reconciliação → Pagamento divergente → Caso.

### Fluxo E — Admin gerencia equipe
Usuários internos → Convidar → Admin pendente → Ativa.


---

# 26. Componente — EMR Copilot da operação

## Entrada
Botão no header:
**✨ Copilot**

## Comportamento
Abrir painel lateral direito sem tirar completamente o contexto da tela.

## Estado inicial
Sugestões:
- “Quais casos preciso priorizar?”
- “Resuma o que mudou hoje.”
- “Quais pagamentos precisam de atenção?”
- “Buscar cliente ou veículo.”

## Resposta
Pode conter:
- texto;
- cards de entidade;
- tabela pequena;
- links para abrir cliente/caso/veículo;
- proposta de ação.

## Loading
Mostrar:
“Consultando dados da operação…”

Evitar spinner infinito sem feedback.

## Tool error parcial
“Consegui encontrar o cliente, mas não consegui carregar o pagamento agora.”

---

# 27. IA no detalhe do caso

Adicionar bloco:
**✨ Assistência do Copilot**

Ações:
- Resumir caso
- Sugerir próxima ação
- Gerar mensagem para cliente
- Explicar erro técnico

## Exemplo de resumo

**Resumo**
Pagamento confirmado às 09:34. Foram feitas 3 tentativas de submissão. As últimas 2 falharam por timeout.

**Situação**
Não há divergência financeira.

**Próxima ação**
Manter como aguardando órgão ou executar nova tentativa conforme procedimento interno.

---

# 28. IA no Dashboard Admin

CTA:
**✨ Resumir operação**

Abrir drawer/modal com:
- principais mudanças;
- principal gargalo;
- pagamentos em atenção;
- volume de casos;
- anomalias observáveis;
- links de investigação.

Nunca afirmar causalidade sem evidência.

---

# 29. Chatbot do proprietário

## Posição
Widget/modal dentro da área autenticada.

## Exemplos
- “Por que meu licenciamento está bloqueado?”
- “Meu pagamento foi confirmado?”
- “Onde baixo meu documento?”
- “Tenho multas em aberto?”

## Restrições
- só recursos do usuário;
- sem dados de terceiros;
- sem ferramentas administrativas;
- sem mutações financeiras autônomas.

---

# 30. Confirmação de ações via IA

Quando Copilot sugerir mutação:

```text
Alterar o caso #1842 para “Aguardando órgão”?

Motivo:
Pagamento confirmado; submissão externa ainda pendente.

[Confirmar] [Cancelar]
```

Nunca executar só porque o usuário escreveu a frase no chat.
