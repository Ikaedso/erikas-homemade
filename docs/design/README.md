# Brief de desarrollo — Erika's Homemade

Tienda online mobile-first de ropa y bisutería hecha a mano, con servicios de costura por cita y un panel administrativo para la dueña (Érika). Proyecto nuevo, desde cero, en un repositorio único.

---

## 1. Qué hay en este paquete

| Archivo | Qué es |
|---|---|
| `README.md` | Este brief: stack, arquitectura, reglas de negocio, tokens, plan de trabajo |
| `PANTALLAS.md` | Especificación pantalla por pantalla (móvil, escritorio, admin) |
| `DATOS.md` | Esquema de base de datos, políticas RLS, Server Actions y validaciones |
| `Erika's Homemade UI.dc.html` | Galería de referencia: sistema visual + las 26 pantallas (móvil y escritorio) |
| `Erika's Homemade Escritorio.dc.html` | Solo las pantallas de escritorio, a 1440 px |
| `Erika's Homemade Prototipo.dc.html` | Prototipo interactivo del flujo de compra en móvil |
| `Erika's Homemade Prototipo Escritorio.dc.html` | El mismo flujo, interactivo, en escritorio |
| `img/` | Logo y fotos de producto reales usadas en los diseños |

### Sobre los archivos de diseño

Los `.dc.html` son **referencias de diseño hechas en HTML**: prototipos que muestran el aspecto y el comportamiento buscados. **No son código de producción y no se deben copiar tal cual.** La tarea es **recrear estos diseños en Next.js + React + Tailwind**, con los patrones y librerías del stack definido abajo.

Ábrelos en el navegador para ver el diseño real. Los dos prototipos son clickeables: recorren el flujo catálogo → producto → carrito → puerta de sesión → cuenta → pago → confirmación, y sirven como especificación viva del comportamiento.

### Fidelidad

**Alta fidelidad (hi-fi).** Colores, tipografía, espaciado y estados son definitivos. Recréalos con precisión. Los valores exactos están en la sección de tokens y en `PANTALLAS.md`.

Excepción: donde el diseño muestra un rectángulo rayado con una etiqueta (`foto chaqueta 4:5`, `foto niño 3:4`) es un placeholder — ahí va una foto real que aún no existe. Trátalo como `next/image` con imagen de relleno y `alt` descriptivo.

---

## 2. Stack

| Capa | Elección | Notas de implementación |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | SSR/SEO en catálogo y producto; Server Actions para todas las mutaciones; `strict: true` en `tsconfig` |
| Backend / BD | **Supabase** — Postgres + Auth + Storage + RLS + Realtime | Auth obligatoria para comprar y agendar; fotos en Storage; **RLS es lo que oculta el stock al cliente** |
| Estilos | **Tailwind CSS** | Paleta de marca como tokens en `tailwind.config.ts`; blanco dominante, morado/dorado solo en acentos |
| Componentes UI | **shadcn/ui (Radix) + lucide-react** | Personalizar los componentes generados con los tokens; no importar temas ajenos |
| Fuentes | **next/font** (auto-hospedadas) | `Lora` (display) + `Work Sans` (cuerpo) desde `next/font/google` |
| Formularios | **React Hook Form + Zod** | Un esquema Zod por formulario, compartido entre cliente y Server Action |
| Datos / estado | **Server Components + Server Actions + `@supabase/ssr`**; **TanStack Query** solo para lo interactivo | El carrito es lo único con estado de cliente real |
| Agenda / citas | **react-day-picker + date-fns** | Zona horaria fija `America/Bogota` |
| Emails | **Resend** | Confirmación de pedido y de cita |
| WhatsApp | Enlaces **wa.me** (MVP) → WhatsApp Business API después | El número vive en variables de entorno |
| Deploy | **Vercel** (front) + **Supabase** (backend gestionado) | Preview deploys por PR |
| Tooling | **pnpm, ESLint, Prettier, Vitest + Testing Library, Playwright** (e2e opcional) | Playwright cubre el flujo de compra completo |

