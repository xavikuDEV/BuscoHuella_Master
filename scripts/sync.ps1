# ==============================================
# 🐾 BUSCOHUELLA 2026 — RITUAL DE SINCRONIZACIÓN TOTAL v2.4.1
# ==============================================
$OutputEncoding = [System.Text.Encoding]::UTF8
Write-Host "🚀 INICIANDO SINCRONIZACIÓN TOTAL BUSCOHUELLA" -ForegroundColor Cyan

# --- CONFIGURACIÓN DE CONTEXTO ---
$agent = "Aider / Specialist"
$category = "Web/Frontend"
$phase = "Fase 2.4: Admin Dashboard 📊" 
$hito = "Génesis del Panel de Mando"
$ambiente = "Local (Búnker Master)"
# ---------------------------------------------------------

Write-Host "`n📝 [1/5] Actualizando Documentación..." -ForegroundColor Gray
.\scripts\update-structure.ps1
.\scripts\generate-context.ps1

Write-Host "`n🧪 [2/5] Ejecutando Tests..." -ForegroundColor Yellow
pnpm test

Write-Host "`n📦 [3/5] Asegurando cambios en GitHub..." -ForegroundColor Magenta
$msg = Read-Host "📝 Mensaje del commit"
if (-not $msg) { $msg = "sync: actualización de mantenimiento" }

git add .
git commit -m $msg
$currentHash = git rev-parse --short HEAD
git pull --rebase origin main
git push origin main

Write-Host "`n📓 [4/5] Sincronizando con Notion..." -ForegroundColor Blue

# Actualizar Roadmap
node .\scripts\notion-update.mjs "$phase" "roadmap" "En progreso" "" "" "" "$agent" "" "$phase" ""

# Registrar en Bitácora (Limpiamos la descripción de caracteres conflictivos para la shell)
$description = "Despliegue del Admin Dashboard con Tailwind 4. Ruta protegida por RBAC y conteo de mascotas real desde Supabase."
node .\scripts\notion-update.mjs "Hito: $msg" "bitacora" "Éxito ✅" "$currentHash" "$description" "$hito" "$agent" "$category" "$phase" "$ambiente"

Write-Host "`n🛡️ [5/5] Verificando Pureza..." -ForegroundColor Cyan
git status --short
Write-Host "`n✨ RITUAL COMPLETADO CON ÉXITO ✨" -ForegroundColor Green
Write-Host "🔗 Hash: $currentHash | 📅 $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Gray