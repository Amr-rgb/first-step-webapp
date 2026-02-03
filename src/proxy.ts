import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const validLocales = ["ar", "en"];

  // Redirect www to non-www for canonical URLs (fixes Google duplicate content)
  const hostname = request.headers.get("host") || "";
  if (hostname.startsWith("www.")) {
    const url = request.nextUrl.clone();
    url.host = hostname.replace("www.", "");
    return NextResponse.redirect(url, 301);
  }

  // 0. Redirect old/legacy URLs for SEO
  const legacyRedirects: Record<string, string> = {
    "/about": "/our-story",
    "/terms-of-service": "/terms-conditions",
  };

  // Check if pathname (without locale) is a legacy route
  for (const locale of validLocales) {
    for (const [oldPath, newPath] of Object.entries(legacyRedirects)) {
      if (pathname === `/${locale}${oldPath}`) {
        return NextResponse.redirect(
          new URL(`/${locale}${newPath}`, request.url),
          301,
        );
      }
    }
  }

  // Handle bare legacy redirects (without locale prefix)
  if (legacyRedirects[pathname]) {
    // This will let the locale logic below handle adding the locale after redirecting the path
    const url = request.nextUrl.clone();
    url.pathname = legacyRedirects[pathname];
    return NextResponse.redirect(url, 301);
  }

  // 1. Check for existing locale in pathname
  const localeMatch = pathname.match(/^\/(\w+)/);
  const potentialLocale = localeMatch ? localeMatch[1] : null;
  let locale = validLocales.includes(potentialLocale || "")
    ? potentialLocale
    : null;

  // 2. If no valid locale in path, check cookie and redirect
  if (!locale) {
    const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
    locale = validLocales.find((l) => l === cookieLocale) || "ar"; // Default to Arabic if no valid cookie
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

  // Add pathname to headers for metadata generation
  response.headers.set("x-pathname", pathname);

  // 4. Get auth token
  const token = request.cookies.get("auth-storage")?.value;

  // 5. Redirect authenticated users away from auth pages
  const isAuthRoute =
    pathname.includes("/sign-in") ||
    pathname.includes("/sign-up") ||
    pathname.includes("/forgot-password") ||
    pathname.includes("/otp-verification") ||
    pathname.includes("/reset-password");

  if (isAuthRoute && token) {
    try {
      const authData = JSON.parse(token);
      const user = authData.user;

      if (user && user.role) {
        const url = request.nextUrl.clone();
        // Redirect to appropriate dashboard based on role
        if (user.role === "parent") {
          url.pathname = `/${locale}/dashboard/parent`;
        } else if (user.role === "center" || user.role === "branch_admin") {
          url.pathname = `/${locale}/dashboard/center`;
        } else if (user.role === "admin") {
          url.pathname = `/${locale}/dashboard/admin`;
        } else {
          url.pathname = `/${locale}`;
        }
        return NextResponse.redirect(url);
      }
    } catch (error) {
      // Invalid token, allow access to auth pages
      console.error("Error parsing auth token:", error);
    }
  }

  // 6. Dashboard auth & role checks
  const isDashboardRoute = pathname.includes("/dashboard");

  if (isDashboardRoute) {
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
  matcher: "/((?!api|trpc|_next|_vercel|monitoring-tune|.*\\..*).*)",
};
