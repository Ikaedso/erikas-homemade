"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, hayServiceRole } from "@/lib/supabase/admin";
import { esAdmin } from "@/lib/auth/require-admin";
import { enviarCorreo, hayEmail, plantillaCorreo } from "@/lib/email";
import { formatFecha, formatHora } from "@/lib/format";
import type { EstadoPedido } from "@/lib/data/pedidos";
import type { EstadoCita } from "@/lib/data/citas";

export type ActionResult = { ok: true } | { ok: false; error: string };
const DENEGADO: ActionResult = { ok: false, error: "No autorizado." };
const GENERICO: ActionResult = { ok: false, error: "No se pudo guardar. Intenta de nuevo." };

/** Revalida las páginas públicas de la tienda para que reflejen los cambios al instante. */
function revalidarTienda() {
  revalidatePath("/");
  revalidatePath("/servicios");
  revalidatePath("/[categoria]", "page");
  revalidatePath("/producto/[slug]", "page");
}

/** Acción para que el subidor de fotos (cliente) refresque la tienda tras cambiar imágenes. */
export async function revalidarCatalogo(): Promise<void> {
  if (!(await esAdmin())) return;
  revalidarTienda();
}

// ---------- Notificaciones por correo ----------
const LABEL_PEDIDO: Record<EstadoPedido, string> = {
  nuevo: "Recibido",
  pagado: "Pago confirmado",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};
const LABEL_CITA: Record<EstadoCita, string> = {
  pendiente: "Pendiente",
  confirmada: "Confirmada",
  completada: "Completada",
  cancelada: "Cancelada",
};

/** Correo del cliente vía API de administración (requiere service role). */
async function correoDe(clienteId: string): Promise<string | null> {
  if (!hayServiceRole()) return null;
  try {
    const admin = createAdminClient();
    const { data } = await admin.auth.admin.getUserById(clienteId);
    return data.user?.email ?? null;
  } catch {
    return null;
  }
}

async function notificarPedido(clienteId: string, numero: number, estado: EstadoPedido) {
  if (!hayEmail()) return;
  const to = await correoDe(clienteId);
  if (!to) return;
  const ref = `#EH-${String(numero).padStart(4, "0")}`;
  const html = plantillaCorreo(
    `Tu pedido ${ref} ahora está: ${LABEL_PEDIDO[estado]}`,
    `<p style="margin:0 0 12px;font-size:14px;color:#2E2438;line-height:1.6">
       Actualizamos el estado de tu pedido <strong>${ref}</strong>.
     </p>
     <p style="margin:0;font-size:14px;color:#2E2438;line-height:1.6">
       Estado actual: <strong style="color:#5B2A86">${LABEL_PEDIDO[estado]}</strong>.
     </p>`,
  );
  await enviarCorreo({ to, subject: `Pedido ${ref} — ${LABEL_PEDIDO[estado]}`, html });
}

type CitaNotif = {
  cliente_id: string;
  inicia_en: string;
  servicios: { nombre: string } | null;
};

async function notificarCita(cita: CitaNotif, estado: EstadoCita) {
  if (!hayEmail()) return;
  const to = await correoDe(cita.cliente_id);
  if (!to) return;
  const servicio = cita.servicios?.nombre ?? "tu servicio";
  const cuando = `${formatFecha(cita.inicia_en)} · ${formatHora(cita.inicia_en)}`;
  const html = plantillaCorreo(
    `Tu cita ahora está: ${LABEL_CITA[estado]}`,
    `<p style="margin:0 0 12px;font-size:14px;color:#2E2438;line-height:1.6">
       Tu cita de <strong>${servicio}</strong> del <strong>${cuando}</strong> cambió de estado.
     </p>
     <p style="margin:0;font-size:14px;color:#2E2438;line-height:1.6">
       Estado actual: <strong style="color:#5B2A86">${LABEL_CITA[estado]}</strong>.
     </p>`,
  );
  await enviarCorreo({ to, subject: `Cita ${servicio} — ${LABEL_CITA[estado]}`, html });
}

const ACENTOS: Record<string, string> = {
  á: "a", é: "e", í: "i", ó: "o", ú: "u", ü: "u", ñ: "n",
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[áéíóúüñ]/g, (c) => ACENTOS[c] ?? c)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ---------- Pedidos ----------
export async function setEstadoPedido(
  pedidoId: string,
  estado: EstadoPedido,
): Promise<ActionResult> {
  if (!(await esAdmin())) return DENEGADO;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pedidos")
    .update({ estado })
    .eq("id", pedidoId)
    .select("numero, cliente_id")
    .single();
  if (error) return GENERICO;
  revalidatePath("/admin/pedidos");
  revalidatePath("/admin");
  revalidatePath("/cuenta");
  revalidatePath("/pedido/[id]", "page");
  await notificarPedido(data.cliente_id as string, data.numero as number, estado);
  return { ok: true };
}

export async function getComprobanteUrl(path: string): Promise<string | null> {
  if (!(await esAdmin())) return null;
  const supabase = await createClient();
  const { data } = await supabase.storage.from("comprobantes").createSignedUrl(path, 60 * 10);
  return data?.signedUrl ?? null;
}

