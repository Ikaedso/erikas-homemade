import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-[1440px] flex-col items-center px-4 py-24 text-center lg:py-32">
      <p className="eyebrow text-dorado">Error 404</p>
      <h1 className="mt-3 font-display text-[30px] text-moradoHondo lg:text-[42px]">
        No encontramos esta página
      </h1>
      <p className="mt-3 max-w-[42ch] text-[14px] text-tinta/65">
        Puede que la pieza ya no esté o que el enlace haya cambiado. Vuelve al catálogo para seguir
        explorando.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/">Ir al inicio</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/mujer">Ver el catálogo</Link>
        </Button>
      </div>
    </div>
  );
}
