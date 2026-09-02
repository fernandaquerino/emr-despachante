# EMR Despachante — Information Architecture

## Áreas

### Área pública / proprietário

```text
/login
/cadastro

/app
  /veiculos
  /veiculos/:id
  /veiculos/:id/historico
  /pedidos/:id
  /checkout/:id
  /documentos
  /perfil
```

### Operação interna

```text
/ops
  /dashboard
  /casos
  /casos/:id
  /clientes
  /clientes/:id
  /veiculos
  /veiculos/:id
  /pedidos
  /pagamentos
```

### Administração

```text
/admin
  /dashboard
  /clientes
  /operadoras
  /servicos
  /casos
  /financeiro/reconciliacao
  /auditoria
  /configuracoes
```

## Navegação lateral — Operadora

- Visão geral
- Casos
- Clientes
- Veículos
- Pedidos
- Pagamentos

## Navegação lateral — Admin

- Dashboard
- Clientes
- Veículos
- Casos
- Pagamentos
- Reconciliação
- Serviços e preços
- Operadoras
- Auditoria
- Configurações

## Hierarquia operacional

```text
Cliente
  └── Veículos
       ├── Situação
       ├── Multas
       ├── Licenciamento
       ├── Pedidos
       ├── Pagamentos
       ├── Documentos
       ├── Casos
       └── Histórico
```

## Objetivo da arquitetura de informação

A pessoa deve conseguir chegar a qualquer problema por três caminhos:

1. pela **fila de casos**;
2. pela **busca global**;
3. pelo **cliente/veículo**.


---

## IA na arquitetura de informação

### Operação interna
Copilot é transversal e não precisa virar item principal da sidebar.

Acesso:
- botão no header;
- ações contextuais;
- possível rota `/ops/copilot` futura para histórico.

### Proprietário
Chatbot acessível dentro de `/app`.

### Admin
Resumo inteligente disponível em:
- dashboard;
- reconciliação;
- casos.
