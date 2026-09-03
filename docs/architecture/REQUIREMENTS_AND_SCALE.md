# EMR Despachante — Requirements and Scale

> Documento de discovery arquitetural para separar fatos conhecidos, hipóteses e perguntas que mudam decisões de arquitetura.

## 1. Objetivo do documento

Este documento registra requisitos arquiteturais de produto, escala e operação antes de escolher desenho técnico detalhado.

Ele deve ajudar o System Design a responder:

- quais fatos já são verdade do produto;
- quais hipóteses ainda precisam ser validadas;
- quais perguntas mudam arquitetura, dados, segurança, custos ou operação;
- quais decisões devem permanecer adiadas até existir requisito real.

Este documento não escolhe serviços AWS por estética, não inventa números e não transforma hipótese em decisão.

Referências:

- [`../../README.md`](../../README.md)
- [`../EMR-SCREEN-MAP.md`](../EMR-SCREEN-MAP.md)
- [`../product/REQUIREMENTS.md`](../product/REQUIREMENTS.md)
- [`../product/STATUS_MODEL.md`](../product/STATUS_MODEL.md)
- [`../engineering/ARCHITECTURE.md`](../engineering/ARCHITECTURE.md)
- [`../engineering/DATA_MODEL.md`](../engineering/DATA_MODEL.md)

## 2. Fatos conhecidos do produto

| Tipo | Item | Impacto arquitetural |
| --- | --- | --- |
| Fato conhecido | O produto atende jornadas B2C, B2B e B2B2C. | O modelo de identidade, autorização, dados e auditoria precisa diferenciar usuário final, parceiro comercial e usuário interno. |
| Fato conhecido | Perfis do MVP: `OWNER`, `PARTNER`, `ADMIN`. | Não criar papel operacional separado no MVP; operação interna pertence ao `ADMIN`. |
| Fato conhecido | Cadastro público cria somente `OWNER`. | Fluxos públicos de signup não podem criar parceiro nem usuário interno. |
| Fato conhecido | `PARTNER` entra por convite. | Convites e memberships de PartnerOrganization são parte do controle de acesso. |
| Fato conhecido | `ADMIN` é usuário interno provisionado administrativamente. | Gestão de usuários internos deve ser controlada e auditável. |
| Fato conhecido | `PartnerOrganization` não é `Customer`. | O modelo de dados deve preservar organização parceira como boundary comercial próprio. |
| Fato conhecido | `ServiceRequest` e `Case` são conceitos diferentes. | Não reutilizar estados, filas ou permissões como se solicitação normal e exceção fossem a mesma coisa. |
| Fato conhecido | WhatsApp outbound é canal de notificação, não fonte da verdade. | Falha de envio não deve invalidar criação de solicitação; estado oficial fica no EMR. |
| Fato conhecido | Pagamento só é confirmado por webhook válido e idempotente. | Checkout/redirect não pode promover pagamento para `PAID`; idempotência é requisito crítico. |
| Fato conhecido | DetranClient real ainda é dependência incerta; MVP usa mock controlado. | Integração governamental deve ficar atrás de adapter/port e simular latência, falha, timeout e eventual consistency. |

## 3. Hipóteses atuais, não confirmadas

| Tipo | Hipótese | Pergunta aberta | Impacto arquitetural |
| --- | --- | --- | --- |
| Hipótese | O tenant provavelmente é a empresa despachante. | Qual é o tenant real do produto? | Define isolamento de dados, chaves de escopo, billing, auditoria e futura expansão multi-empresa. |
| Hipótese | `PartnerOrganization` provavelmente é uma organização atendida dentro do tenant. | Parceiros são apenas clientes B2B do despachante ou também podem operar como subtenants? | Muda modelagem de membership, permissões, relatórios e isolamento. |
| Hipótese | Billing B2B pode exigir invoices/postpaid. | Parceiros pagarão mensalmente, por solicitação, antecipado, pós-pago ou híbrido? | Muda entidades financeiras, reconciliação, ciclo de cobrança e dashboards. |
| Hipótese | Volumes e picos precisam ser levantados com negócio/operação. | Quais volumes reais são esperados por canal e serviço? | Define índices, paginação, filas, cache, limites e observabilidade. |
| Hipótese | RPO/RTO só serão definidos se houver requisito real de continuidade. | Existe requisito formal de recuperação ou continuidade? | Evita overengineering antes de existir obrigação operacional ou contratual. |

## 4. Perguntas arquiteturais abertas

