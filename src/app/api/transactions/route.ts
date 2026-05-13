import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const transactions = await prisma.transaction.findMany({
    include: {
      createdBy: { select: { id: true, name: true, lastname: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(transactions);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const transaction = await prisma.transaction.create({
      data: {
        type: body.type,
        category: body.category,
        description: body.description,
        amount: body.amount,
        referenceId: body.referenceId,
        createdById: (session.user as any).id,
      },
    });
    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear transacción" }, { status: 500 });
  }
}
