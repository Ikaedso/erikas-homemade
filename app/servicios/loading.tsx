import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-[1100px] px-4 py-12 lg:px-8 lg:py-16">
      <Skeleton className="h-2.5 w-28" />
      <Skeleton className="mt-3 h-9 w-3/4" />
      <Skeleton className="mt-2 h-9 w-1/2" />
      <Skeleton className="mt-4 h-4 w-2/3" />

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-[14px] border border-tinta/[0.09] p-5">
            <div className="flex items-start justify-between gap-3">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-6 w-16 rounded-pill" />
            </div>
            <Skeleton className="mt-3 h-3 w-3/4" />
            <div className="mt-4 flex items-end justify-between border-t border-tinta/[0.07] pt-4">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-9 w-24 rounded-pill" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
