import { createClient } from "@/lib/supabase/server";
import type { EstadoPedido, MetodoEntrega, MetodoPago } from "@/lib/data/pedidos";
import type { EstadoCita } from "@/lib/data/citas";

export type PedidoAdmin = {
  id: string;
  numero: number;
  estado: EstadoPedido;
  entrega: MetodoEntrega;
  pago: MetodoPago;
  comprobante_path: string | null;
  total_cop: number;
  creado_en: string;
  perfiles: { nombre: string } | null;
};

export type CitaAdmin = {
  id: string;
  inicia_en: string;
  estado: EstadoCita;
  nota_cliente: string | null;
  servicios: { nombre: string } | null;
  perfiles: { nombre: string } | null;
};

export type ProductoAdmin = {
  id: string;
  slug: string;
  nombre: string;
  precio_cop: number;
  publicado: boolean;
  es_pieza_unica: boolean;
  categorias: { nombre: string } | null;
  subcategorias: { nombre: string } | null;
  variantes: { stock: number }[];
};

export type Variante = {
  id: string;
  producto_id: string;
  talla: string;
  color: string;
  stock: number;
};

const TZ = "America/Bogota";

function inicioMesBogotaISO(): string {
  const ymd = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const mes = ymd.slice(0, 7);
  return new Date(`${mes}-01T00:00:00-05:00`).toISOString();
}

function rangoHoyBogotaISO(): [string, string] {
  const ymd = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const desde = new Date(`${ymd}T00:00:00-05:00`);
  const hasta = new Date(desde);
  hasta.setDate(hasta.getDate() + 1);
  return [desde.toISOString(), hasta.toISOString()];
}

export async function getResumen() {
  const supabase = await createClient();

  const { data: pedidosMes } = await supabase
    .from("pedidos")
    .select("total_cop, estado")
    .gte("creado_en", inicioMesBogotaISO());

  const ventasMes = (pedidosMes ?? [])
    .filter((p) => ["pagado", "enviado", "entregado"].includes(p.estado))
    .reduce((n, p) => n + p.total_cop, 0);

  const { count: pedidosNuevos } = await supabase
    .from("pedidos")
    .select("id", { count: "exact", head: true })
    .eq("estado", "nuevo");

  const [desde, hasta] = rangoHoyBogotaISO();
  const { count: citasHoy } = await supabase
    .from("citas")
    .select("id", { count: "exact", head: true })
    .gte("inicia_en", desde)
    .lt("inicia_en", hasta)
    .neq("estado", "cancelada");

  const stockBajo = await getStockBajo();

  return {
    ventasMes,
    pedidosNuevos: pedidosNuevos ?? 0,
    citasHoy: citasHoy ?? 0,
    stockBajo,
  };
}

export async function getStockBajo(): Promise<
  { id: string; nombre: string; talla: string; color: string; stock: number }[]
> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("variantes")
    .select("id, talla, color, stock, productos(nombre, aviso_stock_bajo)")
    .order("stock");
  type Row = {
    id: string;
    talla: string;
    color: string;
    stock: number;
    productos: { nombre: string; aviso_stock_bajo: number } | null;
  };
  return ((data as unknown as Row[]) ?? [])
    .filter((v) => v.productos && v.stock <= v.productos.aviso_stock_bajo)
    .map((v) => ({
      id: v.id,
      nombre: v.productos!.nombre,
      talla: v.talla,
      color: v.color,
      stock: v.stock,
    }));
}

export async function getUltimosPedidos(limite = 6): Promise<PedidoAdmin[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("pedidos")
    .select("id, numero, estado, entrega, pago, comprobante_path, total_cop, creado_en, perfiles(nombre)")
    .order("creado_en", { ascending: false })
    .limit(limite);
  return (data as unknown as PedidoAdmin[]) ?? [];
}

export async function getPedidosAdmin(): Promise<PedidoAdmin[]> {
  return getUltimosPedidos(100);
}

export async function getCitasAdmin(): Promise<CitaAdmin[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("citas")
    .select("id, inicia_en, estado, nota_cliente, servicios(nombre), perfiles(nombre)")
    .order("inicia_en", { ascending: false });
  return (data as unknown as CitaAdmin[]) ?? [];
}

export async function getProductosAdmin(): Promise<ProductoAdmin[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("productos")
    .select(
      "id, slug, nombre, precio_cop, publicado, es_pieza_unica, categorias(nombre), subcategorias(nombre), variantes(stock)",
    )
    .order("creado_en", { ascending: false });
  return (data as unknown as ProductoAdmin[]) ?? [];
}

export async function getProductoAdmin(id: string) {
  const supabase = await createClient();
  const { data: producto } = await supabase
    .from("productos")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!producto) return null;
  const { data: variantes } = await supabase
    .from("variantes")
    .select("*")
    .eq("producto_id", id)
    .order("talla");
  return { producto, variantes: (variantes as Variante[]) ?? [] };
}

export async function getServiciosAdmin() {
  const supabase = await createClient();
  const { data } = await supabase.from("servicios").select("*").order("nombre");
  return data ?? [];
}
