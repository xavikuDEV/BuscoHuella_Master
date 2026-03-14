# ==============================================
# 🐾 BUSCOHUELLA 2026 — RITUAL DE SINCRONIZACIÓN TOTAL
# ==============================================
$OutputEncoding = [System.Text.Encoding]::UTF8
Write-Host "🚀 INICIANDO SINCRONIZACIÓN TOTAL BUSCOHUELLA" -ForegroundColor Cyan

# --- CONFIGURACIÓN DE CONTEXTO (Cambiar según la tarea) ---
$agent = "Orquestador"                # Quién lo hace
$category = "Infra"                      # Categoría: Infra, Backend, Frontend, UI/UX
$phase = "Fase 2: El Despertar del DUA 🧬🛡️" # Fase actual exacta en Notion
$hito = "Infra-Génesis"              # Nombre del hito
# ---------------------------------------------------------

# 1. Documentación
Write-Host "`n📝 [1/4] Actualizando Structure y Context..." -ForegroundColor Gray
.\scripts\update-structure.ps1
.\scripts\generate-context.ps1

# 2. Tests
Write-Host "`n🧪 [2/4] Ejecutando Tests..." -ForegroundColor Yellow
pnpm test
if ($LASTEXITCODE -ne 0) { 
    Write-Host "❌ Tests fallidos. Abortando ritual por seguridad." -ForegroundColor Red
    exit 1 
}

# 3. Git (Commit y Push)
Write-Host "`n📦 [3/4] Asegurando cambios en GitHub..." -ForegroundColor Magenta
$msg = Read-Host "📝 Mensaje del commit (ej: fix: corregir bugs)"
if (-not $msg) { $msg = "sync: actualización de mantenimiento" }

git add .
git commit -m $msg
$hash = git rev-parse --short HEAD
git pull --rebase origin main
git push origin main

# 4. Notion (Sincronía Luxury Dinámica)
Write-Host "`n📓 [4/4] Sincronizando con Notion..." -ForegroundColor Blue

# Actualizar Roadmap (Busca la fase y pone el estado)
node .\scripts\notion-update.mjs "$phase" "roadmap" "En progreso" "" "" "" "$agent" "" "$phase"

# Registrar en Bitácora (Pasa todos los campos dinámicos)
$description = "Commit: $msg | Hash: $hash | Ejecutado desde el Centro de Control."
node .\scripts\notion-update.mjs "Hito: $msg" "bitacora" "Listo" "$hash" "$description" "$hito" "$agent" "$category" "$phase"

Write-Host "`n✨ RITUAL COMPLETADO CON ÉXITO ✨" -ForegroundColor Green
Write-Host "🔗 Hash: $hash | 📅 $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Gray