| Pergunta aberta | Por que muda arquitetura | Status |
| --- | --- | --- |
| Qual é o tenant real? | Define boundaries de dados, autorização, auditoria, particionamento e futuras migrations. | TBD |
| Haverá uma única empresa despachante ou múltiplos despachantes na mesma plataforma? | Multi-tenant real exige isolamento, operação, billing e observabilidade por tenant. | TBD |
| Parceiros terão cobrança mensal/postpaid ou pagarão por solicitação? | Define se invoices, invoice items, ciclo de fechamento e cobrança B2B entram no core. | TBD |
| Quais volumes esperados por dia/mês para consultas, solicitações, pagamentos e documentos? | Define capacidade, índices, filas, limites e estratégia de dashboard. | TBD |
| Quais horários geram pico? | Define necessidade de elasticidade, filas, retry e janelas de jobs. | TBD |
| Qual latência aceitável para consulta veicular, criação de solicitação, checkout, dashboard e upload/download de documentos? | Define sincronismo vs assíncronismo, cache e experiência de estados intermediários. | TBD |
| Qual disponibilidade mínima esperada para áreas pública, owner, partner e admin? | Define prioridades de fallback, monitoramento, degradação e recuperação. | TBD |
| Quais integrações externas são obrigatórias no MVP e quais são simuladas? | Define adapters, mocks, contratos, retries, DLQ e riscos de entrega. | TBD |
| Existe requisito formal de backup, retenção, RPO ou RTO? | Define políticas de recuperação e retenção sem assumir obrigação inexistente. | TBD |

## 5. Jornadas e superfícies cobertas

| Superfície | Jornada | Fato conhecido | Pergunta aberta | Impacto arquitetural |
| --- | --- | --- | --- | --- |
| Pública | Consulta inicial, entrada, cadastro e login. | Usuário público pode iniciar consulta; cadastro público cria somente `OWNER`. | Quais dados podem aparecer antes de autenticação sem expor PII? | Define minimização de dados e autorização de endpoints públicos. |
| Owner | Proprietário consulta veículos, solicita serviços, acompanha pagamentos, pedidos e documentos. | Owner só acessa dados próprios. | Quais documentos/status podem ser exibidos em cada fase do serviço? | Define regras de autorização, storage privado e timeline pública. |
| Partner | Parceiro cria e acompanha solicitações para uma PartnerOrganization. | PartnerOrganization é separada de Customer. | Quais permissões internas existirão dentro da equipe do parceiro? | Define membership, roles internas de parceiro e escopo de dados. |
| Admin | Usuário interno trabalha solicitações, Cases, clientes, parceiros, financeiro, auditoria e configurações. | Admin concentra operação diária e gestão no MVP. | Haverá permissões internas granulares no futuro? | Define como evitar acoplamento entre papel MVP e permissões futuras. |
| Transversal | Notificações, conta, configurações pessoais e EMR Copilot. | IA não acessa banco diretamente e ações sensíveis exigem confirmação. | Quais ações de IA entram no MVP vs futuro? | Define tool authorization, audit trail e limites de escrita. |

## 6. Escala, volumes e picos

Não há volume validado neste momento. Não inventar números.

| Métrica | Valor atual | Pergunta aberta | Impacto arquitetural |
| --- | --- | --- | --- |
| Consultas públicas por dia/mês | TBD | Quantas consultas por placa são esperadas por período? | Define rate limit, cache, adapter governamental e custo. |
| Consultas autenticadas por dia/mês | TBD | Quantas consultas partem de owner, partner e admin? | Define caching por escopo, auditoria e limites por contexto. |
| ServiceRequests por dia/mês | TBD | Qual volume vem de B2C, B2B e criação interna? | Define filas, dashboards, paginação e indicadores. |
| Cases por dia/mês | TBD | Qual percentual de solicitações vira exceção? | Define capacidade da fila operacional e métricas de SLA interno. |
| Pagamentos por dia/mês | TBD | Quantos checkouts e webhooks são esperados? | Define idempotência, concorrência, reconciliação e observabilidade financeira. |
| Documentos enviados/baixados por dia/mês | TBD | Qual tamanho médio e volume de arquivos? | Define storage, política de retenção, segurança e custos. |
| Picos horários | TBD | Existem picos por campanha, vencimento, horário comercial ou batch externo? | Define necessidade de filas, backpressure e scheduling. |

## 7. Latência e disponibilidade

Não há SLA/SLO validado neste momento. Não inventar metas.

| Fluxo | Latência esperada | Availability esperada | Pergunta aberta | Impacto arquitetural |
| --- | --- | --- | --- | --- |
| Consulta veicular | TBD | TBD | A consulta precisa responder síncrona ou pode mostrar status intermediário? | Define adapter, cache, timeout e UX de processamento. |
| Criação de ServiceRequest | TBD | TBD | A solicitação precisa ser confirmada mesmo se notificação falhar? | Define transação principal, outbox e tratamento de falha de canais. |
| Checkout | TBD | TBD | Qual tempo aceitável para iniciar checkout e refletir pagamento confirmado? | Define separação entre checkout iniciado e confirmação por webhook. |
| Dashboard admin | TBD | TBD | Indicadores podem ser eventualmente consistentes? | Define agregações SQL, cache curto ou read model futuro. |
| Upload/download de documentos | TBD | TBD | Existem exigências de tamanho, expiração e auditoria de acesso? | Define storage privado, signed URLs e política de logs. |
| EMR Copilot | TBD | TBD | IA é assistiva opcional ou fluxo crítico de operação? | Define fallback, timeout, custo e monitoramento. |

