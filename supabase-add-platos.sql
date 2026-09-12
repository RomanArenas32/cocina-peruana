create table platos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  descripcion text,
  precio numeric(10,2),
  imagen_url text,
  created_at timestamptz default now()
);

alter table platos enable row level security;

create policy "Solo auth puede gestionar platos"
  on platos for all using (auth.role() = 'authenticated');
