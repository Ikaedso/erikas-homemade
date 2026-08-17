"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient, haySupabaseEnv } from "@/lib/supabase/client";

/** Devuelve el usuario autenticado (o null), si es admin, y reacciona a los cambios de sesión. */
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [esAdmin, setEsAdmin] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!haySupabaseEnv()) {
      setCargando(false);
      return;
    }
    const supabase = createClient();

    async function cargarRol(u: User | null) {
      if (!u) {
        setEsAdmin(false);
        return;
      }
      const { data } = await supabase
        .from("perfiles")
        .select("rol, deshabilitado")
        .eq("id", u.id)
        .maybeSingle();
      // Si la cuenta fue deshabilitada, cerramos la sesión.
      if (data?.deshabilitado) {
        await supabase.auth.signOut();
        setUser(null);
        setEsAdmin(false);
        return;
      }
      setEsAdmin(data?.rol === "admin");
    }

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setCargando(false);
      void cargarRol(data.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      void cargarRol(u);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, esAdmin, cargando };
}
