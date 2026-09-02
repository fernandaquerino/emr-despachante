# EMR Despachante — User Flows

## Fluxo 1 — Proprietário: primeira consulta

```text
Cadastro
  ↓
Cadastrar veículo
  ↓
Consultando situação
  ↓
Detalhe do veículo
  ├── Regular → fim
  └── Pendência
       ↓
      Serviço
```

## Fluxo 2 — Pagamento de multa

```text
Veículo
  ↓
Multas
  ↓
Detalhe da multa
  ↓
Pagar
  ↓
Checkout
  ↓
Payment = PENDING
  ↓
Webhook
  ├── failed → mostrar falha
  └── paid
       ↓
      Processando baixa
       ↓
      Worker
       ↓
      DetranClient
       ├── sucesso → Concluído
       └── falhas excedidas → Caso manual
```

## Fluxo 3 — Licenciamento bloqueado

```text
Veículo
  ↓
Licenciamento
  ↓
Solicitar
  ↓
Domain validation
  ↓
Existem multas?
  ├── Sim → bloqueado + CTA Ver multas
  └── Não → pagamento/licenciamento
```

## Fluxo 4 — Operadora assume caso

```text
Casos não atribuídos
  ↓
Abrir caso
  ↓
Assumir
  ↓
Conditional update
  ├── outra pessoa pegou → aviso + refresh
  └── sucesso
       ↓
      In progress
       ↓
      Nota/ação
       ↓
      Resolvido
```

## Fluxo 5 — Admin acompanha operação

```text
Admin Dashboard
  ↓
Indicador ruim
  ├── pagamentos → Reconciliação
  ├── casos → Fila consolidada
  ├── integração → Incidentes/casos
  └── operadoras → Gestão de equipe
```

## Fluxo 6 — Acompanhar cliente

```text
Busca global
  ↓
Cliente
  ↓
Detalhe cliente
  ├── Veículos
  ├── Pedidos
  ├── Pagamentos
  ├── Casos
  └── Histórico
```


---

# Fluxo 7 — Copilot prioriza casos

```text
Operadora abre Copilot
  ↓
“Quais casos devo priorizar?”
  ↓
listCases
  ↓
getCaseDetail top candidates
  ↓
Resposta explicada
  ↓
Abrir caso
```

# Fluxo 8 — IA gera mensagem

```text
Detalhe do caso
  ↓
Gerar mensagem
  ↓
RAG procedimento + dados do caso
  ↓
Draft
  ↓
Operadora revisa
  ↓
Confirma envio
```

# Fluxo 9 — Chatbot proprietário

```text
Cliente:
“Por que meu licenciamento está bloqueado?”
  ↓
getMyVehicleStatus
  ↓
getMyFines
  ↓
Resposta
  ↓
CTA Ver multas
```
