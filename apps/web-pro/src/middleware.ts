import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  // 1. Cliente Supabase SSR
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    },
  );

  // 2. Comprobar sesión
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // 🌐 3. Locales
  const locales = ["es", "en"];
  const defaultLocale = "es";

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  // 🛡️ 4. Protección de rutas
  if (!user && pathname.includes("/dashboard")) {
    const localeInPath = pathname.split("/")[1];
    const currentLocale = locales.includes(localeInPath)
      ? localeInPath
      : defaultLocale;

    // 🛡️ La URL es /login porque (auth) no se escribe en la barra del navegador
    return NextResponse.redirect(
      new URL(`/${currentLocale}/login`, request.url),
    );
  }

  // 🌍 5. Forzar locale si falta
  if (!pathnameHasLocale && !pathname.includes(".")) {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname}`, request.url),
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
