import { cn } from "@/lib/utils";

/** Bloque de carga con pulso. Úsalo para armar esqueletos de cualquier vista. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-[8px] bg-tinta/[0.07]", className)} />;
}

/** Esqueleto de una tarjeta de producto (imagen + textos). */
export function ProductCardSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-[4/5] w-full rounded-[10px]" />
      <Skeleton className="mt-3 h-2.5 w-1/2" />
      <Skeleton className="mt-2 h-3.5 w-3/4" />
      <Skeleton className="mt-2 h-3 w-1/3" />
    </div>
  );
}
