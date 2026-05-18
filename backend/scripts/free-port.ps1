param(
  [int]$Port = 0
)

if ($Port -le 0) {
  $envPath = Join-Path $PSScriptRoot "..\.env"

  if (Test-Path $envPath) {
    $portLine = Get-Content $envPath | Where-Object { $_ -match "^\s*PORT\s*=" } | Select-Object -First 1

    if ($portLine) {
      $portValue = ($portLine -split "=", 2)[1].Trim()
      [void][int]::TryParse($portValue, [ref]$Port)
    }
  }
}

if ($Port -le 0) {
  Write-Host "No PORT configured; skipping port cleanup"
  exit 0
}

$connections = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
$processIds = $connections | Select-Object -ExpandProperty OwningProcess -Unique

foreach ($processId in $processIds) {
  if ($processId -and $processId -ne $PID) {
    Stop-Process -Id $processId -Force
    Write-Host "Freed port $Port by stopping process $processId"
  }
}
