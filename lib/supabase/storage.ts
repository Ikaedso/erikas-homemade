import { SUPABASE_URL } from "./config";

/** URL pública de una foto de producto en el bucket `productos`. */
export function urlFotoProducto(path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/productos/${path}`;
}
