"use client";

import { useState, useTransition } from "react";
import { setPublicado } from "@/actions/admin";
import { cn } from "@/lib/utils";

export function PublicadoToggle({ id, publicado }: { id: string; publicado: boolean }) {
  const [valor, setValor] = useState(publicado);
  const [pendiente, startTransition] = useTransition();

  function alternar() {
    const nuevo = !valor;
    setValor(nuevo);
    startTransition(async () => {
      const res = await setPublicado(id, nuevo);
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
      title={valor ? "Publicado" : "Oculto"}
      className={cn(
        "relative h-6 w-11 rounded-full transition-colors",
        valor ? "bg-morado" : "bg-tinta/20",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 size-5 rounded-full bg-blanco transition-transform",
          valor ? "translate-x-[22px]" : "translate-x-0.5",
        )}
      />
    </button>
  );
}