// ---------- Citas ----------
export async function setEstadoCita(citaId: string, estado: EstadoCita): Promise<ActionResult> {
  if (!(await esAdmin())) return DENEGADO;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("citas")
    .update({ estado })
    .eq("id", citaId)
    .select("cliente_id, inicia_en, servicios(nombre)")
    .single();
  if (error) return GENERICO;
  revalidatePath("/admin/citas");
  revalidatePath("/admin");
  revalidatePath("/cuenta");
  await notificarCita(data as unknown as CitaNotif, estado);
  return { ok: true };
}

// ---------- Servicios ----------
export async function setServicioActivo(id: string, activo: boolean): Promise<ActionResult> {
  if (!(await esAdmin())) return DENEGADO;
  const supabase = await createClient();
  const { error } = await supabase.from("servicios").update({ activo }).eq("id", id);
  if (error) return GENERICO;
  revalidatePath("/admin/servicios");
  revalidatePath("/servicios");
  return { ok: true };
}

// ---------- Productos ----------
export async function setPublicado(productoId: string, publicado: boolean): Promise<ActionResult> {
  if (!(await esAdmin())) return DENEGADO;
  const supabase = await createClient();
  const { error } = await supabase.from("productos").update({ publicado }).eq("id", productoId);
  if (error) return GENERICO;
  revalidatePath("/admin/productos");
  revalidarTienda();
  return { ok: true };
}

export type ProductoInput = {
  nombre: string;
  precio_cop: number;
  categoria_id: string;
  subcategoria_id: string | null;
  descripcion: string;
  es_pieza_unica: boolean;
  aviso_stock_bajo: number;
};

export async function crearProducto(
  input: ProductoInput,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  if (!(await esAdmin())) return { ok: false, error: "No autorizado." };
  if (!input.nombre.trim() || input.precio_cop <= 0 || !input.categoria_id) {
    return { ok: false, error: "Completa nombre, precio y categoría." };
  }
  const supabase = await createClient();
  const slug = `${slugify(input.nombre)}-${Date.now().toString(36).slice(-4)}`;
  const { data, error } = await supabase
    .from("productos")
    .insert({
      slug,
      nombre: input.nombre.trim(),
      precio_cop: input.precio_cop,
      categoria_id: input.categoria_id,
      subcategoria_id: input.subcategoria_id,
      descripcion: input.descripcion || null,
      es_pieza_unica: input.es_pieza_unica,
      aviso_stock_bajo: input.aviso_stock_bajo,
      publicado: false,
    })
    .select("id")
    .single();
  if (error) return { ok: false, error: "No se pudo crear el producto." };
  revalidatePath("/admin/productos");
  revalidarTienda();
  return { ok: true, id: data.id };
}

export async function actualizarProducto(
  id: string,
  input: ProductoInput,
): Promise<ActionResult> {
  if (!(await esAdmin())) return DENEGADO;
  const supabase = await createClient();
  const { error } = await supabase
    .from("productos")
    .update({
      nombre: input.nombre.trim(),
      precio_cop: input.precio_cop,
      categoria_id: input.categoria_id,
      subcategoria_id: input.subcategoria_id,
      descripcion: input.descripcion || null,
      es_pieza_unica: input.es_pieza_unica,
      aviso_stock_bajo: input.aviso_stock_bajo,
    })
    .eq("id", id);
  if (error) return GENERICO;
  revalidatePath("/admin/productos");
  revalidatePath(`/admin/productos/${id}`);
  revalidarTienda();
  return { ok: true };
}

// ---------- Variantes (stock) ----------
export async function setStockVariante(varianteId: string, stock: number): Promise<ActionResult> {
  if (!(await esAdmin())) return DENEGADO;
  if (stock < 0 || !Number.isInteger(stock)) return { ok: false, error: "Stock no válido." };
  const supabase = await createClient();
  const { error } = await supabase.from("variantes").update({ stock }).eq("id", varianteId);
  if (error) return GENERICO;
  revalidarTienda();
  return { ok: true };
}

export async function agregarVariante(
  productoId: string,
  talla: string,
  color: string,
  stock: number,
): Promise<ActionResult> {
  if (!(await esAdmin())) return DENEGADO;
  if (!talla.trim() || !color.trim()) return { ok: false, error: "Talla y color son obligatorios." };
  const supabase = await createClient();
  const { error } = await supabase
    .from("variantes")
    .insert({ producto_id: productoId, talla: talla.trim(), color: color.trim(), stock });
  if (error) return { ok: false, error: "Esa combinación de talla y color ya existe." };
  revalidatePath(`/admin/productos/${productoId}`);
  revalidarTienda();
  return { ok: true };
}

export async function eliminarVariante(
  varianteId: string,
  productoId: string,
): Promise<ActionResult> {
  if (!(await esAdmin())) return DENEGADO;
  const supabase = await createClient();
  const { error } = await supabase.from("variantes").delete().eq("id", varianteId);
  if (error) return GENERICO;
  revalidatePath(`/admin/productos/${productoId}`);
  revalidarTienda();
  return { ok: true };
}
