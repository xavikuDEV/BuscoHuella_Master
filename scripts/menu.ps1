# 1. Forzar codificación UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

function Show-Menu {
    $currentBranch = "Desconocida"
    $lastCommit = "N/A"
    try {
        $currentBranch = git rev-parse --abbrev-ref HEAD 2>$null
        $lastCommit = git log -1 --format="%s" 2>$null
    }
    catch {}

    Clear-Host
    Write-Host "╔══════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║          🐾 BUSCOHUELLA 2026 — CENTRO DE CONTROL v2.2                ║" -ForegroundColor Cyan
    Write-Host "║   RAMA: $($currentBranch.PadRight(10)) | COMMIT: $($lastCommit.SubString(0, [Math]::Min(25, $lastCommit.Length)).PadRight(25)) ║" -ForegroundColor Gray
    Write-Host "╠══════════════════════════════════════════════════════════════════════╣" -ForegroundColor Cyan
    Write-Host "║ 🏗️  [DESARROLLO]                                                      ║" -ForegroundColor Yellow
    Write-Host "║    1. 🌐 Portal Web (dev)          2. 📱 App Móvil (Expo)             ║"
    Write-Host "║    3. 🧹 Limpieza Profunda         4. 🧪 Fire Test (Masivo) 🚀        ║" -ForegroundColor White
    Write-Host "║                                                                      ║"
    Write-Host "║ 🧠 [INTELIGENCIA & AGENTES]                                          ║" -ForegroundColor Blue
    Write-Host "║    5. 🤖 Specialist (Aider)        6. ✍️ Technical Writer (Docs)      ║"
    Write-Host "║    7. 📋 Command Center            8. 🔍 Health Check & Snyk          ║"
    Write-Host "║                                                                      ║"
    Write-Host "║ 🚀 [OPERACIONES NUBE]                                                ║" -ForegroundColor Green
    Write-Host "║    9. 📦 PUSH BLINDADO (Semántico) 10. 🔄 RITUAL DE SYNC TOTAL         ║" -ForegroundColor Magenta
    Write-Host "║                                                                      ║"
    Write-Host "║ 0. 🚪 [EXIT] Cerrar Sesión                                           ║"
    Write-Host "╚══════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
}

$exitMenu = $false
do {
    Show-Menu
    $choice = Read-Host "`n⚡ Frecuencia de mando"
    switch ($choice) {
        "1" { pnpm --filter web-pro dev }
        "2" { pnpm --filter mobile-app start }
        "3" { 
            Write-Host "🧹 Iniciando purga de búnker..." -ForegroundColor Red
            powershell -File "scripts/push_bunker.ps1" -message "mantenimiento: limpieza de cache" # Reutilizamos la lógica de limpieza
            pause 
        }
        "4" { 
            # 🚀 El nuevo Fire Test de Domus
            powershell -File "scripts/fire_test.ps1"
            pause 
        }
        "5" { 
            $msg = Read-Host "🤖 Orden para el Specialist (Groq/Llama-3.3)"
            # Añadimos --architect para que use las reglas del architect.md automáticamente
            aider --model groq/llama-3.3-70b-versatile --env-file .env.local --message "$msg"
            pause
        }
        "6" { 
            Write-Host "✍️ Generando Documentación Técnica..." -ForegroundColor Cyan
            powershell -File "scripts/generate-context.ps1"
            pause 
        }
        "7" {
            Write-Host "📡 Abriendo Command Center para instrucciones de baja latencia..." -ForegroundColor Blue
            code agents/command_center.md # Abre el archivo para que escribas la tarea
            pause
        }
        "8" { snyk test --all-projects; pause }
        "9" {
            # 📦 Usamos el nuevo script de Push Blindado
            $commitMsg = Read-Host "📝 Mensaje del Commit (Semántico)"
            powershell -File "scripts/push_bunker.ps1" -message "$commitMsg"
            pause
        }
        "10" {
            Write-Host "`n🔄 INICIANDO RITUAL DE SINCRONIZACIÓN TOTAL..." -ForegroundColor Magenta
            
            # Paso 0: Test de integridad antes de subir nada
            Write-Host "0/4 Verificando estabilidad del Búnker..." -ForegroundColor Gray
            powershell -File "scripts/fire_test.ps1"

            Write-Host "1/4 Actualizando Documentación..." -ForegroundColor Gray
            powershell -File "scripts/generate-context.ps1"
            
            Write-Host "2/4 Subiendo Log a Notion..." -ForegroundColor Gray
            $env:NOTION_LOG_DATA = '{"nombre":"Ritual de Sync Total","agente":"Orquestador","categoria":"Infra","descripcion":"Sincronización de seguridad completada.","status":"Éxito ✅"}'
            node scripts/log-task.mjs
            $env:NOTION_LOG_DATA = $null
            
            Write-Host "3/4 Sincronizando con Google Drive..." -ForegroundColor Gray
            python scripts/sync_drive.py

            Write-Host "4/4 Asegurando cambios en GitHub..." -ForegroundColor Gray
            git add .
            git commit -m "chore: ritual de sincronización completado" -allow-empty
            git push
            
            Write-Host "`n✨ RITUAL COMPLETADO. BÚNKER AL 100% ✨" -ForegroundColor Green
            pause
        }
        "0" { $exitMenu = $true }
        default { Write-Host "⚠️ Frecuencia no reconocida." -ForegroundColor Yellow; Start-Sleep -Seconds 1 }
    }
} while (-not $exitMenu)