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

## Validações de Pull Request

Pull Requests executam automaticamente os mesmos quality gates disponíveis localmente:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

O pipeline instala as dependências com o lockfile, reutiliza o cache do pnpm e cancela uma execução
anterior da mesma branch quando um novo commit é enviado. Cada workspace que possuir testes unitários
deve expor um script `test`; o comando raiz executa todos os scripts de teste disponíveis.

Ao abrir um Pull Request, preencha o template com o contexto, a issue relacionada, os passos de
validação, as evidências visuais aplicáveis e os possíveis impactos da mudança.

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
commit.

O hook `commit-msg` usa commitlint para bloquear mensagens que não seguem a convenção. Por exemplo,
`teste` é rejeitado, enquanto `feat: add vehicle search` é aceito.
