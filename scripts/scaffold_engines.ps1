# BuscoHuella Ecosystem - Scaffolding Script v1.0
# Propósito: Inyectar motores Next.js, Expo y Core Logic

Write-Host "🏗️  INICIANDO SCAFFOLDING TÉCNICO - BUSCOHUELLA" -ForegroundColor Cyan
Write-Host "----------------------------------------------------"

# 1. Crear pnpm-workspace.yaml en la raíz
$workspaceContent = @"
packages:
  - 'apps/*'
  - 'packages/*'
"@
$workspaceContent | Out-File -FilePath "pnpm-workspace.yaml" -Encoding utf8
Write-Host "✅ [ROOT] pnpm-workspace.yaml creado." -ForegroundColor Green

# 2. Configurar Shared Core (@buscohuella/shared)
Write-Host "📦 Configurando @buscohuella/shared-core..." -ForegroundColor Cyan
Set-Location "packages/shared-core"
$sharedPackageJson = @"
{
  "name": "@buscohuella/shared",
  "version": "0.1.0",
  "main": "./index.ts",
  "types": "./index.ts",
  "license": "MIT",
  "scripts": {
    "test": "vitest"
  }
}
"@
$sharedPackageJson | Out-File -FilePath "package.json" -Encoding utf8
"export const DUA_VERSION = '1.0.0';`nexport const SYSTEM_NAME = 'BuscoHuella';" | Out-File -FilePath "index.ts" -Encoding utf8
Set-Location "../../"

# 3. Preparar directorios de Apps
Write-Host "`n🚀 EL SISTEMA ESTÁ LISTO PARA EL DESPLIEGUE DE LAS APPS." -ForegroundColor Yellow
Write-Host "A continuación, ejecuta estos comandos manualmente para asegurar la interactividad correcta:" -ForegroundColor White