"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ContactForm({ email, whatsapp }: { email: string; whatsapp: string }) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");

  function enviarPorCorreo(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Mensaje de ${nombre || "un cliente"}`);
    const body = encodeURIComponent(`${mensaje}\n\n— ${nombre}${correo ? ` (${correo})` : ""}`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  }

  const waTexto = encodeURIComponent(
    `Hola Érika 👋${nombre ? `, soy ${nombre}` : ""}. ${mensaje}`.trim(),
  );
  const waUrl = `https://wa.me/${whatsapp}?text=${waTexto}`;

  return (
    <form onSubmit={enviarPorCorreo} className="rounded-[12px] border border-tinta/[0.09] bg-blanco p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[12px] font-medium text-tinta/70">Nombre</span>
          <Input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[12px] font-medium text-tinta/70">Correo</span>
          <Input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} />
        </label>
      </div>
      <label className="mt-4 block">
        <span className="mb-1.5 block text-[12px] font-medium text-tinta/70">Mensaje</span>
        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          required
          rows={4}
          placeholder="Cuéntanos qué necesitas: una prenda, un arreglo, una cita…"
          className="w-full rounded-[10px] border border-tinta/[0.16] bg-blanco p-3 text-[14px] text-tinta placeholder:text-tinta/45 focus-visible:border-morado focus-visible:outline-none"
        />
      </label>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Button type="submit" size="lg" className="sm:flex-1">
          Enviar por correo
        </Button>
        <Button asChild variant="dorado" size="lg" className="sm:flex-1">
          <a href={waUrl} target="_blank" rel="noopener noreferrer">
            Enviar por WhatsApp
          </a>
        </Button>
      </div>
      <p className="mt-3 text-[12px] text-tinta/55">
        &ldquo;Enviar por correo&rdquo; abre tu app de correo con el mensaje listo.
      </p>
    </form>
  );
}
