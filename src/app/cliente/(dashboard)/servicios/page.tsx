import Link from "next/link";

const services = [
  {
    icon: "🛠️",
    title: "Armado Personalizado",
    desc: "Construimos tu PC desde cero con componentes seleccionados para gaming, trabajo o uso diario.",
  },
  {
    icon: "🔧",
    title: "Mantenimiento",
    desc: "Limpieza profunda, cambio de pasta térmica y revisión completa de componentes.",
  },
  {
    icon: "💻",
    title: "Servicio Técnico",
    desc: "Diagnóstico y reparación de hardware y software. Instalación de sistemas operativos.",
  },
  {
    icon: "🩺",
    title: "Reparaciones",
    desc: "Solución de pantallazos azules, fallas de arranque, lectores y componentes dañados.",
  },
  {
    icon: "🐧",
    title: "Arch Linux / Linux",
    desc: "Instalación y configuración de distribuciones Linux. Hyprland, dotfiles y más.",
  },
  {
    icon: "🪟",
    title: "Windows",
    desc: "Instalación, actualización y optimización de Windows 10/11. Drivers y configuración.",
  },
  {
    icon: "🔄",
    title: "Dual Boot",
    desc: "Configuración de sistemas duales (Windows + Linux) con gestor de arranque personalizado.",
  },
  {
    icon: "🔐",
    title: "Recuperación de Datos",
    desc: "Rescate de archivos desde discos dañados, formateados o con sectores defectuosos.",
  },
];

export default function ServiciosPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-xs font-medium text-accent mb-4">
          ⚙️ Catálogo
        </div>
        <h1 className="text-3xl font-bold text-white">
          Todos los <span className="text-accent">servicios</span>
        </h1>
        <p className="text-white/50 mt-3 max-w-xl">
          Esto es todo lo que ofrecemos. Si no ves lo que necesitás,
          consultanos igual.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {services.map((s) => (
          <div
            key={s.title}
            className="rounded-xl border border-white/5 bg-white/[0.03] p-6 hover:bg-white/[0.06] hover:border-accent/30 transition-all"
          >
            <div className="text-2xl mb-3">{s.icon}</div>
            <h3 className="text-base font-semibold text-white mb-1">
              {s.title}
            </h3>
            <p className="text-sm text-white/50">{s.desc}</p>
          </div>
        ))}
      </div>

      <Link
        href="/cliente/ordenes/nueva"
        className="inline-block rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent/80 transition-all shadow-lg shadow-accent/20"
      >
        Solicitar servicio
      </Link>
    </div>
  );
}
