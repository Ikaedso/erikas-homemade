"use server";

import { createClient } from "@/lib/supabase/server";
import { haySupabaseEnv } from "@/lib/supabase/config";
import { getFotosPrincipales } from "@/lib/data/catalogo";
import { urlFotoProducto } from "@/lib/supabase/storage";

export type ResultadoBusqueda = {
  id: string;
  slug: string;
  nombre: string;
  precio_cop: number;
  disponible: boolean;
  es_pieza_unica: boolean;
  categoriaNombre: string | null;
  fotoUrl: string | null;
};

type Fila = {
  id: string;
  slug: string;
  nombre: string;
  precio_cop: number;
  disponible: boolean;
  es_pieza_unica: boolean;
  categoria_id: string;
};

/**
 * Busca prendas parecidas a lo que escribe el cliente: coincide por nombre y
 * descripción del producto y también por nombre de categoría/subcategoría
 * (así "blusa" trae la subcategoría Blusas aunque el nombre no lo diga).
 */
export async function buscarProductos(q: string, limite = 8): Promise<ResultadoBusqueda[]> {
  const term = q.trim();
  if (!haySupabaseEnv() || term.length < 2) return [];
  const supabase = await createClient();

  // Palabras limpias (sin símbolos que rompan el filtro de PostgREST).
  const palabras = term
    .split(/\s+/)
    .map((w) => w.replace(/[^\p{L}\p{N}]/gu, ""))
    .filter((w) => w.length >= 2)
    .slice(0, 5);
  if (palabras.length === 0) return [];

  const contiene = (texto: string, w: string) => texto.toLowerCase().includes(w.toLowerCase());

  // Categorías / subcategorías cuyo nombre coincide con alguna palabra.
  const [{ data: cats }, { data: subs }] = await Promise.all([
    supabase.from("categorias").select("id, nombre"),
    supabase.from("subcategorias").select("id, nombre"),
  ]);
  const categorias = (cats as { id: string; nombre: string }[]) ?? [];
  const subcategorias = (subs as { id: string; nombre: string }[]) ?? [];
  const nombrePorCat = new Map(categorias.map((c) => [c.id, c.nombre]));

  const catIds = categorias
    .filter((c) => palabras.some((w) => contiene(c.nombre, w)))
    .map((c) => c.id);
  const subIds = subcategorias
    .filter((s) => palabras.some((w) => contiene(s.nombre, w)))
    .map((s) => s.id);

  const orParts = palabras.flatMap((w) => [`nombre.ilike.%${w}%`, `descripcion.ilike.%${w}%`]);
  if (catIds.length) orParts.push(`categoria_id.in.(${catIds.join(",")})`);
  if (subIds.length) orParts.push(`subcategoria_id.in.(${subIds.join(",")})`);

  const { data } = await supabase
    .from("catalogo_publico")
    .select("id, slug, nombre, precio_cop, disponible, es_pieza_unica, categoria_id")
    .or(orParts.join(","))
    .order("creado_en", { ascending: false })
    .limit(limite);

  const filas = (data as Fila[]) ?? [];
  if (filas.length === 0) return [];

  const fotos = await getFotosPrincipales(filas.map((f) => f.id));
  return filas.map((f) => ({
    id: f.id,
    slug: f.slug,
    nombre: f.nombre,
    precio_cop: f.precio_cop,
    disponible: f.disponible,
    es_pieza_unica: f.es_pieza_unica,
    categoriaNombre: nombrePorCat.get(f.categoria_id) ?? null,
    fotoUrl: fotos.get(f.id) ? urlFotoProducto(fotos.get(f.id)!) : null,
  }));
}
