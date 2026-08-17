import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 lg:px-14 lg:py-12">
      <Skeleton className="h-3 w-44" />
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_440px] lg:gap-12">
        <Skeleton className="aspect-[4/5] w-full rounded-[12px]" />
        <div>
          <Skeleton className="h-2.5 w-24" />
          <Skeleton className="mt-3 h-8 w-3/4" />
          <Skeleton className="mt-4 h-7 w-32" />
          <Skeleton className="mt-5 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-2/3" />
          <Skeleton className="mt-6 h-11 w-full rounded-pill" />
          <Skeleton className="mt-3 h-11 w-full rounded-pill" />
        </div>
      </div>
    </div>
  );
}
