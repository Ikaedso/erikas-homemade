"use server";

import { createClient } from "@/lib/supabase/server";

export type CrearCitaResult = { ok: true; citaId: string } | { ok: false; error: string };

export async function crearCita(
  servicioId: string,
  iniciaEnISO: string,
  nota: string,
): Promise<CrearCitaResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Debes iniciar sesión." };

  if (new Date(iniciaEnISO).getTime() <= Date.now()) {
    return { ok: false, error: "Elige un horario futuro." };
  }

  const { data, error } = await supabase
    .from("citas")
    .insert({
      cliente_id: user.id,
      servicio_id: servicioId,
      inicia_en: iniciaEnISO,
      estado: "pendiente",
      nota_cliente: nota || null,
    })
    .select("id")
    .single();

  if (error) {
    // 23505 = violación de UNIQUE(inicia_en): el cupo se tomó entre medias
    if (error.code === "23505") {
      return { ok: false, error: "Ese horario acaba de ocuparse. Elige otro." };
    }
    return { ok: false, error: "No pudimos agendar la cita. Intenta de nuevo." };
  }

  return { ok: true, citaId: data.id };
}
