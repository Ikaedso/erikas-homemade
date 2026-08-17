"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ITEMS = [
  { label: "Panel", href: "/admin" },
  { label: "Productos", href: "/admin/productos" },
  { label: "Servicios", href: "/admin/servicios" },
  { label: "Citas", href: "/admin/citas" },
  { label: "Pedidos", href: "/admin/pedidos" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:gap-0.5">
      {ITEMS.map((item) => {
        const activo = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "whitespace-nowrap rounded-[8px] px-3 py-2 text-[13.5px] transition-colors",
              activo
                ? "bg-lavanda font-medium text-moradoHondo"
                : "text-tinta/70 hover:bg-lavanda/60",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
