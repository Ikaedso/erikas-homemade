import type { Metadata } from "next";
import { Clock, Instagram, Facebook, Mail, MapPin, MessageCircle } from "lucide-react";
import { Stitch } from "@/components/brand/stitch";
import { ContactForm } from "@/components/contacto/contact-form";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Escríbenos por correo o WhatsApp. Ropa y bisutería hecha a mano y costura con cita.",
};

const EMAIL = "hola@erikashomemade.co";

export default function ContactoPage() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP || "573000000000";
  const waHumano = `+${whatsapp}`;

  return (
    <div className="mx-auto max-w-[1000px] px-4 py-12 lg:px-8 lg:py-16">
      <p className="eyebrow text-dorado">Contacto</p>
      <h1 className="mt-2 font-display text-[30px] text-moradoHondo lg:text-[44px]">Hablemos</h1>
      <p className="mt-3 max-w-[54ch] text-[14px] text-tinta/70">
        ¿Una prenda, un arreglo o una cita en el taller? Escríbenos y Érika te responde por
        WhatsApp, normalmente el mismo día.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        {/* Datos de contacto */}
        <div className="rounded-[12px] border border-tinta/[0.09] bg-nieve p-6">
          <ul className="space-y-5">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-[10px] bg-lavanda text-morado">
                <Mail className="size-4" />
              </span>
              <div>
                <p className="text-[12px] uppercase tracking-[0.08em] text-tinta/50">Correo</p>
                <a href={`mailto:${EMAIL}`} className="text-[14px] font-medium text-tinta hover:text-morado">
                  {EMAIL}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-[10px] bg-lavanda text-morado">
                <MessageCircle className="size-4" />
              </span>
              <div>
                <p className="text-[12px] uppercase tracking-[0.08em] text-tinta/50">WhatsApp</p>
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] font-medium text-tinta hover:text-morado"
                >
                  {waHumano}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-[10px] bg-lavanda text-morado">
                <Clock className="size-4" />
              </span>
              <div>
                <p className="text-[12px] uppercase tracking-[0.08em] text-tinta/50">Horario</p>
                <p className="text-[14px] text-tinta">Lun a sáb · 9:00–17:00</p>
                <p className="text-[13px] text-tinta/60">Costura con cita previa</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-[10px] bg-lavanda text-morado">
                <MapPin className="size-4" />
              </span>
              <div>
                <p className="text-[12px] uppercase tracking-[0.08em] text-tinta/50">Taller</p>
                <p className="text-[14px] text-tinta">Colombia · atención con cita</p>
              </div>
            </li>
          </ul>

          <Stitch className="my-6 border-dorado/50" />

          <div className="flex items-center gap-3">
            <span className="text-[13px] text-tinta/60">Síguenos:</span>
            <a
              href="https://instagram.com"
              aria-label="Instagram"
              className="grid size-9 place-items-center rounded-full border border-tinta/15 text-morado transition-colors hover:bg-lavanda"
            >
              <Instagram className="size-4" />
            </a>
            <a
              href="https://facebook.com"
              aria-label="Facebook"
              className="grid size-9 place-items-center rounded-full border border-tinta/15 text-morado transition-colors hover:bg-lavanda"
            >
              <Facebook className="size-4" />
            </a>
          </div>
        </div>

        {/* Formulario */}
        <ContactForm email={EMAIL} whatsapp={whatsapp} />
      </div>
    </div>
  );
}
