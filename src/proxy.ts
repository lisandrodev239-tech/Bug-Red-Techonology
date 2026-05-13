import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fbnjipzbszkfcdxbzwuu.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_ImHNdFtpPsSoRumwL4Ny4A_tuTV30G1";

export async function proxy(request: NextRequest) {
  const publicPaths = ["/cliente/login", "/cliente/registro"];

  let supabaseResponse = NextResponse.next();

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (publicPaths.includes(request.nextUrl.pathname)) {
      if (user) {
        return NextResponse.redirect(new URL("/cliente", request.url));
      }
      return supabaseResponse;
    }

    if (!user) {
      return NextResponse.redirect(new URL("/cliente/login", request.url));
    }

    return supabaseResponse;
  } catch {
    if (publicPaths.includes(request.nextUrl.pathname)) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/cliente/login", request.url));
  }
}

export const config = {
  matcher: ["/cliente/:path*"],
};
