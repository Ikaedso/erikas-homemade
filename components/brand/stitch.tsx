import { cn } from "@/lib/utils";

/** La "puntada": costura dorada discontinua que separa secciones. */
export function Stitch({ className }: { className?: string }) {
  return <div aria-hidden className={cn("puntada", className)} />;
}
