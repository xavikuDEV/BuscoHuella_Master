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
    $choice = Read-Host "Selecciona operación de búnker"

    switch ($choice) {
        "1" { pnpm --filter @buscohuella/web dev }
        "2" { pnpm --filter @buscohuella/mobile start }
        "3" { pnpm --filter @buscohuella/shared build }
        "4" { .\scripts\genesis_bunker.ps1 }
        "5" { Start-Process "https://supabase.com/dashboard" }
    }
    if ($choice -ne "0") { Read-Host "Presiona Enter para volver al búnker..." }
} while ($choice -ne "0")
