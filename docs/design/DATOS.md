# Datos, RLS y acciones — Erika's Homemade

Complemento de `README.md`. Todo lo de aquí vive en `supabase/migrations/` dentro del mismo repositorio.

---

## 1. Esquema

```sql
-- Perfiles (1:1 con auth.users)
create table perfiles (
  id uuid primary key references auth.users on delete cascade,
  nombre text not null,
  whatsapp text,
  rol text not null default 'cliente' check (rol in ('cliente','admin')),
  creado_en timestamptz not null default now()
);

-- Taxonomía
create table categorias (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,          -- mujer | hombre | nino | manualidades
  nombre text not null,
  orden int not null default 0
);

create table subcategorias (
  id uuid primary key default gen_random_uuid(),
  categoria_id uuid not null references categorias on delete cascade,
  slug text not null,
  nombre text not null,               -- Blusas, Camisas unisex, Chaquetas,
  orden int not null default 0,       -- Pantalones de vestir, Viseras,
  unique (categoria_id, slug)         -- Uniformes escolares, Bisutería
);

-- Productos
create table productos (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  nombre text not null,
  descripcion text,
  precio_cop int not null check (precio_cop > 0),
  costo_cop int,                      -- solo admin
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
  talla text not null,                -- S, M, L, XL, 28, 30, 4 años…
  color text not null,
  stock int not null default 0 check (stock >= 0),
  unique (producto_id, talla, color)
);

create table fotos_producto (
  id uuid primary key default gen_random_uuid(),
  producto_id uuid not null references productos on delete cascade,
  path text not null,                 -- Storage: productos/<producto_id>/<archivo>
  orden int not null default 0,
  alt text
);

-- Pedidos
create type estado_pedido as enum ('nuevo','pagado','enviado','entregado','cancelado');
create type metodo_entrega as enum ('taller','delivery','punto');
create type metodo_pago    as enum ('transferencia','efectivo');

create table pedidos (
  id uuid primary key default gen_random_uuid(),
  numero serial unique,               -- se muestra como #EH-1042
  cliente_id uuid not null references perfiles,
  estado estado_pedido not null default 'nuevo',
  entrega metodo_entrega not null,
  costo_entrega_cop int not null default 0,
  pago metodo_pago not null,
  comprobante_path text,              -- bucket privado
  nota text,
  total_cop int not null,
  creado_en timestamptz not null default now()
);

create table items_pedido (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references pedidos on delete cascade,
  variante_id uuid not null references variantes,
  nombre_producto text not null,      -- congelado al momento de comprar
  talla text not null,
  precio_unitario_cop int not null,
  cantidad int not null check (cantidad > 0)
);

-- Servicios y citas
create type estado_cita as enum ('pendiente','confirmada','completada','cancelada');

create table servicios (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  nombre text not null,
  descripcion text,
  precio_desde_cop int,               -- null = presupuesto
  duracion_min int not null,
  cupos_semana int not null default 4,
  requiere_consulta boolean not null default false,
  activo boolean not null default true
);

create table horario_taller (
  dia_semana int primary key check (dia_semana between 0 and 6),
  abre time, cierra time              -- null = cerrado
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
  precio_final_cop int,               -- lo llena Érika
  creado_en timestamptz not null default now(),
  unique (inicia_en)                  -- un cupo por bloque
);
```

---

## 2. Ocultar el stock: vista pública + RLS

Esta es la pieza crítica. El cliente **no debe poder leer `stock` ni por API ni inspeccionando la respuesta**. Se resuelve con una vista que solo deriva un booleano:

```sql
create view catalogo_publico as
select
  p.id, p.slug, p.nombre, p.descripcion, p.precio_cop,
  p.categoria_id, p.subcategoria_id, p.es_pieza_unica, p.ajuste_gratis,
  exists (select 1 from variantes v where v.producto_id = p.id and v.stock > 0) as disponible
from productos p
where p.publicado;

create view variantes_publicas as
select v.id, v.producto_id, v.talla, v.color, (v.stock > 0) as disponible
from variantes v
join productos p on p.id = v.producto_id
where p.publicado;
```

El front público consulta **solo** estas vistas. La tabla `variantes` queda cerrada:

```sql
alter table variantes enable row level security;
create policy "solo admin lee variantes" on variantes
  for select using (
    exists (select 1 from perfiles where id = auth.uid() and rol = 'admin')
  );
create policy "solo admin escribe variantes" on variantes
  for all using (
    exists (select 1 from perfiles where id = auth.uid() and rol = 'admin')
  );
```

