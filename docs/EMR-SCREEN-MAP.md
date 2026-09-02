# EMR Despachantes — Mapa completo de telas

> Baseline de produto para o milestone **M0.2 — Product Prototype** antes do System Design.

## 1. Princípios de navegação

O EMR possui uma única marca e uma única autenticação, mas três contextos autenticados no MVP:

```text
OWNER
PARTNER
ADMIN
```

O usuário **não escolhe o papel no login**.

```text
/login
  ↓
autenticação
  ↓
backend resolve memberships / permissões
  ↓
OWNER    → /owner
PARTNER  → /partner
ADMIN    → /admin
```

Caso um mesmo usuário possua mais de um contexto autorizado:

```text
/login
  ↓
/selecionar-contexto
  ↓
área escolhida
```

Cadastro público cria somente `OWNER`.

`PARTNER` entra através de convite. `ADMIN` entra por provisionamento administrativo.

---

# 2. Área pública

## 2.1 Landing

**Rota**

```text
/
```

**Tela**

`Landing pública`

**Objetivo**

Apresentar o EMR e iniciar a principal jornada B2C sem exigir cadastro antecipado.

**Conteúdo**

- Header público
- Logo EMR Despachantes
- Como funciona
- Serviços
- Para empresas/parceiros
- Entrar
- CTA `Consultar veículo`
- Hero com consulta por placa
- Benefícios
- Serviços principais
- Como funciona
- Confiança/segurança
- FAQ resumido
- CTA final
- Footer
- Privacidade
- Termos

**Status**

`CRIAR / NÃO ESTÁ COBERTA ADEQUADAMENTE NO PROTÓTIPO ATUAL`

---

## 2.2 Consulta inicial por placa

**Rota sugerida**

```text
/consultar
```

Pode também começar diretamente no hero da `/`.

**Tela**

`Consulta do veículo`

**Conteúdo**

- Placa
- validação
- loading
- veículo não encontrado
- consulta indisponível
- necessidade de RENAVAM quando aplicável

**Autenticação**

Não obrigatória para a consulta inicial segura.

**Status**

`CRIAR`

---

## 2.3 Resultado da consulta pública

**Rota sugerida**

```text
/consultar/:id
```

ou estado navegável da própria `/consultar`.

**Tela**

`Resultado da consulta`

**Conteúdo**

- veículo identificado
- situação resumida
- multas
- licenciamento
- IPVA
- outras pendências disponíveis
- última atualização
- serviços que podem ser contratados
- CTA `Resolver pendências`

**Regra**

Não expor PII apenas porque alguém conhece a placa.

**Status**

`CRIAR`

---

## 2.4 Seleção de serviços

**Rota sugerida**

```text
/consultar/:id/servicos
```

Pode ser etapa do resultado em vez de rota própria.

**Tela**

`Selecionar serviços`

**Conteúdo**

- serviços elegíveis
- valores conhecidos
- taxa de serviço
- bloqueios
- documentos necessários quando já conhecidos
- resumo da seleção
- CTA continuar

**Status**

`CRIAR / pode ser incorporada ao resultado`

---

## 2.5 Gate de autenticação

Após selecionar o que deseja resolver:

```text
Resolver pendências
        ↓
Entrar ou criar conta
```

Não é necessário criar uma página diferente se o Login/Cadastro já cobrirem a experiência.

---

## 2.6 Para empresas

**Rota sugerida**

```text
/parceiros
```

**Tela**

`Landing B2B / Para empresas`

**Objetivo**

Explicar o Portal do Parceiro.

**Conteúdo**

- proposta de valor B2B
- solicitação estruturada
- documentos
- acompanhamento
- redução da dependência do WhatsApp
- CTA `Já sou parceiro`
- CTA comercial `Quero ser parceiro`

`Quero ser parceiro` não cria uma conta Partner automaticamente.

**Status**

`RECOMENDADA`

---

## 2.7 Solicitação comercial de parceria

**Rota sugerida**

```text
/parceiros/contato
```

ou formulário/modal dentro de `/parceiros`.

**Tela**

`Quero ser parceiro`

**Campos candidatos**

- empresa
- CNPJ
- nome
- e-mail
- telefone
- mensagem

**Resultado**

Lead comercial, não `PartnerOrganization` ativa.

**Status**

`P1 / pode ser futuro`

---

# 3. Autenticação e acesso

## 3.1 Login único

**Rota**

```text
/login
```

**Acesso**

OWNER, PARTNER, ADMIN.

**Tela**

`Entrar`

**Conteúdo**

- e-mail
- senha
- entrar
- recuperar senha
- criar conta

**Regra**

`Criar conta` significa criar uma conta de cliente/OWNER.

Não mostrar seletor:

```text
Cliente
Parceiro
Operador
Admin
```

**Status**

`COBERTA, MAS PRECISA SER ALINHADA À REGRA DE LOGIN ÚNICO`

---

## 3.2 Cadastro público

**Rota**

```text
/cadastro
```

**Tela**

`Criar minha conta`

**Cria**

```text
OWNER
```

**Conteúdo**

- nome
- CPF quando necessário
- e-mail
- telefone
- senha
- confirmar senha
- termos

**Status**

`COBERTA`

---

## 3.3 Recuperar senha

