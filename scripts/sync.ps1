# ==============================================
# 🐾 BUSCOHUELLA 2026 — RITUAL DE SINCRONIZACIÓN TOTAL
# ==============================================
$OutputEncoding = [System.Text.Encoding]::UTF8
Write-Host "🚀 INICIANDO SINCRONIZACIÓN TOTAL BUSCOHUELLA" -ForegroundColor Cyan

# --- CONFIGURACIÓN DE CONTEXTO (Modifica esto según la tarea) ---
$agent = "Aider"
$category = "Backend"
$phase = "Fase 2.2: Persistencia Segura 🛡️"
$hito = "PetRepository & RLS"
$ambiente = "Local (Búnker Master)"
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
$msg = Read-Host "📝 Mensaje del commit"
if (-not $msg) { $msg = "sync: actualización de mantenimiento" }

git add .
git commit -m $msg
$hash = git rev-parse --short HEAD
git pull --rebase origin main
git push origin main

# 4. Notion (Sincronía Luxury Dinámica)
Write-Host "`n📓 [4/4] Sincronizando con Notion..." -ForegroundColor Blue

# Actualizar Roadmap (Pasa: Título, Tipo, Status, Hash, Desc, Hito, Agente, Cat, Fase, Ambiente)
node .\scripts\notion-update.mjs "$phase" "roadmap" "En progreso" "" "" "" "$agent" "" "$phase" ""

# Registrar en Bitácora
$description = "📦 Sincronización del Búnker: `n- Mensaje: $msg `n- Hash: $hash `n- Ejecutado por el Centro de Control de BuscoHuella."
node .\scripts\notion-update.mjs "Hito: $msg" "bitacora" "Éxito ✅" "$hash" "$description" "$hito" "$agent" "$category" "$phase" "$ambiente"

Write-Host "`n✨ RITUAL COMPLETADO CON ÉXITO ✨" -ForegroundColor Green
Write-Host "🔗 Hash: $hash | 📅 $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Gray