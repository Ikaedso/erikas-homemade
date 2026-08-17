import type { Metadata } from "next";
import { getMisPedidos } from "@/lib/data/pedidos";
import { getMisCitas } from "@/lib/data/citas";
import { requireUser } from "@/lib/auth/require-user";
import { MisListas } from "@/components/cuenta/mis-listas";

export const metadata: Metadata = { title: "Mi cuenta" };
export const dynamic = "force-dynamic";

export default async function CuentaPage() {
  await requireUser("/cuenta");
  const [pedidos, citas] = await Promise.all([getMisPedidos(), getMisCitas()]);

  return (
    <div className="mx-auto max-w-[860px] px-4 py-10 lg:py-14">
      <h1 className="font-display text-[30px] text-moradoHondo lg:text-[40px]">Mi cuenta</h1>
      <MisListas pedidos={pedidos} citas={citas} />
    </div>
  );
}
