[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
# 🔥 BuscoHuella Fire Test Suite
Write-Host "🚀 Iniciando Testeo Masivo de Seguridad..." -ForegroundColor Cyan

# 1. Tests Unitarios (Core & Logic)
Write-Host "🧪 Ejecutando Vitest (Unit Tests)..." -ForegroundColor Yellow
pnpm run test:unit

# 2. Tests E2E (Navigation & Flow)
Write-Host "🎭 Ejecutando Playwright (E2E Tests)..." -ForegroundColor Yellow
pnpm run test:e2e

Write-Host "✅ ¡Búnker estable! Todos los sistemas operativos." -ForegroundColor Green