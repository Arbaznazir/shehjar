import { NextResponse } from "next/server";

export function middleware(request) {
  const url = request.nextUrl.clone();

  // Handle some common 404 errors by redirecting to the home page
  if (url.pathname === "/page" || url.pathname === "/index.html") {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Continue with the request
  return NextResponse.next();
}

// Configure the paths that this middleware applies to
export const config = {
  matcher: ["/page", "/index.html"],
};
