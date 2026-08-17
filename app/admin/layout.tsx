import { requireAdmin } from "@/lib/auth/require-admin";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { nombre } = await requireAdmin();

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 lg:px-8 lg:py-10">
      <div className="lg:grid lg:grid-cols-[200px_1fr] lg:gap-10">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="eyebrow text-dorado">Panel de Érika</p>
          <p className="mt-1 text-[13px] text-tinta/55">{nombre ?? "Administradora"}</p>
          <div className="mt-4">
            <AdminNav />
          </div>
        </aside>
        <div className="mt-6 min-w-0 overflow-x-clip lg:mt-0">{children}</div>
      </div>
    </div>
  );
}