### Repositorio

Todo el proyecto —app, migraciones de Supabase, seeds, tests y este brief— vive en **un solo repositorio**. Nada de código suelto fuera de él.

Al iniciar: commit inicial con el scaffold de Next.js, luego una rama por bloque del plan de trabajo (§8) y PR a `main`. Copia esta carpeta de handoff a `docs/design/` dentro del repo para que la referencia viaje con el código.

---

## 3. Estructura de carpetas propuesta

```
app/
  (tienda)/
    page.tsx                    # Home
    [categoria]/page.tsx        # Mujer · Hombre · Niño · Manualidades
    producto/[slug]/page.tsx
    carrito/page.tsx
    pagar/page.tsx              # Checkout (protegido)
    pedido/[id]/page.tsx        # Confirmación y seguimiento
    servicios/page.tsx
    servicios/[slug]/page.tsx
    agendar/[servicio]/page.tsx # Calendario (protegido)
    cuenta/page.tsx             # Mis pedidos y mis citas
  (auth)/
    entrar/page.tsx
    registro/page.tsx
  admin/
    page.tsx                    # Dashboard
    productos/page.tsx
    productos/[id]/page.tsx     # Crear / editar
    servicios/page.tsx
    citas/page.tsx
    pedidos/page.tsx
  api/                          # Solo webhooks (Resend, etc.)
components/
  ui/                           # shadcn/ui generado
  tienda/                       # ProductCard, CategoryCard, FilterBar, CartLine…
  admin/                        # StatCard, DataTable, StockEditor, WeekCalendar…
lib/
  supabase/{client,server,middleware}.ts
  schemas/                      # Zod
  format.ts                     # formatCOP, formatFecha
actions/                        # Server Actions por dominio
supabase/
  migrations/
  seed.sql
docs/design/                    # Esta carpeta de handoff
```

---

## 4. Reglas de negocio que mandan sobre la UI

Estas cuatro reglas no son opcionales; el diseño entero está construido alrededor de ellas.

**1. Registro obligatorio.** No hay compra ni agendamiento como invitado. El usuario puede navegar todo el catálogo y llenar el carrito sin cuenta, pero al pulsar "Ir al pago" o "Agendar cita" aparece la pantalla **"Necesitas una cuenta para continuar"** (checkout difuminado detrás, tarjeta blanca encima). El carrito se conserva durante el registro y el usuario vuelve exactamente al paso donde estaba.

**2. El stock nunca se muestra al cliente.** El cliente ve solo un badge: **Disponible**, **Agotado** o **Pieza única**. La cantidad numérica existe únicamente en el panel de Érika. Esto se garantiza en la base de datos con RLS y una vista pública que no expone la columna `stock` (ver `DATOS.md`), no solo ocultándola en el front.

**3. Categorías por público.** Mujer, Hombre y Niño son el foco; Manualidades es secundaria. Cada una tiene subcategorías. La bisutería no es categoría propia: se reparte como subcategoría dentro de Mujer, Hombre y Niño.

**4. Mobile-first.** Se diseña y se construye primero la vista de celular (390 px) y luego la de escritorio (1440 px). Breakpoints Tailwind por defecto; el salto real de layout ocurre en `lg` (1024 px).

---

## 5. Identidad visual

El **blanco es el color dominante**: fondos y superficies limpios y luminosos, con aire. La paleta de marca vive **solo en los detalles**: botones, enlaces, íconos, hover, badges, subrayados y footer. Nada de fondos saturados ni degradados decorativos.

El motivo de marca es la **puntada**: una línea discontinua dorada (`border-top: 1px dashed #B98A2E`) que separa secciones y bordea avisos, como una costura.

### Tokens de color

