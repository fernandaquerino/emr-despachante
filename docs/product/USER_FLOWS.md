# EMR Despachante — User Flows

## Fluxo 1 — Proprietário: primeira consulta

```text
Landing
  ↓
Placa
  ↓
RENAVAM quando necessário
  ↓
Consulta
  ↓
Pendências
  ↓
Seleciona serviços
  ↓
Checkout
  ↓
Pagamento confirmado
  ↓
Processamento
  ↓
Acompanhamento
  ↓
Conclusão
```

## Fluxo 1A — Proprietário: conta e veículo

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

## Fluxo 1B — Parceiro cria solicitação

```text
Login
  ↓
Partner Dashboard
  ↓
Nova solicitação
  ↓
Veículo
  ↓
Serviço
  ↓
Documentos
  ↓
Observações
  ↓
Revisão
  ↓
Enviar
  ↓
ServiceRequest criado
  ↓
Acompanhar
```

## Fluxo 1C — Notificação de solicitação de parceiro

```text
Parceiro cria solicitação
  ↓
EMR cria ServiceRequest
  ↓
Notificação in-app
  ↓
WhatsApp outbound para responsável configurado
  ↓
Operadora abre deep link
  ↓
Autorização server-side
  ↓
Operadora trabalha solicitação
```

WhatsApp não é fonte da verdade e não envia documentos sensíveis.

## Fluxo 1D — ServiceRequest vira Case somente por exceção

```text
ServiceRequest
  ↓
Falha persistente / divergência / timeout esgotado
  ↓
Case criado
  ↓
Fila operacional de Cases
  ↓
Resolução da exceção
  ↓
ServiceRequest continua seu lifecycle
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
       └── falhas excedidas → Case manual
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

# Fluxo 8A — WhatsApp inbound futuro/discovery

```text
Parceiro envia mensagem no WhatsApp
  ↓
Sistema interpreta texto como draft
  ↓
Humano revisa placa, serviço, documentos e vínculo
  ↓
Confirma criação
  ↓
ServiceRequest criado no EMR
```

Não é requisito MVP.

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