**Rota sugerida**

```text
/recuperar-senha
```

**Status**

`PRECISA ESTAR NO MAPA`

---

## 3.4 Redefinir senha

**Rota sugerida**

```text
/redefinir-senha/:token
```

**Status**

`PRECISA ESTAR NO MAPA`

---

## 3.5 Ativação por convite

Usada por Partner e Operator.

**Rota sugerida**

```text
/convite/:token
```

**Tela**

`Aceitar convite / Ativar acesso`

**Estados**

- válido
- expirado
- já utilizado
- inválido
- usuário já ativado

**Status**

`COBERTA para Partner e Admin`

---

## 3.6 Seleção de contexto

Somente quando uma pessoa possui mais de um contexto autorizado.

**Rota sugerida**

```text
/selecionar-contexto
```

**Exemplo**

```text
EMR Despachantes
Administração

Auto Prime Santos
Portal do Parceiro
```

**Status**

`P1 / depende de membership model no System Design`

---

# 4. OWNER — Minha área

Prefixo recomendado:

```text
/owner
```

> Substitui a nomenclatura antiga `/app` para deixar o contexto mais explícito.

## Navegação principal

```text
Minha área
Meus veículos
Solicitações
Documentos
Pagamentos
```

Menu do usuário:

```text
Minha conta
Configurações
Sair
```

---

## 4.1 Minha área

**Rota**

```text
/owner
```

ou:

```text
/owner/dashboard
```

Recomendação: usar `/owner`.

**Tela**

`Minha área`

**Pergunta principal**

> O que está acontecendo com meus veículos e existe algo que eu preciso fazer?

**Conteúdo**

- saudação
- pendências que exigem ação
- veículos
- serviços em andamento
- solicitações recentes
- últimas atualizações
- CTA consultar/adicionar veículo

**Não usar**

- gráficos decorativos
- KPIs empresariais
- métricas sem ação

**Status**

`EXPANDIR US-PT-009`

---

## 4.2 Meus veículos

**Rota**

```text
/owner/veiculos
```

**Tela**

`Meus veículos`

**Conteúdo**

- veículos vinculados
- situação resumida
- serviço em andamento
- próxima ação
- CTA consultar/adicionar veículo

**Estados**

- sem veículo
- loading
- error
- stale

**Status**

`COBERTA parcialmente`

---

## 4.3 Adicionar/consultar veículo

**Rota sugerida**

```text
/owner/veiculos/novo
```

Pode reutilizar o fluxo público de consulta.

**Status**

`COBERTA conceitualmente`

---

## 4.4 Detalhe do veículo

**Rota**

```text
/owner/veiculos/:id
```

**Tela**

`Detalhe do veículo`

**Conteúdo**

- resumo
- situação geral
- multas
- licenciamento
- IPVA
- serviços em andamento
- documentos relacionados
- histórico
- nova consulta

**Status**

`COBERTA`

---

## 4.5 Detalhe da multa

**Rota sugerida**

```text
/owner/veiculos/:vehicleId/multas/:fineId
```

**Tela**

`Detalhe da multa`

**Conteúdo**

- descrição
- valor
- vencimento
- situação
- elegibilidade
- selecionar para regularização

**Status**

`COBERTA`

---

## 4.6 Minhas solicitações

**Rota**

```text
/owner/solicitacoes
```

**Tela**

`Minhas solicitações`

**Conteúdo**

- serviço
- veículo
- status
- última atualização
- ação pendente
- concluídas
- canceladas

**Status**

`CRIAR/EXPANDIR US-PT-009`

---

## 4.7 Acompanhamento da solicitação

**Rota**

```text
/owner/solicitacoes/:id
```

**Tela**

`Acompanhar serviço`

**Esta é uma das telas mais importantes do B2C.**

**Conteúdo**

- serviço
- veículo
- status atual
- stepper/timeline
- próxima etapa
- ação necessária do proprietário
- pagamento
- documentos
- histórico

Exemplo:

```text
✓ Solicitação recebida
✓ Pagamento confirmado
✓ Documentos recebidos
● Processando junto ao órgão
○ Regularização concluída
```

**Regra**

```text
Payment = PAID
≠
ServiceRequest = COMPLETED
```

**Status**

`CRIAR/EXPANDIR US-PT-009`

---

## 4.8 Documentos

**Rota**

```text
/owner/documentos
```

**Tela**

`Meus documentos`

**Conteúdo**

- documentos por veículo/solicitação
- pendentes
- recebidos
- rejeitados quando aplicável
- upload
- substituir
- download autorizado

**Status**

`COBERTA parcialmente`

---

## 4.9 Pagamentos

**Rota**

```text
/owner/pagamentos
```

**Tela**

`Meus pagamentos`

**Conteúdo**

- serviço
- veículo
- valor
- status
- data
- comprovante
- pagamento pendente
- failed/expired quando aplicável

**Status**

`CRIAR/EXPANDIR`

---

## 4.10 Detalhe do pagamento

**Rota**

```text
/owner/pagamentos/:id
```

**Tela**

`Detalhe do pagamento`

**Conteúdo**

```text
Valor do órgão
Taxa EMR
Descontos
Total

Status do pagamento
Data de confirmação
Método
Comprovante
```

Separar visualmente:

