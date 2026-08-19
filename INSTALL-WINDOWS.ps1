$ErrorActionPreference = 'Stop'
$Source = Split-Path -Parent $MyInvocation.MyCommand.Path
$Target = 'C:\WinsWi-5.1.2'
$Current = 'C:\WinsWi'
$Stamp = Get-Date -Format 'yyyyMMdd-HHmmss'

Write-Host '=== WinsWi 5.1.2 - preparation Windows ===' -ForegroundColor Cyan

$node = node -v
$npm = npm -v
Write-Host "Node: $node"
Write-Host "npm : $npm"
if (-not ($node -match '^v22\.')) { throw "Node 22.x est requis. Version détectée: $node" }
if (-not ($npm -match '^10\.')) { throw "npm 10.x est requis. Version détectée: $npm" }

if (Test-Path $Target) {
  throw "Le dossier cible existe déjà: $Target. Supprime-le ou choisis un autre dossier avant de relancer."
}

if (Test-Path $Current) {
  $Backup = "C:\WinsWi-backup-$Stamp"
  Write-Host "Sauvegarde de $Current vers $Backup ..." -ForegroundColor Yellow
  Copy-Item $Current $Backup -Recurse -Force
  Write-Host "Sauvegarde créée: $Backup" -ForegroundColor Green
}

Write-Host "Copie de la release vers $Target ..."
New-Item -ItemType Directory -Path $Target | Out-Null
robocopy $Source $Target /E /XD node_modules .next .git /XF package-lock.json *.log | Out-Null
if ($LASTEXITCODE -gt 7) { throw "Echec de la copie (robocopy code $LASTEXITCODE)." }
Set-Location $Target

Write-Host 'Installation des dépendances npm...' -ForegroundColor Cyan
npm install --no-audit --no-fund --no-package-lock

Write-Host 'Validation complète...' -ForegroundColor Cyan
npm run diagnose

Write-Host ''
Write-Host '=== SUCCES ===' -ForegroundColor Green
Write-Host "Projet validé: $Target"
Write-Host 'Le dossier C:\WinsWi original a été conservé intact.'
Write-Host 'Si la validation est verte, le dossier cible peut devenir la nouvelle base de travail.'
