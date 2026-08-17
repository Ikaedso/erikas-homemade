# Erika's Homemade — Stack tecnológico

> Decidido en **Fase 0**. Base elegida por el equipo: **Next.js + Supabase**.
> El resto es la recomendación adoptada para un desarrollo **mobile-first, rápido y económico**.

## Resumen

| Capa | Elección | Rol en el proyecto |
|---|---|---|
| **Framework** | Next.js (App Router) + TypeScript + React | SSR/SEO del catálogo, Server Actions para el admin, tipado seguro |
| **Backend / BD** | Supabase — Postgres + Auth + Storage + RLS + Realtime | Auth obligatoria, fotos, y RLS para ocultar el stock |
| **Estilos** | Tailwind CSS | Base blanca + acentos morado/dorado como tokens |
| **Componentes UI** | shadcn/ui (Radix) + lucide-react | Accesibles y personalizables con la marca |
| **Fuentes** | next/font (auto-hospedadas) | Rendimiento, sin CDNs externos |
| **Formularios** | React Hook Form + Zod | Validación de registro, producto, checkout, citas |
| **Datos / estado** | Server Components + Server Actions + @supabase/ssr; TanStack Query para el carrito | Menos código, datos frescos |
| **Agenda / citas** | react-day-picker + date-fns | Calendario y manejo de fechas/horarios |
| **Emails** | Resend | Confirmaciones de pedido y cita |
| **WhatsApp** | Enlaces wa.me (MVP) → WhatsApp Business API después | Contacto cercano con las clientas |
| **Pagos** | **Transferencia / pago móvil + comprobante** (sin pasarela) | MVP sin comisiones; Érika confirma manualmente |
| **Deploy** | Vercel (frontend) + Supabase (backend gestionado) | Integración nativa con Next.js |
| **Tooling** | pnpm, ESLint, Prettier, Vitest + Testing Library, Playwright (e2e opcional) | Calidad y velocidad |

## Cómo cada módulo usa el stack

- **Registro obligatorio** → Supabase Auth (correo + contraseña) + **RLS por rol** (`cliente` / `admin`).
- **Productos + stock interno** → tablas Postgres. El **número de stock solo lo leen los admins** (RLS);
  al cliente se le expone una **vista** con solo `disponible / agotado`, nunca la cantidad.
- **Ventas** → el descuento de stock se hace en una **función/trigger de Postgres** (transaccional,
  sin condiciones de carrera).
- **Citas** → tabla `citas` + calendario + lógica de disponibilidad; estados con badges.
- **Fotos** → Supabase Storage + `next/image`.
- **Panel admin** → rutas protegidas + verificación de rol en el servidor.

## Flujo de pago (Transferencia + comprobante)

```
Checkout
  → pedido "pendiente_pago"
  → se muestran los datos de pago de Érika (cuenta / pago móvil)
  → el cliente sube el COMPROBANTE (imagen → Supabase Storage)
  → pedido "en_revision"
  → Érika revisa en el panel y CONFIRMA
  → pedido "pagado"  ← aquí se DESCUENTA el stock (función Postgres)
  → "enviado" → "entregado"
     (o "cancelado" en cualquier punto)
```
- Los datos de pago de Érika son configurables desde el panel.
- El comprobante queda ligado al pedido para que Érika lo verifique.

## Servicios / cuentas necesarias

- **Supabase** (proyecto: BD + Auth + Storage).
- **Vercel** (hosting del front).
- **Resend** (envío de correos) — dominio o remitente verificado.
- Repositorio en **GitHub** (ya creado).

## Estructura de carpetas sugerida (Next.js App Router)

```
/app
  /(tienda)        → home, catálogo, categoría, producto, carrito, checkout
  /(cuenta)        → registro, login, mis pedidos, mis citas
  /servicios       → lista + detalle + agendar cita
  /admin           → dashboard, productos, servicios, citas, ventas
  /api             → rutas/route handlers puntuales
/components         → UI (shadcn) + componentes propios
/lib               → supabase client/server, validaciones (zod), utils
/supabase          → migraciones SQL, políticas RLS, seeds
```

## Variables de entorno (referencia)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # solo servidor (admin)
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=
```

*(Se confirma y ajusta al iniciar la Fase 1 — Fundación.)*
