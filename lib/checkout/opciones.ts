import type { MetodoEntrega, MetodoPago } from "@/lib/data/pedidos";

export const ENTREGAS: {
  id: MetodoEntrega;
  nombre: string;
  detalle: string;
  costo: number;
}[] = [
  { id: "taller", nombre: "Retiro en el taller", detalle: "Gratis · recoges tu pedido", costo: 0 },
  { id: "delivery", nombre: "Delivery local", detalle: "Envío dentro de la ciudad", costo: 8000 },
  { id: "punto", nombre: "Punto de encuentro", detalle: "Gratis · se coordina por WhatsApp", costo: 0 },
];

export const PAGOS: { id: MetodoPago; nombre: string; detalle: string }[] = [
  {
    id: "transferencia",
    nombre: "Transferencia bancaria",
    detalle: "Subes el comprobante y Érika lo verifica",
  },
  { id: "efectivo", nombre: "Efectivo al retirar", detalle: "Pagas al recoger tu pedido" },
];

export function costoEntrega(id: MetodoEntrega): number {
  return ENTREGAS.find((e) => e.id === id)?.costo ?? 0;
}
