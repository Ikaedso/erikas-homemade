"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Stitch } from "@/components/brand/stitch";
import { AuthGate } from "@/components/cart/auth-gate";
import { itemKey, useCart } from "@/components/cart/cart-provider";
import { useUser } from "@/lib/auth/use-user";
import { formatCOP } from "@/lib/format";

export default function CarritoPage() {
  const { items, subtotal, setCantidad, remove } = useCart();
  const { user } = useUser();
  const router = useRouter();
  const [mostrarGate, setMostrarGate] = useState(false);

  function irAlPago() {
    if (user) {
      router.push("/pagar");
    } else {
      setMostrarGate(true);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-20 lg:px-14">
        <div className="mx-auto max-w-md rounded-[12px] border border-dashed border-tinta/15 py-16 text-center">
          <h1 className="font-display text-[24px] text-moradoHondo">Tu carrito está vacío</h1>
          <p className="mt-2 text-[13px] text-tinta/60">Aún no has agregado piezas.</p>
          <Button asChild className="mt-6" size="lg">
            <Link href="/mujer">Ver el catálogo</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 lg:px-14 lg:py-14">
      <h1 className="font-display text-[30px] text-moradoHondo lg:text-[40px]">Tu carrito</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_400px]">
        {/* Líneas */}
        <div>
          {items.map((i, idx) => {
            const key = itemKey(i);
            return (
              <div key={key}>
                {idx > 0 && <Stitch className="my-4 border-dorado/40" />}
                <div className="flex gap-4">
                  <div className="flex size-[82px] shrink-0 items-center justify-center rounded-[7px] bg-gradient-to-br from-lavanda to-nieve text-center">
                    <span className="px-1 font-display text-[11px] text-morado/40">{i.nombre}</span>
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          href={`/producto/${i.slug}`}
                          className="font-display text-[15px] text-tinta hover:text-morado"
                        >
                          {i.nombre}
                        </Link>
                        <p className="text-[12px] text-tinta/55">
                          {i.talla} · {i.color}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label="Quitar"
                        onClick={() => remove(key)}
                        className="text-tinta/40 transition-colors hover:text-[#B23A5B]"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-3">
                      {i.esPiezaUnica ? (
                        <span className="text-[12px] text-dorado">Pieza única: solo hay una</span>
                      ) : (
                        <div className="flex items-center rounded-pill border border-tinta/[0.16]">
                          <button
                            type="button"
                            aria-label="Restar"
                            onClick={() => setCantidad(key, i.cantidad - 1)}
                            className="grid size-8 place-items-center text-morado disabled:opacity-40"
                            disabled={i.cantidad <= 1}
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="w-7 text-center text-[13px] font-medium tabular-nums">
                            {i.cantidad}
                          </span>
                          <button
                            type="button"
                            aria-label="Sumar"
                            onClick={() => setCantidad(key, i.cantidad + 1)}
                            className="grid size-8 place-items-center text-morado"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                      )}
                      <span className="font-display text-[15px] text-tinta">
                        {formatCOP(i.precioCop * i.cantidad)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Resumen */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          {mostrarGate && !user ? (
            <AuthGate next="/pagar" />
          ) : (
            <div className="rounded-[12px] border border-tinta/[0.09] bg-nieve p-6">
              <div className="flex justify-between text-[13px] text-tinta/70">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatCOP(subtotal)}</span>
              </div>
              <div className="mt-2 flex justify-between text-[13px] text-tinta/70">
                <span>Entrega</span>
                <span>Se calcula al pagar</span>
              </div>
              <Stitch className="my-4 border-dorado/50" />
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-tinta">Total</span>
                <span className="font-display text-[24px] text-moradoHondo">
                  {formatCOP(subtotal)}
                </span>
              </div>
              <Button className="mt-5 w-full" size="lg" onClick={irAlPago}>
                Ir al pago
              </Button>
              <p className="mt-3 text-center text-[12px] text-tinta/55">
                Necesitas iniciar sesión para completar la compra.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