```ts
// tailwind.config.ts → theme.extend.colors
morado:      '#5B2A86',  // marca: botones primarios, enlaces, íconos
moradoHondo: '#3A1857',  // hover de botón, footer, bloque de servicios, badges sólidos
dorado:      '#B98A2E',  // acento: puntada, badge "pieza única", avisos, subrayados
doradoClaro: '#E7D7A6',  // texto dorado sobre fondo morado oscuro
lila:        '#C9B3DD',  // bordes suaves, badge "enviado", barras de gráfico
lavanda:     '#F2ECF7',  // fondo de bloques suaves, chips activos, badges claros
tinta:       '#2E2438',  // TODO el texto. Nunca negro puro
blanco:      '#FFFFFF',  // superficie dominante
nieve:       '#FCFAFD',  // filas alternas de tabla, tarjetas de resumen
```

Opacidades de tinta usadas: `rgba(46,36,56,.72)` cuerpo secundario · `.6` metadatos · `.5` etiquetas · `.45` placeholders · `.16`/`.1`/`.08` bordes.

Estados: pendiente `bg oklch(.95 .045 85) / text #8A6417` · cancelado `bg oklch(.94 .04 25) / text oklch(.5 .13 25)`.

### Tipografía

```ts
// next/font/google
Lora      → --font-display  (400, 500) — títulos, nombres de producto, precios grandes
Work Sans → --font-body     (300, 400, 500, 600) — cuerpo, UI, etiquetas
```

Escala usada en los diseños:

| Uso | Móvil | Escritorio |
|---|---|---|
| Hero | Lora 500 · 32/1.16 | Lora 500 · 56/1.14 |
| Título de sección | Lora 500 · 24/1.2 | Lora 500 · 38/1.2 |
| Título de página | Lora 500 · 30/1.15 | Lora 500 · 44/1.15 |
| Nombre de producto (tarjeta) | Lora 500 · 13.5/1.3 | Lora 500 · 17/1.35 |
| Nombre de producto (detalle) | Lora 500 · 26/1.25 | Lora 500 · 38/1.22 |
| Precio grande | Lora 500 · 26 | Lora 500 · 34 |
| Cuerpo | Work Sans 400 · 13.5/1.72 | Work Sans 400 · 14.5/1.8 |
| UI / botón | Work Sans 500 · 13 | Work Sans 500 · 14 |
| Etiqueta mayúscula | Work Sans 600 · 10 · `tracking .16em` · uppercase | igual |
| Eyebrow dorado | Work Sans 400 · 10 · `tracking .2em` · uppercase · dorado | 11 · `.24em` |

### Forma y elevación

- Radios: botones `9999px` (píldora) · campos y tarjetas pequeñas `8px` · tarjetas y contenedores `10–12px` · modales `14–16px`
- Bordes: `1px solid rgba(46,36,56,.1)` en tarjetas · `1px solid rgba(46,36,56,.16–.18)` en campos · `1.5px solid #5B2A86` en seleccionado
- Foco de campo: borde morado + `box-shadow: 0 0 0 3px #F2ECF7`
- Sombras: tarjetas `0 1px 3px rgba(46,36,56,.07)` · modal `0 12px 34px rgba(58,24,87,.16)` · ventana `0 18px 44px rgba(58,24,87,.13)`
- Espaciado horizontal de página: **16–18 px** en móvil, **56 px** en escritorio
- Imágenes: producto `4:5`, categoría `3:4`, hero móvil `4:5`, hero escritorio `1440×560`, servicio `16:10`

### Badges (componente único con variantes)

| Dominio | Variantes |
|---|---|
| Producto | Disponible · Agotado · Pieza única |
| Cita | Pendiente · Confirmada · Completada · Cancelada |
| Pedido | Nuevo · Pagado · Enviado · Entregado |

Todos: `Work Sans 500 · 10px · tracking .06em · uppercase · padding 6px 10px · radius 4px`.

### Formato de datos

