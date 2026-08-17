# Pantallas — Erika's Homemade

Especificación pantalla por pantalla. Los identificadores entre paréntesis (`1b`, `1o`…) son los badges visibles en `Erika's Homemade UI.dc.html`: ábrelo y busca ese id para ver la pantalla exacta.

Convenciones: **móvil = 390 px**, **escritorio = 1440 px**. Padding lateral 16–18 px en móvil y 56 px en escritorio salvo que se indique otra cosa. Todo el texto en tinta `#2E2438`.

---

# TIENDA PÚBLICA

## Header (todas las pantallas)

**Móvil** — sticky, `padding 8px 14px`, borde inferior `1px rgba(46,36,56,.08)`.
Izquierda: ícono hamburguesa (18 px, trazo morado 1.5) + logo (34 px de alto) + "Erika's Homemade" en Lora 500 · 14 px en dos líneas.
Derecha: íconos cuenta, búsqueda y carrito (17 px, morado). El carrito lleva un contador: círculo dorado `#B98A2E`, 14 px, texto blanco Work Sans 600 · 9 px.

**Escritorio** — `padding 12px 56px`, no sticky.
Izquierda: logo 52–58 px + nombre en dos líneas.
Centro: `Inicio · Mujer · Hombre · Niño · Manualidades · Servicios · Contacto` en Work Sans 400 · 13.5 px, `gap 28px`. Las cuatro categorías llevan chevron de 11 px. El ítem activo va en morado con subrayado dorado (`border-bottom 1px solid #B98A2E`, `padding-bottom 3px`).
Derecha: nombre de usuario o "Iniciar sesión", búsqueda y carrito con contador.

## Footer (todas las pantallas)

Franja de newsletter sobre fondo lavanda `#F2ECF7`: eyebrow dorado "Suscríbete al correo", titular Lora 500 (19 px móvil / 28 px escritorio) en `#3A1857`, campo de correo + botón morado. En escritorio va en fila; en móvil apilado.

Debajo, footer morado profundo `#3A1857`, texto blanco. Móvil: dos columnas (Menú / Taller). Escritorio: cuatro columnas (marca + redes · Menú inferior · Conoce el taller · Comprar). Menú inferior: Contáctanos · Preguntas frecuentes · Nosotros · Términos y condiciones · Política de privacidad. Redes en círculos de 28–32 px con borde `rgba(255,255,255,.3)`. Separador antes del copyright: puntada dorada `1px dashed rgba(185,138,46,.5)`.

---

## Home (`1b` móvil · `1o` escritorio)

**Propósito**: presentar la marca, llevar al catálogo por categoría y a los servicios.

Secciones en orden:

1. **Hero / carrusel** — foto a sangre (móvil `4:5`; escritorio 1440×560). Degradado encima: móvil de abajo hacia arriba `rgba(58,24,87,.8)` → transparente al 62%; escritorio de izquierda a derecha `.8` → `.1` al 66%. Contenido sobre el degradado: eyebrow dorado claro `#E7D7A6` ("Serie corta · Agosto"), titular Lora 500 blanco a dos líneas ("Cosido a mano, / hecho a tu medida"), párrafo (solo escritorio), botón blanco con texto `#3A1857` + botón fantasma con borde blanco. Indicadores: tres barritas en móvil; flechas circulares abajo a la derecha en escritorio.

2. **Nuestro catálogo** — título centrado + puntada dorada de 34–48 px debajo. Grilla de tarjetas de categoría: 2 columnas en móvil, 4 en escritorio, `gap 12/20px`. Cada tarjeta: foto `3:4`, radio 8–10 px, degradado morado desde abajo, nombre en Lora 500 (19/27 px) blanco y conteo en eyebrow dorado claro. Manualidades lleva además borde dorado `1px rgba(185,138,46,.4)`.

3. **Nuestra historia** — móvil: bloque lavanda centrado con radio 10 px. Escritorio: dos columnas, texto a la izquierda y foto `4:3` a la derecha, más una fila de tres cifras (12 años · 840 piezas hechas · 1 a 1 atención) separada por puntada dorada. Cierra con enlace subrayado en dorado "Conoce a Érika".

