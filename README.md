# Scout Campo Pro (Next.js 16)

Este projeto foi migrado do React/Vite original para **Next.js 16**, utilizando **PostgreSQL** como banco de dados e **Better-auth** para autenticação. As demais tecnologias (Shadcn/UI, TailwindCSS, Zod, Drizzle e TypeScript) foram mantidas e atualizadas.

## Tecnologias Utilizadas

- **Framework:** Next.js 16 (App Router)
- **Linguagem:** TypeScript
- **Banco de Dados:** PostgreSQL
- **ORM:** Drizzle ORM
- **Autenticação:** Better-auth
- **API/Comunicação:** tRPC
- **Estilização:** TailwindCSS v4
- **Componentes UI:** Shadcn/UI (Radix UI)
- **Gerenciamento de Estado:** React Query (@tanstack/react-query)

## Pré-requisitos

Para rodar este projeto localmente, você precisará ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 18.17.0 ou superior)
- [pnpm](https://pnpm.io/) (gerenciador de pacotes recomendado)
- [PostgreSQL](https://www.postgresql.org/) (banco de dados local ou em nuvem como Supabase/Neon)

## Como Rodar Localmente

Siga os passos abaixo para configurar e executar o projeto em sua máquina:

### 1. Instalar Dependências

Abra o terminal na pasta do projeto e execute:

```bash
pnpm install
```

### 2. Configurar Variáveis de Ambiente

O projeto já possui um arquivo `.env.local.example`. Crie uma cópia dele chamada `.env.local`:

```bash
cp .env.local.example .env.local
```

Edite o arquivo `.env.local` com as suas credenciais do PostgreSQL. Por padrão, ele vem configurado como:
`DATABASE_URL="postgresql://postgres:password@localhost:5432/scout_campo_pro"`

Se você não tiver um banco local, pode criar um banco gratuito no [Supabase](https://supabase.com) ou [Neon](https://neon.tech) e colar a URL fornecida.

### 3. Criar o Banco de Dados e Rodar Migrations

Com o PostgreSQL rodando e a URL configurada, gere e aplique as migrations do Drizzle:

```bash
# Gera os arquivos SQL baseados no schema.ts
pnpm db:generate

# Aplica as alterações no banco de dados PostgreSQL
pnpm db:push
```

### 4. Iniciar o Servidor de Desenvolvimento

Agora você já pode iniciar o projeto:

```bash
pnpm dev
```

O projeto estará rodando em [http://localhost:3000](http://localhost:3000).

## Acessando a Plataforma

1. Acesse `http://localhost:3000`
2. Clique em "Entrar" ou "Começar Agora"
3. Vá na aba "Criar Conta" e registre seu primeiro usuário
4. Após o registro, você será redirecionado para o Dashboard e poderá começar a cadastrar Times, Jogadores e Partidas!

## Estrutura do Projeto

- `/src/app`: Rotas e páginas do Next.js (App Router)
- `/src/components`: Componentes UI (Shadcn) e Providers
- `/src/db`: Configuração do Drizzle, Schemas e Queries do banco
- `/src/lib`: Configurações do Better-auth, tRPC e utilitários
- `/src/server`: Servidor tRPC, middlewares e rotas da API

---
Desenvolvido por Manus AI.
