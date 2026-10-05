-- Ejecutar en Supabase → SQL Editor → New query → Run

create table if not exists public.usuarios (
  id              bigint generated always as identity primary key,
  nombre          text        not null check (char_length(nombre) between 2 and 100),
  email           text        not null unique,
  password_hash   text        not null,
  rol             text        not null default 'usuario' check (rol in ('usuario', 'admin')),
  creado_en       timestamptz not null default now(),
  actualizado_en  timestamptz
);

-- Seguridad: activamos RLS sin políticas.
-- Así nadie puede leer la tabla con la clave pública (anon).
-- Nuestra API usa la clave secreta (service role), que sí tiene acceso.
alter table public.usuarios enable row level security;
