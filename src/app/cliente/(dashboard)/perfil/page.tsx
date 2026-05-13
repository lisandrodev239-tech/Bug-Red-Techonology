"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

export default function PerfilPage() {
  const [profile, setProfile] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    tipo_cliente: "particular",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase
        .from("usuarios")
        .select("*, clientes(*)")
        .eq("id_usuario", user.id)
        .single();

      if (data) {
        setProfile({
          nombre: data.nombre ?? "",
          apellido: data.apellido ?? "",
          email: data.email ?? "",
          telefono: data.telefono ?? "",
          direccion: data.direccion ?? "",
          tipo_cliente: data.clientes?.tipo_cliente ?? "particular",
        });
      }
    });
  }, []);

  const handleSave = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("usuarios")
      .update({
        nombre: profile.nombre,
        apellido: profile.apellido,
        telefono: profile.telefono || null,
        direccion: profile.direccion || null,
      })
      .eq("id_usuario", user.id);

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateField = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-16">
      <div>
        <h1 className="text-3xl font-bold text-white">Mi Perfil</h1>
        <p className="text-white/50 mt-1">Tus datos personales</p>
      </div>

      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Nombre</label>
            <input
              name="nombre"
              value={profile.nombre}
              onChange={updateField}
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none focus:border-accent/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Apellido</label>
            <input
              name="apellido"
              value={profile.apellido}
              onChange={updateField}
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none focus:border-accent/50 transition-all"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs text-white/40 mb-1.5">Email</label>
          <input
            value={profile.email}
            disabled
            className="w-full rounded-lg border border-white/5 bg-white/[0.01] px-4 py-2.5 text-sm text-white/30 outline-none cursor-not-allowed"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-white/40 mb-1.5">
              Teléfono
            </label>
            <input
              name="telefono"
              value={profile.telefono}
              onChange={updateField}
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none focus:border-accent/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5">
              Tipo de cliente
            </label>
            <select
              name="tipo_cliente"
              value={profile.tipo_cliente}
              onChange={updateField}
              className="w-full rounded-lg border border-white/10 bg-darkbg px-4 py-2.5 text-sm text-white outline-none focus:border-accent/50 transition-all"
            >
              <option value="particular">Particular</option>
              <option value="empresa">Empresa</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs text-white/40 mb-1.5">
            Dirección
          </label>
          <input
            name="direccion"
            value={profile.direccion}
            onChange={updateField}
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none focus:border-accent/50 transition-all"
          />
        </div>

        <button
          onClick={handleSave}
          className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent/80 transition-all shadow-lg shadow-accent/20"
        >
          {saved ? "✓ Guardado" : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}
