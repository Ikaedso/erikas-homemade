import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-[860px] px-4 py-10 lg:py-14">
      <Skeleton className="h-9 w-48" />
      <div className="mt-8 grid gap-5 lg:grid-cols-2 lg:gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-[14px] border border-tinta/[0.09] p-4 lg:p-5">
            <Skeleton className="h-5 w-32" />
            <div className="mt-4 space-y-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <Skeleton key={j} className="h-14 w-full rounded-[10px]" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
