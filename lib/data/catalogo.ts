import { createClient } from "@/lib/supabase/server";
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
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
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
