import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { auth } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "product-images";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No se recibió archivo" }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    const allowed = ["jpg", "jpeg", "png", "webp", "gif", "svg"];
    if (!allowed.includes(ext)) {
      return NextResponse.json({ error: "Formato no permitido. Usá: jpg, png, webp, gif, svg" }, { status: 400 });
    }

    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Archivo muy grande. Máximo 5MB" }, { status: 400 });
    }

    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    // Try Supabase Storage first
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .upload(`products/${fileName}`, buffer, {
          contentType: file.type,
          cacheControl: "3600",
        });

      if (!error && data) {
        const { data: urlData } = supabase.storage
          .from(BUCKET)
          .getPublicUrl(`products/${fileName}`);

        return NextResponse.json({ url: urlData.publicUrl });
      }
    }

    // Fallback: local storage
    const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    const url = `/uploads/products/${fileName}`;
    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json({ error: "Error al subir archivo" }, { status: 500 });
  }
}
