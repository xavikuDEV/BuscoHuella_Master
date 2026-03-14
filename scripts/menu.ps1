# 🛠️ Forzar el Búnker a hablar en 2026 (UTF-8 Total)
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding = [System.Text.Encoding]::UTF8
chcp 65001 | Out-Null

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
    Write-Host "║          🐾 BUSCOHUELLA 2026 — CENTRO DE CONTROL v2.3                ║" -ForegroundColor Cyan
    Write-Host "║   RAMA: $($currentBranch.PadRight(10)) | COMMIT: $($lastCommit.SubString(0, [Math]::Min(25, $lastCommit.Length)).PadRight(25)) ║" -ForegroundColor Gray
    Write-Host "╠══════════════════════════════════════════════════════════════════════╣" -ForegroundColor Cyan
    Write-Host "║ 🏗️  [DESARROLLO]                                                      ║" -ForegroundColor Yellow
    Write-Host "║    1. 🌐 Portal Web (dev)          2. 📱 App Móvil (Expo)             ║"
    Write-Host "║    3. 🧹 Limpieza Profunda         4. 🧪 Fire Test (Vitest) 🚀        ║" -ForegroundColor White
    Write-Host "║                                                                      ║"
    Write-Host "║ 🧠 [INTELIGENCIA & AGENTES]                                          ║" -ForegroundColor Blue
    Write-Host "║    5. 🤖 Specialist (Aider)        6. ✍️ Technical Writer (Docs)      ║"
    Write-Host "║    7. 📋 Command Center            8. 🏥 Health Check (Nube & local) ║"
    Write-Host "║                                                                      ║"
    Write-Host "║ 🚀 [OPERACIONES NUBE]                                                ║" -ForegroundColor Green
    Write-Host "║    9. 📦 PUSH RÁPIDO               10. 🔄 RITUAL DE SYNC TOTAL 2.2    ║" -ForegroundColor Magenta
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
            git clean -fdx -e .env.local
            Write-Host "✅ Purga completada." -ForegroundColor Green
            pause 
        }
        "4" { 
            Write-Host "🧪 Ejecutando Fire Test (Vitest)..." -ForegroundColor Yellow
            pnpm test
            pause 
        }
        "5" { 
            $msg = Read-Host "🤖 Orden para el Specialist"
            aider --model groq/llama-3.3-70b-versatile --env-file .env.local --message "$msg"
            pause
        }
        "6" { 
            Write-Host "✍️ Generando Documentación Técnica..." -ForegroundColor Cyan
            .\scripts\generate-context.ps1
            .\scripts\update-structure.ps1
            pause 
        }
        "7" {
            code agents/command_center.md
            pause
        }
        "8" { 
            # Combinamos el check de herramientas con el de la nube
            powershell -File "scripts/check_bunker_health.ps1"
            node scripts/health-check.mjs
            pause 
        }
        "9" {
            $commitMsg = Read-Host "📝 Mensaje del Commit"
            git add .
            git commit -m "$commitMsg"
            git push
            pause
        }
        "10" {
            Write-Host "`n🔄 INICIANDO RITUAL DE SINCRONIZACIÓN TOTAL 2.2..." -ForegroundColor Magenta
            # Llamamos al nuevo orquestador que hace todo el flujo (Docs -> Test -> Git -> Notion)
            powershell -ExecutionPolicy Bypass -File "scripts/sync.ps1"
            pause
        }
        "0" { $exitMenu = $true }
        default { Write-Host "⚠️ Frecuencia no reconocida." -ForegroundColor Yellow; Start-Sleep -Seconds 1 }
    }
} while (-not $exitMenu)