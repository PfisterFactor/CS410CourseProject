import { RequestCookie } from "next/dist/server/web/spec-extension/cookies";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const LoggedInPages = ["/website-selector", "/manager"];
const LoggedOutPages = ["/login", "/signup"];

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const page = request.nextUrl.pathname;
  if (![...LoggedInPages, LoggedOutPages].includes(page)) {
    return NextResponse.next();
  }
  const loginToken: RequestCookie | null =
    request.cookies.get("LoginToken") ?? null;
  let hasLoginToken = loginToken != null;
  if (hasLoginToken) {
    if (LoggedOutPages.includes(page)) {
      const newUrl = request.nextUrl.clone();
      newUrl.pathname = "/manager";
      return NextResponse.redirect(newUrl);
    }
    return NextResponse.next();
  } else {
    if (LoggedInPages.includes(page)) {
      const newUrl = request.nextUrl.clone();
      newUrl.pathname = "/login";
      return NextResponse.redirect(newUrl);
    }
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {};