```text
Pagamento
✓ Confirmado

Regularização
● Em processamento
```

**Status**

`CRIAR/EXPANDIR`

---

## 4.11 Checkout

**Rota**

```text
/checkout/:id
```

ou:

```text
/owner/checkout/:id
```

Recomendação: manter checkout como fluxo próprio, acessível após autenticação.

**Estados**

- pending
- provider loading
- failed
- expired
- conflito de pagamento já em andamento
- success redirect

**Status**

`COBERTA por US-PT-006`

---

# 5. PARTNER — Portal do Parceiro

Prefixo:

```text
/partner
```

## Navegação

```text
Visão geral
Solicitações
Veículos
Documentos
Equipe
Financeiro (quando habilitado)
```

CTA global:

```text
+ Nova solicitação
```

---

## 5.1 Dashboard do Parceiro

**Rota**

```text
/partner
```

ou:

```text
/partner/dashboard
```

Recomendação: `/partner`.

**Tela**

`Visão geral`

**Conteúdo**

- em andamento
- aguardando ação do parceiro
- concluídas recentemente
- pendências
- solicitações recentes
- última atualização
- CTA nova solicitação

**Status**

`COBERTA por US-PRT-003`

---

## 5.2 Solicitações

**Rota**

```text
/partner/solicitacoes
```

**Tela**

`Solicitações`

**Conteúdo**

- busca por placa
- busca por ID
- filtros
- veículo
- serviço
- solicitante
- status
- última atualização
- ação pendente

**Status**

`COBERTA por US-PRT-005`

---

## 5.3 Nova solicitação

**Rota**

```text
/partner/solicitacoes/nova
```

**Tela**

`Nova solicitação`

**Wizard**

```text
1. Veículo
2. Serviço
3. Documentos
4. Observações
5. Revisão
6. Enviar
```

**Status**

`COBERTA por US-PRT-004`

---

## 5.4 Detalhe da solicitação

**Rota**

```text
/partner/solicitacoes/:id
```

**Tela**

`Acompanhar solicitação`

**Conteúdo**

- identificação
- veículo
- serviço
- solicitante
- status
- timeline partner-safe
- documentos
- pendência
- histórico
- próxima ação

**Nunca mostrar**

- stack trace
- nota interna
- retry técnico
- dados de outra organização

**Status**

`COBERTA`

---

## 5.5 Veículos do parceiro

**Rota**

```text
/partner/veiculos
```

**Tela**

`Veículos`

**Conteúdo**

- placa
- modelo
- solicitações
- situação
- última atividade
- busca/filtro

**Status**

`PREVISTA, precisa detalhamento de protótipo`

---

## 5.6 Detalhe do veículo do parceiro

**Rota**

```text
/partner/veiculos/:id
```

**Tela**

`Veículo`

**Conteúdo**

- contexto permitido
- solicitações relacionadas
- documentos
- histórico autorizado

**Status**

`PREVISTA`

---

## 5.7 Documentos

**Rota**

```text
/partner/documentos
```

**Tela**

`Documentos e pendências`

Pode servir como visão consolidada além dos documentos dentro da solicitação.

**Conteúdo**

- pendências
- enviados
- rejeitados
- solicitar/substituir
- filtro por veículo/request

**Status**

`COBERTA por US-PRT-015 / PRT-009`

---

## 5.8 Equipe

**Rota**

```text
/partner/equipe
```

**Tela**

`Equipe`

**Conteúdo**

- usuários
- role
- status
- último acesso quando permitido
- convite
- reenviar convite
- suspender/remover
- permission state

**Status**

`PREVISTA / precisa protótipo mais explícito`

---

## 5.9 Convidar membro

Preferência inicial:

```text
Modal/Drawer dentro de /partner/equipe
```

Não precisa de rota própria.

**Status**

`PREVISTA`

---

## 5.10 Financeiro do parceiro

**Rota**

```text
/partner/financeiro
```

**Status**

`FUTURO / somente quando billing B2B estiver definido`

Possíveis telas futuras:

```text
Visão geral
Faturas
Detalhe da fatura
Serviços faturados
Comprovantes
```

---

# 6. ADMIN — Operação

Prefixo:

```text
/admin
```

## Navegação recomendada

```text
Visão geral

Trabalho
- Solicitações
- Casos
- Clientes
- Veículos

Financeiro
- Pedidos
- Pagamentos
```

---

## 6.1 Dashboard Operacional

**Rota**

```text
/admin
```

ou:

```text
/admin/dashboard
```

Recomendação: `/admin`.

**Tela**

`Visão geral`

**Conteúdo**

- trabalho que precisa de atenção
- solicitações novas/atrasadas
- Cases críticos
- Cases sem responsável
- pendências
- itens aguardando cliente/parceiro/órgão
- atividade recente
- Copilot

**Status**

`COBERTA por US-PT-002, mas precisa refletir ServiceRequests`

---

## 6.2 Solicitações

**Rota**

```text
/admin/solicitacoes
```

**Tela**

`Solicitações`

**Conteúdo**

- novas
- em andamento
- aguardando parceiro
- aguardando cliente
- aguardando órgão
- concluídas
- busca
- filtros
- source
- PartnerOrganization quando aplicável
- solicitante
- veículo
- serviço
- status
- próxima ação

