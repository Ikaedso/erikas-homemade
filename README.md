# Erika's Homemade

Tienda online mobile-first de ropa y bisutería hecha a mano, con servicios de costura por cita y un panel administrativo para la dueña (Érika).

> **Estado:** Fase 1 — Fundación. Scaffold Next.js + Tailwind + tokens de marca, layout base y migraciones de Supabase (con la vista pública que oculta el stock).

## Stack

Next.js (App Router) + TypeScript · Supabase (Postgres · Auth · Storage · RLS) · Tailwind CSS + shadcn/ui · React Hook Form + Zod · TanStack Query · react-day-picker · Resend. Detalle en [`docs/stack-tecnologico.md`](docs/stack-tecnologico.md).

## Requisitos

- Node 20+
- pnpm 9+
- Un proyecto de Supabase

## Puesta en marcha

```bash
pnpm install
cp .env.example .env.local   # y completa las claves de Supabase / Resend
pnpm dev                     # http://localhost:3000
```

### Base de datos (Supabase)

Las migraciones y el seed viven en [`supabase/`](supabase/):

- `supabase/migrations/0001_init.sql` — tablas y tipos
- `supabase/migrations/0002_views_rls.sql` — **vista pública + RLS que oculta el stock**
- `supabase/seed.sql` — catálogo real de ejemplo

Aplícalas con la CLI de Supabase (`supabase db reset`) o pegándolas en el SQL Editor del proyecto, en orden.

## Estructura

```
app/                 App Router (layout + páginas)
components/
  ui/                Primitivos shadcn/ui (Button, Input…)
  layout/            Header y Footer
  brand/             Elementos de marca (la "puntada")
lib/
  supabase/          Clientes browser/server/middleware
  format.ts          formatCOP, formatFecha (COP · America/Bogota)
  fonts.ts           Lora (display) + Work Sans (cuerpo)
supabase/            Migraciones y seed
docs/                Plan, stack y handoff de diseño (docs/design/)
```

## Pruebas y CI

```bash
pnpm typecheck   # TypeScript
pnpm lint        # ESLint (next)
pnpm test        # Vitest (helpers: formatCOP, cupos de citas…)
pnpm test:e2e    # Playwright (flujo del home; arranca el dev server solo)
pnpm build       # build de producción
```

CI (GitHub Actions, `.github/workflows/ci.yml`) corre typecheck + lint + tests + build en cada PR a `main`. Accesibilidad: enlace "saltar al contenido", foco visible y respeto a `prefers-reduced-motion`. SEO: `sitemap.xml` y `robots.txt` generados.

## Convenciones

- **El blanco domina**; morado/dorado solo en acentos. Tokens en `tailwind.config.ts`.
- **Precios** en pesos colombianos con `formatCOP` → `$72.000`.
- **El stock nunca llega al cliente**: el front público consulta las vistas `catalogo_publico` / `variantes_publicas`, nunca la tabla `variantes`.
- **Registro obligatorio** para comprar o agendar (puerta de sesión).

Decisiones fijas y dirección de diseño: [`CLAUDE.md`](CLAUDE.md).
