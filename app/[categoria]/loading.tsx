import { ProductCardSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 lg:px-14 lg:py-14">
      <div className="flex flex-col items-center">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="mt-3 h-2.5 w-24" />
        <Skeleton className="mt-3 h-3 w-28" />
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-pill" />
        ))}
      </div>

      <div className="mt-6 lg:grid lg:grid-cols-[236px_1fr] lg:gap-11">
        <div className="hidden space-y-3 lg:block">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
