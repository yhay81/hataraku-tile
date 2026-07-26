[CmdletBinding()]
param(
    [switch]$Local
)

$ErrorActionPreference = "Stop"
$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$SqlPath = Join-Path $PSScriptRoot "product-metrics.sql"
$Wrangler = Join-Path $RepoRoot "node_modules\.bin\wrangler.cmd"
$Target = if ($Local) { "--local" } else { "--remote" }
$Sql = (Get-Content $SqlPath) -join " "

$Output = & $Wrangler d1 execute hataraku-tile $Target --json --command $Sql
if ($LASTEXITCODE -ne 0) {
    throw "D1 metrics query failed with exit code $LASTEXITCODE"
}

$Payload = ($Output -join [Environment]::NewLine) | ConvertFrom-Json
$Row = $Payload[0].results[0]
if (-not $Row) {
    throw "D1 metrics query returned no result"
}

function Get-Percent {
    param(
        [int]$Numerator,
        [int]$Denominator
    )

    if ($Denominator -eq 0) { return 0.0 }
    return [Math]::Round(($Numerator / $Denominator) * 100, 1)
}

$Users = [int]$Row.users
$ShiftAdded = [int]$Row.shift_added
$MonthReady = [int]$Row.month_ready

[ordered]@{
    generated_at = (Get-Date).ToUniversalTime().ToString("o")
    service = "hataraku-tile"
    environment = if ($Local) { "local" } else { "production" }
    funnel = [ordered]@{
        users = $Users
        workplace_added = [int]$Row.workplace_added
        shift_added = $ShiftAdded
        month_ready = $MonthReady
        exported = [int]$Row.exported
        returned = [int]$Row.returned
        users_7d = [int]$Row.users_7d
        month_ready_7d = [int]$Row.month_ready_7d
    }
    rates = [ordered]@{
        shift_add_percent = Get-Percent $ShiftAdded $Users
        month_ready_percent = Get-Percent $MonthReady $ShiftAdded
        export_percent = Get-Percent ([int]$Row.exported) $MonthReady
        return_percent = Get-Percent ([int]$Row.returned) $ShiftAdded
    }
} | ConvertTo-Json -Depth 4
