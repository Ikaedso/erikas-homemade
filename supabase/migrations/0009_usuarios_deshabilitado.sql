-- Erika's Homemade — deshabilitar cuentas (en vez de eliminarlas)
--
-- Un usuario nunca se elimina; se deshabilita. Al intentar iniciar sesión con
-- una cuenta deshabilitada, la app lo detecta y muestra un aviso.

alter table perfiles
  add column if not exists deshabilitado boolean not null default false;

-- Proteger `rol` y `deshabilitado`: con sesión, solo un admin puede cambiarlos.
-- Sin sesión (SQL editor / service role) se permite, para administración manual.
create or replace function public.proteger_rol()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    if tg_op = 'UPDATE' then
      new.rol := old.rol;
      new.deshabilitado := old.deshabilitado;
    else
      new.rol := 'cliente';
      new.deshabilitado := false;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists proteger_rol_trigger on perfiles;
create trigger proteger_rol_trigger
  before insert or update on perfiles
  for each row
  execute function public.proteger_rol();
