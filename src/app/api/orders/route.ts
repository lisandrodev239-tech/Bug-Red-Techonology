import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const userRole = (session.user as any).role;
  const userId = (session.user as any).id;

  const where: any = {};
  if (status) where.status = status;
  if (userRole !== "admin") where.userId = userId;

  const orders = await prisma.order.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, lastname: true, email: true, phone: true } },
      repair: true,
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const userId = (session.user as any).id;

    const order = await prisma.order.create({
      data: {
        userId,
        serviceType: body.serviceType,
        deviceType: body.deviceType,
        brand: body.brand,
        model: body.model,
        problemDescription: body.problemDescription,
        observations: body.observations,
        priority: body.priority || "normal",
        status: "pendiente",
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear pedido" }, { status: 500 });
  }
}
