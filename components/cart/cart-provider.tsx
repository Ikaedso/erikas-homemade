"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  productoId: string;
  varianteId: string;
  slug: string;
  nombre: string;
  precioCop: number;
  talla: string;
  color: string;
  cantidad: number;
  esPiezaUnica: boolean;
  fotoUrl?: string;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (item: Omit<CartItem, "cantidad">, cantidad?: number) => void;
  setCantidad: (key: string, cantidad: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "eh_cart";

/** Clave única por variante dentro del carrito. */
export function itemKey(i: Pick<CartItem, "slug" | "talla" | "color">) {
  return `${i.slug}__${i.talla}__${i.color}`;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cargado, setCargado] = useState(false);

  // Cargar desde localStorage al montar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      // ignore
    }
    setCargado(true);
  }, []);

  // Guardar cuando cambie
  useEffect(() => {
    if (!cargado) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, cargado]);

  const value = useMemo<CartContextValue>(() => {
    function add(nuevo: Omit<CartItem, "cantidad">, cantidad = 1) {
      setItems((prev) => {
        const key = itemKey(nuevo);
        const existente = prev.find((i) => itemKey(i) === key);
        const tope = nuevo.esPiezaUnica ? 1 : 8;
        if (existente) {
          return prev.map((i) =>
            itemKey(i) === key
              ? { ...i, cantidad: Math.min(tope, i.cantidad + cantidad) }
              : i,
          );
        }
        return [...prev, { ...nuevo, cantidad: Math.min(tope, cantidad) }];
      });
    }

    function setCantidad(key: string, cantidad: number) {
      setItems((prev) =>
        prev
          .map((i) => {
            if (itemKey(i) !== key) return i;
            const tope = i.esPiezaUnica ? 1 : 8;
            return { ...i, cantidad: Math.max(1, Math.min(tope, cantidad)) };
          })
          .filter(Boolean),
      );
    }

    function remove(key: string) {
      setItems((prev) => prev.filter((i) => itemKey(i) !== key));
    }

    function clear() {
      setItems([]);
    }

    const count = items.reduce((n, i) => n + i.cantidad, 0);
    const subtotal = items.reduce((n, i) => n + i.cantidad * i.precioCop, 0);

    return { items, count, subtotal, add, setCantidad, remove, clear };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
