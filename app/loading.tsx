import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-16 lg:px-14">
      <Skeleton className="mx-auto h-8 w-56" />
      <Skeleton className="mx-auto mt-4 h-4 w-72" />
      <div className="mt-10 grid grid-cols-3 gap-3 lg:gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[3/4] w-full rounded-[10px]" />
        ))}
      </div>
    </div>
  );
}
