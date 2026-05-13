"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function NuevaOrdenPage() {
  const router = useRouter();
  const [computadoras, setComputadoras] = useState<any[]>([]);
  const [form, setForm] = useState({
    computadora_id: "",
    problema_reportado: "",
    servicio: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase
        .from("computadoras")
        .select("*")
        .eq("cliente_id", user.id);
      if (data) setComputadoras(data);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("ordenes_servicio").insert({
      cliente_id: user.id,
      computadora_id: form.computadora_id || null,
      problema_reportado: `[${form.servicio}] ${form.problema_reportado}`,
      estado: "recibido",
    });

    if (error) {
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/cliente/ordenes"), 2000);
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto pt-16 text-center">
        <div className="text-4xl mb-4">✓</div>
        <h2 className="text-xl font-semibold text-white mb-2">
          ¡Orden creada!
        </h2>
        <p className="text-white/50">
          Te vamos a contactar pronto para coordinar.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-8 pb-16">
      <div>
        <h1 className="text-3xl font-bold text-white">Nueva Orden</h1>
        <p className="text-white/50 mt-1">
          Contanos qué necesitás y te ayudamos
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs text-white/40 mb-1.5">
            ¿Qué servicio necesitás?
          </label>
          <select
            value={form.servicio}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, servicio: e.target.value }))
            }
            required
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none focus:border-accent/50 transition-all"
          >
            <option value="" disabled className="bg-darkbg">
              Seleccionar servicio
            </option>
            <option value="Armado" className="bg-darkbg">
              Armado Personalizado
            </option>
            <option value="Mantenimiento" className="bg-darkbg">
              Mantenimiento
            </option>
            <option value="Servicio Técnico" className="bg-darkbg">
              Servicio Técnico
            </option>
            <option value="Reparación" className="bg-darkbg">
              Reparación
            </option>
            <option value="Instalación SO" className="bg-darkbg">
              Instalación de Sistema Operativo
            </option>
            <option value="Otro" className="bg-darkbg">
              Otro
            </option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-white/40 mb-1.5">
            Computadora (opcional)
          </label>
          <select
            value={form.computadora_id}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                computadora_id: e.target.value,
              }))
            }
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none focus:border-accent/50 transition-all"
          >
            <option value="" className="bg-darkbg">
              No tengo computadora registrada
            </option>
            {computadoras.map((pc) => (
              <option
                key={pc.id_computadora}
                value={pc.id_computadora}
                className="bg-darkbg"
              >
                {pc.marca} {pc.modelo}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-white/40 mb-1.5">
            Describí tu problema o lo que necesitás *
          </label>
          <textarea
            value={form.problema_reportado}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                problema_reportado: e.target.value,
              }))
            }
            required
            rows={5}
            placeholder="Contanos qué te pasa, qué necesitás armar, o qué servicio querés..."
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-accent/50 transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent/80 disabled:opacity-50 transition-all shadow-lg shadow-accent/20"
        >
          {loading ? "Enviando..." : "Enviar solicitud"}
        </button>
      </form>
    </div>
  );
}
