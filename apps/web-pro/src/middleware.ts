import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 🌐 1. Definimos los locales soportados
  const locales = ["es", "en"];
  const defaultLocale = "es";

  // 2. Comprobamos si la ruta ya tiene un locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) return;

  // 3. Si no tiene locale y no es un archivo estático, redirigimos
  // Excluimos imágenes, api y archivos de sistema
  if (
    !pathname.includes(".") &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/_next")
  ) {
    request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }
}

export const config = {
  // Matcher para saltarse archivos internos y estáticos
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
