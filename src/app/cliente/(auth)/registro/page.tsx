"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    telefono: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (authError || !authData.user) {
      setError(authError?.message ?? "Error al registrarse");
      setLoading(false);
      return;
    }

    const { error: userError } = await supabase.from("usuarios").insert({
      id_usuario: authData.user.id,
      nombre: form.nombre,
      apellido: form.apellido,
      email: form.email,
      telefono: form.telefono || null,
      rol: "CLIENTE",
    });

    if (userError) {
      setError(userError.message);
      setLoading(false);
      return;
    }

    const { error: clientError } = await supabase.from("clientes").insert({
      id_usuario: authData.user.id,
      tipo_cliente: "particular",
    });

    if (clientError) {
      setError(clientError.message);
      setLoading(false);
      return;
    }

    router.push("/cliente");
    router.refresh();
  };

  const updateField = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white">
            Bug<span className="text-accent">Red</span>
          </h1>
          <p className="text-white/50 mt-2">Crear cuenta</p>
        </div>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input
              name="nombre"
              placeholder="Nombre"
              value={form.nombre}
              onChange={updateField}
              required
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all"
            />
            <input
              name="apellido"
              placeholder="Apellido"
              value={form.apellido}
              onChange={updateField}
              required
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all"
            />
          </div>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={updateField}
            required
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all"
          />
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={updateField}
            required
            minLength={6}
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all"
          />
          <input
            name="telefono"
            placeholder="Teléfono (opcional)"
            value={form.telefono}
            onChange={updateField}
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-accent py-3 text-sm font-medium text-white hover:bg-accent/80 disabled:opacity-50 transition-all shadow-lg shadow-accent/20"
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>
        <p className="text-center text-sm text-white/40 mt-6">
          ¿Ya tenés cuenta?{" "}
          <Link href="/cliente/login" className="text-accent hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
