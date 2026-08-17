/** Tipos del catálogo público (vistas de Supabase que NO exponen stock). */

export type Categoria = {
  id: string;
  slug: string;
  nombre: string;
  orden: number;
};

export type Subcategoria = {
  id: string;
  categoria_id: string;
  slug: string;
  nombre: string;
  orden: number;
};

export type ProductoPublico = {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string | null;
  precio_cop: number;
  categoria_id: string;
  subcategoria_id: string | null;
  es_pieza_unica: boolean;
  ajuste_gratis: boolean;
  creado_en: string;
  disponible: boolean;
};

export type VariantePublica = {
  id: string;
  producto_id: string;
  talla: string;
  color: string;
  disponible: boolean;
};

export type FotoProducto = {
  id: string;
  producto_id: string;
  path: string;
  orden: number;
  alt: string | null;
};

/** Estado visible del producto (nunca la cantidad). */
export type EstadoProducto = "disponible" | "agotado" | "piezaUnica";

export function estadoProducto(p: Pick<ProductoPublico, "disponible" | "es_pieza_unica">): {
  key: EstadoProducto;
  label: string;
} {
  if (!p.disponible) return { key: "agotado", label: "Agotado" };
  if (p.es_pieza_unica) return { key: "piezaUnica", label: "Pieza única" };
  return { key: "disponible", label: "Disponible" };
}
