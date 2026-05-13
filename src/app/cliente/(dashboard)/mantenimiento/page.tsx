import Link from "next/link";

export default function MantenimientoPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-xs font-medium text-accent mb-4">
          🔧 Mantenimiento
        </div>
        <h1 className="text-3xl font-bold text-white">
          Mantenimiento <span className="text-accent">preventivo y correctivo</span>
        </h1>
        <p className="text-white/50 mt-3 max-w-xl">
          Mantené tu PC funcionando como el primer día. Limpieza, revisión y
          optimización periódica.
        </p>
      </div>

      <ul className="space-y-3">
        {[
          "Limpieza profunda de componentes y disipadores",
          "Cambio de pasta térmica en CPU y GPU",
          "Revisión y cambio de ventiladores",
          "Optimización de sistema operativo",
          "Desfragmentación y limpieza de disco",
          "Actualización de drivers y firmware",
        ].map((item) => (
          <li
            key={item}
            className="flex items-center gap-3 text-sm text-white/60"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent/60 shrink-0" />
            {item}
          </li>
        ))}
      </ul>

      <Link
        href="/cliente/ordenes/nueva"
        className="inline-block rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent/80 transition-all shadow-lg shadow-accent/20"
      >
        Solicitar mantenimiento
      </Link>
    </div>
  );
}
