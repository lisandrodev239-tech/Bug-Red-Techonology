import { createServerClient } from "@/lib/supabase-server";
import { getUser } from "@/lib/auth";
import Link from "next/link";

const estadoColor: Record<string, string> = {
  recibido: "bg-yellow-500/20 text-yellow-300",
  diagnostico: "bg-blue-500/20 text-blue-300",
  reparacion: "bg-orange-500/20 text-orange-300",
  listo: "bg-green-500/20 text-green-300",
  entregado: "bg-white/10 text-white/50",
};

const estadoLabel: Record<string, string> = {
  recibido: "Recibido",
  diagnostico: "En diagnóstico",
  reparacion: "En reparación",
  listo: "Listo",
  entregado: "Entregado",
};

export default async function OrdenesPage() {
  const user = await getUser();
  let ordenes: any[] = [];

  if (user) {
    const supabase = await createServerClient();
    const { data } = await supabase
      .from("ordenes_servicio")
      .select("*")
      .eq("cliente_id", user.id)
      .order("fecha_ingreso", { ascending: false });

    if (data) ordenes = data;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Mis Órdenes</h1>
          <p className="text-white/50 mt-1">
            Historial de servicios solicitados
          </p>
        </div>
        <Link
          href="/cliente/ordenes/nueva"
          className="rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white hover:bg-accent/80 transition-all shadow-lg shadow-accent/20"
        >
          Nueva orden
        </Link>
      </div>

      {ordenes.length === 0 ? (
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-12 text-center">
          <p className="text-white/40">
            Todavía no tenés órdenes de servicio.
          </p>
          <Link
            href="/cliente/ordenes/nueva"
            className="inline-block mt-4 text-sm text-accent hover:underline"
          >
            Solicitar primer servicio
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {ordenes.map((orden) => (
            <Link
              key={orden.id_orden}
              href={`/cliente/ordenes/${orden.id_orden}`}
              className="block rounded-xl border border-white/5 bg-white/[0.03] p-5 hover:bg-white/[0.06] hover:border-accent/30 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/30 font-mono">
                  #{orden.id_orden.slice(0, 8)}
                </span>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    estadoColor[orden.estado] ?? "bg-white/10 text-white/50"
                  }`}
                >
                  {estadoLabel[orden.estado] ?? orden.estado}
                </span>
              </div>
              <p className="text-sm text-white/80 line-clamp-2">
                {orden.problema_reportado}
              </p>
              <p className="text-xs text-white/30 mt-2">
                {new Date(orden.fecha_ingreso).toLocaleDateString("es-AR")}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
