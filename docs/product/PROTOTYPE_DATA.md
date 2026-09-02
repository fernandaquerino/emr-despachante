# EMR Despachante — Prototype Data

## Clientes

Todos os dados abaixo são fictícios e servem apenas para prototipação.

### Mariana Alves
- Honda HR-V
- placa ABC1D23
- 2 multas abertas
- licenciamento bloqueado
- caso HIGH

### Carlos Souza
- Toyota Corolla
- placa DEF4G56
- pagamento PAID
- baixa PROCESSING há 26h
- caso CRITICAL

### Beatriz Lima
- VW T-Cross
- placa GHI7J89
- regular

### Rodrigo Martins
- Chevrolet Onix
- placa JKL2M34
- aguardando documento do cliente
- caso MEDIUM

## Usuários internos

### Ana Ribeiro
- ACTIVE
- 7 casos atuais
- 18 resolvidos na semana

### Paula Mendes
- ACTIVE
- 4 casos atuais
- 14 resolvidos

### Camila Torres
- INVITED

## Parceiros

### Auto Prime Santos
- tipo: loja de seminovos
- status: ACTIVE
- canal principal: Partner Portal
- WhatsApp outbound habilitado para notificações sem documentos sensíveis

Usuários fictícios:
- Marcos Pereira — gestor
- Julia Costa — vendas
- Ricardo Nunes — financeiro

### SR-4392
- Partner: Auto Prime Santos
- Solicitante: Marcos Pereira
- Veículo: Toyota Corolla · ABC1D23
- Serviço: Licenciamento 2026
- Status: Em andamento
- Origem: PARTNER_PORTAL
- Observação: cliente retira o veículo amanhã.

### SR-4393
- Partner: Auto Prime Santos
- Solicitante: Julia Costa
- Veículo: Honda HR-V · DEF4G56
- Serviço: Transferência
- Status: Aguardando documento
- Origem: PARTNER_PORTAL

### SR-4394
- Partner: Auto Prime Santos
- Solicitante: Ricardo Nunes
- Veículo: Chevrolet Onix · JKL2M34
- Serviço: Multas
- Status: Aguardando órgão
- Origem: PARTNER_PORTAL

## Dashboard admin
- Clientes ativos: 1.284
- Veículos ativos: 1.912
- Parceiros ativos: 18
- Solicitações B2C no mês: 842
- Solicitações B2B no mês: 316
- Solicitações por parceiro: Auto Prime Santos 42
- Valor processado mês: R$ 684.220
- Receita por taxa: R$ 73.840
- Casos abertos: 42
- Casos críticos: 6
- Taxa de automação: 91%
- DetranClient success: 94%

## Reconciliação
Payment PAY-8291
- local: PENDING
- provider: PAID
- idade: 3h
- precisa de atenção

Payment PAY-8292
- local: PAID
- provider: PAID
- submission: PROCESSING
- idade: 26h
