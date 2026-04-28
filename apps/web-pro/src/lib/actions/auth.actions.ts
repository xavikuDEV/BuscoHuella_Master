"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// 🗺️ Derivamos el locale activo desde la cookie que gestiona next-intl/middleware
async function getLocale(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.get("NEXT_LOCALE")?.value ?? "es";
}

// 🧭 Mapeo de roles → rutas destino
// /dashboard/ en todas las rutas operativas coincide con (dashboard)/dashboard/ en el FS
function resolveTargetPath(
  locale: string,
  role: string | null | undefined,
  slug: string
): string {
  switch (role) {
    case "admin":
      return `/${locale}/dashboard/admin`;
    case "police":
      return `/${locale}/dashboard/gov/${slug}/police`;
    case "municipality_admin":
      return `/${locale}/dashboard/gov/${slug}/admin`;
    case "vet":
      return `/${locale}/dashboard/pro/vet`;
    case "citizen":
      return `/${locale}/dashboard/me/pets`;
    default:
      return `/${locale}`;
  }
}

export async function login(formData: FormData) {
  const supabase = await createClient();
  const locale = await getLocale();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // 1️⃣ Autenticación
  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({ email, password });

  if (authError) {
    return redirect(
      `/${locale}/login?error=` + encodeURIComponent(authError.message)
    );
  }

  // 2️⃣ Consulta del perfil para saber el rol y el municipio
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, municipality_slug")
    .eq("id", authData.user?.id)
    .single();

  const slug = profile?.municipality_slug || "global";
  const targetPath = resolveTargetPath(locale, profile?.role, slug);

  // 3️⃣ Redirección limpia basada en rol
  revalidatePath("/", "layout");
  redirect(targetPath);
}

export async function logout() {
  const supabase = await createClient();
  const locale = await getLocale();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect(`/${locale}/login`);
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const locale = await getLocale();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: fullName,
        full_name: fullName,
        role: "citizen", // rol por defecto para nuevos registros
      },
    },
  });

  if (error) {
    return redirect(
      `/${locale}/login?error=` + encodeURIComponent(error.message)
    );
  }

  redirect(`/${locale}/login?message=check-email`);
}