- **Precios en pesos colombianos**, sin decimales, punto de miles: `$72.000`. Un solo helper `formatCOP(valor: number)`; guardar en la BD como entero en pesos.
- Fechas en español, zona `America/Bogota`: `Mar 15 sep 2026`, `11:15`.

---

## 6. Componentes clave a construir

Cada uno se implementa una vez y se reutiliza en móvil y escritorio:

`ProductCard` · `CategoryCard` · `Badge` (con las tres familias de estado) · `FilterSidebar` (escritorio) / `FilterSheet` (móvil, bottom sheet) · `SubcategoryChips` · `SizePicker` · `ColorPicker` · `QuantityStepper` · `CartLine` · `OrderSummary` · `DeliveryOption` / `PaymentOption` (radio-card) · `AuthGate` (la pantalla "necesitas una cuenta") · `ServiceCard` · `AppointmentCalendar` + `TimeSlotGrid` · `StatCard` (admin) · `DataTable` (admin) · `StockEditor` (matriz talla × color) · `WeekCalendar` (admin) · `PhotoUploader`.

---

## 7. Entrega y pago (según definición de la dueña)

- **Entrega**: Retiro en el taller (gratis) · Delivery local ($8.000) · Punto de encuentro (gratis, se acuerda por WhatsApp)
- **Pago**: Transferencia bancaria (el cliente sube comprobante, Érika verifica) · Efectivo al retirar
- No hay pasarela de pago en el MVP. El pedido nace en estado **Nuevo** y Érika lo pasa a **Pagado** cuando revisa el comprobante.
- El comprobante se sube a un bucket privado de Storage; solo Érika puede leerlo.

## Servicios de costura

Ajuste de talla (desde $18.000 · 45 min) · Ruedo y dobladillo ($12.000 · 30 min) · Reparación de prendas ($15.000 · 40 min) · Cambio de cierre ($20.000 · 40 min) · Bordado personalizado ($25.000 · 50 min) · Arreglo de bisutería ($10.000 · 20 min) · Confección a medida (presupuesto · 60 min, requiere consulta previa).

Los precios "desde" son referenciales: Érika confirma el precio final en el taller. Una cita nace **Pendiente** y solo Érika la pasa a **Confirmada**.

---

## 8. Plan de trabajo sugerido

1. **Base** — scaffold Next.js + TS + Tailwind + shadcn/ui, tokens y fuentes, layout con header/footer, `formatCOP`
2. **Datos** — proyecto Supabase, migraciones, RLS, seed con el catálogo real, cliente `@supabase/ssr`
3. **Catálogo público** — home, categoría con filtros, detalle de producto (Server Components)
4. **Carrito y auth** — carrito en cliente + persistencia, registro/login, `AuthGate`, middleware de rutas protegidas
5. **Checkout** — entrega, pago, subida de comprobante, creación de pedido, email con Resend, página de confirmación
6. **Servicios y citas** — listado, detalle, calendario con cupos reales, creación de cita
7. **Panel admin** — dashboard, CRUD de productos con stock por variante, servicios y cupos, calendario de citas, pedidos
8. **Cierre** — tests (Vitest en helpers y validaciones, Playwright en el flujo de compra), accesibilidad, SEO, deploy

---

## 9. Accesibilidad y calidad

- Contraste mínimo AA: el texto morado `#5B2A86` sobre blanco cumple; nunca usar dorado `#B98A2E` para texto pequeño sobre blanco salvo en avisos ≥12 px con peso 500.
- Área táctil mínima **44 px** en móvil (los steppers, chips y botones del diseño ya la cumplen).
- Todo control interactivo debe ser un `<button>` o `<a>` real, con foco visible (anillo `#F2ECF7`).
- Imágenes con `alt` descriptivo; los placeholders del diseño indican qué foto va en cada lugar.
- `prefers-reduced-motion`: sin transiciones de más de 150 ms; el diseño no depende de animación.
