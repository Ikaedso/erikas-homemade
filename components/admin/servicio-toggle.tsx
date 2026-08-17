"use client";

import { useState, useTransition } from "react";
import { setServicioActivo } from "@/actions/admin";
import { cn } from "@/lib/utils";

export function ServicioToggle({ id, activo }: { id: string; activo: boolean }) {
  const [valor, setValor] = useState(activo);
  const [pendiente, startTransition] = useTransition();

  function alternar() {
    const nuevo = !valor;
    setValor(nuevo);
    startTransition(async () => {
      const res = await setServicioActivo(id, nuevo);
      if (!res.ok) setValor(!nuevo);
    });
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={valor}
      disabled={pendiente}
      onClick={alternar}
      title={valor ? "Activo" : "Inactivo"}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-morado/40 focus-visible:ring-offset-2",
        valor
          ? "bg-gradient-to-r from-[#6B36A0] to-morado shadow-[0_1px_4px_rgba(91,42,134,0.45)]"
          : "bg-tinta/15",
        pendiente && "opacity-70",
      )}
    >
      <span
        className={cn(
          "pointer-events-none absolute size-5 rounded-full bg-blanco shadow-[0_1px_2px_rgba(46,36,56,0.35)] transition-transform duration-300",
          valor ? "translate-x-[22px]" : "translate-x-0.5",
        )}
      />
    </button>
  );
}
