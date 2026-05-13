import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { serialize } from "@/lib/utils";
import { UsersTable } from "@/components/dashboard/users-table";

export default async function UsuariosPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") redirect("/login");

  const users = serialize(await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      lastname: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: "desc" },
  }));

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Usuarios</h1>
      <UsersTable users={users} />
    </div>
  );
}
