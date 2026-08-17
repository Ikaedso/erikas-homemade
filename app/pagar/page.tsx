"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Stitch } from "@/components/brand/stitch";
import { useCart } from "@/components/cart/cart-provider";
import { formatCOP } from "@/lib/format";

export default function PagarPage() {
  const { items, subtotal } = useCart();

  return (
    <div className="mx-auto max-w-[720px] px-4 py-12 lg:py-16">
      <h1 className="font-display text-[30px] text-moradoHondo lg:text-[40px]">Finalizar compra</h1>

      <div className="mt-6 rounded-[12px] border border-dashed border-dorado/50 bg-nieve p-6">
        <p className="eyebrow text-dorado">En construcción · Fase 5</p>
        <p className="mt-2 text-[14px] text-tinta/72">
          El checkout completo —entrega (retiro / delivery / punto), pago por transferencia con
          subida de comprobante y confirmación del pedido— se conecta en la siguiente fase. Ya
          estás con sesión iniciada, así que la puerta de registro funciona. ✅
        </p>
      </div>

      {items.length > 0 ? (
        <div className="mt-8">
          <h2 className="font-display text-[18px] text-moradoHondo">Tu pedido</h2>
          <ul className="mt-3 space-y-2">
            {items.map((i) => (
              <li key={`${i.slug}-${i.talla}-${i.color}`} className="flex justify-between text-[13px]">
                <span className="text-tinta/75">
                  {i.cantidad}× {i.nombre} · {i.talla} · {i.color}
                </span>
                <span className="tabular-nums">{formatCOP(i.precioCop * i.cantidad)}</span>
              </li>
            ))}
          </ul>
          <Stitch className="my-4 border-dorado/50" />
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-tinta">Subtotal</span>
            <span className="font-display text-[22px] text-moradoHondo">{formatCOP(subtotal)}</span>
          </div>
        </div>
      ) : (
        <p className="mt-8 text-[14px] text-tinta/60">Tu carrito está vacío.</p>
      )}

      <Button asChild variant="outline" className="mt-8">
        <Link href="/carrito">Volver al carrito</Link>
      </Button>
    </div>
  );
}
