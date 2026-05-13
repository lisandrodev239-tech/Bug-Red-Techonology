export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "product-images";

export async function POST() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY no está configurada en las variables de entorno" },
      { status: 400 }
    );
  }

  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.find((b) => b.name === BUCKET);

  if (exists) {
    return NextResponse.json({ message: `Bucket '${BUCKET}' ya existe`, bucket: BUCKET });
  }

  const { data, error } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
  });

  if (error) {
    return NextResponse.json(
      { error: `Error al crear bucket: ${error.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: `Bucket '${BUCKET}' creado`, bucket: data });
}
