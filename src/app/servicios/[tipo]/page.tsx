import { notFound } from "next/navigation";
import { Wrench, ShieldCheck, Cpu, Zap, Monitor, Terminal } from "lucide-react";
import { ServiceForm } from "@/components/services/service-form";

const serviceInfo: Record<string, { title: string; description: string; icon: any }> = {
  reparacion: { title: "Reparación", description: "Reparamos cualquier falla de hardware o software. Nuestros técnicos diagnostican y solucionan el problema de manera rápida y eficiente.", icon: Wrench },
  mantenimiento: { title: "Mantenimiento", description: "Mantenimiento preventivo y correctivo para mantener tu equipo en óptimas condiciones.", icon: ShieldCheck },
  armado_pc: { title: "Armado PC", description: "Armamos la PC perfecta para vos. Elegí los componentes y nosotros nos encargamos del ensamblado.", icon: Cpu },
  limpieza: { title: "Limpieza", description: "Limpieza profesional de componentes, cambio de pasta térmica y optimización del flujo de aire.", icon: Zap },
  diagnostico: { title: "Diagnóstico", description: "Diagnóstico completo para identificar fallas de hardware y software con equipamiento profesional.", icon: Monitor },
  instalacion_so: { title: "Instalación SO", description: "Instalamos Windows, Linux o sistemas dual-boot con todos los drivers y software necesario.", icon: Terminal },
};

export default async function ServiceDetailPage(props: { params: Promise<{ tipo: string }> }) {
  const { tipo } = await props.params;
  const service = serviceInfo[tipo];
  if (!service) notFound();

  const Icon = service.icon;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{service.title}</h1>
            <p className="text-muted-foreground mt-1">{service.description}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">¿En qué consiste?</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                Diagnóstico profesional sin cargo
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                Presupuesto transparente sin sorpresas
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                Garantía en todos nuestros trabajos
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                Técnicos especializados y certificados
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Solicitar Servicio</h2>
            <ServiceForm serviceType={tipo} />
          </div>
        </div>
      </div>
    </div>
  );
}
