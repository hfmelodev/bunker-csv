# bunker-csv

🚀 Solução para processamento massivo de arquivos CSV, com ingestão automatizada e persistência em banco de dados.

## Funcionalidades

* Upload de arquivos CSV via API
* Processamento assíncrono das linhas
* Validação de dados
* Persistência no banco de dados
* Controle de erros e logs
* Fácil de estender e integrar

## Tecnologias

* Fastify
* Prisma
* TypeScript
* Zod
* Dayjs
* Axios
* Biome

## Instalação

```bash
git clone https://github.com/seu-usuario/bunker-csv.git
cd bunker-csv
pnpm install
```

## Configuração

Crie um arquivo `.env` na raiz do projeto com:

```
DATABASE_URL="sua_string_de_conexao"
```

Execute as migrações do banco:

```bash
npx prisma migrate dev
```

## Uso

Inicie o projeto em desenvolvimento:

```bash
pnpm dev
```

A API ficará disponível em:

```
http://localhost:3333
```

## Licença

ISC