4. **Destacados** — encabezado con enlace "Ver todo" a la derecha. Grilla de `ProductCard`: 2 columnas en móvil, 4 en escritorio. Los agotados van con `opacity .74` y la foto en `saturate(.6)`.

5. **Taller de costura** — banda a sangre en morado profundo `#3A1857`, texto blanco. Móvil: centrado con botón dorado. Escritorio: dos columnas, texto a la izquierda y cuatro tarjetas de servicio con borde `rgba(255,255,255,.18)` a la derecha.

## Menú de categorías (`1c`, solo móvil)

Drawer a pantalla completa. Buscador tipo píldora arriba. Lista de secciones separadas por `1px rgba(46,36,56,.07)`, cada una en Lora 500 · 19 px con chevron. La sección abierta (Mujer) despliega sus subcategorías como chips lavanda. "Servicios" lleva badge dorado "Con cita". Al pie, tarjeta con borde punteado dorado invitando a registrarse: botones "Registrarme" (morado) y "Entrar" (contorno).

---

## Catálogo de categoría (`1d` móvil · `1p` escritorio)

**Propósito**: filtrar y encontrar piezas.

Cabecera: migas de pan, título centrado en Lora 500 (30/44 px), puntada corta debajo (escritorio) y conteo de piezas.

**Móvil**: fila horizontal de chips de subcategoría (activo = morado sólido, resto = contorno). Debajo, barra entre dos líneas con botón "Filtrar" y el orden actual. Grilla de 2 columnas, `gap 16px 12px`. Al final, botón contorno "Cargar más".

**Escritorio**: layout `grid-template-columns: 236px 1fr; gap: 44px`.
- *Barra lateral*: botón "Filtrar" · **Subcategorías** (lista con conteo; activa con fondo lavanda, radio 7 px y conteo morado) · puntada · **Disponibilidad** (checkboxes de 16 px, marcado = cuadro morado con check blanco) · puntada · **Precio** (slider de doble mango, riel `rgba(46,36,56,.12)`, tramo activo morado, mangos blancos con borde morado 2 px) · puntada · **Talla** (cuadros de 40×36 px).
- *Contenido*: fila superior con chips de filtros aplicados (lavanda, borde lila, con × para quitar) y el orden; grilla de 3 columnas, `gap 26px 22px`.

## Panel de filtros móvil (`1e`)

Bottom sheet sobre velo `rgba(58,24,87,.35)`. Hoja blanca con radio superior 16 px. Título "Filtrar" + ×, puntada dorada, y los mismos grupos que la barra lateral. Pie con dos botones: "Limpiar" (contorno, `flex:1`) y "Ver 12 piezas" (morado, `flex:2`).

---

## Detalle de producto (`1f` móvil · `1q` escritorio)

**Móvil**: foto principal `1:1` con indicadores de carrusel abajo; tira de 4 miniaturas de 52×60 px (la activa con borde morado 1.5 px). Luego: eyebrow "Mujer · Blusas", nombre en Lora 500 · 26 px, fila con precio Lora 500 · 26 px + badge de estado, descripción, **Talla** (cuadros de 46×42 px; la agotada con borde punteado, texto atenuado y tachado), **Color** (círculos de 32 px; el activo con anillo morado), stepper + botón "Agregar al carrito", aviso del taller con borde punteado dorado y el logo a la izquierda, tres acordeones (Cuidado de la pieza · Entrega y retiro · Cambios y arreglos) y una grilla de 2 relacionados.

**Escritorio**: `grid-template-columns: 88px 1fr 440px; gap: 28px`. Columna 1 miniaturas verticales, columna 2 foto `4:5`, columna 3 toda la información (mismos bloques, tipografía mayor: nombre 38 px, precio 34 px, tallas 50×44 px, colores 34 px). Los acordeones van al final de la tercera columna. Abajo, franja de 4 relacionados.

**Estado agotado**: badge gris, botón principal deshabilitado en `rgba(46,36,56,.09)` con texto `rgba(46,36,56,.42)` y un botón secundario "Avísame cuando vuelva".

---

