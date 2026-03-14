# ==============================================
# 🐾 BUSCOHUELLA 2026 — RITUAL DE SINCRONIZACIÓN TOTAL v2.3.0
# ==============================================
$OutputEncoding = [System.Text.Encoding]::UTF8
Write-Host "🚀 INICIANDO SINCRONIZACIÓN TOTAL BUSCOHUELLA" -ForegroundColor Cyan

# --- CONFIGURACIÓN DE CONTEXTO (Modifica esto según la tarea) ---
$agent = "Aider / Specialist"
$category = "Infra/Fullstack"
$phase = "Fase 2.3: Conectividad Global 🌐" 
$hito = "Roles del Ecosistema 2.0 Finalizados"
$ambiente = "Local (Búnker Master)"
# ---------------------------------------------------------

# 1. Documentación
Write-Host "`n📝 [1/5] Actualizando Structure y Context..." -ForegroundColor Gray
.\scripts\update-structure.ps1
.\scripts\generate-context.ps1

# 2. Tests
Write-Host "`n🧪 [2/5] Ejecutando Tests..." -ForegroundColor Yellow
pnpm test
if ($LASTEXITCODE -ne 0) { 
    Write-Host "❌ Tests fallidos. Abortando ritual por seguridad." -ForegroundColor Red
    exit 1 
}

# 3. Git (Commit y Push)
Write-Host "`n📦 [3/5] Asegurando cambios en GitHub..." -ForegroundColor Magenta
$msg = Read-Host "📝 Mensaje del commit"
if (-not $msg) { $msg = "sync: actualización de mantenimiento" }

git add .
git commit -m $msg
if ($LASTEXITCODE -ne 0) { 
    Write-Host "⚠️ No hay cambios para commitear o error en Git." -ForegroundColor Orange
}

# CAPTURA ATÓMICA DEL HASH (Justo después del commit)
$currentHash = git rev-parse --short HEAD
Write-Host "🔗 Hash generado: $currentHash" -ForegroundColor Gray

git pull --rebase origin main
git push origin main

# 4. Notion (Sincronía Luxury Dinámica)
Write-Host "`n📓 [4/5] Sincronizando con Notion..." -ForegroundColor Blue

# Actualizar Roadmap
node .\scripts\notion-update.mjs "$phase" "roadmap" "En progreso" "" "" "" "$agent" "" "$phase" ""

# Registrar en Bitácora con Hash Real
$description = "📦 Sincronización del Búnker: `n- Mensaje: $msg `n- Ejecutado por el Centro de Control de BuscoHuella."
node .\scripts\notion-update.mjs "Hito: $msg" "bitacora" "Éxito ✅" "$currentHash" "$description" "$hito" "$agent" "$category" "$phase" "$ambiente"

# 5. Verificación de Pureza
Write-Host "`n🛡️ [5/5] Verificando estado del búnker..." -ForegroundColor Cyan
$status = git status --porcelain
if ($status) {
    Write-Host "❌ ALERTA: El búnker no está limpio después del ritual." -ForegroundColor Red
    git status
}
else {
    Write-Host "✅ BÚNKER IMPOLUTO. Nada pendiente." -ForegroundColor Green
}

Write-Host "`n✨ RITUAL COMPLETADO CON ÉXITO ✨" -ForegroundColor Green
Write-Host "🔗 Hash: $currentHash | 📅 $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Gray