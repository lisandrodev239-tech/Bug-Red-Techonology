import { Wrench, ShieldCheck, Cpu, Zap, Monitor, Terminal } from "lucide-react";
import { ServiceCard } from "@/components/services/service-card";

const services = [
  { title: "Reparación", description: "Diagnosticamos y reparamos fallas de hardware y software. Desde pantalla azul hasta componentes dañados.", icon: Wrench, href: "/servicios/reparacion" },
  { title: "Mantenimiento", description: "Mantenimiento preventivo y correctivo para alargar la vida útil de tu equipo.", icon: ShieldCheck, href: "/servicios/mantenimiento" },
  { title: "Armado PC", description: "Armamos la PC perfecta para gaming, trabajo o uso diario con componentes de calidad.", icon: Cpu, href: "/servicios/armado-pc" },
  { title: "Limpieza", description: "Limpieza profunda de componentes, eliminación de polvo y pasta térmica nueva.", icon: Zap, href: "/servicios/limpieza" },
  { title: "Diagnóstico", description: "Diagnóstico profesional completo para identificar fallas en tu equipo.", icon: Monitor, href: "/servicios/diagnostico" },
  { title: "Instalación SO", description: "Instalamos Windows, Linux, dual-boot y software esencial.", icon: Terminal, href: "/servicios/instalacion-so" },
];

export default function ServiciosPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Nuestros Servicios</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Ofrecemos soluciones completas para tus equipos informáticos con garantía y profesionalismo
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <ServiceCard key={service.href} {...service} />
        ))}
      </div>
    </div>
  );
}
