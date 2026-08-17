"use client";

import { useState, useTransition } from "react";
import { FileText } from "lucide-react";
import { setEstadoPedido, getComprobanteUrl } from "@/actions/admin";
import type { EstadoPedido } from "@/lib/data/pedidos";

const ESTADOS: EstadoPedido[] = ["nuevo", "pagado", "enviado", "entregado", "cancelado"];

export function PedidoControl({
  pedidoId,
  estado,
  comprobantePath,
}: {
  pedidoId: string;
  estado: EstadoPedido;
  comprobantePath: string | null;
}) {
  const [valor, setValor] = useState<EstadoPedido>(estado);
  const [pendiente, startTransition] = useTransition();
  const [error, setError] = useState(false);

  function cambiar(nuevo: EstadoPedido) {
    const previo = valor;
    setValor(nuevo);
    setError(false);
    startTransition(async () => {
      const res = await setEstadoPedido(pedidoId, nuevo);
      if (!res.ok) {
        setValor(previo);
        setError(true);
      }
    });
  }

  async function verComprobante() {
    if (!comprobantePath) return;
    const url = await getComprobanteUrl(comprobantePath);
    if (url) window.open(url, "_blank", "noopener");
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {comprobantePath && (
        <button
          type="button"
          onClick={verComprobante}
          title="Ver comprobante"
          className="grid size-8 place-items-center rounded-[7px] border border-tinta/15 text-morado hover:bg-lavanda"
        >
          <FileText className="size-4" />
        </button>
      )}
      <select
        value={valor}
        disabled={pendiente}
        onChange={(e) => cambiar(e.target.value as EstadoPedido)}
        className={`rounded-[7px] border bg-blanco px-2 py-1.5 text-[12.5px] capitalize text-tinta ${
          error ? "border-[#B23A5B]" : "border-tinta/[0.16]"
        }`}
      >
        {ESTADOS.map((e) => (
          <option key={e} value={e}>
            {e}
          </option>
        ))}
      </select>
    </div>
  );
}
