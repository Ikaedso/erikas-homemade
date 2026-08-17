"use server";

import { createClient } from "@/lib/supabase/server";
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

  return { ok: true, pedidoId: pedido.id as string };
}
