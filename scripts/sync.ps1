Write-Host "🚀 INICIANDO SINCRONIZACIÓN TOTAL BUSCOHUELLA" -ForegroundColor Cyan

# 1. Documentación
Write-Host "📝 Actualizando Structure y Context..."
.\scripts\update-structure.ps1
.\scripts\generate-context.ps1

# 2. Tests
Write-Host "🧪 Ejecutando Tests..." -ForegroundColor Yellow
npm test
if ($LASTEXITCODE -ne 0) { Write-Host "❌ Tests fallidos. Abortando." -ForegroundColor Red; exit 1 }

# 3. Git
$msg = Read-Host "📝 Mensaje del commit"
git add .
git commit -m $msg
$hash = git rev-parse --short HEAD
git pull --rebase origin main
git push origin main

# 4. Notion (Actualizar Roadmap a 'En progreso' y loguear en Bitácora)
Write-Host "📓 Sincronizando con Notion..." -ForegroundColor Magenta
node .\scripts\notion-update.mjs "Fase 2 — El Despertar del DUA" "roadmap" "En progreso"
node .\scripts\notion-update.mjs "Hito: $msg" "bitacora" "Listo" "$hash"

Write-Host "✅ TODO OK. Commit: $hash" -ForegroundColor Green