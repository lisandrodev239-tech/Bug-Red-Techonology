import { Wrench, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg mb-4">
              <Wrench className="h-5 w-5 text-primary" />
              <span>BugRed Technology</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Soluciones informáticas profesionales. Reparación, mantenimiento y venta de componentes.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Servicios</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/servicios/reparacion" className="hover:text-primary">Reparación</Link></li>
              <li><Link href="/servicios/mantenimiento" className="hover:text-primary">Mantenimiento</Link></li>
              <li><Link href="/servicios/armado-pc" className="hover:text-primary">Armado PC</Link></li>
              <li><Link href="/servicios/instalacion-so" className="hover:text-primary">Instalación SO</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Enlaces</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/tienda" className="hover:text-primary">Tienda</Link></li>
              <li><Link href="/contacto" className="hover:text-primary">Contacto</Link></li>
              <li><Link href="/login" className="hover:text-primary">Ingresar</Link></li>
              <li><Link href="/register" className="hover:text-primary">Registrarse</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Contacto</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Av. Principal 123
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> 11 2233-4455
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> info@bugred.com
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} BugRed Technology. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