## 8. Tenancy

| Tipo | Item | Impacto arquitetural |
| --- | --- | --- |
| Pergunta aberta | Qual é o tenant real: despachante, PartnerOrganization, ambos ou nenhum no MVP? | Define chaves de escopo em quase todas as entidades. |
| Hipótese | O tenant provavelmente é a empresa despachante. | `PartnerOrganization` ficaria como organização atendida, não como tenant principal. |
| Pergunta aberta | O produto precisa suportar múltiplos despachantes no mesmo deploy? | Se sim, isolamento por tenant vira requisito estrutural desde o início. |
| Pergunta aberta | Admin pertence a um tenant ou é global? | Define autorização administrativa e auditoria. |
| Pergunta aberta | Dados de parceiro precisam de isolamento lógico, físico ou apenas autorização por membership? | Define modelo de dados, índices e testes de IDOR/BOLA. |

Decisão adiada: não definir multi-tenancy definitivo sem resposta explícita dessas perguntas.

## 9. Billing B2B/B2B2C

| Tipo | Item | Impacto arquitetural |
| --- | --- | --- |
| Fato conhecido | Billing B2B completo está fora do MVP até decisão comercial. | Rotas de financeiro do parceiro e faturas ficam futuras. |
| Hipótese | Parceiros podem precisar de invoices/postpaid. | Pode exigir entidades de invoice, invoice item, fechamento, ajuste, desconto e reconciliação. |
| Pergunta aberta | Parceiro paga por solicitação, mensalmente, antecipado, pós-pago ou híbrido? | Muda o fluxo financeiro e o modelo de cobrança. |
| Pergunta aberta | Quem é o pagador em B2B2C: parceiro, proprietário final ou ambos dependendo do serviço? | Define checkout, recibos, notas, conciliação e permissões de visualização. |
| Pergunta aberta | Preços por parceiro entram no MVP? | Define snapshot de preço, catálogo habilitado e histórico financeiro. |

Decisão adiada: não implementar billing B2B profundo sem definição de modelo comercial.

## 10. Dependências externas

| Dependência | Fato conhecido | Pergunta aberta | Impacto arquitetural |
| --- | --- | --- | --- |
| DetranClient | MVP usa mock controlado; integração real é incerta. | Qual órgão/API real será obrigatório, com qual contrato e limitações? | Define adapter real, retry, rate limit, timeout e DLQ. |
| Payment provider | Pagamento depende de checkout e webhook válido/idempotente. | Qual provider real será usado após sandbox? | Define assinatura, idempotência, conciliação e eventos. |
| WhatsApp | Outbound é canal de notificação, não fonte da verdade. | Qual provider/canal será usado e quais mensagens entram no MVP? | Define adapter, templates, retries e tratamento de falha. |
| Storage de documentos | Documentos são privados. | Quais tipos/tamanhos/retenção são exigidos? | Define upload/download seguro, auditoria e políticas de retenção. |
| LLM provider | IA passa por gateway/tools e não acessa banco diretamente. | Qual provider/modelo e quais ações entram no MVP? | Define custo, latência, fallback, logs seguros e guardrails. |

## 11. RPO/RTO

Não há requisito formal de RPO/RTO documentado neste momento.

| Tipo | Item | Impacto arquitetural |
| --- | --- | --- |
| Pergunta aberta | Existe requisito formal de RPO? | Define tolerância de perda de dados e estratégia de backup/restore. |
| Pergunta aberta | Existe requisito formal de RTO? | Define tempo de recuperação esperado e investimento operacional. |
| Pergunta aberta | Existe exigência contratual/regulatória de retenção? | Define storage, backups, logs e ciclo de vida de documentos. |
| Hipótese | RPO/RTO só serão definidos se houver requisito real de continuidade. | Evita desenhar alta disponibilidade ou disaster recovery por estética. |

Decisão adiada: não prometer continuidade operacional sem requisito validado.

## 12. Decisões adiadas

- Escolha definitiva de modelo de tenancy.
- Modelo comercial e financeiro de billing B2B/B2B2C.
- Volumes, picos, limites e capacidade.
- SLA/SLO de latência e disponibilidade.
- RPO/RTO e política formal de continuidade.
- Integrações externas reais além dos adapters/mocks necessários para o MVP.
- Read model dedicado, cache mais agressivo, filas adicionais ou outra complexidade estrutural sem volume/requisito que justifique.

## 13. Próximos passos

- Levantar volumes esperados com negócio/operação para B2C, B2B e B2B2C.
- Validar se o produto será single-despachante ou multi-despachante.
- Definir modelo de cobrança B2B antes de detalhar faturas, postpaid ou financeiro do parceiro.
- Definir quais integrações externas reais entram no MVP e quais permanecem simuladas.
- Registrar requisitos formais de latência, disponibilidade, RPO e RTO somente quando existirem.
- Usar as respostas deste documento como entrada para ADRs e System Design, sem antecipar decisões.
