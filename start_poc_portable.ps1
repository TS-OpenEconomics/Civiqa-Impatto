$ErrorActionPreference = "Stop"
Set-Location -LiteralPath $PSScriptRoot

$portableNode = Join-Path $PSScriptRoot ".tools\node-v24.15.0-win-x64\node.exe"
$appRoot = Join-Path $PSScriptRoot "app"

if (Test-Path -LiteralPath $portableNode) {
  Set-Location -LiteralPath $appRoot
  & $portableNode ".\serve-dist.js"
  exit $LASTEXITCODE
}

$systemNode = Get-Command node -ErrorAction SilentlyContinue
if ($null -ne $systemNode) {
  Set-Location -LiteralPath $appRoot
  & $systemNode.Source ".\serve-dist.js"
  exit $LASTEXITCODE
}

Write-Error "Node.js non trovato. Includi .tools\\node-v24.15.0-win-x64 oppure installa Node.js e assicurati che 'node' sia disponibile nel PATH."
