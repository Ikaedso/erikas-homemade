import { ProductCardSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 lg:px-14 lg:py-14">
      <Skeleton className="h-2.5 w-24" />
      <Skeleton className="mt-3 h-9 w-1/2" />
      <Skeleton className="mt-2 h-3 w-28" />
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
