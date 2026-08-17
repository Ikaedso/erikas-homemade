"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Stitch } from "@/components/brand/stitch";
import { useCart } from "@/components/cart/cart-provider";
import { createClient } from "@/lib/supabase/client";
import { crearPedido } from "@/actions/pedidos";
import { formatCOP } from "@/lib/format";
import { ENTREGAS, PAGOS, costoEntrega } from "@/lib/checkout/opciones";
import type { MetodoEntrega, MetodoPago } from "@/lib/data/pedidos";

function RadioCard({
  activo,
  onClick,
  nombre,
  detalle,
  extra,
}: {
  activo: boolean;
  onClick: () => void;
  nombre: string;
  detalle: string;
  extra?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-3 rounded-[10px] border p-4 text-left transition-colors",
        activo ? "border-morado bg-lavanda" : "border-tinta/[0.16] hover:bg-lavanda/50",
      )}
    >
      <span
        className={cn(
          "mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border",
          activo ? "border-morado" : "border-tinta/30",
        )}
      >
        {activo && <span className="size-2 rounded-full bg-morado" />}
      </span>
      <span className="flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="text-[14px] font-medium text-tinta">{nombre}</span>
          {extra && <span className="text-[13px] font-medium text-moradoHondo">{extra}</span>}
        </span>
        <span className="mt-0.5 block text-[12.5px] text-tinta/60">{detalle}</span>
      </span>
    </button>
  );
}

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();

  const [entrega, setEntrega] = useState<MetodoEntrega>("taller");
  const [pago, setPago] = useState<MetodoPago>("transferencia");
  const [nota, setNota] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Vista previa del comprobante (solo imágenes); se libera al cambiar/desmontar.
  useEffect(() => {
    if (archivo && archivo.type.startsWith("image/")) {
      const url = URL.createObjectURL(archivo);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [archivo]);

  const envio = costoEntrega(entrega);
  const total = subtotal + envio;

  if (items.length === 0) {
    return (
      <div className="rounded-[12px] border border-dashed border-tinta/15 py-16 text-center">
        <p className="font-display text-[20px] text-moradoHondo">Tu carrito está vacío</p>
        <Button asChild className="mt-5" size="lg">
          <Link href="/mujer">Ver el catálogo</Link>
        </Button>
      </div>
    );
  }

  async function confirmar() {
    setError(null);

    if (pago === "transferencia" && !archivo) {
      setError("Sube el comprobante de la transferencia.");
      return;
    }
    if (archivo && archivo.size > 5 * 1024 * 1024) {
      setError("El comprobante no puede pesar más de 5 MB.");
      return;
    }

    setEnviando(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/entrar?next=/pagar");
        return;
      }

      // Subir comprobante (si aplica) al bucket privado
      let comprobantePath: string | null = null;
      if (archivo) {
        const limpio = archivo.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${user.id}/${Date.now()}-${limpio}`;
        const { error: upErr } = await supabase.storage
          .from("comprobantes")
          .upload(path, archivo, { upsert: false });
        if (upErr) {
          setError("No pudimos subir el comprobante. Intenta de nuevo.");
          setEnviando(false);
          return;
        }
        comprobantePath = path;
      }

      const res = await crearPedido({
        entrega,
        costoEntrega: envio,
        pago,
        nota,
        comprobantePath,
        items: items.map((i) => ({ variante_id: i.varianteId, cantidad: i.cantidad })),
      });

      if (!res.ok) {
        setError(res.error);
        setEnviando(false);
        return;
      }

      clear();
      router.push(`/pedido/${res.pedidoId}`);
    } catch {
      setError("Algo salió mal. Intenta de nuevo.");
      setEnviando(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
      {/* Formulario */}
      <div className="space-y-8">
        <section>
          <h2 className="font-display text-[18px] text-moradoHondo">¿Cómo la recibes?</h2>
          <div className="mt-3 space-y-2.5">
            {ENTREGAS.map((e) => (
              <RadioCard
                key={e.id}
                activo={entrega === e.id}
                onClick={() => setEntrega(e.id)}
                nombre={e.nombre}
                detalle={e.detalle}
                extra={e.costo === 0 ? "Gratis" : formatCOP(e.costo)}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-[18px] text-moradoHondo">Método de pago</h2>
          <div className="mt-3 space-y-2.5">
            {PAGOS.map((p) => (
              <RadioCard
                key={p.id}
                activo={pago === p.id}
                onClick={() => setPago(p.id)}
                nombre={p.nombre}
                detalle={p.detalle}
              />
            ))}
          </div>

          {pago === "transferencia" && (
            <div className="puntada mt-3 rounded-b-[10px] border-x border-b border-dorado/40 border-t-dorado bg-nieve p-4">
              <p className="text-[13px] text-tinta/75">
                Transfiere el total y sube el comprobante. Érika verifica y confirma tu pedido.
              </p>
              <p className="mt-2 text-[13px] text-tinta/60">
                Bancolombia · Ahorros 000-000000-00 · Erika&apos;s Homemade
                <br />
                (Datos de ejemplo — Érika los configura en el panel.)
              </p>
              <label className="mt-3 block">
                <span className="mb-1.5 block text-[12px] font-medium text-tinta/70">
                  Comprobante (imagen o PDF, máx. 5 MB)
                </span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
                  className="block w-full text-[13px] text-tinta file:mr-3 file:rounded-pill file:border-0 file:bg-morado file:px-4 file:py-2 file:text-[12px] file:font-medium file:text-blanco hover:file:bg-moradoHondo"
                />
              </label>

              {archivo && (
                <div className="mt-3 flex items-center gap-3 rounded-[10px] border border-morado/20 bg-blanco p-2.5">
                  {previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewUrl}
                      alt="Vista previa del comprobante"
                      className="size-14 shrink-0 rounded-[8px] object-cover"
                    />
                  ) : (
                    <span className="grid size-14 shrink-0 place-items-center rounded-[8px] bg-lavanda text-morado">
                      <FileText className="size-6" />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 text-[13px] font-medium text-moradoHondo">
                      <Check className="size-3.5 text-morado" /> Comprobante cargado
                    </p>
                    <p className="truncate text-[12px] text-tinta/60">{archivo.name}</p>
                    <p className="text-[11px] text-tinta/45">
                      {(archivo.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setArchivo(null)}
                    aria-label="Quitar comprobante"
                    className="grid size-8 shrink-0 place-items-center rounded-full text-tinta/50 transition-colors hover:bg-lavanda hover:text-[#B23A5B]"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        <section>
          <h2 className="font-display text-[18px] text-moradoHondo">Nota para Érika</h2>
          <textarea
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="Algo que debamos saber sobre tu pedido (opcional)"
            className="mt-3 w-full rounded-[10px] border border-tinta/[0.16] bg-blanco p-3 text-[14px] text-tinta placeholder:text-tinta/45 focus-visible:border-morado focus-visible:outline-none"
          />
        </section>
      </div>

      {/* Resumen */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-[12px] border border-tinta/[0.09] bg-nieve p-6">
          <h2 className="font-display text-[17px] text-moradoHondo">Tu pedido</h2>
          <ul className="mt-3 space-y-2">
            {items.map((i) => (
              <li key={i.varianteId} className="flex justify-between gap-3 text-[13px]">
                <span className="text-tinta/75">
                  {i.cantidad}× {i.nombre} · {i.talla}
                </span>
                <span className="tabular-nums">{formatCOP(i.precioCop * i.cantidad)}</span>
              </li>
            ))}
          </ul>
          <Stitch className="my-4 border-dorado/50" />
          <div className="space-y-1.5 text-[13px] text-tinta/75">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatCOP(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Entrega</span>
              <span className="tabular-nums">{envio === 0 ? "Gratis" : formatCOP(envio)}</span>
            </div>
          </div>
          <Stitch className="my-4 border-dorado/50" />
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-tinta">Total</span>
            <span className="font-display text-[24px] text-moradoHondo">{formatCOP(total)}</span>
          </div>

          {error && <p className="mt-3 text-[13px] text-[#B23A5B]">{error}</p>}

          <Button className="mt-5 w-full" size="lg" onClick={confirmar} disabled={enviando}>
            {enviando ? "Confirmando…" : "Confirmar pedido"}
          </Button>
          <p className="mt-3 text-center text-[12px] text-tinta/55">
            Érika confirma por WhatsApp en menos de 24 h.
          </p>
        </div>
      </div>
    </div>
  );
}
