"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { agregarVariante, eliminarVariante, setStockVariante } from "@/actions/admin";
import type { Variante } from "@/lib/data/admin";

export function StockEditor({
  productoId,
  variantes,
}: {
  productoId: string;
  variantes: Variante[];
}) {
  const router = useRouter();
  const [talla, setTalla] = useState("");
  const [color, setColor] = useState("");
  const [stock, setStock] = useState("0");
  const [error, setError] = useState<string | null>(null);
  const [pendiente, startTransition] = useTransition();

  function guardarStock(varianteId: string, valor: string) {
    const n = Math.round(Number(valor));
    if (!Number.isFinite(n) || n < 0) return;
    startTransition(async () => {
      await setStockVariante(varianteId, n);
    });
  }

  function agregar() {
    setError(null);
    if (!talla.trim() || !color.trim()) {
      setError("Talla y color son obligatorios.");
      return;
    }
    startTransition(async () => {
      const res = await agregarVariante(productoId, talla, color, Math.max(0, Math.round(Number(stock) || 0)));
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setTalla("");
      setColor("");
      setStock("0");
      router.refresh();
    });
  }

  function borrar(varianteId: string) {
    startTransition(async () => {
      await eliminarVariante(varianteId, productoId);
      router.refresh();
    });
  }

  return (
    <div className="rounded-[12px] border border-tinta/[0.09] bg-blanco p-5">
      <p className="text-[12px] text-dorado">El stock nunca se muestra en la tienda.</p>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[420px] text-[13px]">
          <thead>
            <tr className="text-left text-[12px] text-tinta/55">
              <th className="pb-2 font-medium">Talla</th>
              <th className="pb-2 font-medium">Color</th>
              <th className="pb-2 font-medium">Stock</th>
              <th className="pb-2"></th>
            </tr>
          </thead>
          <tbody>
            {variantes.map((v) => (
              <tr key={v.id} className="border-t border-tinta/[0.06]">
                <td className="py-2 pr-2 text-tinta">{v.talla}</td>
                <td className="py-2 pr-2 text-tinta">{v.color}</td>
                <td className="py-2 pr-2">
                  <input
                    type="number"
                    inputMode="numeric"
                    defaultValue={v.stock}
                    min={0}
                    onBlur={(e) => guardarStock(v.id, e.target.value)}
                    className="h-9 w-20 rounded-[7px] border border-tinta/[0.16] bg-blanco px-2 text-[13px] tabular-nums"
                  />
                </td>
                <td className="py-2 text-right">
                  <button
                    type="button"
                    onClick={() => borrar(v.id)}
                    disabled={pendiente}
                    aria-label="Eliminar variante"
                    className="text-tinta/40 hover:text-[#B23A5B]"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
            {variantes.length === 0 && (
              <tr>
                <td colSpan={4} className="py-4 text-[13px] text-tinta/50">
                  Aún no hay variantes. Agrega talla, color y stock.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-2 border-t border-tinta/[0.06] pt-4">
        <label className="block">
          <span className="mb-1 block text-[11px] text-tinta/55">Talla</span>
          <Input value={talla} onChange={(e) => setTalla(e.target.value)} className="h-9 w-24" />
        </label>
        <label className="block">
          <span className="mb-1 block text-[11px] text-tinta/55">Color</span>
          <Input value={color} onChange={(e) => setColor(e.target.value)} className="h-9 w-28" />
        </label>
        <label className="block">
          <span className="mb-1 block text-[11px] text-tinta/55">Stock</span>
          <Input
            type="number"
            inputMode="numeric"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="h-9 w-20"
          />
        </label>
        <Button variant="outline" onClick={agregar} disabled={pendiente} className="h-9">
          Agregar variante
        </Button>
      </div>

      {error && <p className="mt-2 text-[13px] text-[#B23A5B]">{error}</p>}
    </div>
  );
}
