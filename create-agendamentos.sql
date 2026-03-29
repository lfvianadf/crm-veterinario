-- Roda isso ANTES do seed de dados fictícios
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
