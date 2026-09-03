# EMR Despachante — Product Description

## 1. Visão

EMR Despachante é uma plataforma digital para uma empresa de despachante operar clientes, veículos e serviços veiculares em escala.

O produto tem três lados principais:

1. **Cliente proprietário**
   - cadastra veículo;
   - consulta pendências;
   - solicita serviços;
   - inicia pagamentos;
   - acompanha andamento;
   - baixa documentos.

2. **Parceiro comercial**
   - cria solicitações para veículos atendidos pela organização parceira;
   - acompanha status e pendências;
   - envia documentos solicitados;
   - consulta histórico permitido;
   - recebe notificações in-app e WhatsApp quando configurado.

3. **Operação interna da empresa**
   - acompanha toda a base de clientes;
   - acompanha organizações parceiras;
   - acompanha todos os veículos;
   - trabalha solicitações normais;
   - trabalha apenas os casos que exigem ação humana;
   - monitora pagamentos, falhas e pendências;
   - gerencia usuários internos quando essa capacidade estiver habilitada;
   - gerencia catálogo e preços;
   - acompanha receita e performance.

O produto segue a lógica de um despachante online: estruturar a entrada de demandas, automatizar o caminho simples e transformar exceções em uma fila operacional clara.

## 2. Problema

Sem uma plataforma central, a operação tende a ficar dividida entre:

- site de órgão;
- planilha;
- WhatsApp;
- comprovantes;
- e-mail;
- demandas de parceiros por WhatsApp;
- histórico manual;
- lembretes pessoais;
- conferência financeira separada.

Isso gera:

- retrabalho;
- perda de contexto;
- risco de cobrança duplicada;
- atraso em casos excepcionais;
- dificuldade para saber qual cliente precisa de contato;
- baixa visibilidade da operação;
- pouca capacidade de crescer sem aumentar o time na mesma proporção.

## 3. Proposta de valor

### Para o proprietário

> Resolver pendências do veículo sem entender a burocracia por trás de cada órgão.

### Para o admin operacional

> Receber uma fila clara do que precisa de ação humana, em vez de consultar tudo manualmente.

### Para o parceiro

> Trocar pedidos soltos no WhatsApp por um portal onde a empresa cria solicitações, envia documentos e acompanha o andamento.

### Para o admin

> Enxergar e executar a operação diária, além de acompanhar clientes, veículos, serviços, receita, pagamentos, falhas e produtividade.

## 4. Personas

### PROPRIETÁRIO

Cliente final.

Objetivos:
- cadastrar veículo;
- saber se está regular;
- entender pendências;
- pagar;
- acompanhar status;
- obter documento.

### ADMIN

Usuário interno do despachante no MVP. Concentra operação diária e gestão administrativa.

Objetivos:
- acompanhar carteira de clientes;
- acompanhar receita e volume;
- acompanhar operação;
- acompanhar novas solicitações;
- trabalhar solicitações em andamento;
- identificar solicitações aguardando cliente, parceiro ou órgão;
- trabalhar Cases de exceção;
- entender histórico;
- executar ação manual;
- deixar nota interna;
- identificar gargalos;
- gerenciar usuários internos quando essa capacidade estiver habilitada;
- configurar catálogo;
- acompanhar reconciliação;
- resolver escalonamentos.

### PARCEIRO

Usuário de uma PartnerOrganization.

Objetivos:
- criar solicitação de serviço;
- acompanhar solicitações da própria organização;
- enviar documentos pertinentes;
- responder pendências;
- convidar ou gerenciar equipe, quando permitido;
- consultar financeiro quando o módulo B2B estiver habilitado.

Exemplos de organizações parceiras:
- concessionárias;
- revendas;
- lojas de seminovos;
- locadoras;
- empresas com frota;
- outros parceiros comerciais do despachante.

## 5. Catálogo

O catálogo contém:

- Multas
- Licenciamento
- IPVA
- Transferência
- Dívida ativa

### Escopo técnico profundo

Implementação completa:
- Multas
- Licenciamento

Implementação estrutural / exercício:
- IPVA
- Transferência
- Dívida ativa

Os serviços adicionais reutilizam os mesmos padrões:
- ServiceRequest;
- Payment;
- Webhook;
- Outbox;
- ExternalSubmission;
- Case Queue;
- Audit.

## 6. Princípios de produto

### Operação por exceção
O sistema deve automatizar o caminho normal e destacar exceções.

