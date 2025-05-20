// middleware.js
import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(request) {
  const url = request.nextUrl.clone();

  // 1) Your existing redirect rules
  if (url.pathname === "/page" || url.pathname === "/index.html") {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // 2) Protect /admin routes (but let them hit /admin/login)
  if (url.pathname.startsWith("/admin") && url.pathname !== "/admin/login") {
    // Spin up a Supabase client in middleware
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req: request, res });

    // Check for an active session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      // No session → redirect to login
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    // Has session → allow through
    return res;
  }

  // 3) Otherwise, proceed as normal
  return NextResponse.next();
}

export const config = {
  // Apply to your old redirects AND all /admin/* paths
  matcher: ["/page", "/index.html", "/admin/:path*"],
};
