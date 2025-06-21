// middleware.js
import { NextResponse } from "next/server";

export async function middleware(request) {
  const url = request.nextUrl.clone();

  // Handle basic redirects
  if (url.pathname === "/page" || url.pathname === "/index.html") {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/page", "/index.html"],
};
