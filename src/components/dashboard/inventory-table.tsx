"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { Plus, Pencil, ImageIcon } from "lucide-react";
import type { Product } from "@/types";
import { ImageUpload } from "@/components/ui/image-upload";

const categories = [
  { value: "motherboard", label: "Motherboard" },
  { value: "cpu", label: "CPU" },
  { value: "gpu", label: "GPU" },
  { value: "ram", label: "RAM" },
  { value: "cabinet", label: "Gabinete" },
  { value: "monitor", label: "Monitor" },
  { value: "assembled_pc", label: "PC Armada" },
];

export function InventoryTable({ products }: { products: Product[] }) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showNew, setShowNew] = useState(false);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Dialog open={showNew} onOpenChange={setShowNew}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Nuevo Producto</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Nuevo Producto</DialogTitle></DialogHeader>
            <ProductForm onSuccess={() => { setShowNew(false); window.location.reload(); }} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imagen</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {product.imageUrl ? (
                    <div className="w-12 h-12 rounded overflow-hidden bg-muted">
                      <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                      <ImageIcon className="h-5 w-5 text-muted-foreground/50" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{product.category}</Badge>
                </TableCell>
                <TableCell>{product.brand || "-"}</TableCell>
                <TableCell>{formatCurrency(product.price)}</TableCell>
                <TableCell>
                  <span className={product.stock <= 3 ? "text-destructive font-medium" : ""}>
                    {product.stock}
                  </span>
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={() => setEditingProduct(product)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader><DialogTitle>Editar Producto</DialogTitle></DialogHeader>
                      {editingProduct?.id === product.id && (
                        <ProductForm product={editingProduct} onSuccess={() => window.location.reload()} />
                      )}
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function ProductForm({ product, onSuccess }: { product?: Product; onSuccess: () => void }) {
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);

    const body = {
      name: formData.get("name"),
      category: formData.get("category"),
      brand: formData.get("brand"),
      model: formData.get("model"),
      price: parseFloat(formData.get("price") as string),
      stock: parseInt(formData.get("stock") as string),
      description: formData.get("description"),
      specs: formData.get("specs"),
      imageUrl: imageUrl || null,
    };

    try {
      const url = product
        ? `/api/products/${product.id}`
        : "/api/products";
      const method = product ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Imagen del producto</Label>
        <ImageUpload currentImage={product?.imageUrl} onUpload={setImageUrl} />
      </div>
      <div>
        <Label>Nombre</Label>
        <Input name="name" defaultValue={product?.name} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Categoría</Label>
          <select name="category" defaultValue={product?.category || "motherboard"} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" required>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>Marca</Label>
          <Input name="brand" defaultValue={product?.brand || ""} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Modelo</Label>
          <Input name="model" defaultValue={product?.model || ""} />
        </div>
        <div>
          <Label>Precio</Label>
          <Input name="price" type="number" step="0.01" defaultValue={product?.price?.toString() || "0"} required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Stock</Label>
          <Input name="stock" type="number" defaultValue={product?.stock?.toString() || "0"} required />
        </div>
      </div>
      <div>
        <Label>Descripción</Label>
        <Textarea name="description" defaultValue={product?.description || ""} rows={2} />
      </div>
      <div>
        <Label>Especificaciones (JSON)</Label>
        <Textarea name="specs" defaultValue={product?.specs || ""} rows={3} placeholder='{"key":"value"}' />
      </div>
      <Button type="submit" disabled={saving}>
        {saving ? "Guardando..." : product ? "Actualizar" : "Crear Producto"}
      </Button>
    </form>
  );
}
