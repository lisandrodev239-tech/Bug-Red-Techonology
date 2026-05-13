import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { serialize } from "@/lib/utils";
import { InventoryTable } from "@/components/dashboard/inventory-table";
import { StorageSetup } from "@/components/dashboard/storage-setup";

export default async function InventarioPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") redirect("/login");

  const products = serialize(await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Inventario</h1>
        <StorageSetup />
      </div>
      <InventoryTable products={products} />
    </div>
  );
}
