"use client";

import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Header() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setEmail(data.user.email ?? "");
    });
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/cliente/login");
    router.refresh();
  };

  return (
    <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 lg:px-8 gap-4 bg-darkbg/20">
      <Link
        href="/cliente"
        className="text-lg font-bold text-white lg:hidden"
      >
        Bug<span className="text-accent">Red</span>
      </Link>
      <div className="flex-1 lg:flex-none" />
      <span className="text-sm text-white/40 truncate max-w-[200px]">
        {email}
      </span>
      <button
        onClick={handleLogout}
        className="text-sm text-white/40 hover:text-accent transition-colors duration-200"
      >
        Cerrar sesión
      </button>
    </header>
  );
}
