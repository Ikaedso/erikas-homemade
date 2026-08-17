"use server";

import { after } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { enviarCorreo, hayEmail, plantillaCorreo } from "@/lib/email";
import { formatFecha, formatHora } from "@/lib/format";

export type CrearCitaResult = { ok: true; citaId: string } | { ok: false; error: string };

function aMinutos(hhmm: string): number {
  const [h, m] = hhmm.slice(0, 5).split(":").map(Number);
  return h * 60 + m;
}

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

  // 1) No en el pasado
  if (new Date(iniciaEnISO).getTime() <= Date.now()) {
    return { ok: false, error: "Elige un horario futuro." };
  }

  // 2) El horario debe ser uno real del taller (no confiar solo en el cliente)
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(iniciaEnISO);
  if (!m) return { ok: false, error: "Horario no válido." };
  const fecha = `${m[1]}-${m[2]}-${m[3]}`;
  const minutos = Number(m[4]) * 60 + Number(m[5]);
  const diaSemana = new Date(`${fecha}T12:00:00Z`).getUTCDay();

  const { data: servicio } = await supabase
    .from("servicios")
    .select("nombre, duracion_min, activo")
    .eq("id", servicioId)
    .maybeSingle();
  if (!servicio || !servicio.activo) return { ok: false, error: "Ese servicio no está disponible." };

  const { data: bloqueado } = await supabase
    .from("dias_bloqueados")
    .select("fecha")
    .eq("fecha", fecha)
    .maybeSingle();
  if (bloqueado) return { ok: false, error: "Ese día no está disponible." };

  const { data: horario } = await supabase
    .from("horario_taller")
    .select("abre, cierra")
    .eq("dia_semana", diaSemana)
    .maybeSingle();
  if (!horario?.abre || !horario?.cierra) {
    return { ok: false, error: "El taller está cerrado ese día." };
  }
  if (minutos < aMinutos(horario.abre) || minutos + servicio.duracion_min > aMinutos(horario.cierra)) {
    return { ok: false, error: "Ese horario está fuera de la jornada del taller." };
  }

  // 3) Insertar (UNIQUE(inicia_en) evita doble reserva)
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
    if (error.code === "23505") {
      return { ok: false, error: "Ese horario acaba de ocuparse. Elige otro." };
    }
    return { ok: false, error: "No pudimos agendar la cita. Intenta de nuevo." };
  }

  // Correo de confirmación al cliente (después de responder, sin bloquear).
  if (hayEmail() && user.email) {
    const to = user.email;
    const nombreServicio = servicio.nombre as string;
    const cuando = `${formatFecha(iniciaEnISO)} · ${formatHora(iniciaEnISO)}`;
    after(() =>
      enviarCorreo({
        to,
        subject: `Recibimos tu cita — ${nombreServicio}`,
        html: plantillaCorreo(
          "¡Tu cita quedó agendada!",
          `<p style="margin:0 0 12px;font-size:14px;color:#2E2438;line-height:1.6">
             Recibimos tu solicitud de cita para <strong>${nombreServicio}</strong>.
           </p>
           <p style="margin:0 0 12px;font-size:14px;color:#2E2438;line-height:1.6">
             Fecha y hora: <strong style="color:#5B2A86">${cuando}</strong>
           </p>
           <p style="margin:0;font-size:14px;color:#2E2438;line-height:1.6">
             Tu cita queda <strong>pendiente</strong> hasta que Érika la confirme por WhatsApp.
             Te avisaremos por correo cuando cambie de estado.
           </p>`,
        ),
      }),
    );
  }

  return { ok: true, citaId: data.id };
}
