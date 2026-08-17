# Prompt para Claude Design — Erika's Homemade

## Cómo usarlo

1. **Plantilla recomendada:**
   - **Paso 1 — `Color + type pairing`:** fija el sistema visual (base blanca + acentos morado/dorado + tipografías).
   - **Paso 2 — `UI mockups`:** diseña las pantallas reales. *(Es la plantilla principal.)*
   - Alternativa: empezar con `Wireframe` para validar estructura y luego pasar a `UI mockups`.
   - Evitar `Mobile app design` (es para apps nativas); esto es web responsive mobile-first → `UI mockups`.
2. **Adjuntar imágenes:**
   - **Las capturas de Ovejita** (home + categoría) → como referencia de **estructura/layout, NO de color**.
   - **El logo de Erika's Homemade** → para la identidad de marca.
3. **Consejo:** si la herramienta se satura con muchas pantallas, genera primero el sistema visual +
   Home + Catálogo + Detalle de producto + Registro; luego continúa con el resto.

---

## Prompt (copiar y pegar)

Diseña la interfaz visual (UI) de **Erika's Homemade**, una tienda online **mobile-first** de
**ropa y bisutería hecha a mano**, que además ofrece **servicios de costura/reparación con agenda
de citas**. La dueña, Érika, administra todo desde un panel administrativo.

**1) Identidad y color (regla clave)**
- **El blanco es el color principal y dominante:** fondos y superficies limpios, luminosos, con aire.
- Usa la paleta de marca **solo en detalles y acentos** (botones, enlaces, íconos, hover, badges,
  subrayados, footer):
  - Morado marca `#5B2A86` · Morado profundo `#3A1857` · Dorado acento `#B98A2E`
  - Apoyos suaves: Lila `#C9B3DD` · Lavanda `#F2ECF7` · Tinta (texto) `#2E2438`
- Nada de fondos saturados; la marca vive en los detalles → experiencia limpia y amena.
- **Tipografía:** artesanal, cercana y femenina ("hecho a mano"): un display cálido (serif suave o
  humanista) + una sans limpia y legible para el cuerpo.

**2) Estructura de referencia (estilo tipo Ovejita — ver capturas adjuntas)**
Usa las capturas **solo como referencia de estructura y layout, NO de color** (ellos usan azul;
nosotros blanco + morado/dorado).
- **Header fijo:** logo a la izquierda; navegación por categorías (Inicio · Mujer · Hombre · Niño ·
  Manualidades · Servicios · Contacto); a la derecha íconos de **cuenta, búsqueda y carrito**.
- **Home:** hero/carrusel con imagen y mensaje de marca; sección "Nuestro catálogo" con **tarjetas
  por categoría** (Mujer/Hombre/Niño); bloque de **historia de la marca**; **productos destacados**;
  footer completo con **suscripción al correo** y **redes**.
- **Página de categoría:** título + **barra lateral de filtros con subcategorías** + **grilla de
  productos** (foto, nombre, precio).
- **Detalle de producto:** galería, descripción, precio, variantes (talla/color), indicador
  **disponible/agotado**, botón **agregar al carrito**.
- **Footer:** menú (contáctanos, preguntas frecuentes, nosotros, términos, privacidad), info de
  contacto, newsletter y redes.

**3) Pantallas a diseñar**
- **Público:** Home · Catálogo/Categoría (con filtros) · Detalle de producto · Carrito · Checkout ·
  Registro / Iniciar sesión · Servicios · Detalle de servicio · Agendar cita (calendario).
- **Admin (panel de Érika):** Dashboard · Lista de productos · Formulario crear/editar producto
  (categoría, nombre, descripción, precio, stock, fotos) · Servicios · Citas (calendario) ·
  Ventas/Pedidos.

**4) Reglas de negocio que afectan la UI**
- **Registro obligatorio:** para comprar o agendar hay que crear cuenta e iniciar sesión (no hay
  compra como invitado). Diseña el estado "necesitas iniciar sesión".
- **Stock interno:** el cliente **nunca ve la cantidad**, solo un badge **Disponible** o
  **Agotado**. El número solo aparece en el panel admin.
- **Categorías por público:** Mujer, Hombre, Niño (foco) + Manualidades (secundaria), cada una con
  **subcategorías**.
- **Mobile-first:** diseña primero la vista de celular e incluye la versión de escritorio.

**5) Componentes clave**
Tarjeta de producto · tarjeta de categoría · barra de filtros/subcategorías · formulario de
producto (admin) · calendario de citas · carrito · resumen de checkout · badges de estado
(disponible/agotado; pendiente/confirmada/completada/cancelada; nuevo/pagado/enviado/entregado) ·
tarjetas del dashboard.

**Entrega esperada:** un sistema visual coherente (colores, tipografía, componentes) + las
pantallas anteriores en versión móvil y escritorio.
