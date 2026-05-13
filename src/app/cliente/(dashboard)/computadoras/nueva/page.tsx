"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function NuevaComputadoraPage() {
  const router = useRouter();
  const [sistemas, setSistemas] = useState<any[]>([]);
  const [form, setForm] = useState({
    marca: "",
    modelo: "",
    numero_serie: "",
    tipo: "desktop",
    id_sistema_operativo: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("sistemas_operativos")
      .select("*")
      .then(({ data }) => {
        if (data) setSistemas(data);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("computadoras").insert({
      cliente_id: user.id,
      marca: form.marca,
      modelo: form.modelo,
      numero_serie: form.numero_serie || null,
      tipo: form.tipo,
      id_sistema_operativo: form.id_sistema_operativo || null,
    });

    if (error) {
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/cliente/computadoras"), 2000);
  };

  const updateField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto pt-16 text-center">
        <div className="text-4xl mb-4">✓</div>
        <h2 className="text-xl font-semibold text-white mb-2">
          Computadora registrada
        </h2>
        <p className="text-white/50">Ya podés seleccionarla en tus órdenes.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-8 pb-16">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Registrar Computadora
        </h1>
        <p className="text-white/50 mt-1">
          Así podemos identificar tu equipo más rápido
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-white/40 mb-1.5">
              Marca *
            </label>
            <input
              name="marca"
              value={form.marca}
              onChange={updateField}
              required
              placeholder="HP, Lenovo, ASUS..."
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-accent/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5">
              Modelo *
            </label>
            <input
              name="modelo"
              value={form.modelo}
              onChange={updateField}
              required
              placeholder="Pavilion, ThinkPad..."
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-accent/50 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-white/40 mb-1.5">
            Número de serie
          </label>
          <input
            name="numero_serie"
            value={form.numero_serie}
            onChange={updateField}
            placeholder="Opcional"
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-accent/50 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs text-white/40 mb-1.5">Tipo *</label>
          <select
            name="tipo"
            value={form.tipo}
            onChange={updateField}
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none focus:border-accent/50 transition-all"
          >
            <option value="desktop" className="bg-darkbg">
              Desktop / PC de escritorio
            </option>
            <option value="laptop" className="bg-darkbg">
              Laptop / Notebook
            </option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-white/40 mb-1.5">
            Sistema operativo
          </label>
          <select
            name="id_sistema_operativo"
            value={form.id_sistema_operativo}
            onChange={updateField}
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none focus:border-accent/50 transition-all"
          >
            <option value="" className="bg-darkbg">
              No sé / No tiene
            </option>
            {sistemas.map((so) => (
              <option
                key={so.id_sistema_operativo}
                value={so.id_sistema_operativo}
                className="bg-darkbg"
              >
                {so.nombre} {so.version}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent/80 disabled:opacity-50 transition-all shadow-lg shadow-accent/20"
        >
          {loading ? "Guardando..." : "Registrar computadora"}
        </button>
      </form>
    </div>
  );
}
