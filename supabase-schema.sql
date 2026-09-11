-- Tabla: plato del dia
create table plato_dia (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  descripcion text,
  precio numeric(10,2),
  imagen_url text,
  created_at timestamptz default now()
);

-- Tabla: promociones
create table promociones (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descripcion text,
  imagen_url text,
  activa boolean default true,
  created_at timestamptz default now()
);

-- Habilitar acceso publico de lectura (para la landing)
alter table plato_dia enable row level security;
alter table promociones enable row level security;

create policy "Lectura publica plato_dia"
  on plato_dia for select using (true);

create policy "Lectura publica promociones"
  on promociones for select using (true);

create policy "Solo auth puede escribir plato_dia"
  on plato_dia for all using (auth.role() = 'authenticated');

create policy "Solo auth puede escribir promociones"
  on promociones for all using (auth.role() = 'authenticated');
