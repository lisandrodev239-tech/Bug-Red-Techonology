"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { formatDate, formatCurrency, serviceTypes, orderStatuses } from "@/lib/utils";
import type { Order } from "@/types";

const statusColors: Record<string, string> = {
  pendiente: "warning",
  en_progreso: "default",
  completado: "success",
  entregado: "success",
  cancelado: "destructive",
};

const priorityColors: Record<string, string> = {
  baja: "secondary",
  normal: "default",
  alta: "warning",
  urgente: "destructive",
};

export function OrderTable({ orders }: { orders: Order[] }) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState("todas");

  const filtered = statusFilter === "todas"
    ? orders
    : orders.filter((o) => o.status === statusFilter);

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas</SelectItem>
            {Object.entries(orderStatuses).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Servicio</TableHead>
              <TableHead>Equipo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  {order.user?.name} {order.user?.lastname}
                </TableCell>
                <TableCell>{serviceTypes[order.serviceType] || order.serviceType}</TableCell>
                <TableCell>
                  {order.brand} {order.model}
                  <span className="text-xs text-muted-foreground block">{order.deviceType}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={statusColors[order.status] as any}>
                    {orderStatuses[order.status] || order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={priorityColors[order.priority] as any}>
                    {order.priority}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{formatDate(order.createdAt)}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                        Gestionar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Gestionar Pedido</DialogTitle>
                      </DialogHeader>
                      {selectedOrder?.id === order.id && (
                        <OrderEditForm order={selectedOrder} />
                      )}
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function OrderEditForm({ order }: { order: Order }) {
  const [saving, setSaving] = useState(false);
  const [updated, setUpdated] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);

    const body: any = {
      status: formData.get("status"),
      priority: formData.get("priority"),
      estimatedPrice: formData.get("estimatedPrice") ? parseFloat(formData.get("estimatedPrice") as string) : undefined,
      finalPrice: formData.get("finalPrice") ? parseFloat(formData.get("finalPrice") as string) : undefined,
      observations: formData.get("observations"),
      repair: {
        diagnostic: formData.get("diagnostic"),
        solution: formData.get("solution"),
        partsUsed: formData.get("partsUsed"),
        repairStatus: formData.get("repairStatus"),
        notes: formData.get("notes"),
      },
    };

    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setUpdated(true);
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  if (updated) {
    return <p className="text-green-600 font-medium">Pedido actualizado correctamente.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {order.problemDescription && (
        <div>
          <Label>Descripción del Problema</Label>
          <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
            {order.problemDescription}
          </p>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Estado</Label>
          <select name="status" defaultValue={order.status} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
            {Object.entries(orderStatuses).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>Prioridad</Label>
          <select name="priority" defaultValue={order.priority} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
            <option value="baja">Baja</option>
            <option value="normal">Normal</option>
            <option value="alta">Alta</option>
            <option value="urgente">Urgente</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Precio Estimado</Label>
          <Input name="estimatedPrice" type="number" defaultValue={order.estimatedPrice?.toString()} />
        </div>
        <div>
          <Label>Precio Final</Label>
          <Input name="finalPrice" type="number" defaultValue={order.finalPrice?.toString()} />
        </div>
      </div>
      <div>
        <Label>Diagnóstico</Label>
        <Textarea name="diagnostic" defaultValue={order.repair?.diagnostic || ""} rows={2} />
      </div>
      <div>
        <Label>Solución</Label>
        <Textarea name="solution" defaultValue={order.repair?.solution || ""} rows={2} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Estado Reparación</Label>
          <select name="repairStatus" defaultValue={order.repair?.repairStatus || "en_diagnostico"} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
            <option value="en_diagnostico">En Diagnóstico</option>
            <option value="en_reparacion">En Reparación</option>
            <option value="esperando_partes">Esperando Partes</option>
            <option value="completado">Completado</option>
          </select>
        </div>
        <div>
          <Label>Partes Usadas</Label>
          <Input name="partsUsed" defaultValue={order.repair?.partsUsed || ""} placeholder="Ej: RAM 8GB, SSD 240GB" />
        </div>
      </div>
      <div>
        <Label>Observaciones</Label>
        <Textarea name="observations" defaultValue={order.observations || ""} rows={2} />
      </div>
      <div>
        <Label>Notas Técnicas</Label>
        <Textarea name="notes" defaultValue={order.repair?.notes || ""} rows={2} />
      </div>
      <Button type="submit" disabled={saving}>
        {saving ? "Guardando..." : "Guardar Cambios"}
      </Button>
    </form>
  );
}
