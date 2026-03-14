# ==============================================
# 🐾 BUSCOHUELLA 2026 — Actualizar Structure.md
# Genera el mapa visual del Búnker Tecnológico
# ==============================================

param(
    [string]$OutputFile = "Structure.md",
    [string]$RootPath = "."
)

Write-Host "🌳 Mapeando el búnker en $OutputFile..." -ForegroundColor Cyan

# Carpetas y archivos a excluir (Ruido tecnológico)
$excludePattern = "^(node_modules|\.next|\.git|\.vscode|\.turbo|dist|out|coverage|pnpm-lock\.yaml|Structure\.md|\.env.*|\.DS_Store)$"

function Get-ProjectTree($Path, $Indent = "") {
    $items = Get-ChildItem -Path $Path | 
        Where-Object { $_.Name -notmatch $excludePattern } | 
        Sort-Object { -not $_.PSIsContainer }, Name

    for ($i = 0; $i -lt $items.Count; $i++) {
        $item = $items[$i]
        $isLast = ($i -eq $items.Count - 1)
        $connector = if ($isLast) { "└── " } else { "├── " }
        $emoji = if ($item.PSIsContainer) { "📁" } else { "📄" }
        $line = "${Indent}${connector}${emoji} $($item.Name)"
        $line | Out-File -FilePath $OutputFile -Append -Encoding utf8

        if ($item.PSIsContainer) {
            $childIndent = if ($isLast) { "${Indent}    " } else { "${Indent}│   " }
            Get-ProjectTree -Path $item.FullName -Indent $childIndent
        }
    }
}

# Estadísticas del ecosistema
$excludeDirs = @("node_modules", ".next", ".git", ".turbo", ".vscode")
$allFiles = Get-ChildItem -Path $RootPath -Recurse -File | Where-Object {
    $fullPath = $_.FullName
    $excluded = $false
    foreach ($dir in $excludeDirs) {
        if ($fullPath -match [regex]::Escape("\$dir\")) { $excluded = $true; break }
    }
    -not $excluded
}

$tsFiles  = ($allFiles | Where-Object { $_.Extension -match '^\.ts|tsx$' } | Measure-Object).Count
$cssFiles = ($allFiles | Where-Object { $_.Extension -eq '.css' } | Measure-Object).Count
$sqlFiles = ($allFiles | Where-Object { $_.Extension -eq '.sql' } | Measure-Object).Count
$yamlFiles = ($allFiles | Where-Object { $_.Extension -match '^\.yaml|yml$' } | Measure-Object).Count
$totalSrc = ($allFiles | Measure-Object).Count

# Escribir Cabecera Institucional
$header = @"
# 🐾 Estructura del Búnker: BuscoHuella 2026
> **Última actualización:** $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')
> **Métricas:** **${totalSrc}** archivos · **${tsFiles}** TypeScript · **${cssFiles}** CSS · **${sqlFiles}** SQL · **${yamlFiles}** YAML

---

"@
$header | Out-File -FilePath $OutputFile -Encoding utf8

# Generar el árbol
Get-ProjectTree -Path $RootPath

Write-Host "✅ Structure.md actualizado. Búnker documentado." -ForegroundColor Green