import { supabase } from "../packages/shared-core/src/supabase";

async function testTrigger() {
  console.log("🚀 Iniciando simulacro de registro...");

  const testEmail = `test-${Date.now()}@buscohuella.es`;

  // 1. Crear el usuario en Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: testEmail,
    password: "PasswordSegura123!",
    options: {
      data: { full_name: "Ciudadano de Prueba Sabadell" },
    },
  });

  if (authError) return console.error("❌ Fallo en Auth:", authError.message);
  console.log("✅ Usuario creado en Auth ID:", authData.user?.id);

  // 2. Esperar 1 segundo para que el Trigger de SQL haga su magia
  await new Promise((r) => setTimeout(r, 1000));

  // 3. Verificar si el Trigger creó el Perfil
  const { data: profile, error: profError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authData.user?.id)
    .single();

  if (profError) {
    console.error(
      "❌ El Trigger falló o no se creó el perfil:",
      profError.message,
    );
  } else {
    console.log(
      "🎯 ¡ÉXITO! El perfil se creó automáticamente con el rol:",
      profile.role,
    );
  }
}

testTrigger();
