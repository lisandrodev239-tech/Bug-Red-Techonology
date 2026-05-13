import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCurrency, serialize } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package, Tag } from "lucide-react";
import Link from "next/link";

export default async function ProductDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const product = serialize(await prisma.product.findUnique({ where: { id } }));
  if (!product) notFound();

  let specs: Record<string, string> = {};
  try {
    if (product.specs) specs = JSON.parse(product.specs);
  } catch {}

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/tienda" className="text-sm text-muted-foreground hover:text-primary mb-6 inline-block">
        ← Volver a tienda
      </Link>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-muted/30 rounded-xl p-8 flex items-center justify-center min-h-[300px] relative">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-contain p-4"
            />
          ) : (
            <Package className="h-24 w-24 text-muted-foreground/40" />
          )}
        </div>
        <div>
          <Badge variant="secondary" className="mb-2">{product.category}</Badge>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          {product.brand && <p className="text-muted-foreground mb-4">Marca: {product.brand} {product.model && `- ${product.model}`}</p>}
          <p className="text-4xl font-bold text-primary mb-6">{formatCurrency(product.price)}</p>
          <p className="text-muted-foreground mb-6">{product.description}</p>

          {Object.keys(specs).length > 0 && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2"><Tag className="h-4 w-4" /> Especificaciones</h3>
                <div className="space-y-1">
                  {Object.entries(specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-muted-foreground capitalize">{key}:</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex items-center gap-4">
            <Button size="lg" className="flex-1" disabled>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Consultar Disponibilidad
            </Button>
            <div className="text-sm text-muted-foreground">Stock: {product.stock} unidades</div>
          </div>
        </div>
      </div>
    </div>
  );
}
