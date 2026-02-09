import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isAuth = !!req.auth;
  const isTargetingAdmin = req.nextUrl.pathname.startsWith("/admin");
  const userRole = (req.auth?.user as any)?.role;

  if (isTargetingAdmin) {
    if (!isAuth) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
