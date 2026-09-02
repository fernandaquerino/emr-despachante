# EMR Despachante — AI Product Specification

## 1. Nome

**EMR Copilot**

## 2. Problema

A operação já possui dados suficientes para resolver muitos casos, mas uma operadora precisa navegar entre cliente, veículo, pagamento, caso e histórico para formar contexto.

A IA deve reduzir esse tempo.

Com Partner Portal, a IA também pode ajudar a operação a entender ServiceRequests de parceiros, mas sem transformar WhatsApp em fonte da verdade.

## 3. Casos de uso prioritários

### UC-AI-01 — Perguntar sobre a operação
“Quais casos críticos estão sem responsável?”

### UC-AI-02 — Explicar um caso
“Por que este caso está aberto?”

### UC-AI-03 — Resumir histórico
“Me dê o contexto deste cliente em 5 linhas.”

### UC-AI-04 — Próxima ação
“O que falta para este caso ser resolvido?”

### UC-AI-05 — Resumo da manhã
“O que mudou desde ontem?”

### UC-AI-06 — Procedimento interno
“O que fazemos quando o pagamento está confirmado e a baixa demora mais de 24h?”

### UC-AI-07 — Rascunho de comunicação
“Gere uma mensagem pedindo o documento faltante.”

### UC-AI-08 — Proprietário
“Por que meu licenciamento está bloqueado?”

### UC-AI-09 — Solicitação de parceiro
“Resuma esta solicitação e explique o que falta para avançar.”

### UC-AI-10 — Solicitações paradas
“Quais solicitações de parceiros estão aguardando ação há mais tempo?”

## 4. Fora do escopo inicial

- IA alterar banco via SQL;
- IA decidir reembolso sozinha;
- IA enviar mensagem sem revisão;
- IA confirmar pagamento;
- IA mudar status financeiro;
- IA diagnosticar fraude automaticamente.
- IA criar solicitação silenciosamente a partir de texto ambíguo;
- IA inventar placa ou serviço;
- IA atravessar PartnerOrganization;
- IA revelar notas internas para parceiro;
- WhatsApp inbound com IA como requisito MVP.

## 5. UX

### Operação
Copilot disponível como:
- botão no header;
- painel lateral;
- ações contextuais nas telas.

### Ações contextuais
No caso:
- ✨ Resumir caso
- ✨ Sugerir próxima ação
- ✨ Gerar mensagem

Na solicitação:
- Resumir solicitação
- Explicar pendência
- Gerar mensagem para parceiro

No dashboard:
- ✨ Resumir operação

No cliente:
- ✨ Resumir histórico

### Proprietário
Chatbot separado, visualmente mais simples e com escopo reduzido.

### Parceiro
Não adicionar chat com acesso amplo sem requisito explícito. Qualquer evolução deve expor apenas dados autorizados da própria PartnerOrganization.

## 6. Métricas

- AI weekly active operators;
- case summary usage;
- recommendation acceptance;
- time-to-understand-case;
- message draft usage;
- partner request summary usage;
- tool error rate;
- AI fallback rate;
- hallucination/factuality failures em evals;
- custo por sessão.
