import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Package, DollarSign, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { formatCurrency, serialize } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const isAdmin = (session.user as any).role === "admin";

  if (!isAdmin) {
    const orders = serialize(await prisma.order.findMany({
      where: { userId: (session.user as any).id },
      include: { repair: true, payment: true },
      orderBy: { createdAt: "desc" },
    }));

    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Mis Pedidos</h1>
        {orders.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No tenés pedidos todavía.</p>
          </div>
        ) : (
          <div className="space-y-4">
        {orders.map((order: any) => (
          <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{order.serviceType}</CardTitle>
                    <span className="text-sm px-2 py-1 rounded bg-muted">{order.status}</span>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>{order.deviceType && `${order.deviceType} - `}{order.brand} {order.model}</p>
                  {order.problemDescription && <p className="mt-1">Problema: {order.problemDescription}</p>}
                  <p className="mt-2 text-xs">Creado: {new Date(order.createdAt).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  const [totalOrders, pendingOrders, inProgress, completed, revenueAgg] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "pendiente" } }),
    prisma.order.count({ where: { status: "en_progreso" } }),
    prisma.order.count({ where: { status: "completado" } }),
    prisma.transaction.aggregate({ where: { type: "ingreso" }, _sum: { amount: true } }),
  ]);
  const revenue = Number(revenueAgg._sum.amount || 0);

  const stats = [
    { title: "Total Pedidos", value: totalOrders, icon: ClipboardList, color: "text-blue-600" },
    { title: "Pendientes", value: pendingOrders, icon: Clock, color: "text-yellow-600" },
    { title: "En Progreso", value: inProgress, icon: TrendingUp, color: "text-orange-600" },
    { title: "Completados", value: completed, icon: CheckCircle, color: "text-green-600" },
    { title: "Ingresos Totales", value: formatCurrency(revenue), icon: DollarSign, color: "text-primary" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Admin</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