**Status**

`COBERTA por US-PT-016`

---

## 6.3 Detalhe da solicitação

**Rota**

```text
/admin/solicitacoes/:id
```

**Tela**

`Detalhe da solicitação`

**Conteúdo**

- próxima ação
- cliente
- veículo
- parceiro
- serviço
- pagamento
- processamento
- documentos
- timeline
- Case relacionado quando existir

**Status**

`COBERTA por US-PT-016`

---

## 6.4 Casos

**Rota**

```text
/admin/casos
```

**Tela**

`Casos`

**Views**

- Meus casos
- Não atribuídos
- Todos quando autorizado

**Conteúdo**

- prioridade
- status
- motivo
- age
- responsável

**Status**

`COBERTA por US-PT-003`

---

## 6.5 Detalhe do Case

**Rota**

```text
/admin/casos/:id
```

**Tela**

`Case`

**Conteúdo**

- motivo
- prioridade
- responsável
- próxima ação
- contexto cliente
- veículo
- pagamento
- ServiceRequest relacionado
- Submission
- timeline
- notas internas
- assumir
- status
- resolver
- escalar
- Copilot

**Status**

`COBERTA`

---

## 6.6 Clientes

**Rota**

```text
/admin/clientes
```

**Tela**

`Clientes`

**Conteúdo**

- cards de resumo
- busca
- filtros
- tabela
- próxima ação
- paginação

**Status**

`COBERTA por US-PT-004`

---

## 6.7 Detalhe do cliente

**Rota**

```text
/admin/clientes/:id
```

**Tela**

`Cliente`

**Tabs**

```text
Visão geral
Veículos
Solicitações/Pedidos
Pagamentos
Casos
Documentos
Histórico
Notas
```

Recomendação: atualizar `Pedidos` para refletir também `Solicitações`, sem fundir conceitos.

**Status**

`COBERTA`

---

## 6.8 Veículos

**Rota**

```text
/admin/veiculos
```

**Tela**

`Veículos`

**Status**

`COBERTA por US-PT-005`

---

## 6.9 Detalhe do veículo

**Rota**

```text
/admin/veiculos/:id
```

**Tela**

`Veículo`

**Conteúdo**

- situação geral
- stale timestamp
- multas
- multa detalhe
- licenciamento
- pedidos
- ServiceRequests
- pagamentos
- documentos
- Cases
- histórico

**Status**

`COBERTA`

---

## 6.10 Pedidos

**Rota**

```text
/admin/pedidos
```

**Tela**

`Pedidos`

**Conteúdo**

- order
- cliente
- veículo
- itens
- total
- status comercial
- payment relacionado
- ServiceRequests relacionados

**Status**

`PREVISTA na IA, protótipo ainda precisa detalhamento próprio`

---

## 6.11 Detalhe do pedido

**Rota recomendada**

```text
/admin/pedidos/:id
```

**Status**

`CRIAR`

---

## 6.12 Pagamentos

**Rota**

```text
/admin/pagamentos
```

**Tela**

`Pagamentos`

**Conteúdo**

- Payment ID
- Order
- cliente
- valor
- status local
- provider status
- confirmedAt
- divergência

**Status**

`PREVISTA, precisa protótipo mais explícito`

---

## 6.13 Detalhe do pagamento

**Rota recomendada**

```text
/admin/pagamentos/:id
```

**Conteúdo**

- breakdown
- provider reference
- eventos
- status
- timestamps
- ServiceRequest
- divergência
- Case relacionado

**Status**

`CRIAR`

---

# 7. ADMIN — Administração

Prefixo:

```text
/admin
```

## Navegação recomendada

```text
Visão geral

Operação
- Solicitações
- Casos
- Clientes
- Veículos

Financeiro
- Pedidos
- Pagamentos
- Reconciliação
- Faturamento B2B (futuro)

Gestão
- Parceiros
- Serviços e preços
- Usuários internos
- Auditoria
- Configurações
```

Admin pode reutilizar componentes de Operação, mas possui escopo e ações maiores.

---

## 7.1 Dashboard Admin

**Rota**

```text
/admin
```

ou:

```text
/admin/dashboard
```

Recomendação: `/admin`.

**Tela**

`Visão geral`

**Conteúdo**

- financeiro
- operação
- receita
- volume por serviço
- gargalos
- problemas que exigem atenção
- atividade recente
- filtro de período
- Copilot/resumo

**Status**

`COBERTA por US-PT-007`

---

# 8. ADMIN — Financeiro

Essa área precisa ficar mais explícita no protótipo.

## 8.1 Visão geral financeira

**Rota recomendada**

```text
/admin/financeiro
```

**Tela**

`Financeiro`

**Conteúdo**

- valor processado
- taxas de serviço
- receita
- refunds
- pagamentos pendentes
- divergências
- reconciliação pendente

**Regra**

```text
valor processado
≠
receita
```

**Status**

`CRIAR — GAP ATUAL`

---

## 8.2 Pedidos

**Rota**

```text
/admin/financeiro/pedidos
```

ou manter:

```text
/admin/pedidos
```

Recomendação: agrupar visualmente em Financeiro.

**Tela**

`Pedidos`

**Status**

`CRIAR/DETALHAR`

---

