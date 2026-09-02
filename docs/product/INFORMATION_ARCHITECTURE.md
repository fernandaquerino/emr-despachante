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

Cadastro público cria somente OWNER. PARTNER entra por convite. ADMIN entra por provisionamento administrativo.

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

### Administração: operação interna + gestão

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
  /pedidos
  /pedidos/:id
  /pagamentos
  /pagamentos/:id
  /reconciliacao
  /reconciliacao/:id

  /financeiro
  /financeiro/reconciliacao
  /financeiro/reconciliacao/:id
  /financeiro/faturas
  /financeiro/faturas/:id

  /parceiros
  /parceiros/novo
  /parceiros/:id
  /servicos
  /servicos/:id
  /usuarios
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

## Navegação lateral — Admin

Admin concentra operação diária e gestão administrativa no MVP.

- Visão geral

OPERAÇÃO:
- Solicitações
- Cases
- Clientes
- Veículos

FINANCEIRO:
- Pedidos
- Pagamentos
- Reconciliação

GESTÃO:
- Parceiros
- Serviços e preços
- Usuários
- Auditoria
- Configurações

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

### Admin
Copilot é transversal e não precisa virar item principal da sidebar.

Acesso:
- botão no header;
- ações contextuais;
- possível rota futura para histórico.

### Proprietário
Chatbot acessível dentro de `/owner`.

### Parceiro
Sem chat amplo no escopo inicial. Ações futuras devem respeitar PartnerOrganization e esconder notas internas.

Resumo inteligente disponível em dashboard, reconciliação, solicitações e Cases.
