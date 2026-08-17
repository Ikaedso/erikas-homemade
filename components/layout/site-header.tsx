"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav-items";
import { useCart } from "@/components/cart/cart-provider";
import { useUser } from "@/lib/auth/use-user";
import { createClient } from "@/lib/supabase/client";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <Image
        src="/logo.png"
        alt="Erika's Homemade"
        width={52}
        height={52}
        className="h-9 w-9 object-contain lg:h-[52px] lg:w-[52px]"
        priority
      />
      <span className="font-display text-[14px] font-medium leading-[1.1] text-tinta">
        Erika&apos;s
        <br />
        Homemade
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCart();
  const { user, esAdmin } = useUser();

  // Animación del carrito cuando sube la cantidad.
  const [bump, setBump] = useState(false);
  const prevCount = useRef(count);
  useEffect(() => {
    if (count > prevCount.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 420);
      prevCount.current = count;
      return () => clearTimeout(t);
    }
    prevCount.current = count;
  }, [count]);

  const nombre =
    (user?.user_metadata?.nombre as string | undefined) ?? user?.email ?? null;
  const primerNombre = nombre?.split(" ")[0]?.split("@")[0];

  async function salir() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-tinta/[0.08] bg-blanco lg:static">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-2 lg:px-14 lg:py-3">
        {/* Móvil: hamburguesa */}
        <button
          type="button"
          aria-label="Abrir menú"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="text-morado lg:hidden"
        >
          {open ? <X className="size-[18px]" /> : <Menu className="size-[18px]" />}
        </button>

        <Logo />

        {/* Escritorio: navegación por categorías */}
        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-[13.5px] text-tinta/80 transition-colors hover:text-morado",
                  active && "border-b border-dorado pb-[3px] text-morado",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Acciones */}
        <div className="flex items-center gap-3.5 text-morado lg:gap-4">
          {esAdmin && (
            <Link
              href="/admin"
              className="hidden rounded-pill bg-dorado px-3 py-1.5 text-[12.5px] font-medium text-blanco lg:inline-flex"
            >
              Panel
            </Link>
          )}
          {user ? (
            <div className="hidden items-center gap-3 lg:flex">
              <Link
                href="/cuenta"
                className="inline-flex items-center gap-1.5 text-[13.5px] font-medium transition-colors hover:text-morado"
              >
                <User className="size-[15px]" />
                Hola, {primerNombre}
              </Link>
              <button
                type="button"
                onClick={salir}
                className="text-[13px] text-tinta/60 transition-colors hover:text-morado"
              >
                Salir
              </button>
            </div>
          ) : (
            <Link href="/entrar" className="hidden text-[13.5px] font-medium lg:inline-flex">
              Iniciar sesión
            </Link>
          )}
          <Link href={user ? "/cuenta" : "/entrar"} aria-label="Mi cuenta" className="lg:hidden">
            <User className="size-[17px]" />
          </Link>
          <button type="button" aria-label="Buscar">
            <Search className="size-[17px]" />
          </button>
          <Link href="/carrito" aria-label="Carrito" className="relative">
            <ShoppingBag
              className={cn("size-[17px] transition-transform", bump && "animate-cart-bump")}
            />
            {count > 0 && (
              <span
                className={cn(
                  "absolute -right-2 -top-2 grid size-[14px] place-items-center rounded-full bg-dorado text-[9px] font-semibold text-blanco",
                  bump && "animate-cart-bump",
                )}
              >
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Móvil: panel de navegación desplegable */}
      {open && (
        <div className="border-t border-tinta/[0.08] lg:hidden">
          <nav className="mx-auto flex max-w-[1440px] flex-col px-4 py-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-tinta/[0.07] py-3 font-display text-[19px] text-tinta last:border-none"
              >
                {item.label}
              </Link>
            ))}
            {user && (
              <Link
                href="/cuenta"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-tinta/[0.07] py-3 font-display text-[19px] text-tinta"
              >
                Mi cuenta
              </Link>
            )}
            {esAdmin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-tinta/[0.07] py-3 font-display text-[19px] text-dorado"
              >
                Panel de Érika
              </Link>
            )}
            <div className="mt-3 flex gap-2 pb-2">
              {user ? (
                <>
                  <span className="flex-1 py-2.5 text-[13px] font-medium text-tinta">
                    Hola, {primerNombre}
                  </span>
                  <button
                    type="button"
                    onClick={salir}
                    className="flex-1 rounded-pill border border-tinta/15 py-2.5 text-center text-[13px] font-medium text-tinta"
                  >
                    Salir
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/registro"
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-pill bg-morado py-2.5 text-center text-[13px] font-medium text-blanco"
                  >
                    Registrarme
                  </Link>
                  <Link
                    href="/entrar"
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-pill border border-tinta/15 py-2.5 text-center text-[13px] font-medium text-tinta"
                  >
                    Entrar
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