## 8.3 Detalhe do pedido

**Rota**

```text
/admin/financeiro/pedidos/:id
```

**Status**

`CRIAR`

---

## 8.4 Pagamentos

**Rota**

```text
/admin/financeiro/pagamentos
```

**Tela**

`Pagamentos`

**Status**

`CRIAR/DETALHAR`

---

## 8.5 Detalhe do pagamento

**Rota**

```text
/admin/financeiro/pagamentos/:id
```

**Status**

`CRIAR`

---

## 8.6 Reconciliação

**Rota**

```text
/admin/financeiro/reconciliacao
```

**Tela**

`Reconciliação`

**Conteúdo**

- Payment local
- provider
- divergência
- valor
- age
- ação
- filtro

**Status**

`COBERTA por US-PT-006`

---

## 8.7 Detalhe da divergência

Pode ser:

```text
/admin/financeiro/reconciliacao/:id
```

ou Drawer.

**Conteúdo**

- estado local
- estado provider
- eventos
- timeline
- investigação
- criar/abrir Case

**Status**

`COBERTA como Drawer, rota opcional`

---

## 8.8 Faturamento B2B

**Rota futura**

```text
/admin/financeiro/faturas
```

**Status**

`FUTURO / após decisão de billing`

---

## 8.9 Detalhe da fatura B2B

**Rota futura**

```text
/admin/financeiro/faturas/:id
```

**Status**

`FUTURO`

---

# 9. ADMIN — Parceiros

## 9.1 Parceiros

**Rota**

```text
/admin/parceiros
```

**Tela**

`Parceiros`

**Conteúdo**

- lista
- busca
- filtros
- status
- volume
- pendências
- último movimento

**Status**

`COBERTA por US-PRT-010`

---

## 9.2 Detalhe do parceiro

**Rota**

```text
/admin/parceiros/:id
```

**Tela**

`PartnerOrganization`

**Seções/tabs**

```text
Visão geral
Usuários
Solicitações
Volume
Pendências
Serviços habilitados
Preços
Notificações
Auditoria
Financeiro (quando habilitado)
```

**Status**

`COBERTA por US-PRT-010`

---

## 9.3 Criar parceiro

Pode ser:

```text
/admin/parceiros/novo
```

ou modal.

**Status**

`PRECISA SER REPRESENTADA`

---

## 9.4 Convidar primeiro usuário Partner

Preferência:

Modal/Drawer dentro do Partner Detail.

**Status**

`COBERTA pelo fluxo PRT-014`

---

# 10. ADMIN — Serviços e preços

## 10.1 Serviços

**Rota**

```text
/admin/servicos
```

**Tela**

`Serviços e preços`

**Conteúdo**

- catálogo
- preço
- status
- regras
- ativar/desativar

**Status**

`COBERTA por US-PT-008`

---

## 10.2 Detalhe/Editar serviço

**Rota sugerida**

```text
/admin/servicos/:id
```

ou Drawer.

**Status**

`COBERTA conceitualmente`

---

# 11. ADMIN — Usuários internos

## 11.1 Usuários internos

**Rota**

```text
/admin/usuarios
```

**Tela**

`Usuários internos`

**Conteúdo**

- lista
- status
- carga
- convidar
- suspender/reactivar

**Status**

`COBERTA por US-PT-008`

---

## 11.2 Detalhe do usuário interno

**Rota**

```text
/admin/usuarios/:id
```

**Status**

`COBERTA`

---

## 11.3 Provisionar admin interno

Preferência:

Modal dentro de `/admin/usuarios`.

**Status**

`COBERTA`

---

# 12. ADMIN — Auditoria

## 12.1 Audit log

**Rota**

```text
/admin/auditoria
```

**Tela**

`Auditoria`

**Conteúdo**

- ator
- ação
- recurso
- data
- filtros
- tenant/org quando permitido
- correlation

**Regra**

Audit não possui editar/excluir.

**Status**

`COBERTA`

---

# 13. Configurações administrativas

## 13.1 Configurações do produto/tenant

**Rota**

```text
/admin/configuracoes
```

**Tela**

`Configurações administrativas`

**Possíveis seções**

- organização
- dados do despachante
- notificações
- regras operacionais
- integrações quando aplicável
- preferências de negócio
- segurança

Não misturar com preferências pessoais do usuário.

**Status**

`PRECISA DETALHAMENTO`

---

# 14. Conta e configurações pessoais — transversal

Em vez de duplicar tela em cada role, pode existir um módulo transversal.

## 14.1 Minha conta

**Rota recomendada**

```text
/conta
```

ou preservar um route group interno por contexto.

**Tela**

`Minha conta`

**Conteúdo**

- nome
- e-mail
- telefone
- avatar
- organização/contexto
- role informativa
- alterar dados

**Status**

`COBERTA por US-PT-012`

---

## 14.2 Segurança

Pode ser tab da Minha conta.

**Conteúdo**

- alterar senha
- sessões/dispositivos
- reautenticação
- MFA quando aplicável

**Status**

`COBERTA conceitualmente`

---

## 14.3 Configurações pessoais

**Rota recomendada**

```text
/configuracoes
```

**Conteúdo**

- preferências pessoais
- notificações
- canal
- acessibilidade quando aplicável

**Status**

