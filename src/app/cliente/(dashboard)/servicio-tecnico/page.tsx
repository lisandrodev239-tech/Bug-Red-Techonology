import Link from "next/link";

export default function ServicioTecnicoPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-xs font-medium text-accent mb-4">
          💻 Servicio Técnico
        </div>
        <h1 className="text-3xl font-bold text-white">
          Diagnóstico y <span className="text-accent">solución</span>
        </h1>
        <p className="text-white/50 mt-3 max-w-xl">
          Problemas de hardware o software. Diagnosticamos, reparamos y dejamos
          tu PC funcionando al 100%.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-6">
          <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider text-accent">
            Software
          </h3>
          <ul className="space-y-2">
            {[
              "Instalación de Windows / Linux / Arch",
              "Configuración de dual-boot",
              "Eliminación de virus y malware",
              "Recuperación de datos",
              "Optimización de sistema",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-sm text-white/60"
              >
                <span className="h-1 w-1 rounded-full bg-accent/60 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-6">
          <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider text-accent">
            Hardware
          </h3>
          <ul className="space-y-2">
            {[
              "Diagnóstico de componentes",
              "Reemplazo de piezas dañadas",
              "Actualización de CPU / GPU / RAM",
              "Armado desde cero",
              "Pruebas de estrés y estabilidad",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-sm text-white/60"
              >
                <span className="h-1 w-1 rounded-full bg-accent/60 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Link
        href="/cliente/ordenes/nueva"
        className="inline-block rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent/80 transition-all shadow-lg shadow-accent/20"
      >
        Solicitar servicio técnico
      </Link>
    </div>
  );
}
