-- Erika's Homemade — datos semilla
-- Catálogo real tomado de docs/design/DATOS.md §5

-- ---------- Categorías ----------
insert into categorias (slug, nombre, orden) values
  ('mujer', 'Mujer', 1),
  ('hombre', 'Hombre', 2),
  ('nino', 'Niño', 3),
  ('manualidades', 'Manualidades', 4);

-- ---------- Subcategorías ----------
insert into subcategorias (categoria_id, slug, nombre, orden)
select c.id, s.slug, s.nombre, s.orden
from (values
  ('mujer', 'blusas', 'Blusas', 1),
  ('mujer', 'camisas-unisex', 'Camisas unisex', 2),
  ('mujer', 'chaquetas', 'Chaquetas', 3),
  ('mujer', 'vestidos', 'Vestidos', 4),
  ('mujer', 'bisuteria', 'Bisutería', 5),
  ('hombre', 'camisas-unisex', 'Camisas unisex', 1),
  ('hombre', 'pantalones-de-vestir', 'Pantalones de vestir', 2),
  ('hombre', 'chaquetas', 'Chaquetas', 3),
  ('hombre', 'viseras', 'Viseras', 4),
  ('hombre', 'bisuteria', 'Bisutería', 5),
  ('nino', 'uniformes-escolares', 'Uniformes escolares', 1),
  ('nino', 'basicos', 'Básicos', 2),
  ('nino', 'bisuteria', 'Bisutería', 3)
) as s(cat_slug, slug, nombre, orden)
join categorias c on c.slug = s.cat_slug;

-- ---------- Productos ----------
-- helper inline: categoría por slug y subcategoría por (cat, slug)
insert into productos (slug, nombre, descripcion, precio_cop, categoria_id, subcategoria_id, es_pieza_unica, publicado)
select p.slug, p.nombre, p.descripcion, p.precio_cop,
       c.id,
       sc.id,
       p.es_pieza_unica,
       true
from (values
  ('blusa-encaje-amanecer', 'Blusa encaje Amanecer', 'Blusa en tela liviana con detalle de encaje en los hombros.', 72000, 'mujer', 'blusas', false),
  ('blusa-domingo', 'Blusa Domingo', 'Pieza única cosida a mano, serie de una sola unidad.', 65000, 'mujer', 'blusas', true),
  ('camisa-unisex-crudo', 'Camisa unisex Crudo', 'Camisa unisex en algodón crudo, corte holgado.', 89000, 'mujer', 'camisas-unisex', false),
  ('camiseta-esencial-negra', 'Camiseta Esencial negra', 'Básico esencial en algodón negro.', 58000, 'hombre', 'camisas-unisex', false),
  ('chaqueta-unisex-taller', 'Chaqueta unisex Taller', 'Chaqueta unisex resistente, pensada para el día a día.', 165000, 'mujer', 'chaquetas', false),
  ('pantalon-vestir-sastre', 'Pantalón de vestir Sastre', 'Pantalón de vestir con caída sastre.', 120000, 'hombre', 'pantalones-de-vestir', false),
  ('visera-bordada-sol', 'Visera bordada Sol', 'Visera con bordado hecho a mano.', 35000, 'hombre', 'viseras', false),
  ('uniforme-escolar-conjunto', 'Uniforme escolar · conjunto', 'Conjunto de uniforme escolar, tallas de 4 a 12 años.', 95000, 'nino', 'uniformes-escolares', false)
) as p(slug, nombre, descripcion, precio_cop, cat_slug, subcat_slug, es_pieza_unica)
join categorias c on c.slug = p.cat_slug
join subcategorias sc on sc.categoria_id = c.id and sc.slug = p.subcat_slug;

-- ---------- Variantes (aquí vive el stock; agotado = 0, pieza única = 1) ----------
insert into variantes (producto_id, talla, color, stock)
select pr.id, v.talla, v.color, v.stock
from (values
  ('blusa-encaje-amanecer', 'S', 'Crudo', 3),
  ('blusa-encaje-amanecer', 'M', 'Crudo', 2),
  ('blusa-encaje-amanecer', 'L', 'Crudo', 1),
  ('blusa-domingo', 'S', 'Blanco', 1),
  ('camisa-unisex-crudo', 'S', 'Crudo', 4),
  ('camisa-unisex-crudo', 'M', 'Crudo', 5),
  ('camisa-unisex-crudo', 'L', 'Crudo', 3),
  ('camisa-unisex-crudo', 'XL', 'Crudo', 2),
  ('camiseta-esencial-negra', 'S', 'Negro', 0),
  ('camiseta-esencial-negra', 'M', 'Negro', 0),
  ('camiseta-esencial-negra', 'L', 'Negro', 0),
  ('chaqueta-unisex-taller', 'S', 'Gris', 2),
  ('chaqueta-unisex-taller', 'M', 'Gris', 3),
  ('chaqueta-unisex-taller', 'L', 'Gris', 2),
  ('pantalon-vestir-sastre', '28', 'Gris', 2),
  ('pantalon-vestir-sastre', '30', 'Gris', 3),
  ('pantalon-vestir-sastre', '32', 'Gris', 3),
  ('pantalon-vestir-sastre', '34', 'Gris', 1),
  ('visera-bordada-sol', 'Única', 'Beige', 6),
  ('uniforme-escolar-conjunto', '4 años', 'Azul', 4),
  ('uniforme-escolar-conjunto', '8 años', 'Azul', 4),
  ('uniforme-escolar-conjunto', '12 años', 'Azul', 3)
) as v(prod_slug, talla, color, stock)
join productos pr on pr.slug = v.prod_slug;

-- ---------- Servicios ----------
insert into servicios (slug, nombre, descripcion, precio_desde_cop, duracion_min, cupos_semana, requiere_consulta) values
  ('ajuste-de-talla', 'Ajuste de talla', 'Entallar o soltar una prenda a tu medida.', 18000, 45, 4, false),
  ('ruedo-y-dobladillo', 'Ruedo y dobladillo', 'Subir o bajar ruedos y dobladillos.', 12000, 30, 6, false),
  ('reparacion-de-prendas', 'Reparación de prendas', 'Costuras, descosidos y remiendos.', 15000, 40, 4, false),
  ('cambio-de-cierre', 'Cambio de cierre', 'Reemplazo de cremalleras y cierres.', 20000, 40, 3, false),
  ('bordado-personalizado', 'Bordado personalizado', 'Bordado a mano de nombres y detalles.', 25000, 50, 3, false),
  ('arreglo-de-bisuteria', 'Arreglo de bisutería', 'Reparación de piezas de bisutería.', 10000, 20, 5, false),
  ('confeccion-a-medida', 'Confección a medida', 'Prenda hecha a tu medida. Requiere consulta previa.', null, 60, 2, true);

-- ---------- Horario del taller (0 = domingo … 6 = sábado) ----------
insert into horario_taller (dia_semana, abre, cierra) values
  (0, null, null),                 -- domingo cerrado
  (1, '09:00', '17:00'),
  (2, '09:00', '17:00'),
  (3, '09:00', '17:00'),
  (4, '09:00', '17:00'),
  (5, '09:00', '17:00'),
  (6, '09:00', '13:00');           -- sábado
