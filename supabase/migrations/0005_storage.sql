-- Erika's Homemade — buckets de Storage y políticas
-- comprobantes: privado (el cliente sube el suyo, solo Érika lo lee)
-- productos: público (fotos del catálogo)
-- Idempotente: se puede re-ejecutar sin chocar (drop policy if exists antes de crear).

insert into storage.buckets (id, name, public)
values ('comprobantes', 'comprobantes', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('productos', 'productos', true)
on conflict (id) do nothing;

-- ---------- comprobantes ----------
-- El cliente sube dentro de su propia carpeta: comprobantes/<uid>/<archivo>
drop policy if exists "comprobantes: insert propio" on storage.objects;
create policy "comprobantes: insert propio"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'comprobantes'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Solo Érika puede leerlos
drop policy if exists "comprobantes: admin lee" on storage.objects;
create policy "comprobantes: admin lee"
  on storage.objects for select
  using (bucket_id = 'comprobantes' and public.is_admin());

-- ---------- productos ----------
drop policy if exists "productos: lectura pública" on storage.objects;
create policy "productos: lectura pública"
  on storage.objects for select
  using (bucket_id = 'productos');

drop policy if exists "productos: admin escribe" on storage.objects;
create policy "productos: admin escribe"
  on storage.objects for all to authenticated
  using (bucket_id = 'productos' and public.is_admin())
  with check (bucket_id = 'productos' and public.is_admin());
