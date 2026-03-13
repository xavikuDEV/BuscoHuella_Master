# 🛠️ Forzar el Búnker a hablar en 2026 (UTF-8 Total)
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding = [System.Text.Encoding]::UTF8
chcp 65001 | Out-Null
# 📦 BuscoHuella Push Protocol
param([string]$message = "update: mejoras en el búnker")

Write-Host "🧹 Limpiando caché y formateando..." -ForegroundColor Cyan
pnpm run lint --fix

Write-Host "💾 Preparando commit..." -ForegroundColor Yellow
git add .
git commit -m $message

Write-Host "🚀 Subiendo al búnker (GitHub)..." -ForegroundColor Magenta
git push

Write-Host "🏁 ¡Sincronización completada!" -ForegroundColor Green