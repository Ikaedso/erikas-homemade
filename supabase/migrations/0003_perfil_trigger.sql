-- Erika's Homemade — crear perfil automáticamente al registrarse
-- Al insertarse un usuario en auth.users, se crea su fila en perfiles
-- tomando nombre/whatsapp de los metadatos del registro.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.perfiles (id, nombre, whatsapp)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'nombre', ''), 'Cliente'),
    nullif(new.raw_user_meta_data->>'whatsapp', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
