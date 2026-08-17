-- Erika's Homemade — arreglo de lectura pública de fotos de producto
--
-- Problema: la política "fotos lectura publica" comprobaba `publicado`
-- consultando la tabla `productos`, pero esa tabla tiene RLS solo-admin
-- (el público usa la vista `catalogo_publico`). Para un cliente/anónimo el
-- subquery no veía filas → no podía leer NINGUNA foto. Por eso las imágenes
-- solo aparecían para el admin.
--
-- Solución: una función `security definer` que verifica `publicado` sin que
-- el RLS de `productos` bloquee la comprobación.

create or replace function public.producto_publicado(pid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from productos where id = pid and publicado);
$$;

drop policy if exists "fotos lectura publica" on fotos_producto;
create policy "fotos lectura publica" on fotos_producto
  for select using (public.producto_publicado(producto_id));
