import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { serialize } from "@/lib/utils";
import { FinanceView } from "@/components/dashboard/finance-view";

export default async function FinanzasPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") redirect("/login");

  const [transactions, incomeAgg, expenseAgg] = await Promise.all([
    prisma.transaction.findMany({
      include: { createdBy: { select: { name: true, lastname: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.transaction.aggregate({
      where: { type: "ingreso" },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { type: "egreso" },
      _sum: { amount: true },
    }),
  ]);

  const totalIncome = Number(incomeAgg._sum.amount || 0);
  const totalExpense = Number(expenseAgg._sum.amount || 0);
  const balance = totalIncome - totalExpense;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Finanzas</h1>
      <FinanceView
        transactions={serialize(transactions)}
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        balance={balance}
      />
    </div>
  );
}
