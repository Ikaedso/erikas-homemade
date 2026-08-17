import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-[4px] px-2.5 py-1 font-body text-[10px] font-medium uppercase tracking-[0.06em]",
  {
    variants: {
      variant: {
        // Producto
        disponible: "bg-lavanda text-morado",
        agotado: "bg-tinta/[0.06] text-tinta/55",
        piezaUnica: "bg-dorado text-blanco",
        // Genérico
        neutro: "bg-lavanda text-moradoHondo",
      },
    },
    defaultVariants: {
      variant: "neutro",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
