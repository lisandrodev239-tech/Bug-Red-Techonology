import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const [totalOrders, pendingOrders, inProgressOrders, completedOrders, totalRevenue] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "pendiente" } }),
      prisma.order.count({ where: { status: "en_progreso" } }),
      prisma.order.count({ where: { status: "completado" } }),
      prisma.transaction.aggregate({
        where: { type: "ingreso" },
        _sum: { amount: true },
      }),
    ]);

  return NextResponse.json({
    totalOrders,
    pendingOrders,
    inProgressOrders,
    completedOrders,
    totalRevenue: totalRevenue._sum.amount || 0,
  });
}
