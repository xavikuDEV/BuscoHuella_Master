function Show-Menu {
    Clear-Host
    Write-Host "==============================================" -ForegroundColor Cyan
    Write-Host "    🐾 BUSCOHUELLA 2026 - CENTRO DE MANDO" -ForegroundColor Cyan
    Write-Host "==============================================" -ForegroundColor Cyan
    Write-Host "1. 🔍 Auditoría de Salud (Health Check)"
    Write-Host "2. 🌳 Actualizar Mapa del Proyecto (Structure.md)"
    Write-Host "3. 🌐 Lanzar Portal Web (Dev Mode)"
    Write-Host "4. 📱 Lanzar App Móvil (Expo)"
    Write-Host "5. 🚀 Fase 2: Preparar Supabase (Próximamente)"
    Write-Host "6. 🧹 Limpiar Caché y Resetear TS"
    Write-Host "0. Salir"
    Write-Host "----------------------------------------------"
}

$exitMenu = $false
do {
    Show-Menu
    $choice = Read-Host "Selecciona una opción"
    switch ($choice) {
        "1" { . "scripts/check_bunker_health.ps1"; pause }
        "2" { . "scripts/update-structure.ps1"; pause }
        "3" { pnpm web:dev }
        "4" { pnpm app:start }
        "5" { Write-Host "Cargando protocolos de base de datos..." -ForegroundColor Yellow; pause }
        "6" { 
            Write-Host "Limpiando node_modules y regenerando vínculos..." -ForegroundColor Cyan
            pnpm install
            Write-Host "Hecho. Por favor, reinicia el TS Server en VS Code." -ForegroundColor Green
            pause 
        }
        "0" { $exitMenu = $true }
        default { Write-Host "Opción no válida." -ForegroundColor Red; Start-Sleep -Seconds 1 }
    }
} while (-not $exitMenu)