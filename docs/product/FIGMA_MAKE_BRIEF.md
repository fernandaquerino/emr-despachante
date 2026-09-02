# EMR Despachante — Figma Make / Prototype Brief

## Objetivo

Criar um protótipo navegável de uma plataforma de despachante online com três perfis:
- proprietário;
- operadora;
- admin.

O foco principal visual deve ser a operação interna.

## Prioridade

### P0
1. Login
2. Dashboard Operacional
3. Casos
4. Detalhe do Caso
5. Clientes
6. Detalhe do Cliente
7. Veículos
8. Detalhe do Veículo
9. Dashboard Admin
10. Reconciliação Financeira

### P1
11. Meus Veículos
12. Detalhe da Multa
13. Checkout
14. Pedido / Tracking
15. Serviços e Preços
16. Operadoras
17. Detalhe da Operadora
18. Histórico
19. Auditoria

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


---

## IA no protótipo

Adicionar aos fluxos P1:

20. Copilot lateral na operação
21. Resumo IA no detalhe do caso
22. Resumo IA no dashboard admin
23. Chatbot do proprietário
24. Modal de confirmação de ação via IA

### Exemplos de conversa

**Operadora**
“Quais casos preciso priorizar hoje?”

**Admin**
“Por que os casos manuais aumentaram?”

**Proprietário**
“Meu pagamento já foi confirmado?”

### Regra visual
IA deve parecer integrada ao produto, não uma página genérica de chatbot.
