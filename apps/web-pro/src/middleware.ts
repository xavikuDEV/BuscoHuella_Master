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

  // 🛡️ 5. Protección de rutas tácticas por Roles
  if (user && pathname.includes("/dashboard")) {
        let userRole = user.app_metadata?.role;
        let municipalitySlug = user.app_metadata?.municipality_slug;

        if (!userRole || !municipalitySlug) {
          try {
            const { data: profile } = await supabase
              .from("profiles")
              .select("role, municipality_slug")
              .eq("id", user.id)
              .single();
            if (profile) {
              if (!userRole && profile.role) userRole = profile.role;
              if (!municipalitySlug && profile.municipality_slug) municipalitySlug = profile.municipality_slug;
            }
          } catch (error) {
            console.error("Middleware DB Sync Error:", error);
          }
        }

        if (!userRole) {
          if (municipalitySlug && pathname.includes(`/dashboard/gov/${municipalitySlug}`)) {
            if (pathname.includes("/police")) {
              userRole = "police";
            } else {
              userRole = "gov_municipality";
            }
          } else {
            userRole = "citizen_free";
          }
        }

        const localeInPath = pathname.split("/")[1];
        const currentLocale = locales.includes(localeInPath) ? localeInPath : defaultLocale;

        // Bypass total para el administrador Archon
        const isUserAdmin = userRole?.toLowerCase().trim() === "admin" || userRole?.toLowerCase().trim() === "administrador";
        if (!isUserAdmin) {
          const govPoliceRegex = new RegExp(`^/${currentLocale}/dashboard/gov/[^/]+/police`);
          const ROLE_RULES = [
            { prefix: `/${currentLocale}/dashboard/gov/global-map`, roles: ["gov_national"], deniedMessage: "Acceso exclusivo para el Alto Mando Nacional." },
            { prefix: `/${currentLocale}/dashboard/gov/regional-map`, roles: ["gov_regional"], deniedMessage: "Acceso exclusivo para el Mando Regional." },
            { 
              regex: govPoliceRegex, 
              roles: ["gov_municipality", "police_chief", "police_agent", "police"], 
              deniedMessage: "Acceso exclusivo para Autoridades Municipales y Seguridad." 
            },
            { prefix: `/${currentLocale}/dashboard/pro`, roles: ["vet_admin", "vet_staff", "shop_owner", "shop_staff", "vet"], deniedMessage: "Acceso exclusivo para profesionales registrados." },
            { prefix: `/${currentLocale}/dashboard/shelter`, roles: ["shelter_admin", "shelter_volunteer", "ngo_manager"], deniedMessage: "Acceso exclusivo para personal de refugios." },
          ];

          const normalizedUserRole = userRole.toLowerCase().trim();

          for (const rule of ROLE_RULES) {
            const isMatch = (rule as any).regex
              ? (rule as any).regex.test(pathname)
              : rule.prefix
              ? pathname.startsWith(rule.prefix)
              : false;

            if (
              isMatch && 
              !rule.roles.map(r => r.toLowerCase().trim()).includes(normalizedUserRole)
            ) {
              return NextResponse.redirect(
                new URL(
                  `/${currentLocale}/dashboard/restricted-access?role=${userRole}&deniedMessage=${encodeURIComponent(rule.deniedMessage)}`,
                  request.url
                )
              );
            }
          }
        }
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
