$contextFile = "ARCHITECT_CONTEXT.md"
$date = Get-Date -Format "dd/MM/yyyy HH:mm"

$template = @"
# 🏗️ ARCHITECT CONTEXT: BuscoHuella Master
> Última actualización: $date

## 📍 Estado Actual
- **Fase:** Q1 (Cimientos)
- **Salud:** Blindado 🛡️
- **Siguiente Paso:** Modelado Supabase

## 🤖 Equipo Activo
$(Get-Content agents/profiles.md)

## 📁 Estructura del Proyecto
$(pnpm list -r --depth -1)
"@

$template | Out-File -FilePath $contextFile -Encoding utf8
Write-Host "✅ ARCHITECT_CONTEXT.md actualizado con éxito." -ForegroundColor Green