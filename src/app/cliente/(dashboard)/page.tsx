import Link from "next/link";
import ServiceCard from "@/components/portal/ServiceCard";
import ProductCard from "@/components/portal/ProductCard";

export default function ClienteHome() {
  return (
    <div className="max-w-4xl mx-auto space-y-20 pb-16">
      {/* HERO */}
      <section>
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-xs font-medium text-accent mb-6">
          Portal Cliente
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
          Soluciones <span className="text-accent">BugRed</span>
        </h1>
        <p className="text-white/50 text-lg mt-3 max-w-xl">
          Servicio técnico profesional para tu PC. Armado, mantenimiento,
          reparación y diagnóstico de hardware y software.
        </p>
        <div className="flex gap-4 mt-8">
          <Link
            href="/cliente/ordenes/nueva"
            className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent/80 transition-all shadow-lg shadow-accent/20"
          >
            Solicitar Servicio
          </Link>
          <Link
            href="/cliente/servicios"
            className="rounded-lg border border-white/10 px-6 py-2.5 text-sm font-medium text-white/70 hover:border-accent/50 hover:text-accent transition-all"
          >
            Ver servicios
          </Link>
        </div>
      </section>

      {/* SERVICIOS */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-6">
          Nuestros Servicios
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <ServiceCard
            icon="🛠️"
            title="Armado Personalizado"
            description="PCs a medida para gaming, trabajo o uso diario. Seleccionamos cada componente según tu presupuesto."
            href="/cliente/armado"
          />
          <ServiceCard
            icon="🔧"
            title="Mantenimiento"
            description="Limpieza profunda, cambio de pasta térmica, optimización de sistema y revisión general."
            href="/cliente/mantenimiento"
          />
          <ServiceCard
            icon="💻"
            title="Servicio Técnico"
            description="Diagnóstico y reparación de hardware y software. Instalación de SO, controladores y más."
            href="/cliente/servicio-tecnico"
          />
          <ServiceCard
            icon="🩺"
            title="Reparaciones"
            description="Pantallazos azules, fallas de arranque, lectores dañados, overheating y componentes."
            href="/cliente/reparaciones"
          />
        </div>
      </section>

      {/* ARMADOS DESTACADOS */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            Armados Destacados
          </h2>
          <Link
            href="/cliente/armado"
            className="text-sm text-accent hover:underline"
          >
            Ver todos →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <ProductCard
            name="PC Gamer RX 7600"
            specs="Ryzen 5 5600 · 32GB DDR4 · RX 7600 · SSD 1TB NVMe"
          />
          <ProductCard
            name="Workstation Pro"
            specs="Intel i7-14700 · 64GB DDR5 · RTX 4060 · SSD 2TB NVMe"
          />
          <ProductCard
            name="Oficina Esencial"
            specs="Ryzen 5 4600G · 16GB DDR4 · SSD 480GB · Fuente 600W"
          />
          <ProductCard
            name="Arch Linux Build"
            specs="Ryzen 7 7800X3D · 32GB DDR5 · Hyprland · Personalizado"
          />
        </div>
      </section>

      {/* COMPONENTES DESTACADOS */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            Componentes Destacados
          </h2>
          <Link
            href="/cliente/servicios"
            className="text-sm text-accent hover:underline"
          >
            Ver catálogo →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: "CPU", desc: "AMD / Intel" },
            { name: "GPU", desc: "NVIDIA / AMD" },
            { name: "SSD", desc: "NVMe / SATA" },
            { name: "RAM", desc: "DDR4 / DDR5" },
          ].map((item) => (
            <div
              key={item.name}
              className="rounded-xl border border-white/5 bg-white/[0.03] p-5 text-center hover:bg-white/[0.06] hover:border-accent/30 transition-all duration-300"
            >
              <div className="text-2xl mb-2">
                {item.name === "CPU"
                  ? "⚡"
                  : item.name === "GPU"
                    ? "🎮"
                    : item.name === "SSD"
                      ? "💾"
                      : "🧠"}
              </div>
              <h4 className="text-sm font-semibold text-white">{item.name}</h4>
              <p className="text-xs text-white/40 mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="rounded-xl border border-accent/10 bg-accent/[0.02] p-8 lg:p-12 text-center">
        <h2 className="text-2xl font-bold text-white">
          ¿Necesitás ayuda con tu PC?
        </h2>
        <p className="text-white/50 mt-3 max-w-md mx-auto">
          Contanos qué problema tenés y te ayudamos a resolverlo.
        </p>
        <Link
          href="/cliente/ordenes/nueva"
          className="inline-block mt-6 rounded-lg bg-accent px-8 py-3 text-sm font-medium text-white hover:bg-accent/80 transition-all shadow-lg shadow-accent/20"
        >
          Contanos tu problema
        </Link>
      </section>
    </div>
  );
}
