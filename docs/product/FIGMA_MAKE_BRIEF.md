# EMR Despachante — Figma Make / Prototype Brief

## Objetivo

Criar um protótipo navegável de uma plataforma de despachante online com quatro perfis:
- proprietário;
- parceiro;
- operadora;
- admin.

O foco principal visual deve ser a operação interna e o Partner Portal como canal estruturado para solicitações B2B/B2B2C.

## Prioridade

### P0
1. Login
2. Dashboard Operacional
3. Solicitações da Operadora
4. Detalhe da Solicitação Operacional
5. Casos
6. Detalhe do Caso
7. Partner Dashboard
8. Nova Solicitação
9. Lista de Solicitações do Parceiro
10. Detalhe da Solicitação do Parceiro
11. Clientes
12. Detalhe do Cliente
13. Veículos
14. Detalhe do Veículo
15. Dashboard Admin
16. Admin — Parceiros
17. Admin — Partner Detail
18. Reconciliação Financeira

### P1
19. Meus Veículos
20. Detalhe da Multa
21. Checkout
22. Pedido / Tracking
23. Documentos/Pendências do Parceiro
24. Equipe do Parceiro
25. Serviços e Preços
26. Operadoras
27. Detalhe da Operadora
28. Histórico
29. Auditoria

## Direção de UI

- sidebar fixa em desktop;
- header com busca global;
- tabelas com dados realistas;
- filtros server-side representados na UI;
- badges com texto + cor;
- drawers para detalhe rápido;
- páginas para contexto completo;
- empty/loading/error/stale;
- cards relevantes clicáveis;
- timestamps de atualização;
- não transformar dashboard em decoração.
- não tratar toda solicitação como Case.

## Dataset fake

### Mariana Alves
Honda HR-V — ABC1D23
2 multas pendentes
Licenciamento bloqueado

### Carlos Souza
Toyota Corolla — DEF4G56
Pagamento confirmado
Baixa processando há 6h

### Beatriz Lima
VW T-Cross — GHI7J89
Regular

### Caso crítico
Pagamento confirmado, baixa não reconhecida há 26h.

### Caso alto
DetranClient falhou 3 vezes.

### Caso médio
Cliente precisa enviar documento complementar.

### Parceiro
Auto Prime Santos
Marcos Pereira — gestor
Julia Costa — vendas
Ricardo Nunes — financeiro

### Solicitação de parceiro
SR-4392
Toyota Corolla — ABC1D23
Licenciamento 2026
Status: Em andamento
Origem: PARTNER_PORTAL
Observação: cliente retira o veículo amanhã.

### Solicitação aguardando parceiro
SR-4393
Honda HR-V — DEF4G56
Transferência
Status: Aguardando documento
Origem: PARTNER_PORTAL

## Navegação obrigatória

Dashboard Operacional
→ Caso
→ Cliente
→ Veículo
→ Pedido

Dashboard Admin
→ Reconciliação
→ Pagamento
→ Caso

Clientes
→ Cliente
→ Veículo

Operadoras
→ Operadora

Proprietário
→ Veículo
→ Multa
→ Checkout
→ Pedido

Parceiro
→ Partner Dashboard
→ Nova solicitação
→ Veículo
→ Serviço
→ Documentos
→ Revisão
→ ServiceRequest criado
→ Acompanhamento

Operadora
→ Solicitações
→ Detalhe da solicitação
→ Case apenas se houver exceção


---

## IA no protótipo

Adicionar aos fluxos P1:

30. Copilot lateral na operação
31. Resumo IA no detalhe do caso
32. Resumo IA no detalhe da solicitação
33. Resumo IA no dashboard admin
34. Chatbot do proprietário
35. Modal de confirmação de ação via IA

### Exemplos de conversa

**Operadora**
“Quais casos preciso priorizar hoje?”

“Quais solicitações de parceiro estão aguardando ação?”

**Admin**
“Por que os casos manuais aumentaram?”

**Proprietário**
“Meu pagamento já foi confirmado?”

### Regra visual
IA deve parecer integrada ao produto, não uma página genérica de chatbot.

Não adicionar chat amplo para parceiro no protótipo sem requisito explícito.