`COBERTA por US-PT-012`

---

# 15. Notificações

Preferência:

```text
Notification Center
```

como Drawer/Popover no header, não uma tela principal.

**Conteúdo**

- não lidas
- recentes
- deep link
- marcar como lida
- empty
- failure

Pode existir rota futura:

```text
/notificacoes
```

somente se o volume justificar.

**Status**

`PARCIALMENTE COBERTA NO APP SHELL`

---

# 16. Busca global

Preferência:

Overlay/Command/Search results no header.

Busca por:

- cliente
- placa
- solicitação
- Case
- pedido
- pagamento

**Status**

`COBERTA NO APP SHELL / precisa atualizar para ServiceRequest + Partner`

---

# 17. EMR Copilot

O Copilot não precisa ser item principal de navegação.

## Operação/Admin

Acesso por:

```text
Header
Ações contextuais
Side panel
```

**Estados**

- fechado
- aberto
- suggested prompts
- loading/streaming
- tool result
- partial tool failure
- RAG references
- write confirmation
- unavailable

**Status**

`COBERTA por US-PT-010`

---

## 17.1 Confirmação de ação da IA

Modal/Card transversal.

Exemplo:

```text
Alterar Case para WAITING_EXTERNAL?

[ Confirmar ] [ Cancelar ]
```

**Status**

`COBERTA`

---

## 17.2 Chat do OWNER

Chat simplificado dentro da área do proprietário.

Não precisa ter rota exclusiva no MVP.

**Status**

`COBERTA conceitualmente`

---

# 18. Estados globais obrigatórios

As páginas relevantes devem prever:

```text
Loading
Empty
Error
Partial failure
Stale
Permission denied
Not found
Offline/degraded quando útil
```

Também precisam existir:

```text
403
404
500/falha inesperada
```

como experiências coerentes.

---

# 19. Mapa consolidado de rotas

```text
PUBLIC
/
├── /consultar
├── /consultar/:id
├── /parceiros
├── /parceiros/contato              P1
├── /login
├── /cadastro
├── /recuperar-senha
├── /redefinir-senha/:token
├── /convite/:token
├── /selecionar-contexto            P1
├── /privacidade
└── /termos


OWNER
/owner
├── /veiculos
│   ├── /novo
│   └── /:id
│       └── /multas/:fineId
├── /solicitacoes
│   └── /:id
├── /documentos
└── /pagamentos
    └── /:id

CHECKOUT
/checkout/:id


PARTNER
/partner
├── /solicitacoes
│   ├── /nova
│   └── /:id
├── /veiculos
│   └── /:id
├── /documentos
├── /equipe
└── /financeiro                     FUTURO
    ├── /faturas
    └── /faturas/:id


ADMIN
/admin
├── /solicitacoes
│   └── /:id
├── /casos
│   └── /:id
├── /clientes
│   └── /:id
├── /veiculos
│   └── /:id
│
├── /financeiro
│   ├── /pedidos
│   │   └── /:id
│   ├── /pagamentos
│   │   └── /:id
│   ├── /reconciliacao
│   │   └── /:id                    opcional
│   └── /faturas                    FUTURO
│       └── /:id
│
├── /parceiros
│   ├── /novo                       opcional/modal
│   └── /:id
├── /servicos
│   └── /:id
├── /usuarios
│   └── /:id
├── /auditoria
└── /configuracoes


TRANSVERSAL
/conta
/configuracoes
```

---

# 20. Telas que eu considero obrigatórias no M0.2 antes do System Design

## Público

```text
Landing
Consulta por placa
Resultado da consulta
Login
Cadastro OWNER
```

## OWNER

```text
Minha área
Meus veículos
Detalhe do veículo
Minhas solicitações
Acompanhamento da solicitação
Documentos
Pagamentos
Checkout
```

## PARTNER

```text
Dashboard
Solicitações
Nova solicitação
Detalhe da solicitação
Documentos/pendências
Equipe
Convite/primeiro acesso
```

## ADMIN

```text
Dashboard
Solicitações
Detalhe da solicitação
Casos
Detalhe do Case
Clientes
Detalhe do cliente
Veículos
Detalhe do veículo
Pedidos
Pagamentos
```

## ADMIN

```text
Dashboard
Financeiro
Pedidos
Pagamentos
Reconciliação
Parceiros
Detalhe do parceiro
Serviços e preços
Usuários internos
Auditoria
Configurações
```

## Transversal

```text
Minha conta
Configurações pessoais
Notification Center
Copilot
```

---

# 21. Matriz rota, acesso e issue FE

Esta matriz é a fonte de verdade para produto, protótipo e implementação frontend.

## PUBLIC

