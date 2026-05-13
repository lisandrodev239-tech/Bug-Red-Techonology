import Link from "next/link";

export default function ArmadoPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-xs font-medium text-accent mb-4">
          🛠️ Armado Personalizado
        </div>
        <h1 className="text-3xl font-bold text-white">
          PCs a tu <span className="text-accent">medida</span>
        </h1>
        <p className="text-white/50 mt-3 max-w-xl">
          Elegimos cada componente según tu presupuesto y necesidades. Gaming,
          trabajo, home theater o servidor — lo armamos desde cero.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {[
          {
            name: "Gaming",
            desc: "Rendimiento en cada cuadro. Targets: 60/144+ FPS en tus títulos favoritos.",
          },
          {
            name: "Workstation",
            desc: "Potencia para render, edición de video, desarrollo y multitarea pesada.",
          },
          {
            name: "Oficina / Hogar",
            desc: "Equipos confiables y silenciosos para el día a día con buena relación precio.",
          },
          {
            name: "Custom / Ricing",
            desc: "Armados con estética cuidada, cable management y builds temáticos.",
          },
        ].map((item) => (
          <div
            key={item.name}
            className="rounded-xl border border-white/5 bg-white/[0.03] p-6 hover:bg-white/[0.06] transition-all"
          >
            <h3 className="text-base font-semibold text-white mb-1">
              {item.name}
            </h3>
            <p className="text-sm text-white/50">{item.desc}</p>
          </div>
        ))}
      </div>

      <Link
        href="/cliente/ordenes/nueva"
        className="inline-block rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent/80 transition-all shadow-lg shadow-accent/20"
      >
        Solicitar armado
      </Link>
    </div>
  );
}
