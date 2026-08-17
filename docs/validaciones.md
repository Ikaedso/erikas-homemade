# Erika's Homemade — Mapa de validaciones y seguridad

Principio: **defensa en capas.** El cliente valida para UX; el **servidor (Server Actions) y la base de datos (RLS + funciones)** son la autoridad real. Nada crítico depende solo del navegador.

Capas: **C** = Cliente (UX) · **SA** = Server Action · **RLS/DB** = Postgres (políticas / funciones / constraints).

---

## 1. Autenticación y registro

| Regla | Dónde | Estado |
|---|---|---|
| Correo con formato válido, contraseña ≥ 8, nombre 2–60, WhatsApp E.164 opcional | C (Zod `registro`) | ✅ |
| **Correo ya existente no crea cuenta** (se detecta el "éxito obfuscado" de Supabase: `user.identities` vacío, o error `already/registered`) | C | ✅ (arreglado) |
| Registro obligatorio para comprar o agendar | SA + páginas protegidas | ✅ |
| Confirmación de correo con enlace al dominio real (local o prod) | `/auth/callback` + `emailRedirectTo = origin` | ✅ |
| El perfil (`rol=cliente`) se crea solo al registrarse | RLS/DB (trigger `handle_new_user`) | ✅ |

## 2. Autorización (roles y rutas)

| Regla | Dónde | Estado |
|---|---|---|
| `/pagar`, `/cuenta`, `/agendar/*` exigen sesión | SA (`requireUser` en la página) | ✅ |
| `/admin/*` exige sesión **y** rol admin | SA (`requireAdmin` en el layout) | ✅ |
| Cada acción de admin revalida el rol (no confía en la ruta) | SA (`esAdmin()` en cada acción) | ✅ |
| Escritura de productos/stock/servicios/pedidos/citas: **solo admin** | RLS/DB (políticas `is_admin()`) | ✅ |
| El botón "Panel" solo aparece a admins (UX) | C | ✅ |

## 3. Productos y stock (regla clave del negocio)

| Regla | Dónde | Estado |
|---|---|---|
| **El cliente nunca lee el stock**; solo `disponible/agotado` | RLS/DB (vistas `catalogo_publico`/`variantes_publicas`; tabla `variantes` cerrada) | ✅ |
| `costo_cop` y `aviso_stock_bajo` nunca se exponen | RLS/DB (no están en la vista) | ✅ |
| Producto: precio > 0, categoría requerida, stock ≥ 0 | SA + DB (`check`) | ✅ |
| Solo productos `publicado` aparecen en la tienda | RLS/DB (vista `where publicado`) | ✅ |

## 4. Carrito y checkout (pedidos)

| Regla | Dónde | Estado |
|---|---|---|
| Cantidades ≥ 1; pieza única máx. 1 | C (carrito) + DB (stock=1) | ✅ |
| **El total se recalcula con precios de la BD** (no se confía en el precio del cliente) | RLS/DB (función `crear_pedido`) | ✅ |
| **Stock validado y descontado en una transacción**; falla si no alcanza | RLS/DB (`crear_pedido`, `security definer`, `for update`) | ✅ |
| El pedido se crea a nombre del usuario en sesión (`cliente_id = auth.uid()`) | RLS/DB | ✅ |
| Comprobante obligatorio si el pago es transferencia | C + SA (`crearPedido`) | ✅ |
| El cliente no puede cambiar el estado de su pedido | RLS/DB (política) | ✅ |

## 5. Citas

| Regla | Dónde | Estado |
|---|---|---|
| Horario futuro | SA (`crearCita`) | ✅ |
| **El horario debe ser real del taller** (día abierto, dentro de la jornada, no bloqueado, cabe la duración) | SA (revalidado en el servidor) | ✅ (endurecido) |
| No hay doble reserva del mismo bloque | DB (`unique(inicia_en)` + manejo `23505`) | ✅ |
| La cita nace `pendiente`; solo Érika la confirma | RLS/DB (política de insert/estado) | ✅ |
| El cliente no ve las citas de otros; para agendar solo recibe las marcas ocupadas | RLS/DB (`horarios_ocupados`, `security definer`) | ✅ |

## 6. Storage

| Regla | Dónde | Estado |
|---|---|---|
| Comprobantes en bucket **privado**; el cliente solo sube en su carpeta (`<uid>/…`) | RLS/DB (política de `storage.objects`) | ✅ |
| Solo Érika lee los comprobantes (URL firmada temporal) | RLS/DB + SA (`getComprobanteUrl`) | ✅ |
| Comprobante: imagen o PDF, ≤ 5 MB | C (checkout) | ✅ |

## 7. Datos y exposición (RLS)

- RLS **activo en todas las tablas**. Lectura pública solo de: catálogo (vistas), categorías/subcategorías, servicios, horario, días bloqueados y fotos de productos publicados.
- Perfiles, variantes, pedidos, items y citas: cada quien ve lo suyo; el admin, todo.

---

## Notas de robustez ya cubiertas
- El middleware Edge se retiró (fallaba en Vercel); la protección vive en las páginas + RLS.
- `emailRedirectTo` usa el origin actual → funciona en local y producción.
- Los formularios comparten esquema Zod entre cliente y servidor donde aplica.

---

## Auditoría — hallazgos y cierre (migración `0007_seguridad.sql`)

Al auditar RLS + lógica se encontraron y cerraron **3 huecos reales**:

| # | Hueco | Riesgo | Cierre |
|---|---|---|---|
| 1 | Un usuario podía **cambiar su propio `rol` a admin** por API (update de `perfiles` sin restricción de columna) | **Alto** (escalada de privilegios) | Trigger `proteger_rol`: con sesión, solo un admin cambia `rol`; sin sesión (SQL editor) se permite la promoción manual |
| 2 | Un usuario podía **insertar un pedido directo** (p. ej. "pagado") evitando `crear_pedido` | Medio (integridad) | Se quitan las políticas de insert de `pedidos`/`items_pedido`; solo nacen dentro de `crear_pedido` |
| 3 | Un cliente podía **auto-confirmar su cita** (update de estado) | Medio (integridad) | Trigger `proteger_estado_cita`: el cliente solo puede cancelar, no confirmar/completar |

> ⚠️ **Aplicar `supabase/migrations/0007_seguridad.sql`** en Supabase para que estos cierres queden activos.

## Arreglo posterior — fotos visibles solo para admin (migración `0008_fotos_rls.sql`)

La política `fotos lectura publica` comprobaba `publicado` leyendo la tabla `productos`, que tiene RLS solo-admin. Para clientes/anónimos el subquery no veía filas y **ninguna foto era legible** (las imágenes solo aparecían para el admin). Se cierra con `producto_publicado(uuid)` (`security definer`), que verifica `publicado` sin que el RLS de `productos` bloquee la comprobación.

## Residuales de bajo riesgo (opcionales)
- **Citas por API**: un usuario podría insertar una cita `pendiente` con un horario raro saltándose la validación de la Server Action (la UI solo ofrece horarios válidos, `unique(inicia_en)` evita choques y Érika revisa toda cita antes de confirmar). Cierre total: mover la creación a una función `security definer`.
- **`requiere_consulta`** (confección a medida): hoy se puede agendar directo; podría exigir consulta previa.
- **Pieza única**: el tope de 1 se apoya en `stock = 1`; `crear_pedido` podría además forzar cantidad máx. 1.
- **Compra de producto no publicado**: `crear_pedido` no verifica `publicado` (se compraría un borrador a su precio real).

Ninguno expone datos ni permite fraude de precio/stock; se pueden endurecer si se desea.
