import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-pill font-body text-[13px] font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primario de marca
        default: "bg-morado text-blanco hover:bg-moradoHondo",
        // Contorno
        outline: "border border-tinta/15 bg-blanco text-tinta hover:bg-lavanda",
        // Sobre fondo oscuro (footer, hero)
        claro: "bg-blanco text-moradoHondo hover:bg-lavanda",
        // Acento dorado
        dorado: "bg-dorado text-blanco hover:brightness-95",
        ghost: "text-tinta hover:bg-lavanda",
        link: "text-morado underline-offset-4 hover:underline",
      },
      size: {
        // 44px de alto: área táctil mínima en móvil
        default: "h-11 px-5",
        sm: "h-9 px-4 text-[12px]",
        lg: "h-12 px-7 text-[14px]",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
