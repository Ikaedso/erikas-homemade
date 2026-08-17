"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Stitch } from "@/components/brand/stitch";
import { createClient, haySupabaseEnv } from "@/lib/supabase/client";
import {
  loginSchema,
  registroSchema,
  type LoginInput,
  type RegistroInput,
} from "@/lib/schemas/auth";

function Campo({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-medium text-tinta/70">{label}</span>
      {children}
      {error && <span className="mt-1 block text-[12px] text-[#B23A5B]">{error}</span>}
    </label>
  );
}

function Tabs({ modo, next }: { modo: "login" | "registro"; next: string }) {
  const q = next && next !== "/" ? `?next=${encodeURIComponent(next)}` : "";
  return (
    <div className="mx-auto flex w-full max-w-[340px] rounded-pill bg-lavanda p-1">
      <Link
        href={`/entrar${q}`}
        className={cn(
          "flex-1 rounded-pill py-2 text-center text-[13px] font-medium transition-colors",
          modo === "login" ? "bg-blanco text-moradoHondo shadow-sm" : "text-tinta/60",
        )}
      >
        Entrar
      </Link>
      <Link
        href={`/registro${q}`}
        className={cn(
          "flex-1 rounded-pill py-2 text-center text-[13px] font-medium transition-colors",
          modo === "registro" ? "bg-blanco text-moradoHondo shadow-sm" : "text-tinta/60",
        )}
      >
        Crear cuenta
      </Link>
    </div>
  );
}

export function AuthForm({ modo }: { modo: "login" | "registro" }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";

  return (
    <div className="mx-auto flex w-full max-w-[420px] flex-col items-center px-4 py-14">
      <Image src="/logo.png" alt="Erika's Homemade" width={56} height={56} className="h-12 w-12" />
      <h1 className="mt-4 font-display text-[26px] text-moradoHondo">
        {modo === "login" ? "Hola de nuevo" : "Crea tu cuenta"}
      </h1>
      <p className="mt-1 text-[13px] text-tinta/60">
        {modo === "login"
          ? "Entra para comprar y agendar."
          : "El registro es rápido y obligatorio para comprar."}
      </p>

      <div className="mt-6 w-full">
        <Tabs modo={modo} next={next} />
      </div>

      <div className="mt-6 w-full">
        {modo === "login" ? (
          <LoginForm next={next} router={router} />
        ) : (
          <RegistroForm next={next} router={router} />
        )}
      </div>
    </div>
  );
}

type Router = ReturnType<typeof useRouter>;

function LoginForm({ next, router }: { next: string; router: Router }) {
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginInput) {
    setErrorGeneral(null);
    if (!haySupabaseEnv()) {
      setErrorGeneral("El servicio no está disponible ahora mismo. Intenta más tarde.");
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword(values);
    if (error) {
      setErrorGeneral("Correo o contraseña incorrectos.");
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errorGeneral && (
        <p className="rounded-[8px] bg-[#B23A5B]/10 px-3 py-2 text-[13px] text-[#B23A5B]">
          {errorGeneral}
        </p>
      )}
      <Campo label="Correo" error={errors.email?.message}>
        <Input type="email" autoComplete="email" {...register("email")} />
      </Campo>
      <Campo label="Contraseña" error={errors.password?.message}>
        <Input type="password" autoComplete="current-password" {...register("password")} />
      </Campo>
      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Entrando…" : "Entrar"}
      </Button>
    </form>
  );
}

function RegistroForm({ next, router }: { next: string; router: Router }) {
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [revisaCorreo, setRevisaCorreo] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistroInput>({ resolver: zodResolver(registroSchema) });

  async function onSubmit(values: RegistroInput) {
    setErrorGeneral(null);
    if (!haySupabaseEnv()) {
      setErrorGeneral("El servicio no está disponible ahora mismo. Intenta más tarde.");
      return;
    }
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: { nombre: values.nombre, whatsapp: values.whatsapp || null },
        // Usa el dominio actual (localhost o producción) para el enlace del correo.
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setErrorGeneral(
        error.message.includes("already")
          ? "Ese correo ya tiene cuenta. Entra en su lugar."
          : "No pudimos crear la cuenta. Intenta de nuevo.",
      );
      return;
    }
    if (data.session) {
      router.push(next);
      router.refresh();
    } else {
      setRevisaCorreo(true);
    }
  }

  if (revisaCorreo) {
    return (
      <div className="rounded-[12px] border border-dashed border-dorado/50 bg-nieve p-6 text-center">
        <h2 className="font-display text-[18px] text-moradoHondo">Revisa tu correo</h2>
        <p className="mt-2 text-[13px] text-tinta/65">
          Te enviamos un enlace para confirmar tu cuenta. Ábrelo y luego inicia sesión.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errorGeneral && (
        <p className="rounded-[8px] bg-[#B23A5B]/10 px-3 py-2 text-[13px] text-[#B23A5B]">
          {errorGeneral}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo label="Nombre" error={errors.nombre?.message}>
          <Input autoComplete="name" {...register("nombre")} />
        </Campo>
        <Campo label="WhatsApp (opcional)" error={errors.whatsapp?.message}>
          <Input type="tel" autoComplete="tel" placeholder="+57…" {...register("whatsapp")} />
        </Campo>
      </div>
      <Campo label="Correo" error={errors.email?.message}>
        <Input type="email" autoComplete="email" {...register("email")} />
      </Campo>
      <Campo label="Contraseña" error={errors.password?.message}>
        <Input type="password" autoComplete="new-password" {...register("password")} />
      </Campo>
      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Creando…" : "Crear mi cuenta"}
      </Button>
      <Stitch className="border-dorado/40" />
      <p className="text-center text-[12px] text-tinta/55">
        Al registrarte aceptas los términos y la política de privacidad.
      </p>
    </form>
  );
}
