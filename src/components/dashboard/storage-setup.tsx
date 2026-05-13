"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HardDrive } from "lucide-react";

export function StorageSetup() {
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSetup() {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/storage/setup", { method: "POST" });
      const data = await res.json();
      setStatus({ ok: res.ok, msg: data.message || data.error || "OK" });
    } catch {
      setStatus({ ok: false, msg: "Error de conexión" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" size="sm" onClick={handleSetup} disabled={loading}>
        <HardDrive className="h-4 w-4 mr-2" />
        {loading ? "Configurando..." : "Inicializar Storage"}
      </Button>
      {status && (
        <span className={`text-xs ${status.ok ? "text-green-600" : "text-destructive"}`}>
          {status.msg}
        </span>
      )}
    </div>
  );
}
