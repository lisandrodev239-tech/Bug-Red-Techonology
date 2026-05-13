"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSession } from "next-auth/react";

interface ServiceFormProps {
  serviceType: string;
}

export function ServiceForm({ serviceType }: ServiceFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!session) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const body = {
      serviceType,
      deviceType: formData.get("deviceType"),
      brand: formData.get("brand"),
      model: formData.get("model"),
      problemDescription: formData.get("problemDescription"),
      observations: formData.get("observations"),
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al crear solicitud");
      }

      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="p-6 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200">
        <p className="text-green-700 dark:text-green-300 font-medium">
          Solicitud creada con éxito. Redirigiendo...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="deviceType">Tipo de equipo</Label>
        <Select name="deviceType" required>
          <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
          <SelectContent>
            <SelectItem value="pc_escritorio">PC Escritorio</SelectItem>
            <SelectItem value="notebook">Notebook</SelectItem>
            <SelectItem value="all_in_one">All-in-One</SelectItem>
            <SelectItem value="monitor">Monitor</SelectItem>
            <SelectItem value="otro">Otro</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="brand">Marca</Label>
          <Input id="brand" name="brand" placeholder="HP, Dell, etc." />
        </div>
        <div>
          <Label htmlFor="model">Modelo</Label>
          <Input id="model" name="model" placeholder="Pavilion 15" />
        </div>
      </div>
      <div>
        <Label htmlFor="problemDescription">Descripción del problema</Label>
        <Textarea id="problemDescription" name="problemDescription" placeholder="Describí el problema detalladamente..." required rows={4} />
      </div>
      <div>
        <Label htmlFor="observations">Observaciones adicionales</Label>
        <Textarea id="observations" name="observations" placeholder="Algo más que debamos saber..." rows={2} />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Enviando..." : "Solicitar Servicio"}
      </Button>
    </form>
  );
}