| Rota | Tela | Acesso | Issue FE | MVP |
| --- | --- | --- | --- | --- |
| `/` | Landing pública | PUBLIC | `FE-PUB-001` | Sim |
| `/consultar` | Consulta do veículo | PUBLIC | `FE-PUB-002` | Sim |
| `/consultar/:id` | Resultado da consulta / seleção de serviços | PUBLIC | `FE-PUB-003` | Sim |
| `/parceiros` | Landing B2B / Para empresas | PUBLIC | `FE-PUB-001` | Sim |
| `/parceiros/contato` | Quero ser parceiro | PUBLIC | Futuro/lead comercial | Não |
| `/login` | Login único | PUBLIC | `FE-AUTH-001` | Sim |
| `/cadastro` | Cadastro OWNER | PUBLIC | `FE-AUTH-002` | Sim |
| `/recuperar-senha` | Recuperar senha | PUBLIC | `FE-AUTH-003` | P1 |
| `/redefinir-senha/:token` | Redefinir senha | PUBLIC | `FE-AUTH-003` | P1 |
| `/convite/:token` | Aceitar convite / Ativar acesso | PUBLIC com token | `FE-AUTH-004` | Sim |
| `/selecionar-contexto` | Seleção de contexto | Usuário autenticado com múltiplos contextos | `FE-AUTH-004` | P1 |
| `/privacidade` | Privacidade | PUBLIC | `FE-PUB-001` | Sim |
| `/termos` | Termos | PUBLIC | `FE-PUB-001` | Sim |

## OWNER

| Rota | Tela | Acesso | Issue FE | MVP |
| --- | --- | --- | --- | --- |
| `/owner` | Minha área | OWNER | `FE-OWN-001` | Sim |
| `/owner/veiculos` | Meus veículos | OWNER | `FE-OWN-002` | Sim |
| `/owner/veiculos/novo` | Adicionar/consultar veículo | OWNER | `FE-OWN-002` | Sim |
| `/owner/veiculos/:id` | Detalhe do veículo | OWNER | `FE-OWN-002` | Sim |
| `/owner/veiculos/:vehicleId/multas/:fineId` | Detalhe da multa | OWNER | `FE-OWN-003` | Sim |
| `/owner/solicitacoes` | Minhas solicitações | OWNER | `FE-OWN-004` | Sim |
| `/owner/solicitacoes/:id` | Acompanhar serviço | OWNER | `FE-OWN-004` | Sim |
| `/owner/documentos` | Meus documentos | OWNER | `FE-OWN-005` | P1 |
| `/owner/pagamentos` | Meus pagamentos | OWNER | `FE-OWN-006` | Sim |
| `/owner/pagamentos/:id` | Detalhe do pagamento | OWNER | `FE-OWN-006` | Sim |
| `/checkout/:id` | Checkout | OWNER autenticado | `FE-OWN-007` | Sim |

## PARTNER

| Rota | Tela | Acesso | Issue FE | MVP |
| --- | --- | --- | --- | --- |
| `/partner` | Dashboard do parceiro | PARTNER | `FE-PRT-001` | Sim |
| `/partner/solicitacoes` | Solicitações | PARTNER | `FE-PRT-002` | Sim |
| `/partner/solicitacoes/nova` | Nova solicitação | PARTNER | `FE-PRT-003` | Sim |
| `/partner/solicitacoes/:id` | Acompanhar solicitação | PARTNER | `FE-PRT-002` | Sim |
| `/partner/veiculos` | Veículos do parceiro | PARTNER | `FE-PRT-004` | P1 |
| `/partner/veiculos/:id` | Detalhe do veículo do parceiro | PARTNER | `FE-PRT-004` | P1 |
| `/partner/documentos` | Documentos e pendências | PARTNER | `FE-PRT-005` | Sim |
| `/partner/equipe` | Equipe | PARTNER_ADMIN ou permissão equivalente | `FE-PRT-006` | Sim |
| `/partner/financeiro` | Financeiro do parceiro | PARTNER financeiro | Futuro, depende de billing B2B | Não |
| `/partner/financeiro/faturas` | Faturas | PARTNER financeiro | Futuro, depende de billing B2B | Não |
| `/partner/financeiro/faturas/:id` | Detalhe da fatura | PARTNER financeiro | Futuro, depende de billing B2B | Não |

## ADMIN

| Rota | Tela | Acesso | Issue FE | MVP |
| --- | --- | --- | --- | --- |
| `/admin` | Dashboard Operacional | ADMIN | `FE-OPS-001` | Sim |
| `/admin/solicitacoes` | Solicitações | ADMIN | `FE-OPS-002` | Sim |
| `/admin/solicitacoes/:id` | Detalhe da solicitação | ADMIN | `FE-OPS-002` | Sim |
| `/admin/casos` | Casos | ADMIN | `FE-OPS-003` | Sim |
| `/admin/casos/:id` | Detalhe do Case | ADMIN | `FE-OPS-003` | Sim |
| `/admin/clientes` | Clientes | ADMIN | `FE-OPS-004` | Sim |
| `/admin/clientes/:id` | Detalhe do cliente | ADMIN | `FE-OPS-004` | Sim |
| `/admin/veiculos` | Veículos | ADMIN | `FE-OPS-005` | Sim |
| `/admin/veiculos/:id` | Detalhe do veículo | ADMIN | `FE-OPS-005` | Sim |
| `/admin/pedidos` | Pedidos | ADMIN | `FE-OPS-006` | P1 |
| `/admin/pedidos/:id` | Detalhe do pedido | ADMIN | `FE-OPS-006` | P1 |
| `/admin/pagamentos` | Pagamentos | ADMIN | `FE-OPS-007` | P1 |
| `/admin/pagamentos/:id` | Detalhe do pagamento | ADMIN | `FE-OPS-007` | P1 |

## ADMIN

