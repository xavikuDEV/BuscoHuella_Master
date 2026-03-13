[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
# 📦 BuscoHuella Push Protocol
param([string]$message = "update: mejoras en el búnker")

Write-Host "🧹 Limpiando caché y formateando..." -ForegroundColor Cyan
pnpm run lint --fix

Write-Host "💾 Preparando commit..." -ForegroundColor Yellow
git add .
git commit -m $message

Write-Host "🚀 Subiendo al búnker (GitHub)..." -ForegroundColor Magenta
git push

Write-Host "🏁 ¡Sincron