"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/cliente", label: "Inicio", icon: "🏠" },
  { href: "/cliente/armado", label: "Armado Personalizado", icon: "🛠️" },
  { href: "/cliente/mantenimiento", label: "Mantenimiento", icon: "🔧" },
  { href: "/cliente/servicio-tecnico", label: "Servicio Técnico", icon: "💻" },
  { href: "/cliente/reparaciones", label: "Reparaciones", icon: "🩺" },
  { href: "/cliente/servicios", label: "Servicios Ofrecidos", icon: "⚙️" },
  { href: "/cliente/ordenes", label: "Mis Órdenes", icon: "📋" },
  { href: "/cliente/computadoras", label: "Mis Computadoras", icon: "🖥️" },
  { href: "/cliente/perfil", label: "Mi Perfil", icon: "👤" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-darkbg/60 border-r border-white/5 flex flex-col z-40 max-lg:hidden">
      <div className="p-6 border-b border-white/5">
        <Link
          href="/cliente"
          className="text-xl font-bold tracking-tight text-white"
        >
          Bug<span className="text-accent">Red</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== "/cliente" &&
              pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                isActive
                  ? "bg-accent/10 text-accent font-medium"
                  : "text-white/60 hover:text-white/90 hover:bg-white/5"
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/5">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-white/30 hover:text-white/50 transition-colors"
        >
          ← Volver al sitio
        </Link>
      </div>
    </aside>
  );
}
