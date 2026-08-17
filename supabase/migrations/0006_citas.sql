-- Erika's Homemade — disponibilidad de citas
-- El cliente no puede leer las citas de otros (RLS), pero para agendar necesita
-- saber qué horarios están ocupados. Esta función devuelve SOLO las marcas de
-- tiempo ocupadas (sin datos de quién) en un rango.

create or replace function public.horarios_ocupados(
  p_desde timestamptz,
  p_hasta timestamptz
)
returns setof timestamptz
language sql
security definer
set search_path = public
as $$
  select inicia_en
  from citas
  where inicia_en >= p_desde
    and inicia_en < p_hasta
    and estado <> 'cancelada';
$$;

grant execute on function public.horarios_ocupados(timestamptz, timestamptz) to authenticated;
