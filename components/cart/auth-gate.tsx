import Link from "next/link";
import { Lock } from "lucide-react";
import { Stitch } from "@/components/brand/stitch";

/** Tarjeta "Necesitas una cuenta para continuar" (registro obligatorio). */
export function AuthGate({ next = "/pagar" }: { next?: string }) {
  const q = `?next=${encodeURIComponent(next)}`;
  return (
    <div className="rounded-[14px] border border-tinta/10 bg-blanco p-6 text-center shadow-modal duration-300 animate-in fade-in zoom-in-95">
      <div className="mx-auto grid size-12 place-items-center rounded-full border border-dashed border-dorado text-morado">
        <Lock className="size-5" />
      </div>
      <h2 className="mt-4 font-display text-[20px] leading-tight text-moradoHondo">
        Necesitas una cuenta
        <br />
        para continuar
      </h2>
      <p className="mx-auto mt-2 max-w-[36ch] text-[13px] text-tinta/65">
        En Erika&apos;s Homemade el registro es obligatorio para comprar o agendar. Es rápido y tu
        carrito se conserva.
      </p>
      <div className="mt-5 flex flex-col gap-2">
        <Link
          href={`/registro${q}`}
          className="rounded-pill bg-morado py-3 text-[13px] font-medium text-blanco transition-colors hover:bg-moradoHondo"
        >
          Crear mi cuenta
        </Link>
        <Link
          href={`/entrar${q}`}
          className="rounded-pill border border-tinta/15 py-3 text-[13px] font-medium text-tinta transition-colors hover:bg-lavanda"
        >
          Ya tengo cuenta, entrar
        </Link>
      </div>
      <Stitch className="mt-5 border-dorado/50" />
      <p className="mt-3 text-[12px] text-tinta/55">Tu carrito se guarda mientras te registras.</p>
    </div>
  );
}
