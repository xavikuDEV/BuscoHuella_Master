# BuscoHuella Ecosystem - Environment Health Check v1.1
# Propósito: Validar que el entorno de desarrollo cumple los estándares del Búnker.

Clear-Host
Write-Host "🔍 AUDITORÍA DE SALUD DEL ENTORNO - BUSCOHUELLA" -ForegroundColor Cyan
Write-Host "----------------------------------------------------"

$requirements = @{
    "Node.js" = "20.0.0"
    "pnpm"    = "9.0.0"
    "Git"     = "2.40.0"
    "Expo"    = "0.0.0" # Solo comprobamos existencia
}

function Check-Tool {
    param ($Name, $Command, $MinVersion)
    try {
        # Ejecutamos el comando de versión
        $versionInfo = Invoke-Expression "$Command --version" 2>$null
        
        # Extraemos solo los números de versión
        if ($versionInfo -match "(\d+\.\d+\.\d+)") {
            $v = $Matches[1]
            if ([version]$v -ge [version]$MinVersion) {
                # FIX: Usamos ${Name} para que el ':' no de error
                Write-Host "✅ [OK] ${Name}: $v (Mínimo: $MinVersion)" -ForegroundColor Green
                return $true
            } else {
                Write-Host "⚠️ [ADVERTENCIA] ${Name}: $v (Se recomienda v$MinVersion+)" -ForegroundColor Yellow
                return $false
            }
        } else {
            # Si el comando responde pero no da una versión clara (común en npx expo)
            Write-Host "✅ [OK] ${Name} detectado." -ForegroundColor Green
            return $true
        }
    } catch {
        Write-Host "❌ [ERROR] ${Name} no detectado. Es obligatorio para operar." -ForegroundColor Red
        return $false
    }
}

# 1. Ejecutar Comprobaciones
$nodeStatus = Check-Tool "Node.js" "node" $requirements["Node.js"]
$pnpmStatus = Check-Tool "pnpm" "pnpm" $requirements["pnpm"]
$gitStatus  = Check-Tool "Git" "git" $requirements["Git"]
# npx expo --version puede tardar unos segundos, es normal
$expoStatus = Check-Tool "Expo CLI" "npx expo" $requirements["Expo"]

# 2. Comprobación de Entorno Móvil (Android)
Write-Host "`n📱 Comprobando capacidades nativas..." -ForegroundColor Cyan
if (Get-Command "adb" -ErrorAction SilentlyContinue) {
    Write-Host "✅ Android Debug Bridge (ADB) detectado." -ForegroundColor Green
} else {
    Write-Host "ℹ️ ADB no detectado (opcional, necesario para testear en Android físico)." -ForegroundColor Gray
}

Write-Host "----------------------------------------------------"
if ($nodeStatus -and $pnpmStatus -and $gitStatus) {
    Write-Host "🚀 EL SISTEMA ESTÁ LISTO PARA LA FASE 1.2 (SCAFFOLDING)." -ForegroundColor Green
} else {
    Write-Host "🛑 ACCIÓN REQUERIDA: Revisa los errores en rojo antes de continuar." -ForegroundColor Red
    if (-not $pnpmStatus) { Write-Host "👉 Tip: Ejecuta 'npm install -g pnpm' para instalar pnpm." -ForegroundColor Gray }
}