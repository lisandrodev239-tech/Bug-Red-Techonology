import Link from "next/link";

export default function ReparacionesPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-xs font-medium text-accent mb-4">
          🩺 Reparaciones
        </div>
        <h1 className="text-3xl font-bold text-white">
          Reparación <span className="text-accent">especializada</span>
        </h1>
        <p className="text-white/50 mt-3 max-w-xl">
          Diagnosticamos y reparamos fallas comunes y complejas en
          componentes y sistemas.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {[
          {
            title: "Pantallazos azules (BSOD)",
            items: [
              "Análisis de minidumps",
              "Diagnóstico de memoria RAM",
              "Controladores corruptos",
            ],
          },
          {
            title: "Problemas de almacenamiento",
            items: [
              "Lectores / HDD / SSD no detectados",
              "Recuperación de archivos",
              "Clonación y migración de discos",
            ],
          },
          {
            title: "Overheating y ruidos",
            items: [
              "Cambio de pasta térmica",
              "Limpieza de disipadores y coolers",
              "Reemplazo de ventiladores",
            ],
          },
          {
            title: "Fallas de arranque",
            items: [
              "PC que no enciende o no hace POST",
              "Reparación de bootloader",
              "Fuente y placa madre",
            ],
          },
        ].map((group) => (
          <div
            key={group.title}
            className="rounded-xl border border-white/5 bg-white/[0.03] p-6 hover:bg-white/[0.06] transition-all"
          >
            <h3 className="text-sm font-semibold text-accent mb-3">
              {group.title}
            </h3>
            <ul className="space-y-2">
              {group.items.map((item) => (
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
        ))}
      </div>

      <Link
        href="/cliente/ordenes/nueva"
        className="inline-block rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent/80 transition-all shadow-lg shadow-accent/20"
      >
        Solicitar reparación
      </Link>
    </div>
  );
}