## Carrito (`1g`)

**Móvil**: lista de líneas separadas por puntada dorada. Cada línea: foto 82×100 px (radio 7), nombre en Lora 500 · 15 px, variante en gris, stepper píldora y precio de línea. La pieza única muestra la nota dorada "Pieza única: solo hay una" y su `+` queda inerte. Debajo: campo de descuento + "Aplicar", bloque de resumen lavanda (Subtotal · Entrega · puntada · Total en Lora 500 · 24 px), botón "Ir al pago" y el aviso de sesión con círculo dorado "i".

**Escritorio** (ver prototipo): `grid-template-columns: 1fr 400px; gap: 52px`. Izquierda, tabla con cabecera `Pieza / Cantidad / Total` en `#FCFAFD`; derecha, tarjeta de resumen fija en `#FCFAFD` con borde `rgba(46,36,56,.09)`.

**Carrito vacío**: ícono en círculo punteado dorado, titular Lora 500, párrafo y botón "Ver el catálogo".

## Necesitas iniciar sesión (`1h`)

Aparece al pulsar "Ir al pago" sin cuenta. El checkout queda detrás con `filter: blur(1.6px); opacity:.4`. Encima, tarjeta blanca (radio 14 px, sombra `0 12px 34px rgba(58,24,87,.16)`): candado en círculo punteado dorado, titular a dos líneas "Necesitas una cuenta / para continuar", párrafo explicativo, botón morado "Crear mi cuenta", botón contorno "Ya tengo cuenta, entrar", y al pie tras una puntada: "Tu carrito se guarda mientras te registras". En escritorio es un modal centrado de 430 px sobre el checkout difuminado.

## Registro / iniciar sesión (`1i`)

**Móvil**: logo centrado, titular, conmutador de dos pestañas dentro de una píldora lavanda, campos, "Recordarme" + "Olvidé mi contraseña", botón "Entrar", separador "o" con puntada, botones de Google y WhatsApp, y nota legal en bloque lavanda.

**Escritorio**: dos columnas — foto con degradado y mensaje de marca a la izquierda; formulario de 430 px a la derecha (nombre y WhatsApp en dos columnas, correo y contraseña a ancho completo).

## Checkout (`1j` móvil · `1r` escritorio)

Indicador de tres pasos arriba: `1 Entrega — 2 Pago — 3 Listo`, unidos por puntada dorada (tramo recorrido) y línea gris (pendiente).

Bloques: **¿Cómo la recibes?** (tres radio-cards: Retiro en el taller / Delivery local $8.000 / Punto de encuentro) · **Método de pago** (Transferencia bancaria / Efectivo al retirar) · si es transferencia, panel punteado dorado con los datos de la cuenta y el enlace "Subir comprobante" · **Nota para Érika**.

Radio-card seleccionada: borde `1.5px #5B2A86`, fondo `#F2ECF7`, punto relleno `border: 5px solid #5B2A86` sobre blanco.

Resumen: en móvil bloque lavanda al final; en escritorio tarjeta lateral de 420 px con las líneas del pedido, subtotal, entrega, puntada y total en Lora 500 · 28 px. Botón "Confirmar pedido" y nota "Érika confirma por WhatsApp en menos de 24 h".

## Pedido confirmado (`1k`)

Check en círculo lavanda con borde punteado dorado, "¡Gracias, María!", número de pedido en morado profundo, tarjeta de estado con badge "Nuevo" y una línea de tiempo de tres hitos (Recibido · Pago verificado · Listo para retirar) unidos por puntada lila; los pendientes van en círculo hueco. Debajo, resumen y dos botones (Ver mis pedidos / Seguir comprando). En escritorio la línea de tiempo es horizontal y el resumen va a la derecha.

---

## Servicios (`1l`)

Encabezado con eyebrow "Taller de costura" y titular a dos líneas. Lista de tarjetas de servicio: foto 64×64 (radio 8), nombre en Lora 500 · 17 px, descripción, precio "Desde $X" + duración. Pie de tarjeta separado por puntada: cupos de la semana a la izquierda (en dorado si quedan pocos) y "Agendar" subrayado a la derecha. "Confección a medida" va destacada con borde y fondo cálidos (`#FDFBF6`). Cierra con bloque lavanda "¿No sabes qué necesitas?" y botón WhatsApp en morado profundo.

