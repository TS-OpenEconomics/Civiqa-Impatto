param(
  [switch]$WhatIf
)

$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$escapedRepoRoot = [WildcardPattern]::Escape($repoRoot)

$processes = Get-CimInstance Win32_Process -Filter "name = 'node.exe'" |
  Where-Object {
    $_.CommandLine -and
    $_.CommandLine -like "*$escapedRepoRoot*" -and
    (
      $_.CommandLine -like "*vite*" -or
      $_.CommandLine -like "*scripts/open-app.mjs*" -or
      $_.CommandLine -like "*scripts\open-app.mjs*" -or
      $_.CommandLine -like "*--prefix app run dev*"
    )
  }

if (-not $processes) {
  Write-Host "No active Civiqa app servers found."
  exit 0
}

foreach ($process in $processes) {
  if ($WhatIf) {
    Write-Host "Would stop process $($process.ProcessId): $($process.CommandLine)"
    continue
  }

  Stop-Process -Id $process.ProcessId -Force
  Write-Host "Stopped process $($process.ProcessId)."
}