| Rota | Tela | Acesso | Issue FE | MVP |
| --- | --- | --- | --- | --- |
| `/admin` | Dashboard Admin | ADMIN | `FE-ADM-001` | Sim |
| `/admin/financeiro` | Visão Financeira | ADMIN | `FE-ADM-002` | Sim |
| `/admin/financeiro/pedidos` | Pedidos | ADMIN | `FE-ADM-003` | Sim |
| `/admin/financeiro/pedidos/:id` | Detalhe do pedido | ADMIN | `FE-ADM-003` | Sim |
| `/admin/financeiro/pagamentos` | Pagamentos | ADMIN | `FE-ADM-003` | Sim |
| `/admin/financeiro/pagamentos/:id` | Detalhe do pagamento | ADMIN | `FE-ADM-003` | Sim |
| `/admin/financeiro/reconciliacao` | Reconciliação | ADMIN | `FE-ADM-004` | Sim |
| `/admin/financeiro/reconciliacao/:id` | Detalhe da divergência | ADMIN | `FE-ADM-004` | Opcional/drawer |
| `/admin/financeiro/faturas` | Faturamento B2B | ADMIN | Futuro, depende de billing B2B | Não |
| `/admin/financeiro/faturas/:id` | Detalhe da fatura B2B | ADMIN | Futuro, depende de billing B2B | Não |
| `/admin/parceiros` | Parceiros | ADMIN | `FE-ADM-005` | Sim |
| `/admin/parceiros/novo` | Criar parceiro | ADMIN | `FE-ADM-005` | Opcional/modal |
| `/admin/parceiros/:id` | Detalhe do parceiro | ADMIN | `FE-ADM-005` | Sim |
| `/admin/servicos` | Serviços e preços | ADMIN | `FE-ADM-006` | P1 |
| `/admin/servicos/:id` | Detalhe/editar serviço | ADMIN | `FE-ADM-006` | Opcional/drawer |
| `/admin/usuarios` | Usuários internos | ADMIN | `FE-ADM-007` | P1 |
| `/admin/usuarios/:id` | Detalhe do usuário interno | ADMIN | `FE-ADM-007` | P1 |
| `/admin/auditoria` | Auditoria | ADMIN | `FE-ADM-008` | P1 |
| `/admin/configuracoes` | Configurações administrativas | ADMIN | `FE-ADM-009` | P1 |

## TRANSVERSAL

| Rota | Tela | Acesso | Issue FE | MVP |
| --- | --- | --- | --- | --- |
| `/conta` | Minha conta | Usuário autenticado | `FE-SHARED-002` | P1 |
| `/configuracoes` | Configurações pessoais | Usuário autenticado | `FE-SHARED-002` | P1 |
| Header/Popover | Notification Center | Usuário autenticado | `FE-SHARED-003` | P1 |
| Header/Side panel | EMR Copilot | ADMIN; OWNER restrito quando habilitado | `FE-AI-001` | P1 |

## Regras de acesso

- Cadastro público cria somente `OWNER`.
- Login é único; o backend resolve memberships e contexto autorizado.
- `PARTNER` e `ADMIN` entram por convite/provisionamento.
- `ADMIN` entra por provisionamento controlado.
- Menu/sidebar é UX; autorização verdadeira fica no backend.
- `ServiceRequest` e `Case` são conceitos diferentes.
- Rotas futuras podem aparecer no mapa, mas não entram no MVP sem issue e decisão explícita.

## Open questions

- `PartnerOrganization` é atendida dentro de um tenant despachante ou é o próprio tenant?
- Como o usuário com múltiplos contextos troca contexto depois do login?
- Billing B2B terá fatura mensal, pay-per-request, prepaid ou combinação?
- Quais configurações são pessoais, administrativas ou da PartnerOrganization?
- Quais rotas opcionais devem virar drawer/modal em vez de página?

---

# 22. Principais gaps atuais de issues/protótipo

## Gap 1 — Site público

Criar issues específicas para:

```text
Landing
Consulta pública
Resultado público
```

## Gap 2 — OWNER

A `US-PT-009` deve ser expandida para cobrir claramente:

```text
Minha área
Solicitações
Acompanhamento
Pagamentos
Pendências
```

## Gap 3 — Financeiro interno

`US-PT-006` cobre Checkout/Pedido/Reconciliação, mas ainda é necessário detalhar:

```text
Visão geral Financeira Admin
Lista de Pedidos
Detalhe do Pedido
Lista de Pagamentos
Detalhe do Pagamento
```

## Gap 4 — Configurações

`US-PT-012` cobre Perfil e Configurações em alto nível, mas falta fechar:

```text
Configuração pessoal
Configuração administrativa
Configuração do Partner
```

sem misturar responsabilidades.

## Gap 5 — Partner Team

`/partner/equipe` está na arquitetura, mas precisa de protótipo explícito se não estiver representado dentro das stories atuais.

## Gap 6 — Admin Partner onboarding

Representar:

```text
Criar PartnerOrganization
Convidar primeiro Partner Admin
Ativar/suspender organização
```

## Gap 7 — QA final do mapa

Atualizar a issue final de Design QA para conectar:

```text
Público
OWNER
PARTNER
ADMIN
ADMIN
```

e não apenas os fluxos originais.
