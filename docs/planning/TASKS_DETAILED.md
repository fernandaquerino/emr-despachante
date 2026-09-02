# EMR Despachante — Task Breakdown Guide

O [`BACKLOG.md`](BACKLOG.md) contém as tasks específicas por User Story. Este arquivo define a profundidade esperada.

## Uma User Story não termina em “fiz a tela”

### Produto
- qual problema resolve;
- quem usa;
- regra de negócio;
- estados possíveis;
- permissões.

### Protótipo
Para cada tela, prever:
- default;
- loading;
- empty;
- error;
- stale;
- disabled;
- success;
- permission denied quando aplicável;
- conflito quando aplicável.

### Frontend
- rota;
- page;
- components;
- query/mutation;
- validation;
- filters;
- pagination;
- accessibility;
- error handling.

### Backend
- controller;
- DTO;
- service/use case;
- authorization;
- domain validation;
- external ports;
- error mapping.

### Banco
- schema;
- FKs;
- constraints;
- indexes;
- transaction boundaries;
- migrations.

### Testes
- unit;
- integration;
- concurrency;
- e2e quando o fluxo justificar.

### Observabilidade
- log;
- metric;
- trace;
- alert quando aplicável.

### Segurança
- PII;
- authorization;
- abuse;
- secrets;
- audit.

## Definition of Ready

Uma US só vai para desenvolvimento quando:
- objetivo compreendido;
- tela/protótipo suficiente;
- critérios definidos;
- dependências conhecidas;
- estudo necessário listado.

## Definition of Done
- código;
- testes;
- estados de UI;
- observabilidade quando aplicável;
- docs;
- explicação técnica.
