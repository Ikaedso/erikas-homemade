-- Erika's Homemade — esquema inicial
-- Fuente: docs/design/DATOS.md §1

-- ---------- Perfiles (1:1 con auth.users) ----------
create table perfiles (
  id uuid primary key references auth.users on delete cascade,
  nombre text not null,
  whatsapp text,
  rol text not null default 'cliente' check (rol in ('cliente', 'admin')),
  creado_en timestamptz not null default now()
);

-- ---------- Taxonomía ----------
create table categorias (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,            -- mujer | hombre | nino | manualidades
  nombre text not null,
  orden int not null default 0
);

create table subcategorias (
  id uuid primary key default gen_random_uuid(),
  categoria_id uuid not null references categorias on delete cascade,
  slug text not null,
  nombre text not null,
  orden int not null default 0,
  unique (categoria_id, slug)
);

-- ---------- Productos ----------
create table productos (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  nombre text not null,
  descripcion text,
  precio_cop int not null check (precio_cop > 0),
  costo_cop int,                        -- solo admin (no en la vista pública)
  categoria_id uuid not null references categorias,
  subcategoria_id uuid references subcategorias,
  es_pieza_unica boolean not null default false,
  ajuste_gratis boolean not null default true,
  aviso_stock_bajo int not null default 3,   -- solo admin
  publicado boolean not null default false,
  creado_en timestamptz not null default now()
);

-- Variantes: aquí vive el stock, y NUNCA se expone al cliente
create table variantes (
  id uuid primary key default gen_random_uuid(),
  producto_id uuid not null references productos on delete cascade,
  talla text not null,
  color text not null,
  stock int not null default 0 check (stock >= 0),
  unique (producto_id, talla, color)
);

create table fotos_producto (
  id uuid primary key default gen_random_uuid(),
  producto_id uuid not null references productos on delete cascade,
  path text not null,                   -- Storage: productos/<producto_id>/<archivo>
  orden int not null default 0,
  alt text
);

-- ---------- Pedidos ----------
create type estado_pedido as enum ('nuevo', 'pagado', 'enviado', 'entregado', 'cancelado');
create type metodo_entrega as enum ('taller', 'delivery', 'punto');
create type metodo_pago as enum ('transferencia', 'efectivo');

create table pedidos (
  id uuid primary key default gen_random_uuid(),
  numero serial unique,                 -- se muestra como #EH-1042
  cliente_id uuid not null references perfiles,
  estado estado_pedido not null default 'nuevo',
  entrega metodo_entrega not null,
  costo_entrega_cop int not null default 0,
  pago metodo_pago not null,
  comprobante_path text,                -- bucket privado
  nota text,
  total_cop int not null,
  creado_en timestamptz not null default now()
);

create table items_pedido (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references pedidos on delete cascade,
  variante_id uuid not null references variantes,
  nombre_producto text not null,        -- congelado al momento de comprar
  talla text not null,
  precio_unitario_cop int not null,
  cantidad int not null check (cantidad > 0)
);

-- ---------- Servicios y citas ----------
create type estado_cita as enum ('pendiente', 'confirmada', 'completada', 'cancelada');

create table servicios (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  nombre text not null,
  descripcion text,
  precio_desde_cop int,                 -- null = presupuesto
  duracion_min int not null,
  cupos_semana int not null default 4,
  requiere_consulta boolean not null default false,
  activo boolean not null default true
);

create table horario_taller (
  dia_semana int primary key check (dia_semana between 0 and 6),
  abre time,
  cierra time                           -- null = cerrado
);

create table dias_bloqueados (
  fecha date primary key,
  motivo text
);

create table citas (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references perfiles,
  servicio_id uuid not null references servicios,
  inicia_en timestamptz not null,
  estado estado_cita not null default 'pendiente',
  nota_cliente text,
  precio_final_cop int,                 -- lo llena Érika
  creado_en timestamptz not null default now(),
  unique (inicia_en)                    -- un cupo por bloque
);

-- Índices de apoyo
create index on productos (categoria_id);
create index on productos (subcategoria_id);
create index on variantes (producto_id);
create index on pedidos (cliente_id);
create index on citas (cliente_id);
