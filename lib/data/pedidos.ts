import { createClient } from "@/lib/supabase/server";

export type EstadoPedido = "nuevo" | "pagado" | "enviado" | "entregado" | "cancelado";
export type MetodoEntrega = "taller" | "delivery" | "punto";
export type MetodoPago = "transferencia" | "efectivo";

export type Pedido = {
  id: string;
  numero: number;
  cliente_id: string;
  estado: EstadoPedido;
  entrega: MetodoEntrega;
  costo_entrega_cop: number;
  pago: MetodoPago;
  comprobante_path: string | null;
  nota: string | null;
  total_cop: number;
  creado_en: string;
};

export type ItemPedido = {
  id: string;
  pedido_id: string;
  nombre_producto: string;
  talla: string;
  precio_unitario_cop: number;
  cantidad: number;
};

export async function getPedido(
  id: string,
): Promise<{ pedido: Pedido; items: ItemPedido[] } | null> {
  const supabase = await createClient();
  const { data: pedido } = await supabase.from("pedidos").select("*").eq("id", id).maybeSingle();
  if (!pedido) return null;
  const { data: items } = await supabase
    .from("items_pedido")
    .select("*")
    .eq("pedido_id", id);
  return { pedido: pedido as Pedido, items: (items as ItemPedido[]) ?? [] };
}

export async function getMisPedidos(): Promise<Pedido[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("pedidos")
    .select("*")
    .order("creado_en", { ascending: false });
  return (data as Pedido[]) ?? [];
}
