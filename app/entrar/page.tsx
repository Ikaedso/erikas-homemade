import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = { title: "Iniciar sesión" };

export default function EntrarPage() {
  return (
    <Suspense>
      <AuthForm modo="login" />
    </Suspense>
  );
}
