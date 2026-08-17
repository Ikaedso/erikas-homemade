import { createClient } from "@/lib/supabase/server";
import { haySupabaseEnv } from "@/lib/supabase/config";
import type {
  Categoria,
  FotoProducto,
  ProductoPublico,
  Subcategoria,
  VariantePublica,
} from "./types";

/** Nombres de categoría de respaldo (para renderizar sin base de datos configurada). */
export const CATEGORIAS_CONOCIDAS: Record<string, string> = {
  mujer: "Mujer",
  hombre: "Hombre",
  nino: "Niño",
  manualidades: "Manualidades",
};

function haySupabase() {
  return haySupabaseEnv();
}

export async function getCategorias(): Promise<Categoria[]> {
  if (!haySupabase()) return [];
  const supabase = await createClient();
  const { data } = await supabase.from("categorias").select("*").order("orden");
  return data ?? [];
}

export async function getCategoriaPorSlug(slug: string): Promise<Categoria | null> {
  if (!haySupabase()) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("categorias").select("*").eq("slug", slug).maybeSingle();
  return data ?? null;
}

export async function getSubcategorias(categoriaId: string): Promise<Subcategoria[]> {
  if (!haySupabase()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("subcategorias")
    .select("*")
    .eq("categoria_id", categoriaId)
    .order("orden");
  return data ?? [];
}

export async function getSubcategoriasTodas(): Promise<Subcategoria[]> {
  if (!haySupabase()) return [];
  const supabase = await createClient();
  const { data } = await supabase.from("subcategorias").select("*").order("orden");
  return data ?? [];
}

export async function getProductosPorCategoria(categoriaId: string): Promise<ProductoPublico[]> {
  if (!haySupabase()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("catalogo_publico")
    .select("*")
    .eq("categoria_id", categoriaId)
    .order("creado_en", { ascending: false });
  return data ?? [];
}

export async function getDestacados(limite = 4): Promise<ProductoPublico[]> {
  if (!haySupabase()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("catalogo_publico")
    .select("*")
    .order("creado_en", { ascending: false })
    .limit(limite);
  return data ?? [];
}

export async function getProductoPorSlug(slug: string): Promise<ProductoPublico | null> {
  if (!haySupabase()) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("catalogo_publico")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data ?? null;
}

export async function getVariantes(productoId: string): Promise<VariantePublica[]> {
  if (!haySupabase()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("variantes_publicas")
    .select("*")
    .eq("producto_id", productoId);
  return data ?? [];
}

export async function getFotos(productoId: string): Promise<FotoProducto[]> {
  if (!haySupabase()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("fotos_producto")
    .select("*")
    .eq("producto_id", productoId)
    .order("orden");
  return data ?? [];
}

/** Hasta `max` fotos (por orden) de cada producto pedido, para galería en tarjetas. */
export async function getFotosGaleria(
  ids: string[],
  max = 4,
): Promise<Map<string, string[]>> {
  const mapa = new Map<string, string[]>();
  if (!haySupabase() || ids.length === 0) return mapa;
  const supabase = await createClient();
  const { data } = await supabase
    .from("fotos_producto")
    .select("producto_id, path, orden")
    .in("producto_id", ids)
    .order("orden");
  for (const f of (data as { producto_id: string; path: string }[]) ?? []) {
    const arr = mapa.get(f.producto_id) ?? [];
    if (arr.length < max) {
      arr.push(f.path);
      mapa.set(f.producto_id, arr);
    }
  }
  return mapa;
}

/** Foto principal (primera por orden) de cada producto pedido. */
export async function getFotosPrincipales(ids: string[]): Promise<Map<string, string>> {
  const mapa = new Map<string, string>();
  if (!haySupabase() || ids.length === 0) return mapa;
  const supabase = await createClient();
  const { data } = await supabase
    .from("fotos_producto")
    .select("producto_id, path, orden")
    .in("producto_id", ids)
    .order("orden");
  for (const f of (data as { producto_id: string; path: string }[]) ?? []) {
    if (!mapa.has(f.producto_id)) mapa.set(f.producto_id, f.path);
  }
  return mapa;
}

/**
 * Foto de portada por categoría: la foto principal del producto publicado más
 * reciente de cada categoría. Devuelve un mapa `categoria_id -> path`.
 */
export async function getPortadasCategorias(): Promise<Map<string, string>> {
  const mapa = new Map<string, string>();
  if (!haySupabase()) return mapa;
  const supabase = await createClient();
  const { data: prods } = await supabase
    .from("catalogo_publico")
    .select("id, categoria_id")
    .order("creado_en", { ascending: false });
  const lista = (prods as { id: string; categoria_id: string }[]) ?? [];
  if (lista.length === 0) return mapa;

  const fotos = await getFotosPrincipales(lista.map((p) => p.id));
  for (const p of lista) {
    const foto = fotos.get(p.id);
    if (foto && !mapa.has(p.categoria_id)) mapa.set(p.categoria_id, foto);
  }
  return mapa;
}

export async function getRelacionados(
  categoriaId: string,
  excluirId: string,
  limite = 4,
): Promise<ProductoPublico[]> {
  if (!haySupabase()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("catalogo_publico")
    .select("*")
    .eq("categoria_id", categoriaId)
    .neq("id", excluirId)
    .limit(limite);
  return data ?? [];
}
