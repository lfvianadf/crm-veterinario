# Patinhas CRM 🐾

Sistema de gestão para clínicas veterinárias de pequeno porte, desenvolvido com Next.js 14 e Supabase. Construído como solução prática para digitalizar operações, centralizar dados de clientes e gerar inteligência financeira.

## Sobre o projeto

O Patinhas CRM resolve um problema comum em clínicas veterinárias: a falta de visibilidade sobre clientes, receita e oportunidades de crescimento. Com ele, a clínica sai de fichas de papel e WhatsApp pessoal para um sistema centralizado que mostra onde está o dinheiro e o que fazer para crescer.

## Funcionalidades

- **Dashboard financeiro** com filtro por mês, comparativo com mês anterior e composição da receita (avulso vs recorrente)
- **Gestão de clientes** com cadastro de tutores e animais
- **Agendamentos** com paginação, filtros por status e data, e opção de agendar retorno ao concluir
- **Plano mensal de saúde preventiva** com controle de assinantes e MRR
- **Serviços** com cadastro, edição e exclusão (com verificação de vínculos)
- **Aba Pets** com visão geral dos animais, status de vacinas e plano
- **Inteligência financeira** com LTV por cliente, receita por serviço e receita potencial perdida
- **Motor de recomendações** com ações priorizadas e mensagens prontas para WhatsApp

## Stack

- **Next.js 14** — App Router com Server Components
- **Supabase** — PostgreSQL + API REST
- **TypeScript**
- **Tailwind CSS**
- **Recharts** — gráficos
- **Lucide React** — ícones

## Estrutura do projeto

```
app/                    # Rotas (Next.js App Router)
  page.tsx              # Dashboard
  clientes/             # Lista, cadastro e perfil de clientes
  agendamentos/         # Lista e criação de agendamentos
  pets/                 # Visão geral dos animais
  servicos/             # Cadastro de serviços
  plano/                # Plano mensal
  financeiro/           # Inteligência financeira
  inteligencia/         # Motor de recomendações

components/             # Componentes reutilizáveis
  dashboard/            # Cards, gráficos e alertas
  agendamentos/         # Formulários e ações
  clientes/             # Formulário de cadastro
  financeiro/           # Gráficos financeiros
  inteligencia/         # Cards de recomendação
  plano/                # Formulários e ações
  ui/                   # Button, Card

services/               # Camada de acesso ao banco
  tutores.ts
  animais.ts
  agendamentos.ts
  atendimentos.ts
  servicos.ts
  vacinas.ts
  plano.ts
  financeiro.ts
  inteligencia.ts

types/                  # Tipos TypeScript
lib/                    # Supabase client e utilitários
```

## Como rodar

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/patinhas-crm.git
cd patinhas-crm
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Renomeie `.env.local.example` para `.env.local` e preencha com suas credenciais do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
```

### 4. Crie as tabelas no Supabase

Execute o SQL abaixo no **SQL Editor** do Supabase:

```sql
create table tutores (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  telefone text,
  email text,
  created_at timestamp default now()
);

create table animais (
  id uuid default gen_random_uuid() primary key,
  tutor_id uuid references tutores(id) on delete cascade,
  nome text not null,
  especie text,
  raca text,
  data_nascimento date,
  created_at timestamp default now()
);

create table servicos (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  preco decimal(10,2) not null,
  descricao text,
  created_at timestamp default now()
);

create table atendimentos (
  id uuid default gen_random_uuid() primary key,
  animal_id uuid references animais(id) on delete cascade,
  servico_id uuid references servicos(id),
  valor_cobrado decimal(10,2),
  data_atendimento timestamp default now(),
  observacoes text,
  created_at timestamp default now()
);

create table vacinas (
  id uuid default gen_random_uuid() primary key,
  animal_id uuid references animais(id) on delete cascade,
  nome text not null,
  data_aplicacao date not null,
  data_vencimento date not null,
  created_at timestamp default now()
);

create table plano_assinantes (
  id uuid default gen_random_uuid() primary key,
  tutor_id uuid references tutores(id) on delete cascade,
  ativo boolean default true,
  data_inicio date default now(),
  valor_mensal decimal(10,2),
  created_at timestamp default now()
);

create table agendamentos (
  id uuid default gen_random_uuid() primary key,
  tutor_id uuid references tutores(id) on delete cascade,
  animal_id uuid references animais(id) on delete cascade,
  servico_id uuid references servicos(id),
  data_agendamento timestamp not null,
  status text default 'agendado' check (status in ('agendado', 'concluido', 'cancelado')),
  observacoes text,
  valor_cobrado decimal(10,2),
  created_at timestamp default now()
);
```

### 5. Rode o projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto no Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima do Supabase |

As credenciais ficam exclusivamente no `.env.local`, que está no `.gitignore` e nunca é enviado ao repositório.
