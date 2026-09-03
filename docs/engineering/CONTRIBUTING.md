# Contribuindo

## Preparação local

Instale as dependências com `pnpm install`. O script `prepare` configura o Husky automaticamente.

Antes de cada commit, o hook de pre-commit executa somente sobre arquivos adicionados ao stage:

- Prettier nos formatos suportados pela configuração do repositório;
- ESLint nos arquivos JavaScript e TypeScript, usando a configuração do workspace responsável.

O hook pode modificar arquivos para aplicar correções seguras. O lint-staged adiciona essas correções ao
commit automaticamente. Testes, typecheck completo, build e E2E permanecem fora do pre-commit e devem ser
executados conforme o risco da mudança e no pipeline de pull request.

Para validar manualmente os arquivos no stage, execute:

```bash
pnpm lint:staged
```

## Convenção de commits

Use Conventional Commits no formato:

```text
<tipo>(<escopo opcional>): <descrição curta no imperativo>
```

Tipos usuais:

- `feat`: nova funcionalidade;
- `fix`: correção de defeito;
- `docs`: somente documentação;
- `test`: criação ou ajuste de testes;
- `refactor`: mudança interna sem alterar comportamento;
- `chore`: manutenção de ferramentas ou infraestrutura;
- `ci`: automação de integração contínua.

Exemplos:

```text
feat(payments): prevent duplicate active payments
fix(webhooks): make provider event processing idempotent
docs(engineering): document local commit workflow
```

Commits com mudança incompatível devem usar `!` após o tipo ou escopo e explicar a migração no corpo do
commit. A convenção é documentada e revisada, mas não é bloqueada por commitlint neste momento.
