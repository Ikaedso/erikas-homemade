# Erika's Homemade — Plan del Aplicativo Web

> Documento de planeación, flujo de trabajo y mapeo de módulos.
> **Estado:** Fase 0 — Definición. *No se ha desarrollado código todavía.*
> **Siguiente paso:** entregar este plan a Claude Design para generar wireframes y UI a partir de la colorimetría de la marca.

---

## 1. Visión general

Aplicativo web para **Erika's Homemade**, el negocio de nuestra clienta Érika, quien vende
prendas y artículos hechos a mano (ropa, camisas, manualidades y bisutería) y además ofrece
**servicios de reparación y confección de ropa**.

El sistema tiene dos grandes propósitos:

1. **Tienda / catálogo** — Érika publica y gestiona los productos que vende; los clientes los
   exploran, agregan al carrito y compran.
2. **Servicios con agenda** — Érika publica los servicios que ofrece; los clientes agendan
   una cita de reparación/confección.

**Prioridad de diseño:** *mobile-first*. La mayoría de las clientas llegarán desde el celular.

---

## 2. Usuarios y roles

| Rol | Quién | Qué puede hacer |
|-----|-------|-----------------|
| **Administradora** | Érika (dueña) | Crear/editar/eliminar productos y servicios, gestionar citas, ver y procesar ventas, panel de control. |
| **Cliente** | Visitante / comprador | Explorar catálogo, buscar y filtrar, agregar al carrito, comprar, agendar citas. Compra como invitado (registro opcional a futuro). |

---

## 3. Identidad visual — Colorimetría (extraída del logo)

El logo es una máquina de coser morada dentro de un trazo circular tipo pincel, con el texto
"erika's homemade". La paleta se deriva de esos morados artesanales, con un dorado cálido de
acento que complementa el mundo de la bisutería y lo hecho a mano.

| Token | Hex | Uso |
|-------|-----|-----|
| **Morado marca** (primary) | `#5B2A86` | Color principal, botones, enlaces, encabezados. |
| **Morado profundo** | `#3A1857` | Texto de titulares, fondos oscuros, contraste. |
| **Morado medio** | `#8257A8` | Estados hover, elementos secundarios. |
| **Lila** | `#C9B3DD` | Detalles suaves, bordes destacados, ilustración. |
| **Lavanda pálido** | `#F2ECF7` | Fondos de sección, tarjetas, superficies. |
| **Dorado acento** | `#B98A2E` | Llamados a la acción especiales, precios destacados, detalles. |
| **Tinta** (texto) | `#2E2438` | Texto de cuerpo. |
| **Blanco cálido** | `#FBF9FC` | Fondo base. |

**Colores semánticos (estados):** verde = confirmado/entregado, ámbar = pendiente, rosa = cancelado.
Son independientes del acento de marca.

---

## 4. Mapa del sitio (arquitectura de información)

```
Inicio (Landing)
├── Catálogo
│   ├── Categorías (por público): Mujer · Hombre · Niño  (+ Manualidades, secundaria)
│   ├── Subcategorías por tipo de prenda (blusas · camisas · vestidos · accesorios…)
│   ├── Búsqueda
│   └── Detalle de producto → disponible/agotado → Agregar al carrito
├── Servicios
│   └── Detalle de servicio → Agendar cita
├── Agendar cita (Reservas)
├── Carrito
│   └── Checkout → Confirmación
├── Contacto / Sobre Érika
│
└── ADMIN (solo Érika, requiere login)
    ├── Panel / Dashboard
    ├── Productos (crear · editar · eliminar · inventario)
    ├── Servicios (crear · editar · eliminar)
    ├── Citas (calendario · confirmar · reagendar · cancelar)
    └── Ventas / Pedidos (estados · historial · reportes)
```

---

## 5. Módulos detallados

### 5.1 Inicio / Landing — *Público*
Presentación de la marca. Productos destacados, categorías, acceso rápido a servicios y a
"Agendar cita". Refleja la personalidad artesanal y la colorimetría de la marca.

### 5.2 Catálogo — *Público*
- Grilla de productos con foto, nombre y precio.
- Filtros por **categoría (público):** **Mujer, Hombre, Niño** *(foco inicial)*;
  **Manualidades** queda como categoría secundaria.
- Cada categoría tiene **subcategorías por tipo de prenda** (blusas, camisas, vestidos,
  accesorios/bisutería…).
- Búsqueda por nombre.
- **Detalle de producto:** galería de fotos, descripción, precio, variantes (talla/color),
  indicador **disponible / agotado** (sin mostrar la cantidad), botón **Agregar al carrito**.

### 5.3 Gestión de productos — Panel administrativo (CRUD) — *Admin*
Es el **centro de control** de Érika. Desde aquí administra todo el catálogo sin tocar código:
- **Agregar producto:** elige la **categoría** (Mujer / Hombre / Niño / Manualidades) y su
  subcategoría, y llena: **nombre, descripción, precio, stock** y fotos.
- **Publicar:** al guardarlo, el producto aparece automáticamente en la **landing / catálogo**
  de la página, donde el cliente lo ve y puede **agregarlo al carrito**.
- **Editar / deshabilitar / eliminar:** puede modificar cualquier dato, ocultar (deshabilitar)
  o borrar un producto en cualquier momento.
- **Stock:** el administrador **define y edita el stock** de cada producto desde el panel.

