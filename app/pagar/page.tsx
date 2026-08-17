import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = { title: "Finalizar compra" };

export default function PagarPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-4 py-10 lg:px-8 lg:py-14">
      <h1 className="font-display text-[30px] text-moradoHondo lg:text-[40px]">Finalizar compra</h1>
      <div className="mt-2 flex items-center gap-2 text-[12px] text-tinta/55">
        <span className="font-medium text-morado">1 Entrega</span>
        <span className="text-lila">—</span>
        <span className="font-medium text-morado">2 Pago</span>
        <span className="text-lila">—</span>
        <span>3 Listo</span>
      </div>

      <div className="mt-8">
        <CheckoutForm />
      </div>
    </div>
  );
}
