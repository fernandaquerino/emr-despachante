# EMR Despachante — Information Architecture

Este documento resume a arquitetura de informação do produto.

A fonte de verdade detalhada para rotas, telas, perfis de acesso e issue FE é [`../EMR-SCREEN-MAP.md`](../EMR-SCREEN-MAP.md).

## Áreas

### Área pública

```text
/
/consultar
/consultar/:id
/parceiros
/login
/cadastro
/recuperar-senha
/redefinir-senha/:token
/convite/:token
/selecionar-contexto
```

`/selecionar-contexto` é usado somente quando a mesma pessoa possui mais de um contexto autorizado.

Cadastro público cria somente OWNER. PARTNER, OPERATOR e ADMIN entram por convite/provisionamento.

### Área do proprietário

```text
/owner
  /veiculos
  /veiculos/novo
  /veiculos/:id
  /veiculos/:vehicleId/multas/:fineId
  /solicitacoes
  /solicitacoes/:id
  /documentos
  /pagamentos
  /pagamentos/:id

/checkout/:id
```

### Portal do parceiro

```text
/partner
  /solicitacoes
  /solicitacoes/nova
  /solicitacoes/:id
  /veiculos
  /veiculos/:id
  /documentos
  /equipe
  /financeiro
```

`/partner/financeiro` pode ficar como fase futura se billing B2B ainda não estiver decidido.

### Operação interna

```text
/ops
  /solicitacoes
  /solicitacoes/:id
  /casos
  /casos/:id
  /clientes
  /clientes/:id
  /veiculos
  /veiculos/:id
  /pedidos
  /pedidos/:id
  /pagamentos
  /pagamentos/:id
```

### Administração

```text
/admin
  /solicitacoes
  /solicitacoes/:id
  /casos
  /casos/:id
  /clientes
  /clientes/:id
  /veiculos
  /veiculos/:id

  /financeiro
  /financeiro/pedidos
  /financeiro/pedidos/:id
  /financeiro/pagamentos
  /financeiro/pagamentos/:id
  /financeiro/reconciliacao
  /financeiro/reconciliacao/:id
  /financeiro/faturas
  /financeiro/faturas/:id

  /parceiros
  /parceiros/novo
  /parceiros/:id
  /operadoras
  /operadoras/:id
  /servicos
  /servicos/:id
  /auditoria
  /configuracoes
```

`/admin/financeiro/faturas` e `/admin/financeiro/faturas/:id` são futuros e dependem de decisão de billing B2B.

### Transversal

```text
/conta
/configuracoes
Header/Popover: Notification Center
Header/Side panel: EMR Copilot
```

## Navegação lateral — Operadora

- Visão geral
- Trabalho
- Solicitações
- Casos
- Clientes
- Veículos
- Financeiro
- Pedidos
- Pagamentos

Quando existem exceções críticas, Cases devem manter grande protagonismo visual.

## Navegação lateral — Parceiro

- Visão geral
- Solicitações
- Veículos
- Documentos
- Equipe
- Financeiro, quando habilitado

CTA principal:
**+ Nova solicitação**

## Navegação lateral — Admin

- Dashboard
- Clientes
- Parceiros
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
Cliente / PartnerOrganization
  └── Veículos
       ├── Situação
       ├── Multas
       ├── Licenciamento
       ├── Solicitações
       ├── Pedidos
       ├── Pagamentos
       ├── Documentos
       ├── Cases
       └── Histórico
```

PartnerOrganization representa a empresa parceira atendida pelo despachante. Ela não deve ser modelada conceitualmente como Customer.

## Objetivo da arquitetura de informação

A pessoa deve conseguir chegar a qualquer problema por três caminhos:

1. pela **fila de solicitações**;
2. pela **busca global**;
3. pelo **cliente/parceiro/veículo**;
4. pela **fila de cases** quando houver exceção.

## Open questions

- O tenant será a empresa despachante e PartnerOrganization uma organização atendida por ela?
- Quais permissões específicas existirão dentro da equipe do parceiro?
- Quando billing B2B estiver habilitado, `/partner/financeiro` será acompanhamento de faturas, pagamentos ou ambos?


---

## IA na arquitetura de informação

### Operação interna
Copilot é transversal e não precisa virar item principal da sidebar.

Acesso:
- botão no header;
- ações contextuais;
- possível rota `/ops/copilot` futura para histórico.

### Proprietário
Chatbot acessível dentro de `/owner`.

### Parceiro
Sem chat amplo no escopo inicial. Ações futuras devem respeitar PartnerOrganization e esconder notas internas.

### Admin
Resumo inteligente disponível em:
- dashboard;
- reconciliação;
- casos.
