import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, lastname: true, email: true, phone: true } },
      repair: { include: { technician: { select: { id: true, name: true, lastname: true } } } },
      payment: true,
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
  }

  const userRole = (session.user as any).role;
  const userId = (session.user as any).id;
  if (userRole !== "admin" && order.userId !== userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  return NextResponse.json(order);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data: any = {};

    if (body.status) data.status = body.status;
    if (body.priority) data.priority = body.priority;
    if (body.estimatedPrice) data.estimatedPrice = body.estimatedPrice;
    if (body.finalPrice) data.finalPrice = body.finalPrice;
    if (body.observations) data.observations = body.observations;
    if (body.status === "entregado") data.deliveredAt = new Date();

    const order = await prisma.order.update({
      where: { id },
      data,
    });

    if (body.repair) {
      await prisma.repair.upsert({
        where: { orderId: id },
        update: {
          diagnostic: body.repair.diagnostic,
          solution: body.repair.solution,
          partsUsed: body.repair.partsUsed,
          repairTime: body.repair.repairTime,
          repairStatus: body.repair.repairStatus,
          notes: body.repair.notes,
        },
        create: {
          orderId: id,
          technicianId: (session.user as any).id,
          diagnostic: body.repair.diagnostic,
          solution: body.repair.solution,
          partsUsed: body.repair.partsUsed,
          repairTime: body.repair.repairTime,
          repairStatus: body.repair.repairStatus || "en_diagnostico",
          notes: body.repair.notes,
        },
      });
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar pedido" }, { status: 500 });
  }
}
