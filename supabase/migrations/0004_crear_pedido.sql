-- Erika's Homemade — crear pedido de forma transaccional
-- Valida y descuenta stock, crea el pedido + items, todo en una transacción.
-- security definer: el stock (tabla variantes) solo lo puede tocar un rol elevado.

create or replace function public.crear_pedido(
  p_entrega metodo_entrega,
  p_costo_entrega int,
  p_pago metodo_pago,
  p_nota text,
  p_comprobante_path text,
  p_items jsonb            -- [{ "variante_id": uuid, "cantidad": int }, ...]
)
returns pedidos
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_pedido pedidos;
  v_item jsonb;
  v_var variantes;
  v_prod productos;
  v_total int := 0;
  v_cant int;
begin
  if v_uid is null then
    raise exception 'Debes iniciar sesión para comprar';
  end if;
  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'El carrito está vacío';
  end if;

  -- 1) Validar stock y calcular total (bloqueando las filas de variante)
  for v_item in select * from jsonb_array_elements(p_items) loop
    v_cant := (v_item->>'cantidad')::int;
    if v_cant is null or v_cant <= 0 then
      raise exception 'Cantidad no válida';
    end if;
    select * into v_var from variantes where id = (v_item->>'variante_id')::uuid for update;
    if v_var.id is null then
      raise exception 'Una de las piezas ya no existe';
    end if;
    if v_var.stock < v_cant then
      raise exception 'Sin stock suficiente para una de las piezas';
    end if;
    select * into v_prod from productos where id = v_var.producto_id;
    v_total := v_total + v_prod.precio_cop * v_cant;
  end loop;

  v_total := v_total + coalesce(p_costo_entrega, 0);

  -- 2) Crear el pedido
  insert into pedidos (
    cliente_id, estado, entrega, costo_entrega_cop, pago, comprobante_path, nota, total_cop
  )
  values (
    v_uid, 'nuevo', p_entrega, coalesce(p_costo_entrega, 0), p_pago,
    p_comprobante_path, nullif(p_nota, ''), v_total
  )
  returning * into v_pedido;

  -- 3) Insertar items y descontar stock
  for v_item in select * from jsonb_array_elements(p_items) loop
    v_cant := (v_item->>'cantidad')::int;
    select * into v_var from variantes where id = (v_item->>'variante_id')::uuid;
    select * into v_prod from productos where id = v_var.producto_id;

    insert into items_pedido (
      pedido_id, variante_id, nombre_producto, talla, precio_unitario_cop, cantidad
    )
    values (v_pedido.id, v_var.id, v_prod.nombre, v_var.talla, v_prod.precio_cop, v_cant);

    update variantes set stock = stock - v_cant where id = v_var.id;
  end loop;

  return v_pedido;
end;
$$;

grant execute on function public.crear_pedido to authenticated;
