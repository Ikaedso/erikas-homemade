import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Stitch } from "@/components/brand/stitch";

export type SubcatConteo = { slug: string; nombre: string; count: number };

function href(categoriaSlug: string, sub: string | null, disp: boolean) {
  const params = new URLSearchParams();
  if (sub) params.set("sub", sub);
  if (disp) params.set("disp", "1");
  const qs = params.toString();
  return `/${categoriaSlug}${qs ? `?${qs}` : ""}`;
}

/** Chips horizontales (móvil). */
export function SubcategoryChips({
  categoriaSlug,
  subs,
  subActivo,
  dispActivo,
}: {
  categoriaSlug: string;
  subs: SubcatConteo[];
  subActivo?: string;
  dispActivo: boolean;
}) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:hidden">
      <Chip href={href(categoriaSlug, null, dispActivo)} activo={!subActivo}>
        Todo
      </Chip>
      {subs.map((s) => (
        <Chip
          key={s.slug}
          href={href(categoriaSlug, s.slug, dispActivo)}
          activo={subActivo === s.slug}
        >
          {s.nombre}
        </Chip>
      ))}
    </div>
  );
}

function Chip({ href, activo, children }: { href: string; activo: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "whitespace-nowrap rounded-pill border px-4 py-2 text-[13px] font-medium transition-colors",
        activo
          ? "border-transparent bg-morado text-blanco"
          : "border-tinta/15 bg-blanco text-tinta hover:bg-lavanda",
      )}
    >
      {children}
    </Link>
  );
}

/** Barra lateral (escritorio). */
export function FilterSidebar({
  categoriaSlug,
  subs,
  subActivo,
  dispActivo,
  total,
}: {
  categoriaSlug: string;
  subs: SubcatConteo[];
  subActivo?: string;
  dispActivo: boolean;
  total: number;
}) {
  return (
    <aside className="hidden w-[236px] shrink-0 lg:block">
      <p className="eyebrow text-tinta/50">Subcategorías</p>
      <ul className="mt-3 space-y-1">
        <FilterRow
          href={href(categoriaSlug, null, dispActivo)}
          activo={!subActivo}
          nombre="Todo"
          count={total}
        />
        {subs.map((s) => (
          <FilterRow
            key={s.slug}
            href={href(categoriaSlug, s.slug, dispActivo)}
            activo={subActivo === s.slug}
            nombre={s.nombre}
            count={s.count}
          />
        ))}
      </ul>

      <Stitch className="my-5 border-dorado/60" />

      <p className="eyebrow text-tinta/50">Disponibilidad</p>
      <Link
        href={href(categoriaSlug, subActivo ?? null, !dispActivo)}
        className="mt-3 flex items-center gap-2.5 text-[13px] text-tinta"
      >
        <span
          className={cn(
            "grid size-4 place-items-center rounded-[4px] border",
            dispActivo ? "border-morado bg-morado text-blanco" : "border-tinta/25 bg-blanco",
          )}
        >
          {dispActivo && <Check className="size-3" strokeWidth={3} />}
        </span>
        Solo disponible
      </Link>
    </aside>
  );
}

function FilterRow({
  href,
  activo,
  nombre,
  count,
}: {
  href: string;
  activo: boolean;
  nombre: string;
  count: number;
}) {
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "flex items-center justify-between rounded-[7px] px-3 py-2 text-[13px] transition-colors",
          activo ? "bg-lavanda font-medium text-moradoHondo" : "text-tinta/80 hover:bg-lavanda/60",
        )}
      >
        <span>{nombre}</span>
        <span className={cn("text-[12px]", activo ? "text-morado" : "text-tinta/40")}>{count}</span>
      </Link>
    </li>
  );
}
