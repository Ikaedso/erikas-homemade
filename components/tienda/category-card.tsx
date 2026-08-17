import Link from "next/link";
import { cn } from "@/lib/utils";

export function CategoryCard({
  nombre,
  href,
  nota,
  destacada = false,
}: {
  nombre: string;
  href: string;
  nota?: string;
  destacada?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-[10px] bg-gradient-to-t from-moradoHondo via-morado/70 to-morado/30 p-4 transition-transform hover:-translate-y-0.5",
        destacada && "ring-1 ring-dorado/40",
      )}
    >
      {nota && <p className="eyebrow text-doradoClaro">{nota}</p>}
      <p className="mt-1 font-display text-[19px] text-blanco lg:text-[27px]">{nombre}</p>
    </Link>
  );
}
