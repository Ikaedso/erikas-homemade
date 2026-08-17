import type { MetadataRoute } from "next";
import { CATEGORIAS_CONOCIDAS } from "@/lib/data/catalogo";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const estaticas = ["", "/servicios", "/contacto"].map((p) => ({
    url: `${base}${p}`,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.7,
  }));

  const categorias = Object.keys(CATEGORIAS_CONOCIDAS).map((slug) => ({
    url: `${base}/${slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...estaticas, ...categorias];
}
