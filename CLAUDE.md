# Erika's Homemade — Memoria del proyecto

Aplicativo web para **Erika's Homemade**: tienda online de ropa y bisutería hecha a mano, más
**servicios de costura/reparación con agenda de citas**. La clienta (Érika) administra todo desde
un **panel administrativo**.

> Estado actual: **Fase 0 — planeación y diseño**. No hay código de la aplicación todavía.
> El plan completo vive en [`docs/plan-erikas-homemade.md`](docs/plan-erikas-homemade.md).

## Decisiones fijas (respetar siempre)

- **Registro OBLIGATORIO.** El cliente **debe crear cuenta e iniciar sesión** para comprar o
  agendar. No hay compra como invitado. Roles: `cliente` y `admin` (Érika).
- **Categorías por público:** **Mujer · Hombre · Niño** (foco inicial) + **Manualidades**
  (secundaria). Cada categoría tiene **subcategorías** por tipo de prenda.
- **Stock interno.** Érika define y edita el stock desde el panel. El **cliente NO ve la cantidad**;
  solo **disponible / agotado**. El stock baja automáticamente con cada venta.
- **Panel administrativo** = centro de control de Érika: productos (crear/editar/deshabilitar/
  eliminar + stock), servicios, citas, ventas, dashboard.
- **Mobile-first.**

## Dirección de diseño (para prompts de Claude Design)

- **El blanco es el color principal / dominante.** Interfaz limpia y luminosa.
- Colorimetría de marca **solo en detalles y acentos** (botones, enlaces, íconos, hover, badges,
  footer):
  - Morado marca `#5B2A86` · Morado profundo `#3A1857` · Dorado acento `#B98A2E`
  - Apoyos: Lila `#C9B3DD` · Lavanda `#F2ECF7` · Tinta `#2E2438` · Blanco cálido `#FBF9FC`
- **Estructura de referencia = estilo tipo Ovejita:** header con navegación por categorías +
  íconos cuenta/búsqueda/carrito; home con hero, tarjetas por categoría, historia de marca,
  destacados y footer con newsletter + redes; página de categoría con **filtros de subcategoría
  en barra lateral** + grilla de productos; detalle de producto con agregar al carrito. Sobre esa
  base se añaden los módulos propios de Érika: Servicios, Agendar cita y Panel admin.
- **Tono:** artesanal, cercano, femenino ("hecho a mano").

## Stack tecnológico (decidido — Fase 0)

- **Next.js** (App Router) + TypeScript + React · **Supabase** (Postgres + Auth + Storage + RLS).
- **Tailwind CSS** + **shadcn/ui** + lucide-react · **next/font**.
- **React Hook Form** + **Zod** · Server Actions + `@supabase/ssr` · TanStack Query (carrito).
- **react-day-picker** + date-fns (citas) · **Resend** (emails) · WhatsApp vía `wa.me`.
- **Pagos:** transferencia / pago móvil + **comprobante** (sin pasarela; Érika confirma manual).
- **Deploy:** Vercel (front) + Supabase (backend). Tooling: pnpm, ESLint, Prettier, Vitest, Playwright.
- Detalle completo en [`docs/stack-tecnologico.md`](docs/stack-tecnologico.md).

## Entregables

- Documento del plan: `docs/plan-erikas-homemade.md` (módulos, flujos, mapa del sitio, modelo de
  datos, roadmap, dirección de diseño y el brief/prompt base — secciones 11 y 12).
- Prompt para diseño: `docs/prompt-claude-design.md`.
- Stack tecnológico: `docs/stack-tecnologico.md`.
- Página de handoff visual (artifact) para compartir con diseño.

## Git

- Rama principal: `main` (rama por defecto del repositorio).
