# EMR Despachante — Screen & Prototype Specification

Este documento descreve o protótipo funcional do EMR Despachante.

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
Autenticar proprietário, operadora ou admin.

## Conteúdo
- logo EMR Despachante;
- título “Acesse sua conta”;
- email;
- senha;
- mostrar senha;
- “Esqueci minha senha”;
- botão entrar;
- link cadastro para proprietário.

## Estados
- loading;
- credenciais inválidas;
- conta suspensa;
- convite de operadora ainda não ativado.

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
OPERADORA e ADMIN.
Admin vê operação inteira.
Operadora pode ver seus próprios indicadores e fila.

## Objetivo
Responder:
**“O que precisa ser trabalhado agora?”**

## Linha 1 — cards

- Casos abertos
- Meus casos
- Casos críticos
- Aguardando cliente
- Aguardando órgão
- Pagamentos em análise
- Clientes com pendência

## Fila prioritária

Tabela:
- prioridade;
- caso;
- cliente;
- veículo;
- tipo;
- motivo;
- status;
- tempo parado;
- responsável;
- ação.

Primeira coluna:
indicador de prioridade.

CTA:
**Abrir caso**

## Bloco “Sem responsável”
Destacar casos ainda não assumidos.

## Bloco “Mais antigos”
5 casos com maior tempo aberto.

## Performance pessoal
Para operadora:
- resolvidos hoje;
- resolvidos na semana;
- tempo médio;
- casos atuais.

Evitar ranking público entre funcionárias no MVP.

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

# 19. Tela — Operadoras

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

# 20. Tela — Detalhe da operadora

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

### Fluxo B — Operadora resolve exceção
Dashboard operacional → Caso → Assumir → Nota → Resolver.

### Fluxo C — Operadora acompanha cliente
Clientes → Detalhe cliente → Veículo → Pedido.

### Fluxo D — Admin investiga financeiro
Dashboard Admin → Reconciliação → Pagamento divergente → Caso.

### Fluxo E — Admin gerencia equipe
Operadoras → Convidar → Operadora pendente → Ativa.


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
