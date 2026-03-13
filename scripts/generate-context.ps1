# 🛠️ Forzar el Búnker a hablar en 2026 (UTF-8 Total)
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding = [System.Text.Encoding]::UTF8
chcp 65001 | Out-Null

$contextFile = "ARCHITECT_CONTEXT.md"
$date = Get-Date -Format "dd/MM/yyyy HH:mm"

# 🔍 LEER PERFILES: Forzamos UTF8 aquí también para que los iconos entren limpios
$profilesContent = Get-Content -Path "agents/profiles.md" -Raw -Encoding UTF8

$template = @"
# 🏗️ ARCHITECT CONTEXT: BuscoHuella Master
> Última actualización: $date

## 📍 Estado Actual
- **Fase:** Q1 (Cimientos)
- **Salud:** Blindado 🛡️
- **Siguiente Paso:** Modelado Supabase

## 🤖 Equipo Activo
$profilesContent

## 📁 Estructura del Proyecto
$(pnpm list -r --depth -1)
"@

# 💾 GUARDAR CON BOM: En PS 5.1, '-Encoding UTF8' es igual a 'UTF-8 con BOM'
$template | Out-File -FilePath $contextFile -Encoding UTF8 -Force

Write-Host "✅ ARCHITECT_CONTEXT.md actualizado con éxito (BOM Shield Active)." -ForegroundColor Green