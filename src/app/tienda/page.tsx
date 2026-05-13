import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/utils";
import { ProductGrid } from "@/components/products/product-grid";

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function TiendaPage(props: PageProps) {
  const { category } = await props.searchParams;
  const where = category ? { category } : {};
  const products = await prisma.product.findMany({ where, orderBy: { createdAt: "desc" } });

  const categories = [
    { value: "motherboard", label: "Motherboards" },
    { value: "cpu", label: "Procesadores" },
    { value: "gpu", label: "Tarjetas Gráficas" },
    { value: "ram", label: "Memorias RAM" },
    { value: "cabinet", label: "Gabinetes" },
    { value: "monitor", label: "Monitores" },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Tienda de Componentes</h1>
      <div className="flex flex-wrap gap-2 mb-8">
        <a href="/tienda" className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!category ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}>
          Todos
        </a>
        {categories.map((cat) => (
          <a
            key={cat.value}
            href={`/tienda?category=${cat.value}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === cat.value ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}
          >
            {cat.label}
          </a>
        ))}
      </div>
      {products.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No hay productos disponibles en esta categoría.</p>
      ) : (
        <ProductGrid products={serialize(products)} />
      )}
    </div>
  );
}