## Detalle de servicio (`1m`)

Foto `16:10`, eyebrow "Servicio con cita", nombre en Lora 500 · 27 px, fila de tres datos entre puntadas (Desde / Duración / Entrega), descripción, lista "Incluye" con viñetas romboidales doradas (cuadro de 5 px rotado 45°), y tabla de precios por prenda con filas alternas en `#FCFAFD`. Barra inferior sticky: precio "Desde" + botón "Agendar cita".

## Agendar cita (`1n` móvil · `1s` escritorio)

Resumen del servicio elegido en bloque lavanda con enlace "Cambiar".

**Calendario**: cabecera con mes y flechas; fila de iniciales de día; grilla de 7 columnas. Estados: día con cupos = punto dorado de 4 px debajo del número; día elegido = círculo morado (móvil) o cuadro morado radio 8 px (escritorio) con número blanco; día sin cupos o taller cerrado = número en `rgba(46,36,56,.25)`. Leyenda debajo con los tres estados.

**Franjas horarias**: grilla de 3 columnas en móvil, 2 en la columna lateral de escritorio. Libre = contorno gris; elegida = borde morado 1.5 px + fondo lavanda; ocupada = borde punteado, texto atenuado y tachado.

**Nota para Érika**: textarea con placeholder "Qué prenda traes y qué le quieres cambiar".

**Resumen**: móvil = bloque punteado dorado; escritorio = tarjeta lateral de 400 px con servicio, día, hora, lugar, precio "Desde" y la aclaración de que el precio final se confirma en el taller. Botón "Confirmar cita" y la línea "Queda **pendiente** hasta que Érika la confirme" (la palabra pendiente como badge).

---

# PANEL DE ÉRIKA

Layout común: `grid-template-columns: 236px 1fr`. Barra lateral sobre `#FCFAFD` con borde derecho, logo + "Panel" en eyebrow dorado, puntada, y navegación (Panel · Productos · Categorías · Servicios · Citas · Pedidos · Clientes · Ajustes). Ítem activo: fondo lavanda, radio 8 px, texto `#3A1857` y rombo dorado a la izquierda; los inactivos llevan rombo hueco. Citas y Pedidos muestran contador circular (dorado y morado respectivamente). Contenido con `padding 26px 30px 40px`.

## Dashboard (`1t`)

Saludo con fecha y dos botones (Exportar ventas / Nuevo producto). Cuatro `StatCard` de igual ancho: Ventas del mes · Pedidos nuevos · Citas de hoy · **Stock bajo** (esta última con borde dorado y fondo `#FDFBF6`). Cifra en Lora 500 · 30 px.

Debajo, `grid 1.5fr 1fr`: tabla de últimos pedidos a la izquierda (Pedido · Cliente · Piezas · Total · Estado) y, a la derecha, tarjeta "Citas de hoy" (hora en morado + servicio y cliente + badge de estado) y tarjeta "Stock bajo" con las cantidades reales, cerrada por la puntada y la nota "Estas cantidades no se muestran en la tienda".

## Lista de productos (`1u`)

Cabecera con conteo y botón "Nuevo producto". Fila de filtros: buscador + chips por categoría + chip "Stock bajo" con estilo dorado.

Tabla: `56px 1.6fr 1.1fr 110px 90px 110px 80px` = miniatura (40×48) · Producto (nombre en Lora + tallas debajo) · Categoría · Precio · **Stock** · Estado · Editar. El stock bajo va en dorado y el 0 en rojo `oklch(.5 .13 25)`; su fila completa se tinta `#FDFBF6`. Paginación al pie.

## Crear / editar producto (`1v`)

Migas, título, botones "Guardar borrador" y "Publicar". Layout `1fr 380px`.