**Regla de stock (importante):** el **cliente NO ve la cantidad exacta** de stock. Solo ve si el
producto está **disponible** o **agotado**. El número real es interno y solo lo maneja Érika desde
el panel; el stock baja de forma automática con cada venta.

### 5.4 Servicios — *Público*
- Lista de servicios que ofrece Érika (reparación, ajustes, confección).
- **Detalle de servicio:** descripción, precio o rango, tiempo estimado, botón **Agendar cita**.

### 5.5 Gestión de servicios (CRUD) — *Admin*
Crear, editar y eliminar servicios (nombre, descripción, precio/rango, duración estimada, estado).

### 5.6 Citas / Reservas (Agenda) — *Público + Admin*
- **Cliente:** elige servicio → selecciona fecha y hora disponible → deja datos de contacto y
  descripción de la prenda → confirma.
- **Admin:** calendario de citas; confirmar, reagendar o cancelar; estados
  **(pendiente · confirmada · completada · cancelada)**.

### 5.7 Carrito — *Público*
Agregar/quitar productos, ajustar cantidades, ver subtotal, proceder al checkout.

### 5.8 Ventas / Checkout / Pedidos — *Público + Admin*
- **Checkout:** datos de entrega, método de pago (por definir según el país), resumen y
  confirmación del pedido.
- **Admin:** lista de pedidos/ventas con estados **(nuevo · pagado · enviado · entregado)**,
  historial y reportes básicos.

### 5.9 Panel de administración (Dashboard) — *Admin*
Resumen para Érika: ventas del día/mes, próximas citas, productos con bajo stock, accesos
rápidos a los CRUD.

### 5.10 Autenticación — *Transversal*
Login para Érika (administradora). Los clientes compran como invitados; registro de cuenta
opcional a futuro.

### 5.11 Contacto / Sobre Érika — *Público*
Historia de la marca, redes sociales, ubicación e información de contacto.

**Transversales:** notificaciones (confirmación de cita/pedido por correo o WhatsApp — por
definir), búsqueda e inventario ligado a productos.

---

## 6. Flujos de trabajo (recorridos)

**F1 · Cliente compra un producto**
`Inicio → Catálogo → Detalle → Agregar al carrito → Carrito → Checkout → Confirmación`

**F2 · Cliente agenda una reparación**
`Inicio → Servicios → Detalle del servicio → Agendar cita (fecha/hora) → Datos → Confirmación`

**F3 · Érika publica un producto** *(ciclo completo)*
`Login → Panel → Productos → Elegir categoría (Mujer/Hombre/Niño) → Nombre · Descripción · Precio · Stock · Fotos → Publicar → Aparece en la landing/catálogo → El cliente lo agrega al carrito`

**F4 · Érika gestiona una cita**
`Login → Dashboard → Citas → Ver solicitud → Confirmar/Reagendar → Notificar al cliente`

**F5 · Érika procesa una venta**
`Dashboard → Pedidos → Ver pedido → Marcar pagado → enviado → entregado`

---

## 7. Modelo de datos (entidades principales)

- **Producto** — id, nombre, categoría, subcategoría, descripción, precio, stock (interno), variantes[], imágenes[], estado (publicado/borrador/deshabilitado), fechas.
- **Categoría** — id, nombre (Mujer / Hombre / Niño / Manualidades), slug, subcategorías[].
- **Servicio** — id, nombre, descripción, precio/rango, duración estimada, estado.
- **Cita** — id, servicio_id, cliente (nombre, contacto), fecha, hora, notas, estado.
- **Carrito** — id, items[] (producto_id, variante, cantidad, precio).
- **Pedido / Venta** — id, items[], datos de entrega, total, método de pago, estado, fecha.
- **Usuario (Admin)** — id, nombre, email, rol, credenciales.

---

## 8. Roadmap paso a paso (fases)

| Fase | Nombre | Contenido |
|------|--------|-----------|
| **0** | Definición y diseño | Este plan + colorimetría → Claude Design genera wireframes y UI kit. |
| **1** | Fundación | Estructura del proyecto, sistema de diseño (colores/tipografía), layout base, navegación. |
| **2** | Catálogo y productos | Catálogo público + CRUD de productos + inventario. |
| **3** | Servicios y citas | Módulo de servicios + agenda/reservas. |
| **4** | Carrito y ventas | Carrito + checkout + gestión de pedidos. |
| **5** | Panel admin y auth | Dashboard, login, roles. |
| **6** | Extras | Notificaciones, reportes, SEO, despliegue. |

---

## 9. Entregables que necesita Claude Design

1. **Tokens de color** con la colorimetría de la sección 3.
2. **Tipografía** sugerida (display + cuerpo) acorde a lo artesanal.
3. **Wireframes / mockups** de cada pantalla clave por módulo.
4. **Componentes clave:** tarjeta de producto, formulario de producto, calendario de citas,
   carrito, checkout, tarjetas del dashboard.
5. **Versiones responsive** (mobile-first).

---

## 10. Stack tecnológico sugerido (para fases posteriores)

- **Frontend:** React / Next.js.
- **Estilos:** Tailwind con los tokens de marca.
- **Backend / BD:** Node + PostgreSQL, o un backend-as-a-service (Supabase / Firebase) para acelerar.
- **Imágenes:** almacenamiento en la nube.
- **Pagos:** pasarela local (por definir según el país).

*(El stack es orientativo; se confirma al iniciar la Fase 1.)*
