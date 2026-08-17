"use client";

import { useState, useTransition } from "react";
import { setEstadoCita } from "@/actions/admin";
import type { EstadoCita } from "@/lib/data/citas";

const ESTADOS: EstadoCita[] = ["pendiente", "confirmada", "completada", "cancelada"];

export function CitaControl({ citaId, estado }: { citaId: string; estado: EstadoCita }) {
  const [valor, setValor] = useState<EstadoCita>(estado);
  const [pendiente, startTransition] = useTransition();
  const [error, setError] = useState(false);

  function cambiar(nuevo: EstadoCita) {
    const previo = valor;
    setValor(nuevo);
    setError(false);
    startTransition(async () => {
      const res = await setEstadoCita(citaId, nuevo);
      if (!res.ok) {
        setValor(previo);
        setError(true);
      }
    });
  }

  return (
    <select
      value={valor}
      disabled={pendiente}
      onChange={(e) => cambiar(e.target.value as EstadoCita)}
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
  );
}
