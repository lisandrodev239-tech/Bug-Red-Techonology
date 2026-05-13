import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const userRole = (req.auth?.user as any)?.role;

  const publicPaths = [
    "/", "/servicios", "/tienda", "/contacto",
    "/login", "/register",
  ];
  const isPublic = publicPaths.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  const isApiAuth = pathname.startsWith("/api/auth");
  const isStatic = pathname.startsWith("/_next") || pathname.startsWith("/favicon");

  if (isStatic || isApiAuth) return NextResponse.next();

  if (!isLoggedIn && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isLoggedIn && pathname.startsWith("/dashboard") && userRole !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
