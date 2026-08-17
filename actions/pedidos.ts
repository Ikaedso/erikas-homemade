"use server";

import { after } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { enviarCorreo, hayEmail, plantillaCorreo } from "@/lib/email";
import { formatCOP } from "@/lib/format";
import type { MetodoEntrega, MetodoPago } from "@/lib/data/pedidos";

export type CrearPedidoInput = {
  entrega: MetodoEntrega;
  costoEntrega: number;
  pago: MetodoPago;
  nota: string;
  comprobantePath: string | null;
  items: { variante_id: string; cantidad: number }[];
};

export type CrearPedidoResult =
  | { ok: true; pedidoId: string }
  | { ok: false; error: string };

function mensajeError(raw: string): string {
  const m = raw.toLowerCase();
  if (m.includes("stock")) return "Una de las piezas se agotó. Revisa tu carrito.";
  if (m.includes("sesión") || m.includes("autenticad")) return "Debes iniciar sesión.";
  if (m.includes("vacío")) return "Tu carrito está vacío.";
  return "No pudimos crear el pedido. Intenta de nuevo.";
}

export async function crearPedido(input: CrearPedidoInput): Promise<CrearPedidoResult> {
  if (!input.items || input.items.length === 0) {
    return { ok: false, error: "Tu carrito está vacío." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Debes iniciar sesión." };

  if (input.pago === "transferencia" && !input.comprobantePath) {
    return { ok: false, error: "Sube el comprobante de la transferencia." };
  }

  const { data, error } = await supabase.rpc("crear_pedido", {
    p_entrega: input.entrega,
    p_costo_entrega: input.costoEntrega,
    p_pago: input.pago,
    p_nota: input.nota,
    p_comprobante_path: input.comprobantePath,
    p_items: input.items,
  });

  if (error) return { ok: false, error: mensajeError(error.message) };

  const pedido = Array.isArray(data) ? data[0] : data;
  if (!pedido?.id) return { ok: false, error: "No pudimos crear el pedido." };

  // Correo de confirmación al comprador (después de responder, sin bloquear).
  if (hayEmail() && user.email) {
    const to = user.email;
    const ref = `#EH-${String(pedido.numero ?? "").padStart(4, "0")}`;
    const total = Number(pedido.total_cop) || 0;
    const cierre =
      input.pago === "transferencia"
        ? "Érika verificará tu comprobante y confirmará el pedido por WhatsApp en menos de 24 h."
        : "Érika confirmará tu pedido por WhatsApp en menos de 24 h.";
    after(() =>
      enviarCorreo({
        to,
        subject: `Recibimos tu pedido ${ref}`,
        html: plantillaCorreo(
          `¡Tu pedido ${ref} ha sido agendado!`,
          `<p style="margin:0 0 12px;font-size:14px;color:#2E2438;line-height:1.6">
             ¡Gracias por tu compra! Recibimos tu pedido <strong>${ref}</strong> y quedó registrado.
           </p>
           <p style="margin:0 0 12px;font-size:14px;color:#2E2438;line-height:1.6">
             Total: <strong style="color:#5B2A86">${formatCOP(total)}</strong>
           </p>
           <p style="margin:0;font-size:14px;color:#2E2438;line-height:1.6">
             ${cierre} Te avisaremos por correo cada vez que cambie el estado.
           </p>`,
        ),
      }),
    );
  }

  return { ok: true, pedidoId: pedido.id as string };
}
