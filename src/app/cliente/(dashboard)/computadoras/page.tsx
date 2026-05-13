import { createServerClient } from "@/lib/supabase-server";
import { getUser } from "@/lib/auth";
import Link from "next/link";

export default async function ComputadorasPage() {
  const user = await getUser();
  let computadoras: any[] = [];

  if (user) {
    const supabase = await createServerClient();
    const { data } = await supabase
      .from("computadoras")
      .select("*, sistemas_operativos(nombre)")
      .eq("cliente_id", user.id)
      .order("fecha_registro", { ascending: false });

    if (data) computadoras = data;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Mis Computadoras</h1>
          <p className="text-white/50 mt-1">
            Equipos registrados en tu cuenta
          </p>
        </div>
        <Link
          href="/cliente/computadoras/nueva"
          className="rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white hover:bg-accent/80 transition-all shadow-lg shadow-accent/20"
        >
          + Agregar equipo
        </Link>
      </div>

      {computadoras.length === 0 ? (
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-12 text-center">
          <p className="text-white/40">
            No registraste ninguna computadora todavía.
          </p>
          <Link
            href="/cliente/computadoras/nueva"
            className="inline-block mt-4 text-sm text-accent hover:underline"
          >
            Registrar equipo
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {computadoras.map((pc) => (
            <div
              key={pc.id_computadora}
              className="rounded-xl border border-white/5 bg-white/[0.03] p-6"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">
                  {pc.tipo === "laptop" ? "💻" : "🖥️"}
                </span>
                <h3 className="text-base font-semibold text-white">
                  {pc.marca} {pc.modelo}
                </h3>
              </div>
              <p className="text-xs text-white/30 font-mono mb-2">
                {pc.numero_serie ?? "Sin serie"}
              </p>
              {pc.sistemas_operativos && (
                <p className="text-sm text-white/50">
                  {Array.isArray(pc.sistemas_operativos)
                    ? pc.sistemas_operativos[0]?.nombre
                    : pc.sistemas_operativos.nombre}
                </p>
              )}
              <p className="text-xs text-white/30 mt-2">
                Registrada:{" "}
                {new Date(pc.fecha_registro).toLocaleDateString("es-AR")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
