"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Plus, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import type { Transaction } from "@/types";

interface FinanceViewProps {
  transactions: Transaction[];
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export function FinanceView({ transactions, totalIncome, totalExpense, balance }: FinanceViewProps) {
  const [showNew, setShowNew] = useState(false);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Egresos</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${balance >= 0 ? "text-primary" : "text-destructive"}`}>
              {formatCurrency(balance)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end mb-4">
        <Dialog open={showNew} onOpenChange={setShowNew}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Nueva Transacción</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nueva Transacción</DialogTitle></DialogHeader>
            <TransactionForm onSuccess={() => { setShowNew(false); window.location.reload(); }} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>
                  <Badge variant={tx.type === "ingreso" ? "success" : "destructive"}>
                    {tx.type === "ingreso" ? "Ingreso" : "Egreso"}
                  </Badge>
                </TableCell>
                <TableCell>{tx.category}</TableCell>
                <TableCell>{tx.description}</TableCell>
                <TableCell className={tx.type === "ingreso" ? "text-green-600" : "text-red-600"}>
                  {tx.type === "ingreso" ? "+" : "-"}{formatCurrency(tx.amount)}
                </TableCell>
                <TableCell className="text-sm">{formatDate(tx.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function TransactionForm({ onSuccess }: { onSuccess: () => void }) {
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: formData.get("type"),
          category: formData.get("category"),
          description: formData.get("description"),
          amount: parseFloat(formData.get("amount") as string),
        }),
      });
      if (res.ok) onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Tipo</Label>
          <select name="type" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" required>
            <option value="ingreso">Ingreso</option>
            <option value="egreso">Egreso</option>
          </select>
        </div>
        <div>
          <Label>Categoría</Label>
          <select name="category" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" required>
            <option value="reparacion">Reparación</option>
            <option value="venta">Venta</option>
            <option value="compra_hardware">Compra Hardware</option>
            <option value="servicio">Servicio</option>
            <option value="otro">Otro</option>
          </select>
        </div>
      </div>
      <div>
        <Label>Descripción</Label>
        <Input name="description" required placeholder="Detalle de la transacción" />
      </div>
      <div>
        <Label>Monto</Label>
        <Input name="amount" type="number" step="0.01" required placeholder="0.00" />
      </div>
      <Button type="submit" disabled={saving}>
        {saving ? "Guardando..." : "Crear Transacción"}
      </Button>
    </form>
  );
}