Mismo patrón para `productos.costo_cop` y `productos.aviso_stock_bajo`: no aparecen en la vista pública.

### Resto de políticas

| Tabla | Cliente | Admin |
|---|---|---|
| `perfiles` | lee y edita el suyo (`id = auth.uid()`) | todo |
| `pedidos` / `items_pedido` | lee los suyos; inserta solo con `cliente_id = auth.uid()`; no puede cambiar `estado` | todo |
| `citas` | lee las suyas; inserta como `pendiente`; puede cancelar la suya | todo |
| `servicios`, `categorias`, `subcategorias`, `horario_taller`, `dias_bloqueados` | lectura pública | escritura |
| Storage `productos` | lectura pública | escritura |
| Storage `comprobantes` | insert propio, **sin** lectura | lectura y escritura |

El rol admin se marca en `perfiles.rol`. El middleware de Next protege `/admin` y las Server Actions vuelven a verificarlo (nunca confiar solo en el middleware).

---

## 3. Server Actions

```
actions/carrito.ts     agregarAlCarrito, cambiarCantidad, quitarDelCarrito
actions/pedidos.ts     crearPedido(entrega, pago, nota, comprobante)
                       → valida stock, descuenta variantes en transacción,
                         crea pedido + items, envía email Resend, revalida rutas
actions/citas.ts       cuposDisponibles(servicioId, mes), crearCita(servicioId, inicia_en, nota)
actions/admin/         crearProducto, actualizarProducto, actualizarStock,
                       cambiarEstadoPedido, confirmarCita, reprogramarCita,
                       bloquearDia, actualizarServicio
```

Reglas dentro de las acciones:

- **Pieza única**: si `es_pieza_unica`, la cantidad máxima por línea es 1 y el stepper `+` queda inerte.
- **Stock**: se valida y se descuenta dentro de la misma transacción que crea el pedido. Si una variante se agotó entre el carrito y el pago, la acción falla con un mensaje claro y devuelve al carrito marcando la línea.
- **Cupos**: `cuposDisponibles` cruza `horario_taller`, `dias_bloqueados`, `servicios.duracion_min` y las citas ya tomadas. Un día sin cupos se muestra en gris; un día con cupos lleva punto dorado.
- **Estados**: solo Érika mueve pedidos y citas de estado. El cliente puede cancelar su cita si faltan más de 24 h.

---

## 4. Validación (Zod)

```
lib/schemas/registro.ts   nombre 2–60 · email · password ≥8 · whatsapp E.164 opcional
lib/schemas/checkout.ts   entrega ∈ enum · pago ∈ enum · nota ≤500
                          comprobante requerido si pago = 'transferencia' (jpg/png/pdf ≤5MB)
lib/schemas/producto.ts   nombre 2–80 · precio_cop entero >0 · categoría requerida
                          ≥1 variante · stock entero ≥0 · ≥1 foto para publicar
lib/schemas/cita.ts       servicio · fecha futura · bloque libre · nota ≤500
```

El mismo esquema se usa en React Hook Form y dentro de la Server Action.

---

## 5. Seed inicial

Cargar el catálogo real que ya está en los diseños:

| Producto | Categoría / Subcategoría | Precio | Tallas | Estado |
|---|---|---|---|---|
| Blusa encaje Amanecer | Mujer / Blusas | $72.000 | S, M, L | Disponible |
| Blusa Domingo | Mujer / Blusas | $65.000 | S | Pieza única |
| Camisa unisex Crudo | Mujer y Hombre / Camisas unisex | $89.000 | S, M, L, XL | Disponible |
| Camiseta Esencial negra | Hombre / Camisas unisex | $58.000 | S, M, L | Agotado |
| Chaqueta unisex Taller | Mujer y Hombre / Chaquetas | $165.000 | S, M, L | Disponible |
| Pantalón de vestir Sastre | Hombre / Pantalones de vestir | $120.000 | 28, 30, 32, 34 | Disponible |
| Visera bordada Sol | Hombre / Viseras | $35.000 | única | Disponible |
| Uniforme escolar · conjunto | Niño / Uniformes escolares | $95.000 | 4–12 años | Disponible |

Más los 7 servicios listados en `README.md` §7 y el horario del taller: lunes a viernes 9:00–17:00, sábado 9:00–13:00, domingo cerrado, bloques de 45 min.

---

## 6. Variables de entorno

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY      # solo en Server Actions
RESEND_API_KEY
EMAIL_REMITENTE
NEXT_PUBLIC_WHATSAPP           # número en formato wa.me
NEXT_PUBLIC_SITE_URL
```
