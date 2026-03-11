# 🐾 PROTOCOLO GÉNESIS: BUSCOHUELLA BUNKER 2.0
# Objetivo: Inicializar infraestructura modular de grado institucional.

Write-Host "🚀 Iniciando Protocolo Génesis para BuscoHuella..." -ForegroundColor Cyan

# 1. Creación de Estructura de Carpetas (Piezas del Puzzle)
$folders = @(
    "apps/web-pro",
    "apps/mobile-app",
    "packages/shared-core",
    "packages/shared-ui",
    "packages/shared-config",
    "docs/adr",
    "docs/db",
    "docs/legal",
    "scripts",
    "agents",
    "logs"
)

foreach ($folder in $folders) {
    if (!(Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder -Force | Out-Null
        Write-Host "  [OK] Carpeta creada: $folder" -ForegroundColor Green
    }
}

# 2. Generación de ARCHITECT_CONTEXT.md (Hoja de Ruta)
$architectContext = @"
# 🏗️ ARCHITECT CONTEXT: BuscoHuella Ecosystem
> Última actualización: $(Get-Date -Format "dd/MM/yyyy HH:mm:ss")

## 📍 Estado Actual
- **Fase:** Fase 1 (Cimientos y Gobernanza) — **EN CURSO** ⏳
- **Infraestructura:** Monorepo (Next.js 15 + Expo)
- **Hito Actual:** Configuración de la "Fuente de Verdad" (Bunker Genesis).

## 🎯 Roadmap Estratégico
- **FASE 1: Cimientos y Gobernanza** (Setup, Supabase, Notion Sync).
- **FASE 2: El Cerebro Animal (DUA)** (DB Inmutable, RBAC).
- **FASE 3: Design System Accesible** (WCAG 2.2 AA).
- **FASE 4: BuscoHuella PRO (Web)** (Intranet Autoridades).
- **FASE 5: App Móvil MVP** (Alertas y Comunidad).

## 📉 Backlog de Deuda Técnica
- Configurar Sentry para logs automáticos.
- Definir Smart Contracts para DUA (Blockchain).
"@
$architectContext | Out-File -FilePath "ARCHITECT_CONTEXT.md" -Encoding utf8

# 3. Generación de agents.md (Identidades de IA)
$agentsDoc = @"
# 🤖 EQUIPO DE AGENTES: BUSCOHUELLA
1. **Orquestador (CTO):** Supervisor de procesos y sincronización.
2. **Obrero (Aider/Groq):** Brazo ejecutor de código modular.
3. **QA & Accessibility Specialist:** Validador WCAG 2.2 AA y Tests.
4. **Technical Writer:** Documentador de la carpeta /docs.
"@
$agentsDoc | Out-File -FilePath "agents.md" -Encoding utf8

# 4. Generación de menu.ps1 (Sistema Operativo Local)
$menuScript = @"
do {
    Clear-Host
    Write-Host "===============================================" -ForegroundColor Yellow
    Write-Host "   🐾 BUSCOHUELLA MASTER - SISTEMA OPERATIVO   " -ForegroundColor Yellow
    Write-Host "===============================================" -ForegroundColor Yellow
    Write-Host "1. [DOCS]   Actualizar Contexto"
    Write-Host "2. [SYNC]   Sincronizar (GitHub, Notion, Drive)"
    Write-Host "3. [HEALTH] Check de Accesibilidad (WCAG)"
    Write-Host "0. [EXIT]   Salir"
    Write-Host "-----------------------------------------------"
    `$choice = Read-Host "Selecciona una acción"

    switch (`$choice) {
        "1" { Write-Host "Actualizando contexto..." -ForegroundColor Cyan }
        "2" { Write-Host "Sincronizando búnker..." -ForegroundColor Green }
        "3" { Write-Host "Ejecutando auditoría WCAG..." -ForegroundColor Magenta }
    }
    if (`$choice -ne "0") { Read-Host "Presiona Enter para continuar..." }
} while (`$choice -ne "0")
"@
$menuScript | Out-File -FilePath "menu.ps1" -Encoding utf8

Write-Host "✅ Protocolo Génesis completado. El búnker BuscoHuella está listo para operar." -ForegroundColor Green
Write-Host "👉 Siguiente paso: Ejecuta '.\menu.ps1' para iniciar el mando." -ForegroundColor Yellow