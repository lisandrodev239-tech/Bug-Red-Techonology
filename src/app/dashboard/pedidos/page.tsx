import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { serialize } from "@/lib/utils";
import { OrderTable } from "@/components/dashboard/order-table";

export default async function PedidosPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") redirect("/login");

  const orders = serialize(await prisma.order.findMany({
    include: {
      user: { select: { id: true, name: true, lastname: true, email: true } },
      repair: true,
    },
    orderBy: { createdAt: "desc" },
  }));

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Pedidos</h1>
      <OrderTable orders={orders} />
    </div>
  );
}
