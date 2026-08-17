-- Erika's Homemade — endurecimiento de seguridad
-- Cierra 3 huecos encontrados en la auditoría:
--   1) Un usuario podía cambiar su propio rol a admin (escalada de privilegios).
--   2) Un usuario podía insertar pedidos directo (evitando crear_pedido).
--   3) Un cliente podía auto-confirmar su cita.

-- ---------- 1) Proteger el rol de perfiles ----------
-- Con sesión, solo un admin puede tocar `rol`. Sin sesión (SQL editor / service
-- role) se permite, para que la promoción manual a admin siga funcionando.
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
    else
      new.rol := 'cliente';
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

-- ---------- 2) Forzar la creación de pedidos por la función ----------
-- Sin política de insert para clientes, los pedidos e items solo pueden nacer
-- dentro de crear_pedido (security definer), que valida y descuenta stock.
drop policy if exists "pedidos propios - insert" on pedidos;
drop policy if exists "items pedido propios - insert" on items_pedido;

-- ---------- 3) El cliente solo puede cancelar su cita, no confirmarla ----------
create or replace function public.proteger_estado_cita()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    -- El cliente puede cancelar; cualquier otro cambio de estado se ignora.
    if new.estado is distinct from old.estado and new.estado <> 'cancelada' then
      new.estado := old.estado;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists proteger_estado_cita_trigger on citas;
create trigger proteger_estado_cita_trigger
  before update on citas
  for each row
  execute function public.proteger_estado_cita();