### Cliente e veículo como centro
Toda informação deve ser navegável a partir de:
- cliente;
- veículo;
- serviço/pedido;
- caso.

### Status intermediário é produto
Estados como “aguardando webhook”, “processando baixa” e “precisa de ação” precisam aparecer claramente.

### Não esconder informação desatualizada
Quando a integração estiver indisponível, mostrar último snapshot + horário.

### Financeiro só é verdade após confirmação confiável
Checkout retornou sucesso não significa pagamento confirmado.

### Toda exceção precisa virar trabalho visível
Falha repetida ou divergência relevante cria caso operacional.

### ServiceRequest não é Case
ServiceRequest representa o trabalho normal solicitado por proprietário, parceiro ou operação.

Case representa exceção/problema que exige intervenção humana especial.

Uma solicitação de licenciamento criada por parceiro segue o fluxo normal. Ela só cria Case quando há falha persistente, divergência, timeout esgotado ou outra exceção explícita.

### WhatsApp não é fonte da verdade
No MVP, WhatsApp é canal de notificação outbound. A solicitação, os documentos, o histórico e os estados oficiais vivem no EMR.

## 7. Métricas de negócio

- clientes ativos;
- veículos ativos;
- pedidos por serviço;
- solicitações por canal;
- volume B2C;
- volume B2B;
- solicitações por parceiro;
- receita bruta;
- receita de taxa;
- valor processado;
- pagamentos confirmados;
- taxa de conversão checkout → pago;
- tempo médio até conclusão;
- casos manuais abertos;
- casos críticos;
- tempo médio de resolução;
- taxa de automação;
- taxa de sucesso de integração;
- veículos sem atualização recente;
- clientes aguardando contato.

## 8. Não objetivos

- integração oficial real com todos os Detrans;
- operação financeira real em desenvolvimento;
- suportar regras de todos os estados;
- substituir órgão oficial;
- prometer emissão governamental real no projeto pessoal.
- tratar WhatsApp inbound com IA como requisito MVP;
- decidir neste documento se PartnerOrganization é Tenant;
- fechar modelo comercial B2B sem validação de negócio.

## 8.1 Open questions

- O tenant será a empresa despachante e PartnerOrganization uma organização atendida por ela?
- Quais parceiros terão billing mensal/postpaid, pay-per-request ou preço negociado por serviço?
- Quais documentos serão obrigatórios por serviço e por estado quando as regras forem detalhadas?


---

# 9. Inteligência Artificial — EMR Copilot

## Objetivo

O EMR Copilot reduz o custo cognitivo da operação.

Ele não substitui regras de negócio, reconciliação ou autorização.

Perguntas que deve responder:

- “Quais casos preciso priorizar hoje?”
- “Por que este pedido está parado?”
- “Quais pagamentos estão confirmados, mas ainda sem baixa?”
- “Quais clientes precisam de contato?”
- “Resuma o histórico deste cliente.”
- “O que aconteceu com este pagamento?”
- “Quais casos têm relação com timeout do DetranClient?”
- “Quais solicitações de parceiro estão aguardando ação?”
- “Resuma esta solicitação antes de eu responder ao parceiro.”

## Valor por persona

### Papel operacional separado
Removida como papel ativo do MVP. As capacidades operacionais pertencem ao ADMIN.

### Admin
- resumo de caso;
- resumo de solicitação;
- explicação de timeline;
- recomendação de próxima ação;
- rascunho de mensagem para parceiro/cliente;
- resumo diário;
- interpretação de indicadores;
- busca de divergências;
- análise de causas mais frequentes;
- perguntas sobre receita e volume.

### Proprietário
Chatbot restrito ao próprio contexto:
- explicar situação do veículo;
- explicar bloqueio;
- orientar próximo passo;
- explicar status do pedido.

### Parceiro
Sem chat amplo no escopo inicial. Qualquer experiência futura deve respeitar organization isolation e expor apenas solicitações/documentos autorizados da própria PartnerOrganization.

## Princípio

```text
Dados estruturados dizem O QUE aconteceu.
Regras dizem O QUE É permitido.
IA ajuda a explicar O QUE SIGNIFICA e O QUE FAZER A SEGUIR.
```

## IA não é fonte da verdade

O modelo nunca inventa:
- status;
- valor;
- vencimento;
- pagamento;
- multa;
- documento;
- decisão financeira.

Esses dados sempre vêm de tools autorizadas ou de documentos recuperados via RAG.
