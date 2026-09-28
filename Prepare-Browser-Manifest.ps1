param(
    [Parameter(Mandatory)][string]$ManifestPath,
    [Parameter(Mandatory)][string]$Browser
)

$ErrorActionPreference = 'Stop'
$Manifest = Get-Content -LiteralPath $ManifestPath -Raw | ConvertFrom-Json

if ($Manifest.manifest_version -ne 3 -or
    $Manifest.background.service_worker -ne 'worker.js' -or
    -not $Manifest.background.scripts) {
    throw 'Unexpected extension manifest; stopped.'
}

if ($Browser -eq 'Firefox') {
    $Manifest.background.PSObject.Properties.Remove('service_worker')
} else {
    $Manifest.background.PSObject.Properties.Remove('scripts')
}

$Json = $Manifest | ConvertTo-Json -Depth 30
[System.IO.File]::WriteAllText(
    $ManifestPath, $Json + "`r`n",
    [System.Text.UTF8Encoding]::new($false)
)
Write-Host "Prepared $Browser manifest"
