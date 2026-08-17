import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 lg:px-14 lg:py-12">
      <Skeleton className="h-3 w-44" />
      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,500px)_1fr] lg:gap-12">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="order-2 flex gap-2.5 lg:order-1 lg:w-[66px] lg:flex-col">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="size-16 shrink-0 rounded-[8px] lg:size-[66px]" />
            ))}
          </div>
          <Skeleton className="order-1 aspect-[4/5] w-full rounded-[12px] lg:order-2 lg:max-w-[420px]" />
        </div>
        <div>
          <Skeleton className="h-2.5 w-24" />
          <Skeleton className="mt-3 h-8 w-3/4" />
          <Skeleton className="mt-4 h-7 w-32" />
          <Skeleton className="mt-5 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-2/3" />
          <Skeleton className="mt-6 h-11 w-full max-w-[420px] rounded-pill" />
          <Skeleton className="mt-3 h-11 w-full max-w-[420px] rounded-pill" />
        </div>
      </div>
    </div>
  );
}
