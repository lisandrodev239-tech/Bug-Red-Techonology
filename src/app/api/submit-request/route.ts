import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, service_type, problem } = body;

    if (!name || !service_type || !problem) {
      return NextResponse.json(
        { error: "Name, service type, and problem are required." },
        { status: 400 }
      );
    }

    const validServices = ["Windows", "Linux", "Arch"];
    if (!validServices.includes(service_type)) {
      return NextResponse.json(
        { error: "Invalid service type." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { error } = await supabase.from("requests").insert({
      name,
      email: email || null,
      service_type,
      problem,
      status: "pending",
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to submit request. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
