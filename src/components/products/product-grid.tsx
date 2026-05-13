import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { ImageIcon } from "lucide-react";
import type { Product } from "@/types";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link key={product.id} href={`/tienda/${product.id}`}>
          <Card className="group transition-all hover:shadow-lg hover:border-primary/50 h-full overflow-hidden">
            <div className="relative w-full aspect-square bg-muted/30">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <ImageIcon className="h-16 w-16 text-muted-foreground/30" />
                </div>
              )}
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between mb-1">
                <Badge variant="secondary" className="text-xs">{product.category}</Badge>
              </div>
              <CardTitle className="text-base line-clamp-1">{product.name}</CardTitle>
              <CardDescription className="line-clamp-2 text-xs">
                {product.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">
                  {formatCurrency(product.price)}
                </span>
                <span className="text-sm text-muted-foreground">
                  Stock: {product.stock}
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
