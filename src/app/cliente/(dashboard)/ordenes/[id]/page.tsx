import { createServerClient } from "@/lib/supabase-server";
import { getUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";

const estadoLabel: Record<string, string> = {
  recibido: "Recibido",
  diagnostico: "En diagnóstico",
  reparacion: "En reparación",
  listo: "Listo",
  entregado: "Entregado",
};

export default async function OrdenDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();
  if (!user) return notFound();

  const supabase = await createServerClient();
  const { data: orden } = await supabase
    .from("ordenes_servicio")
    .select("*, computadoras(marca, modelo), diagnosticos(*)")
    .eq("id_orden", id)
    .eq("cliente_id", user.id)
    .single();

  if (!orden) return notFound();

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-16">
      <Link
        href="/cliente/ordenes"
        className="text-sm text-white/40 hover:text-accent transition-colors"
      >
        ← Volver a órdenes
      </Link>

      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-white">
            Orden #{id.slice(0, 8)}
          </h1>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              orden.estado === "recibido"
                ? "bg-yellow-500/20 text-yellow-300"
                : orden.estado === "diagnostico"
                  ? "bg-blue-500/20 text-blue-300"
                  : orden.estado === "reparacion"
                    ? "bg-orange-500/20 text-orange-300"
                    : orden.estado === "listo"
                      ? "bg-green-500/20 text-green-300"
                      : "bg-white/10 text-white/50"
            }`}
          >
            {estadoLabel[orden.estado] ?? orden.estado}
          </span>
        </div>
        <p className="text-xs text-white/30">
          Creada: {new Date(orden.fecha_ingreso).toLocaleDateString("es-AR")}
        </p>
      </div>

      <div className="rounded-xl border border-white/5 bg-white/[0.03] p-6 space-y-4">
        <div>
          <p className="text-xs text-white/40 mb-1">Problema reportado</p>
          <p className="text-sm text-white/80">{orden.problema_reportado}</p>
        </div>
        {orden.computadoras && (
          <div>
            <p className="text-xs text-white/40 mb-1">Equipo</p>
            <p className="text-sm text-white/80">
              {orden.computadoras.marca} {orden.computadoras.modelo}
            </p>
          </div>
        )}
        {orden.diagnostico && (
          <div>
            <p className="text-xs text-white/40 mb-1">Diagnóstico</p>
            <p className="text-sm text-white/80">{orden.diagnostico}</p>
          </div>
        )}
        {orden.costo_mano_obra > 0 && (
          <div>
            <p className="text-xs text-white/40 mb-1">Costo estimado</p>
            <p className="text-sm text-accent font-medium">
              ${orden.costo_mano_obra.toLocaleString("es-AR")}
            </p>
          </div>
        )}
      </div>

      <Link
        href="/cliente/ordenes/nueva"
        className="inline-block rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent/80 transition-all shadow-lg shadow-accent/20"
      >
        Nueva solicitud
      </Link>
    </div>
  );
}
