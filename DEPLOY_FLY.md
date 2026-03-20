Pré-requisitos

- CLI Fly (`flyctl`) instalada e autenticada: <https://fly.io/docs/getting-started/installing/>
- Ter o projeto pronto no diretório (com `Dockerfile`, `fly.toml` etc.)

Passos resumidos

1. Autenticar no Fly (se necessário):

```bash
fly auth login
```

1. Criar a app no Fly (ou reutilizar existente):

```bash
fly apps create devburger-api --org YOUR_ORG
```

1. Criar banco Postgres gerenciado pelo Fly (opcional) — isso cria um cluster e retorna credenciais:

```bash
fly postgres create --name devburger-db --region <region>
```

Anote a connection string (DATABASE_URL) retornada ou recupere com:

```bash
fly postgres attach --app devburger-api --name devburger-db
```

1. Criar volume persistente para `uploads` (opcional, recomendado):

```bash
fly volumes create uploads --region <region> --size 1 --app devburger-api
```

1. Configurar secrets (JWT, Stripe, CORS, etc):

```bash
fly secrets set \
  DATABASE_URL="<sua_database_url>" \
  JWT_SECRET="<segredo_jwt_producao>" \
  STRIPE_KEY="<stripe_key>" \
  CORS_ORIGINS="https://meusite.com"
```

1. Deployar a primeira vez:

```bash
fly deploy --app devburger-api
```

Observações importantes

- Migrations: o `fly.toml` já define `release_command = "yarn sequelize-cli db:migrate"`. O Fly executa esse comando no release antes de receber tráfego, garantindo que as migrations rodem automaticamente.
- Certifique-se que a `DATABASE_URL` usada permita conexão com SSL se necessário (o `src/config/database.cjs` já habilita `ssl` por padrão).
- Uploads: o `fly.toml` monta um volume em `/app/uploads`, que corresponde à pasta `uploads` do projeto. Se você optar por S3, atualize os pontos que escrevem/servem arquivos para usar S3.
- `JWT_SECRET`: não deixe o valor em código; use `fly secrets set` para produção.

Comandos úteis para depuração

```bash
# Ver logs
fly logs --app devburger-api

# Ver status das releases
fly releases list --app devburger-api

# Rodar um shell no container
fly ssh console --app devburger-api
```
