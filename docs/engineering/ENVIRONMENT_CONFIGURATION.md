# Configuração de ambiente e secrets

Cada processo possui configuração própria e deve receber somente as variáveis que utiliza. Variáveis
injetadas pelo ambiente têm precedência sobre arquivos locais.

| Contexto | Exemplo | Responsabilidade |
| --- | --- | --- |
| Docker local | `/.env.example` | PostgreSQL executado pelo Docker Compose |
| Web | `/apps/web/.env.example` | Configuração pública entregue ao navegador |
| API | `/apps/api/.env.example` | Porta HTTP, banco e futuros secrets da API |
| Worker | `/apps/worker/.env.example` | Configuração dos jobs e futuras integrações assíncronas |

## Desenvolvimento local

Copie cada exemplo necessário sem remover o sufixo `.example` do arquivo versionado:

```bash
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
cp apps/worker/.env.example apps/worker/.env
```

Os arquivos locais de ambiente são ignorados pelo Git. Os exemplos contêm apenas valores locais
descartáveis ou placeholders e devem ser atualizados sempre que uma variável obrigatória for criada.

API e worker carregam seus respectivos arquivos `.env` em desenvolvimento. O Next.js carrega os
arquivos da aplicação web conforme sua convenção. Em CI, homologação e produção, injete as variáveis no
processo; não distribua arquivos `.env` nem reutilize valores entre ambientes.

`NODE_ENV` aceita somente `development`, `test` ou `production`. O nome do ambiente operacional, como
homologação, não deve criar um quarto modo de runtime: use `NODE_ENV=production` e credenciais/endpoints
exclusivos daquele ambiente.

## Regras de segurança

- Nunca versione valores reais, tokens, chaves privadas ou credenciais de produção.
- Variáveis `NEXT_PUBLIC_*` são incorporadas ao bundle e visíveis no navegador; nunca são secrets.
- Não registre objetos de configuração ou URLs que possam conter credenciais.
- Cada ambiente deve ter credenciais próprias e com o menor privilégio possível.
- Falhas de validação devem interromper o processo antes de ele aceitar tráfego ou consumir jobs.

## Rotação de secrets

Quando um secret expirar, for exposto ou precisar ser substituído:

1. identifique os processos e ambientes consumidores sem copiar o valor para issues ou logs;
2. gere uma nova credencial no provedor com o mesmo escopo mínimo necessário;
3. atualize a configuração segura do ambiente e reinicie ou reprocesse os consumidores;
4. valide saúde e acesso usando identificadores não sensíveis;
5. revogue a credencial anterior assim que a nova estiver confirmada;
6. registre responsável, data, motivo e ambientes afetados, sem registrar o secret;
7. em caso de exposição, revise logs e histórico do Git e trate o valor antigo como comprometido mesmo
   depois de removê-lo do código.

O mecanismo de armazenamento e injeção de secrets em produção será definido junto ao deployment e não
faz parte desta configuração inicial.
