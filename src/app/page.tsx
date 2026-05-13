import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, ShieldCheck, Cpu, Zap, Monitor, Terminal } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/utils";
import { ProductGrid } from "@/components/products/product-grid";
import { ServiceCard } from "@/components/services/service-card";

const services = [
  { title: "Reparación", description: "Reparamos cualquier fallo de hardware y software", icon: Wrench, href: "/servicios/reparacion" },
  { title: "Mantenimiento", description: "Mantenimiento preventivo para tu equipo", icon: ShieldCheck, href: "/servicios/mantenimiento" },
  { title: "Armado PC", description: "Armamos la PC de tus sueños componente por componente", icon: Cpu, href: "/servicios/armado-pc" },
  { title: "Limpieza", description: "Limpieza profunda de componentes y periféricos", icon: Zap, href: "/servicios/limpieza" },
  { title: "Diagnóstico", description: "Diagnóstico profesional de fallas", icon: Monitor, href: "/servicios/diagnostico" },
  { title: "Instalación SO", description: "Instalamos Windows, Linux o sistemas dual-boot", icon: Terminal, href: "/servicios/instalacion-so" },
];

export default async function HomePage() {
  const products = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/70 text-primary-foreground">
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Tu PC merece el mejor cuidado
            </h1>
            <p className="text-lg md:text-xl mb-8 text-primary-foreground/80">
              Servicio técnico profesional, venta de componentes y armado de PCs.
              Más de 10 años reparando equipos en toda la ciudad.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/servicios">
                <Button size="lg" variant="secondary" className="font-semibold">
                  Ver Servicios
                </Button>
              </Link>
              <Link href="/contacto">
                <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10 font-semibold">
                  Contactanos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nuestros Servicios</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ofrecemos soluciones completas para tus equipos informáticos
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.href} {...service} />
            ))}
          </div>
        </div>
      </section>

      {products.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold">Productos Destacados</h2>
                <p className="text-muted-foreground mt-2">Los componentes más buscados</p>
              </div>
              <Link href="/tienda">
                <Button variant="outline">Ver todos</Button>
              </Link>
            </div>
            <ProductGrid products={serialize(products)} />
          </div>
        </section>
      )}
    </div>
  );
}
