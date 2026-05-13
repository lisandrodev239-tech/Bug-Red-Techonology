"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate } from "@/lib/utils";

interface UserWithCount {
  id: string;
  name: string;
  lastname: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt: string;
  _count: { orders: number };
}

export function UsersTable({ users }: { users: UserWithCount[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Pedidos</TableHead>
            <TableHead>Registro</TableHead>
            <TableHead>Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name} {user.lastname}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone || "-"}</TableCell>
              <TableCell>
                <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                  {user.role === "admin" ? "Admin" : "Usuario"}
                </Badge>
              </TableCell>
              <TableCell>{user._count.orders}</TableCell>
              <TableCell className="text-sm">{formatDate(user.createdAt)}</TableCell>
              <TableCell>
                <RoleChanger userId={user.id} currentRole={user.role} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function RoleChanger({ userId, currentRole }: { userId: string; currentRole: string }) {
  const [saving, setSaving] = useState(false);

  async function handleRoleChange(role: string) {
    setSaving(true);
    try {
      await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, role }),
      });
      window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <select
      defaultValue={currentRole}
      onChange={(e) => handleRoleChange(e.target.value)}
      disabled={saving}
      className="flex h-8 w-24 rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-sm"
    >
      <option value="user">Usuario</option>
      <option value="admin">Admin</option>
    </select>
  );
}