Izquierda: tarjeta **Información** (nombre, categoría y subcategoría en dos columnas, descripción) y tarjeta **Precio e inventario** con la aclaración "El stock nunca se muestra en la tienda" en dorado; tres campos (Precio COP, Costo de tela, Aviso de stock bajo) y la matriz de variantes: tabla `Talla · Color · Cantidad · Estado` con input numérico de 52 px por fila y badge derivado automáticamente. Enlace "Agregar variante".

Derecha: tarjeta **Fotos** (grilla de 2; la primera con badge morado "Principal", el hueco vacío con borde punteado morado y "+ Subir foto"), tarjeta **Publicación** (chips Publicado/Oculto y dos toggles: "Marcar como pieza única" en dorado, "Se puede ajustar gratis" en morado) y un recuadro punteado que explica cómo verá el cliente el estado.

## Servicios (`1w`)

Tabla `Servicio · Precio desde · Duración · Cupos/semana · Estado · Editar`. La fila con pocos cupos se tinta `#FDFBF6` y muestra la cifra en dorado. Debajo, dos tarjetas: **Horario del taller** (lunes a viernes 9:00–17:00, sábado 9:00–13:00, domingo cerrado, bloque de 45 min) y **Días bloqueados** con enlace "Bloquear otro día".

## Citas (`1x`)

Cabecera con rango de la semana, conmutador Semana / Mes / Lista y botón "Crear cita". Calendario semanal: `grid-template-columns: 70px repeat(6,1fr)`, filas por bloque horario, celdas con borde izquierdo suave. Bloques de cita: radio 6 px, `padding 8px 9px`, servicio en negrita + cliente. Colores por estado — confirmada lila `#C9B3DD`, pendiente `oklch(.9 .07 85)`, completada `#3A1857` con texto blanco, cancelada `oklch(.88 .07 25)`. Las franjas cerradas van con rayado diagonal tenue. En la barra lateral, leyenda de los cuatro estados.

Al pie, panel dorado con el detalle de la cita seleccionada (cliente, servicio, fecha, nota textual y la pieza comprada) y los botones "Reprogramar" y "Confirmar cita".

## Ventas y pedidos (`1y`)

Cuatro `StatCard`: Vendido · Ticket promedio · Por cobrar · Servicios cobrados. Gráfico de barras por semana con dos series (ropa en morado `#5B2A86`, servicios en lila `#C9B3DD`), la semana en curso al 50% de opacidad. Tabla de pedidos: `Pedido · Cliente · Piezas · Total · Pago · Estado · Ver`.

## Panel en el celular de Érika (`1z`)

Cuatro tarjetas de 2×2 (Hoy · Pedidos · Mes · Stock bajo), "Agenda de hoy" como lista de tarjetas —la pendiente destacada con borde dorado 1.5 px y dos botones (Confirmar / Reprogramar)— y "Pedidos por revisar" con acciones "Marcar pagado" y "Ver comprobante".

---

# Comportamiento transversal

- **Navegación**: header y footer persistentes; en móvil el menú es un drawer completo.
- **Carrito**: persiste sin sesión (localStorage o cookie) y se migra al perfil al iniciar sesión. El contador del header se actualiza al instante.
- **Puerta de sesión**: intercepta "Ir al pago" y "Agendar cita"; al autenticarse, devuelve al usuario al mismo paso.
- **Pieza única**: cantidad máxima 1, el `+` no responde y la línea del carrito muestra la nota dorada.
- **Agotado**: tarjeta con `opacity .74` y foto desaturada; el detalle deshabilita la compra y ofrece aviso de reposición.
- **Filtros**: cambian la grilla de verdad (ver prototipo de escritorio). Sin resultados → mensaje "Nada con ese filtro" con sugerencia de quitar filtros.
- **Estados de carga**: skeletons con el mismo radio y proporción que la tarjeta final (`4:5` en producto, `3:4` en categoría), en `#F7F4F9`.
- **Errores**: mensaje bajo el campo en rojo `oklch(.5 .13 25)`, borde del campo del mismo tono; los errores de acción se muestran arriba del formulario.
- **Transiciones**: 120–150 ms, `ease-out`. Hover de botón primario: `#5B2A86` → `#3A1857`. Hover de botón contorno: fondo `#F2ECF7`. Sin animaciones decorativas.
