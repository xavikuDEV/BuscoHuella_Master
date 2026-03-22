/**
 * 🧪 E2E Tests: Dashboard Command Center
 * Flujo completo: Login -> Carga -> Sector -> Modal -> Feed de incidentes
 *
 * ⚠️ REQUIERE:
 * - Dev server corriendo en localhost:3000 (`pnpm web:dev`)
 * - Variables de entorno E2E_USER_EMAIL y E2E_USER_PASSWORD configuradas,
 *   o un usuario de prueba en Supabase con las credenciales por defecto.
 */
import { test, expect } from "@playwright/test";

// 🔑 Credenciales de prueba — usa variables de entorno o un fallback para desarrollo local
const TEST_EMAIL = process.env.E2E_USER_EMAIL || "test@buscohuella.com";
const TEST_PASSWORD = process.env.E2E_USER_PASSWORD || "testpassword123";

/**
 * Helper: Realiza el login y navega al dashboard.
 * Reutilizable en cada test.
 */
async function loginAndNavigate(page: any) {
  // 1. Navegar al dashboard (será redirigido a login)
  await page.goto("http://localhost:3000/es/dashboard/admin");

  // 2. Verificar que estamos en la página de login
  await page.waitForURL(/login/, { timeout: 10000 });

  // 3. Rellenar credenciales
  await page.fill('input[name="email"]', TEST_EMAIL);
  await page.fill('input[name="password"]', TEST_PASSWORD);

  // 4. Hacer click en "Entrar"
  await page.getByText("Entrar 🔓").click();

  // 5. Esperar a que nos redirija al dashboard
  await page.waitForURL(/dashboard\/admin/, { timeout: 15000 });
}

test.describe("Dashboard Command Center", () => {
  // Timeout generoso — el login + server-side rendering toma tiempo
  test.setTimeout(60000);

  test("login y carga de la página con heading Command Center", async ({
    page,
  }) => {
    await loginAndNavigate(page);

    // Verificamos que el heading principal está visible
    const heading = page.getByRole("heading", { level: 2 });
    await expect(heading).toContainText("Command", { timeout: 10000 });
    await expect(heading).toContainText("Center");
  });

  test("selección de sector SBD-08 actualiza la URL", async ({ page }) => {
    await loginAndNavigate(page);

    // Buscamos el selector de sector y cambiamos a SBD-08
    const sectorSelect = page.locator("select").first();
    await expect(sectorSelect).toBeVisible({ timeout: 10000 });
    await sectorSelect.selectOption("SBD-08");

    // Verificamos que la URL se actualiza
    await page.waitForURL(/sector=SBD-08/, { timeout: 10000 });
    expect(page.url()).toContain("sector=SBD-08");
  });

  test('clic en "Emitir Alerta" abre el modal', async ({ page }) => {
    await loginAndNavigate(page);

    // Buscamos y hacemos clic en el botón de emitir alerta
    const alertButton = page.getByText("Emitir Alerta");
    await expect(alertButton).toBeVisible({ timeout: 10000 });
    await alertButton.click();

    // Verificamos que el modal se abre con el texto esperado
    const modalTitle = page.getByText("Alerta Táctica");
    await expect(modalTitle).toBeVisible({ timeout: 5000 });

    // Verificamos que el textarea del mensaje está presente
    const textarea = page.locator('textarea[name="message"]');
    await expect(textarea).toBeVisible();

    // Verificamos los selectores de tipo y urgencia
    const typeSelect = page.locator('select[name="type"]');
    await expect(typeSelect).toBeVisible();

    const urgencySelect = page.locator('select[name="urgency"]');
    await expect(urgencySelect).toBeVisible();
  });

  test("el feed de incidentes tiene contenido o muestra estado vacío", async ({
    page,
  }) => {
    await loginAndNavigate(page);

    // Buscamos el header del incident feed (texto dividido en spans)
    const feedHeader = page.locator("h3", { hasText: "Incident" });
    await expect(feedHeader).toBeVisible({ timeout: 10000 });

    // Verificamos que hay contenido: o incidentes o el mensaje de perímetro seguro
    const incidentItems = page.locator(
      '[class*="border-"][class*="rounded-4xl"]',
    );
    const emptyState = page.getByText(/Sin_Alertas_Detectadas/);

    const incidentCount = await incidentItems.count();
    const isEmptyVisible = await emptyState.isVisible().catch(() => false);

    // Al menos uno de los dos estados debe ser verdad
    expect(incidentCount > 0 || isEmptyVisible).toBe(true);
  });

  test("flujo completo: sector -> modal -> verificación", async ({
    page,
  }) => {
    await loginAndNavigate(page);

    // 1. Seleccionar sector SBD-08
    const sectorSelect = page.locator("select").first();
    await expect(sectorSelect).toBeVisible({ timeout: 10000 });
    await sectorSelect.selectOption("SBD-08");
    await page.waitForURL(/sector=SBD-08/, { timeout: 10000 });

    // 2. Abrir modal
    const alertButton = page.getByText("Emitir Alerta");
    await expect(alertButton).toBeVisible({ timeout: 10000 });
    await alertButton.click();

    // 3. Verificar que el modal se abrió
    await expect(page.getByText("Alerta Táctica")).toBeVisible({
      timeout: 5000,
    });

    // 4. Cerrar modal con Abortar
    await page.getByText("Abortar").click();

    // 5. Verificar que el feed sigue visible
    const feedHeader = page.locator("h3", { hasText: "Incident" });
    await expect(feedHeader).toBeVisible({ timeout: 5000 });
  });
});
