# EMR Despachante — Dashboard da Despachante

## Objetivo

O dashboard deve funcionar como a mesa de trabalho da despachante.

Ele não é apenas um conjunto de gráficos.

Ele precisa responder:

> “Quem precisa de mim agora?”

A operação possui duas filas:
- ServiceRequests normais, solicitadas por proprietário, parceiro ou operação;
- Cases, criados apenas para exceções/problemas.

Quando existem exceções críticas, a fila de Cases precisa ter grande protagonismo.

## Estrutura sugerida

### 1. Header
- busca global;
- filtro de período;
- botão “Adicionar cliente”;
- botão “+ Nova solicitação”;
- botão “Consultar veículo”;
- notificações;
- perfil.

### 2. Cards de resumo
1. Clientes ativos
2. Veículos gerenciados
3. Pendências críticas
4. Multas em aberto
5. Licenciamentos pendentes
6. Solicitações em andamento
7. Aguardando parceiro
8. Aguardando órgão
9. Pagamentos processando
10. Casos manuais
11. Comissão estimada

Cada card:
- valor atual;
- variação do período quando útil;
- link para lista filtrada.

### 3. Precisa de atenção
Lista prioritária.

Colunas:
- prioridade;
- request id quando for ServiceRequest;
- cliente;
- parceiro quando aplicável;
- veículo;
- motivo;
- status;
- há quanto tempo;
- próxima ação;
- responsável.

Exemplos:
- “Baixa não reconhecida há 26h”
- “Webhook pago sem submissão concluída”
- “Licenciamento bloqueado por multa”
- “DetranClient falhou 3 vezes”
- “Cliente ainda não aceitou vínculo”
- “Documento não gerado”
- “Parceiro precisa enviar documento”

### 3A. Solicitações recentes
Lista operacional de ServiceRequests.

Colunas:
- request id;
- origem;
- cliente/parceiro;
- veículo;
- serviço;
- status;
- última atualização;
- próxima ação;
- responsável.

### 4. Próximos vencimentos
Agrupar:
- próximos 7 dias;
- próximos 15 dias;
- próximos 30 dias.

### 5. Mudanças recentes
Feed:
- nova multa;
- multa quitada;
- veículo emr-despachantedo;
- licenciamento liberado;
- documento disponível;
- nova solicitação de parceiro;
- caso manual criado.

### 6. Saúde da carteira
Distribuição:
- REGULAR;
- ATTENTION;
- IRREGULAR;
- PROCESSING;
- MANUAL_REVIEW;
- UNKNOWN.

### 7. Pagamentos
Resumo:
- pending;
- paid;
- failed;
- refunded;
- processing_submission.

### 8. Comissão
- estimada no mês;
- veículos ativos;
- comissão por veículo;
- histórico mensal.

## Tela Carteira de Clientes

Colunas:
- cliente;
- telefone;
- quantidade de veículos;
- pendências;
- caso crítico;
- próxima ação;
- última atualização;
- status do vínculo.

Filtros:
- com pendência;
- sem pendência;
- cliente novo;
- convite pendente;
- caso manual;
- pagamento pendente;
- documento disponível.

## Detalhe do Cliente

### Resumo
- nome;
- contato;
- status do vínculo;
- quantidade de veículos;
- total pendente;
- última atualização.

### Veículos
Cards/tabela com:
- placa;
- modelo;
- situação;
- multas;
- licenciamento;
- próxima ação.

### Timeline
- vínculo criado;
- veículo cadastrado;
- consulta executada;
- multa detectada;
- pagamento iniciado;
- webhook confirmado;
- baixa submetida;
- documento gerado.

### Documentos
- comprovantes;
- CRLV mock;
- recibos.

### Observações
Despachante pode adicionar notas internas.

## Tela Carteira de Veículos

Colunas:
- placa;
- cliente;
- veículo;
- situação;
- multas em aberto;
- licenciamento;
- pagamento;
- última consulta;
- próximo vencimento;
- atualização automática;
- ação.

## Fila Manual

Estados:
- OPEN;
- IN_PROGRESS;
- WAITING_EXTERNAL;
- WAITING_CLIENT;
- RESOLVED;
- CANCELLED.

Filtros:
- prioridade;
- tipo;
- responsável;
- idade;
- cliente;
- veículo.

## UX

### Estado stale
Se dado veio do cache:
> “Última atualização: 2h atrás.”

### Dependência indisponível
Não mostrar erro genérico.

Exemplo:
> “Não conseguimos atualizar agora. Você está vendo os dados da última consulta.”

### Pagamento
Nunca exibir “Pago” antes do webhook.

Possíveis estados de UI:
- aguardando pagamento;
- pagamento identificado;
- processando baixa;
- emr-despachantedo;
- precisa de atenção.

## Dashboard do Parceiro

## Objetivo
Responder:

> “O que está acontecendo com as solicitações da minha empresa e existe algo que preciso fazer?”

## Estrutura
- CTA “+ Nova solicitação”;
- indicadores de em andamento, aguardando ação do parceiro, concluídos recentemente e com pendência;
- solicitações recentes;
- pendências/documentos necessários.

Não usar gráficos decorativos.

## Tabela principal
- request id;
- veículo;
- serviço;
- status;
- solicitante;
- última atualização;
- próxima ação quando necessária.

## Dashboard Admin e B2B

O dashboard admin pode reconhecer:
- volume B2C;
- volume B2B;
- solicitações por parceiro;
- receita/taxa por canal;
- valor processado;
- receita de serviço.

Não confundir `valor processado` com faturamento/receita do despachante.

Modelo comercial B2B ainda depende de validação.

## Performance

Dashboard não deve executar uma query por card.

Preferir:
- endpoint agregado;
- read model;
- índices;
- cache curto;
- materialized view apenas se volume justificar.

## Responsividade

Desktop:
foco operacional completo.

Mobile:
- cards essenciais;
- busca;
- fila de atenção;
- cliente/veículo;
- ações rápidas.


---

# IA no dashboard

## Admin — Resumo inteligente
CTA discreto:
**✨ Resumir minha fila**

Retorna:
- casos mais urgentes;
- casos mais antigos;
- casos sem responsável;
- padrão recorrente do dia;
- links para investigação.

## Admin — Resumo da operação
CTA:
**✨ Resumir operação**

Usa apenas métricas estruturadas e consultas autorizadas.

Exemplo:
“11 dos 18 casos manuais abertos hoje são relacionados a falha de integração de licenciamento. O volume financeiro permanece dentro do padrão, mas o tempo médio de resolução subiu.”

## Regra
A IA interpreta.
O dashboard continua exibindo os números brutos.
