# EMR Despachante — Product Description

## 1. Visão

EMR Despachante é uma plataforma digital para uma empresa de despachante operar clientes, veículos e serviços veiculares em escala.

O produto tem dois lados:

1. **Cliente proprietário**
   - cadastra veículo;
   - consulta pendências;
   - solicita serviços;
   - inicia pagamentos;
   - acompanha andamento;
   - baixa documentos.

2. **Operação interna da empresa**
   - acompanha toda a base de clientes;
   - acompanha todos os veículos;
   - trabalha apenas os casos que exigem ação humana;
   - monitora pagamentos, falhas e pendências;
   - gerencia operadoras;
   - gerencia catálogo e preços;
   - acompanha receita e performance.

O produto segue a lógica de um despachante online: automatizar o caso simples e transformar exceções em uma fila operacional clara.

## 2. Problema

Sem uma plataforma central, a operação tende a ficar dividida entre:

- site de órgão;
- planilha;
- WhatsApp;
- comprovantes;
- e-mail;
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

### Para a operadora

> Receber uma fila clara do que precisa de ação humana, em vez de consultar tudo manualmente.

### Para o admin

> Enxergar clientes, veículos, serviços, receita, pagamentos, falhas e produtividade da operação inteira.

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

### OPERADORA

Pessoa da equipe que processa exceções.

Objetivos:
- saber quais casos são seus;
- pegar caso não atribuído;
- entender o histórico;
- executar ação manual;
- deixar nota;
- resolver;
- identificar cliente que precisa de contato.

### ADMIN

Dona/gestora do negócio.

Objetivos:
- acompanhar carteira de clientes;
- acompanhar receita e volume;
- acompanhar operação;
- identificar gargalos;
- gerenciar operadoras;
- configurar catálogo;
- acompanhar reconciliação;
- resolver escalonamentos.

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

## 7. Métricas de negócio

- clientes ativos;
- veículos ativos;
- pedidos por serviço;
- receita bruta;
- receita de taxa;
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

## Valor por persona

### Operadora
- resumo de caso;
- explicação de timeline;
- recomendação de próxima ação;
- busca conversacional na carteira;
- rascunho de mensagem para cliente.

### Admin
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
