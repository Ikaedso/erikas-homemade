import { createClient } from "@/lib/supabase/server";

export type Servicio = {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string | null;
  precio_desde_cop: number | null;
  duracion_min: number;
  cupos_semana: number;
  requiere_consulta: boolean;
  activo: boolean;
};

export type HorarioDia = { dia_semana: number; abre: string | null; cierra: string | null };

export type EstadoCita = "pendiente" | "confirmada" | "completada" | "cancelada";

export type CitaConServicio = {
  id: string;
  inicia_en: string;
  estado: EstadoCita;
  nota_cliente: string | null;
  servicios: { nombre: string } | null;
};

function haySupabase() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export async function getServicios(): Promise<Servicio[]> {
  if (!haySupabase()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("servicios")
    .select("*")
    .eq("activo", true)
    .order("requiere_consulta")
    .order("nombre");
  return (data as Servicio[]) ?? [];
}

export async function getServicioPorSlug(slug: string): Promise<Servicio | null> {
  if (!haySupabase()) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("servicios").select("*").eq("slug", slug).maybeSingle();
  return (data as Servicio | null) ?? null;
}

export async function getHorario(): Promise<HorarioDia[]> {
  if (!haySupabase()) return [];
  const supabase = await createClient();
  const { data } = await supabase.from("horario_taller").select("*").order("dia_semana");
  return (data as HorarioDia[]) ?? [];
}

export async function getDiasBloqueados(): Promise<string[]> {
  if (!haySupabase()) return [];
  const supabase = await createClient();
  const { data } = await supabase.from("dias_bloqueados").select("fecha");
  return ((data as { fecha: string }[]) ?? []).map((d) => d.fecha);
}

export async function getHorariosOcupados(
  desdeISO: string,
  hastaISO: string,
): Promise<string[]> {
  if (!haySupabase()) return [];
  const supabase = await createClient();
  const { data } = await supabase.rpc("horarios_ocupados", {
    p_desde: desdeISO,
    p_hasta: hastaISO,
  });
  return (data as string[] | null) ?? [];
}

export async function getMisCitas(): Promise<CitaConServicio[]> {
  if (!haySupabase()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("citas")
    .select("id, inicia_en, estado, nota_cliente, servicios(nombre)")
    .order("inicia_en", { ascending: false });
  return (data as unknown as CitaConServicio[]) ?? [];
}
