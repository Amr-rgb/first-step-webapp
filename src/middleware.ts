import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Extract locale from pathname
  const localeMatch = pathname.match(/^\/(\w+)/);
  const locale = localeMatch ? localeMatch[1] : 'en';
  
  // Check if this is a dashboard route
  const isDashboardRoute = pathname.includes('/dashboard');
  
  if (isDashboardRoute) {
    // Get auth token from cookies
    const token = request.cookies.get('auth-storage')?.value;
    
    if (!token) {
      // No token, redirect to home
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}`;
      return NextResponse.redirect(url);
    }
    
    try {
      // Parse the stored auth data
      const authData = JSON.parse(token);
      const user = authData.user;
      
      if (!user || !user.role) {
        // No user or role, redirect to home
        const url = request.nextUrl.clone();
        url.pathname = `/${locale}`;
        return NextResponse.redirect(url);
      }
      
      const role = user.role;
      const allowedRoles = ["admin", "center", "branch_admin", "parent"];
      
      if (!allowedRoles.includes(role)) {
        // Invalid role, redirect to home
        const url = request.nextUrl.clone();
        url.pathname = `/${locale}`;
        return NextResponse.redirect(url);
      }
      
      // Check role-based path restrictions
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
      // Invalid token format, redirect to home
      console.error('Error parsing auth token:', error);
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}`;
      return NextResponse.redirect(url);
    }
  }
  
  // Continue with internationalization middleware
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
