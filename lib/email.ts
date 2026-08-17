import { Resend } from "resend";

/**
 * Envío de correos con Resend. **Solo servidor.**
 * Requiere `RESEND_API_KEY`. Opcional `EMAIL_FROM` (remitente verificado).
 *
 * En modo de prueba de Resend, `onboarding@resend.dev` solo entrega al correo
 * dueño de la cuenta de Resend. Para enviar a cualquier cliente hay que
 * verificar un dominio y poner `EMAIL_FROM = "Erika's Homemade <no-reply@tudominio>"`.
 */
const FROM = process.env.EMAIL_FROM ?? "Erika's Homemade <onboarding@resend.dev>";

export function hayEmail(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function enviarCorreo(opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<boolean> {
  if (!hayEmail()) return false;
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    });
    return !error;
  } catch {
    return false;
  }
}

/** Envuelve el contenido en una plantilla con la identidad de la marca. */
export function plantillaCorreo(titulo: string, cuerpoHtml: string): string {
  return `
  <div style="background:#FBF9FC;padding:24px 0;font-family:'Helvetica Neue',Arial,sans-serif">
    <div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #EEE9F2;border-radius:14px;overflow:hidden">
      <div style="background:#5B2A86;padding:18px 24px">
        <p style="margin:0;color:#fff;font-size:16px;font-weight:600;letter-spacing:0.3px">Erika's Homemade</p>
      </div>
      <div style="padding:24px">
        <h1 style="margin:0 0 14px;font-size:18px;color:#3A1857">${titulo}</h1>
        ${cuerpoHtml}
      </div>
      <div style="padding:14px 24px;border-top:1px solid #F0ECF5">
        <p style="margin:0;font-size:11px;color:#9A8FA6">Hecho a mano en Colombia · Erika's Homemade</p>
      </div>
    </div>
  </div>`;
}
