import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Check for existing locale in pathname
  const localeMatch = pathname.match(/^\/(\w+)/);
  let locale = localeMatch ? localeMatch[1] : null;

  // 2. If no locale in path, check cookie
  if (!locale) {
    const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
    locale = cookieLocale || "ar"; // Default to Arabic if no cookie
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(url);
  }

  // 3. Persist locale into cookie
  const response = intlMiddleware(request);
  response.cookies.set("NEXT_LOCALE", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });

  // 4. Dashboard auth & role checks
  const isDashboardRoute = pathname.includes("/dashboard");

  if (isDashboardRoute) {
    const token = request.cookies.get("auth-storage")?.value;

    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}`;
      return NextResponse.redirect(url);
    }

    try {
      const authData = JSON.parse(token);
      const user = authData.user;

      if (!user || !user.role) {
        const url = request.nextUrl.clone();
        url.pathname = `/${locale}`;
        return NextResponse.redirect(url);
      }

      const role = user.role;
      const allowedRoles = ["admin", "center", "branch_admin", "parent"];

      if (!allowedRoles.includes(role)) {
        const url = request.nextUrl.clone();
        url.pathname = `/${locale}`;
        return NextResponse.redirect(url);
      }

      const parentDashboard = `/${locale}/dashboard/parent`;
      const adminDashboard = `/${locale}/dashboard/admin`;
      const centerDashboard = `/${locale}/dashboard/center`;

      if (role === "parent" && !pathname.startsWith(parentDashboard)) {
        const url = request.nextUrl.clone();
        url.pathname = parentDashboard;
        return NextResponse.redirect(url);
      } else if (
        (role === "center" || role === "branch_admin") &&
        !pathname.startsWith(centerDashboard)
      ) {
        const url = request.nextUrl.clone();
        url.pathname = centerDashboard;
        return NextResponse.redirect(url);
      } else if (role === "admin" && !pathname.startsWith(adminDashboard)) {
        const url = request.nextUrl.clone();
        url.pathname = adminDashboard;
        return NextResponse.redirect(url);
      }
    } catch (error) {
      console.error("Error parsing auth token:", error);
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}`;
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
