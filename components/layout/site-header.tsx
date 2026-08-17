"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, LogOut, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav-items";
import { useCart } from "@/components/cart/cart-provider";
import { SearchDialog } from "@/components/search/search-dialog";
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
  const [buscando, setBuscando] = useState(false);
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
          <button
            type="button"
            aria-label="Buscar"
            onClick={() => setBuscando(true)}
            className="transition-colors hover:text-moradoHondo"
          >
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

      {/* Móvil: panel de navegación desplegable (animación suave abrir/cerrar) */}
      <div
        aria-hidden={!open}
        className={cn(
          "grid overflow-hidden transition-all duration-300 ease-out lg:hidden",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div
          className={cn(
            "min-h-0 overflow-hidden border-t border-tinta/[0.08]",
            !open && "pointer-events-none",
          )}
        >
          <nav className="mx-auto max-w-[1440px] px-3 pb-4 pt-2">
            {/* Enlaces */}
            <ul className="flex flex-col gap-0.5">
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center justify-between rounded-[10px] px-3 py-2.5 text-[15px] transition-colors",
                        active
                          ? "bg-lavanda font-medium text-moradoHondo"
                          : "text-tinta hover:bg-lavanda/50",
                      )}
                    >
                      {item.label}
                      <ChevronRight className="size-4 text-tinta/25" />
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Cuenta */}
            <div className="mt-3 border-t border-tinta/[0.08] pt-3">
              {user ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-3 px-3 py-1.5">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-lavanda text-morado">
                      <User className="size-[18px]" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-medium text-tinta">
                        Hola, {primerNombre}
                      </p>
                      <p className="text-[11px] text-tinta/50">Bienvenida de nuevo</p>
                    </div>
                  </div>
                  <Link
                    href="/cuenta"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-[10px] px-3 py-2.5 text-[14px] font-medium text-tinta transition-colors hover:bg-lavanda/50"
                  >
                    Mi cuenta
                    <ChevronRight className="size-4 text-tinta/25" />
                  </Link>
                  {esAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between rounded-[10px] bg-dorado/10 px-3 py-2.5 text-[14px] font-medium text-dorado transition-colors hover:bg-dorado/15"
                    >
                      Panel de Érika
                      <ChevronRight className="size-4 text-dorado/50" />
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={salir}
                    className="mt-1 flex w-full items-center justify-center gap-2 rounded-pill border border-tinta/15 py-2.5 text-[14px] font-medium text-tinta transition-colors hover:bg-lavanda/40"
                  >
                    <LogOut className="size-4" />
                    Cerrar sesión
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 px-1">
                  <Link
                    href="/registro"
                    onClick={() => setOpen(false)}
                    className="rounded-pill bg-morado py-3 text-center text-[14px] font-medium text-blanco transition-colors hover:bg-moradoHondo"
                  >
                    Registrarme
                  </Link>
                  <Link
                    href="/entrar"
                    onClick={() => setOpen(false)}
                    className="rounded-pill border border-tinta/15 py-3 text-center text-[14px] font-medium text-tinta transition-colors hover:bg-lavanda/40"
                  >
                    Ya tengo cuenta
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>

      <SearchDialog open={buscando} onClose={() => setBuscando(false)} />
    </header>
  );
}
