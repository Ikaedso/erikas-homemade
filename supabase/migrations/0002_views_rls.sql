-- Erika's Homemade — vistas públicas + RLS
-- Fuente: docs/design/DATOS.md §2
-- Regla crítica: el cliente NUNCA puede leer `stock`, ni por API ni inspeccionando la respuesta.

-- ---------- Helper: ¿el usuario actual es admin? ----------
-- security definer para leer `perfiles` sin disparar recursión de RLS.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from perfiles where id = auth.uid() and rol = 'admin'
  );
$$;

-- ---------- Vistas públicas (solo derivan un booleano de disponibilidad) ----------
-- Las vistas se ejecutan con los privilegios de su dueño (security_invoker = off, el default),
-- por lo que leen las tablas base aunque el cliente no tenga acceso directo a ellas.
create view catalogo_publico as
select
  p.id, p.slug, p.nombre, p.descripcion, p.precio_cop,
  p.categoria_id, p.subcategoria_id, p.es_pieza_unica, p.ajuste_gratis, p.creado_en,
  exists (select 1 from variantes v where v.producto_id = p.id and v.stock > 0) as disponible
from productos p
where p.publicado;

create view variantes_publicas as
select v.id, v.producto_id, v.talla, v.color, (v.stock > 0) as disponible
from variantes v
join productos p on p.id = v.producto_id
where p.publicado;

grant select on catalogo_publico, variantes_publicas to anon, authenticated;

-- ---------- RLS ----------
alter table perfiles enable row level security;
alter table categorias enable row level security;
alter table subcategorias enable row level security;
alter table productos enable row level security;
alter table variantes enable row level security;
alter table fotos_producto enable row level security;
alter table pedidos enable row level security;
alter table items_pedido enable row level security;
alter table servicios enable row level security;
alter table horario_taller enable row level security;
alter table dias_bloqueados enable row level security;
alter table citas enable row level security;

-- Perfiles: cada quien el suyo; admin todo
create policy "perfil propio - select" on perfiles
  for select using (id = auth.uid() or public.is_admin());
create policy "perfil propio - update" on perfiles
  for update using (id = auth.uid());
create policy "perfil propio - insert" on perfiles
  for insert with check (id = auth.uid());
create policy "perfiles admin" on perfiles
  for all using (public.is_admin()) with check (public.is_admin());

-- Taxonomía y contenido público: lectura para todos, escritura admin
create policy "categorias lectura" on categorias for select using (true);
create policy "categorias admin" on categorias for all using (public.is_admin()) with check (public.is_admin());

create policy "subcategorias lectura" on subcategorias for select using (true);
create policy "subcategorias admin" on subcategorias for all using (public.is_admin()) with check (public.is_admin());

create policy "servicios lectura" on servicios for select using (true);
create policy "servicios admin" on servicios for all using (public.is_admin()) with check (public.is_admin());

create policy "horario lectura" on horario_taller for select using (true);
create policy "horario admin" on horario_taller for all using (public.is_admin()) with check (public.is_admin());

create policy "dias bloqueados lectura" on dias_bloqueados for select using (true);
create policy "dias bloqueados admin" on dias_bloqueados for all using (public.is_admin()) with check (public.is_admin());

-- Fotos: se ven las de productos publicados; escritura admin
create policy "fotos lectura publica" on fotos_producto
  for select using (
    exists (select 1 from productos p where p.id = producto_id and p.publicado)
  );
create policy "fotos admin" on fotos_producto for all using (public.is_admin()) with check (public.is_admin());

-- Productos: acceso directo solo admin. El público usa la vista catalogo_publico.
create policy "productos admin" on productos for all using (public.is_admin()) with check (public.is_admin());

-- Variantes: SOLO admin. Aquí vive el stock; el público jamás lo lee directo.
create policy "variantes admin" on variantes for all using (public.is_admin()) with check (public.is_admin());

-- Pedidos: el cliente ve/crea los suyos, no cambia el estado; admin todo
create policy "pedidos propios - select" on pedidos
  for select using (cliente_id = auth.uid() or public.is_admin());
create policy "pedidos propios - insert" on pedidos
  for insert with check (cliente_id = auth.uid());
create policy "pedidos admin" on pedidos
  for all using (public.is_admin()) with check (public.is_admin());

create policy "items pedido propios - select" on items_pedido
  for select using (
    exists (select 1 from pedidos o where o.id = pedido_id and (o.cliente_id = auth.uid() or public.is_admin()))
  );
create policy "items pedido propios - insert" on items_pedido
  for insert with check (
    exists (select 1 from pedidos o where o.id = pedido_id and o.cliente_id = auth.uid())
  );
create policy "items pedido admin" on items_pedido
  for all using (public.is_admin()) with check (public.is_admin());

-- Citas: el cliente ve/crea las suyas (como pendiente) y puede cancelarlas; admin todo
create policy "citas propias - select" on citas
  for select using (cliente_id = auth.uid() or public.is_admin());
create policy "citas propias - insert" on citas
  for insert with check (cliente_id = auth.uid() and estado = 'pendiente');
create policy "citas propias - update" on citas
  for update using (cliente_id = auth.uid());
create policy "citas admin" on citas
  for all using (public.is_admin()) with check (public.is_admin());
