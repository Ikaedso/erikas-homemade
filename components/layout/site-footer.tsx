import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";
import { Stitch } from "@/components/brand/stitch";

const MENU_INFERIOR = [
  { label: "Contáctanos", href: "/contacto" },
  { label: "Preguntas frecuentes", href: "/faq" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Términos y condiciones", href: "/terminos" },
  { label: "Política de privacidad", href: "/privacidad" },
];

export function SiteFooter() {
  return (
    <footer>
      {/* Franja de newsletter */}
      <section className="bg-lavanda">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-10 lg:flex-row lg:items-center lg:justify-between lg:px-14">
          <div>
            <p className="eyebrow text-dorado">Suscríbete al correo</p>
            <p className="mt-1 font-display text-[19px] text-moradoHondo lg:text-[28px]">
              Novedades, series cortas y descuentos
            </p>
          </div>
          <form className="flex w-full max-w-md gap-2">
            <input
              type="email"
              required
              placeholder="Tu correo"
              aria-label="Tu correo"
              className="h-11 flex-1 rounded-pill border border-tinta/[0.16] bg-blanco px-4 text-[14px] placeholder:text-tinta/45 focus-visible:border-morado focus-visible:outline-none"
            />
            <button
              type="submit"
              className="h-11 rounded-pill bg-morado px-5 text-[13px] font-medium text-blanco transition-colors hover:bg-moradoHondo"
            >
              Suscribirme
            </button>
          </form>
        </div>
      </section>

      {/* Footer morado profundo */}
      <div className="bg-moradoHondo text-blanco">
        <div className="mx-auto max-w-[1440px] px-4 py-12 lg:px-14">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            <div className="col-span-2 lg:col-span-1">
              <p className="font-display text-[20px]">Erika&apos;s Homemade</p>
              <p className="mt-2 max-w-[30ch] text-[13px] text-blanco/70">
                Cosido a mano, hecho a tu medida. Ropa y bisutería artesanal, y servicios de costura
                con cita.
              </p>
              <div className="mt-4 flex gap-2">
                <a
                  href="https://instagram.com"
                  aria-label="Instagram"
                  className="grid size-8 place-items-center rounded-full border border-blanco/30 transition-colors hover:bg-blanco/10"
                >
                  <Instagram className="size-4" />
                </a>
                <a
                  href="https://facebook.com"
                  aria-label="Facebook"
                  className="grid size-8 place-items-center rounded-full border border-blanco/30 transition-colors hover:bg-blanco/10"
                >
                  <Facebook className="size-4" />
                </a>
              </div>
            </div>

            <div>
              <p className="eyebrow text-doradoClaro">Menú</p>
              <ul className="mt-3 space-y-2 text-[13px] text-blanco/80">
                {MENU_INFERIOR.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="transition-colors hover:text-blanco">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="eyebrow text-doradoClaro">Conoce el taller</p>
              <ul className="mt-3 space-y-2 text-[13px] text-blanco/80">
                <li>Lun a sáb · 9:00–17:00</li>
                <li>Costura con cita previa</li>
                <li>Retiro en el taller o delivery</li>
              </ul>
            </div>

            <div>
              <p className="eyebrow text-doradoClaro">Comprar</p>
              <ul className="mt-3 space-y-2 text-[13px] text-blanco/80">
                <li>
                  <Link href="/mujer" className="transition-colors hover:text-blanco">
                    Mujer
                  </Link>
                </li>
                <li>
                  <Link href="/hombre" className="transition-colors hover:text-blanco">
                    Hombre
                  </Link>
                </li>
                <li>
                  <Link href="/nino" className="transition-colors hover:text-blanco">
                    Niño
                  </Link>
                </li>
                <li>
                  <Link href="/servicios" className="transition-colors hover:text-blanco">
                    Servicios
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <Stitch className="my-6 border-dorado/50" />
          <p className="text-center text-[12px] text-blanco/60">
            © {new Date().getFullYear()} Erika&apos;s Homemade · Hecho a mano en Colombia
          </p>
        </div>
      </div>
    </footer>
  );
}
