# 🐾 PROTOCOLO GÉNESIS: BUSCOHUELLA BUNKER 2.1 (Multi-Tenant Edition)
# Objetivo: Gestión total de infraestructura, guardado de progreso y gobernanza.

$ErrorActionPreference = "Stop"
Write-Host "🚀 [BUSCOHUELLA] Iniciando Protocolo Génesis V2.1..." -ForegroundColor Cyan

# --- 1. VERIFICACIÓN DE IDENTIDAD Y ENTORNO ---
Write-Host "🔍 Verificando integridad del entorno..." -ForegroundColor Yellow

$folders = @(
    "apps/web-pro",
    "apps/mobile-app",
    "packages/shared-core",
    "packages/shared-ui",
    "packages/shared-config",
    "packages/mcp-geo-server",
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
        Write-Host "  [+] Estructura creada: $folder" -ForegroundColor Green
    }
}

# --- 2. PROTOCOLO DE SELLADO (GIT SAVEPOINT) ---
Write-Host "🛡️ Ejecutando Protocolo de Sellado de Cimientos..." -ForegroundColor Cyan
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "📦 Cambios detectados. Sellando versión actual..." -ForegroundColor Yellow
    git add .
    git commit -m "Genesis Savepoint: Estructura Multi-tenant, Shared Core conectado y Dashboard Base Operativo"
    Write-Host "✅ Cimientos sellados en Git." -ForegroundColor Green
}
else {
    Write-Host "✨ El búnker ya está sincronizado." -ForegroundColor Gray
}

# --- 3. ACTUALIZACIÓN DE INTELIGENCIA (ARCHITECT_CONTEXT.md) ---
$architectContext = @"
# 🏗️ ARCHITECT CONTEXT: BuscoHuella Ecosystem
> Última actualización: $(Get-Date -Format "dd/MM/yyyy HH:mm:ss")

## 📍 Estado Actual: FASE 3 (Conectividad y Auth) 🛰️
- **Infraestructura:** Monorepo pnpm (Next.js 16 + Expo).
- **Core:** Shared-core con Supabase Client universal.
- **DB:** Esquema sellado (animals, incidences, profiles) con RLS.
- **Dashboard:** Command Center Pro funcional con telemetría real.

## 🎯 Estrategia Multi-Inquilino (Sabadell / Terrassa / ...)
- **Aislamiento:** Filtrado por `municipality_id` vía RLS.
- **RBAC:** Roles dinámicos (police, vet, pro, citizen, admin).
- **Web-App:** buscohuella.app para acceso público rápido (Found & Scan).

## 📉 Backlog Inmediato
- [ ] Implementar Middleware de redirección por Rol.
- [ ] Pantalla de Login / Registro con validación de perfil.
- [ ] Mapeo de Geo-Zonas para nuevos ayuntamientos.
"@
$architectContext | Out-File -FilePath "ARCHITECT_CONTEXT.md" -Encoding utf8

# --- 4. ACTUALIZACIÓN DEL SISTEMA OPERATIVO LOCAL (menu.ps1) ---
$menuScript = @"
do {
    Clear-Host
    Write-Host "===============================================" -ForegroundColor Yellow
    Write-Host "   🐾 BUSCOHUELLA MASTER OS - 2026 🛰️          " -ForegroundColor Yellow
    Write-Host "   Arquitectura Multi-Rol & Multi-Ciudad       " -ForegroundColor Yellow
    Write-Host "===============================================" -ForegroundColor Yellow
    Write-Host "1. [DEV]   Lanzar Web Pro (Dashboard Admin)"
    Write-Host "2. [DEV]   Lanzar Mobile App (Expo)"
    Write-Host "3. [CORE]  Recompilar Shared-Core (Build)"
    Write-Host "4. [SYNC]  Sincronizar Búnker (Genesis Savepoint)"
    Write-Host "5. [DB]    Abrir Panel Supabase"
    Write-Host "0. [EXIT]  Cerrar Consola"
    Write-Host "-----------------------------------------------"
    `$choice = Read-Host "Selecciona operación de búnker"

    switch (`$choice) {
        "1" { pnpm --filter @buscohuella/web dev }
        "2" { pnpm --filter @buscohuella/mobile start }
        "3" { pnpm --filter @buscohuella/shared build }
        "4" { .\scripts\genesis_bunker.ps1 }
        "5" { Start-Process "https://supabase.com/dashboard" }
    }
    if (`$choice -ne "0") { Read-Host "Presiona Enter para volver al búnker..." }
} while (`$choice -ne "0")
"@
$menuScript | Out-File -FilePath "menu.ps1" -Encoding utf8

Write-Host "✅ Búnker BuscoHuella Actualizado y Operativo." -ForegroundColor Green
Write-Host "👉 Ejecuta '.\menu.ps1' para tomar el mando." -ForegroundColor Yellow