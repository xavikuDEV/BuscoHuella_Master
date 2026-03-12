function Show-Menu {
    $currentBranch = git rev-parse --abbrev-ref HEAD
    $lastCommit = git log -1 --format="%s"
    
    Clear-Host
    Write-Host "╔══════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║              🐾 BUSCOHUELLA 2026 — CENTRO DE CONTROL                 ║" -ForegroundColor Cyan
    Write-Host "║   RAMA: $currentBranch | ÚLTIMO COMMIT: $lastCommit" -ForegroundColor Gray
    Write-Host "╠══════════════════════════════════════════════════════════════════════╣" -ForegroundColor Cyan
    Write-Host "║ 🏗️  [DESARROLLO]                                                      ║" -ForegroundColor Yellow
    Write-Host "║    1. 🌐 Portal Web (pnpm dev)      2. 📱 App Móvil (Expo start)     ║"
    Write-Host "║    3. 🧹 Limpiar Búnker (Caché)     4. 🧪 Tests de Conexión          ║"
    Write-Host "║                                                                      ║"
    Write-Host "║ 🧠 [AGENTES & DOCS]                                                  ║" -ForegroundColor Blue
    Write-Host "║    5. 🤖 Invocar Specialist (Aider) 6. 🌳 Actualizar Structure & Context║"
    Write-Host "║    7. 📝 Crear Tarea en Roadmap     8. 🔍 Health Check & Snyk Scan   ║"
    Write-Host "║                                                                      ║"
    Write-Host "║ 🚀 [OPERACIONES NUBE]                                                ║" -ForegroundColor Green
    Write-Host "║    9. 🚀 PUSH SEMÁNTICO (Git)       10. 🔄 RITUAL DE SYNC TOTAL      ║" -ForegroundColor Magenta
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
            Write-Host "🧹 Eliminando residuos de compilación..." -ForegroundColor Red
            Remove-Item -Recurve -Force **/node_modules, **/.next, **/.expo, **/dist -ErrorAction SilentlyContinue
            pnpm install
            pause 
        }
        "4" { node tests/test-connections.mjs; pause }
        "5" { 
            $msg = Read-Host "🤖 Orden para el Specialist"
            aider --model groq/llama-3.3-70b-versatile --env-file .env.local --message "$msg"
            pause
        }
        "6" { 
            Write-Host "🌳 Sincronizando mapas locales..." -ForegroundColor Cyan
            . "scripts/update-structure.ps1"
            . "scripts/generate-context.ps1"
            pause 
        }
        "7" {
            $taskName = Read-Host "📋 Nombre de la nueva tarea"
            node scripts/create-task.mjs "$taskName" # Necesitaremos este script
            pause
        }
        "8" {
            Write-Host "🏥 Iniciando Auditoría..." -ForegroundColor Yellow
            . "scripts/check_bunker_health.ps1"
            Write-Host "🛡️ Escaneando vulnerabilidades con Snyk..." -ForegroundColor Red
            snyk test --all-projects
            pause
        }
        "9" {
            $commitMsg = Read-Host "📝 Mensaje del Commit (feat/fix/docs...)"
            git add .
            git commit -m "$commitMsg"
            git push
            Write-Host "✅ Sincronizado con GitHub." -ForegroundColor Green
            pause
        }
        "10" {
            Write-Host "🔄 INICIANDO RITUAL DE SINCRONIZACIÓN TOTAL..." -ForegroundColor Magenta
            Write-Host "1/3 Actualizando Documentación..."
            . "scripts/update-structure.ps1"
            . "scripts/generate-context.ps1"
            
            Write-Host "2/3 Subiendo Log a Notion..."
            $logData = @{
                nombre = "Ritual de Sync Total"
                agente = "Orquestador"
                categoria = "Infra"
                descripcion = "Ejecución de mantenimiento programado: Estructura, Contexto y Drive."
                status = "Éxito ✅"
            } | ConvertTo-Json -Compress
            node scripts/log-task.mjs "'$logData'"
            
            Write-Host "3/3 Sincronizando con Google Drive..."
            python scripts/sync_drive.py
            
            Write-Host "✨ RITUAL COMPLETADO. BÚNKER AL 100% ✨" -ForegroundColor Green
            pause
        }
        "0" { $exitMenu = $true }
        default { Write-Host "⚠️ Frecuencia no reconocida." -ForegroundColor Yellow; Start-Sleep -Seconds 1 }
    }
} while (-not $exitMenu)