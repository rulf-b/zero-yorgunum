<#
Creates deploy.zip with everything cPanel needs:
- standalone/ (with node_modules/next and server.js)
- static/
- public/
- data/
- server.cjs, package.json
- .next/BUILD_ID

It also auto-fixes layout by copying from .next/standalone and .next/static if root-level folders are missing.
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Info($msg) { Write-Host "[pack] $msg" -ForegroundColor Cyan }
function Warn($msg) { Write-Warning $msg }
function Fail($msg) { Write-Host "[pack] ERROR: $msg" -ForegroundColor Red; exit 1 }

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root
Info "Working dir: $root"

$standalone = Join-Path $root 'standalone'
$static     = Join-Path $root 'static'
$public     = Join-Path $root 'public'
$data       = Join-Path $root 'data'
$serverCjs  = Join-Path $root 'server.cjs'
$pkgJson    = Join-Path $root 'package.json'
$buildId        = Join-Path (Join-Path $root '.next') 'BUILD_ID'
$nextStandalone = Join-Path (Join-Path $root '.next') 'standalone'
$nextStatic     = Join-Path (Join-Path $root '.next') 'static'

# Auto-fix: copy from .next/* if needed
if (-not (Test-Path $standalone) -and (Test-Path $nextStandalone)) {
  Info "Copying .next/standalone -> standalone (first run)"
  Copy-Item -Path $nextStandalone -Destination $standalone -Recurse -Force
}
if (-not (Test-Path $static) -and (Test-Path $nextStatic)) {
  Info "Copying .next/static -> static (first run)"
  Copy-Item -Path $nextStatic -Destination $static -Recurse -Force
}

# Basic validations
if (-not (Test-Path $standalone)) { Fail "Missing 'standalone' folder. Run 'npm run build' first." }
if (-not (Test-Path (Join-Path $standalone 'server.js'))) { Fail "Missing 'standalone/server.js'. Build may have failed." }
if (-not (Test-Path (Join-Path (Join-Path (Join-Path $standalone 'node_modules') 'next') 'package.json'))) {
  Warn "standalone/node_modules/next not found. If Windows zip trimmed long paths, rebuild or copy from .next/standalone."
  if (Test-Path (Join-Path (Join-Path (Join-Path $nextStandalone 'node_modules') 'next') 'package.json')) {
    Info "Fixing: copying next from .next/standalone/node_modules -> standalone/node_modules"
    Copy-Item -Path (Join-Path (Join-Path $nextStandalone 'node_modules') 'next') -Destination (Join-Path $standalone 'node_modules') -Recurse -Force
  }
}
if (-not (Test-Path (Join-Path (Join-Path (Join-Path $standalone 'node_modules') 'next') 'package.json'))) {
  Fail "Next package still missing under standalone/node_modules. Run 'npm ci && npm run build' and retry."
}

if (-not (Test-Path $static)) { Fail "Missing 'static' folder. Build must produce .next/static." }
if (-not (Test-Path $public)) { Warn "Missing 'public' folder (optional)" }
if (-not (Test-Path $data))   { Warn "Missing 'data' folder (optional)" }
if (-not (Test-Path $serverCjs)) { Fail "Missing 'server.cjs' in project root." }
if (-not (Test-Path $pkgJson))   { Fail "Missing 'package.json' in project root." }
if (-not (Test-Path $buildId))   { Fail "Missing '.next/BUILD_ID'. Build again." }

$zip = Join-Path $root 'deploy.zip'
if (Test-Path $zip) { Remove-Item -Force $zip }

# Use tar for robust long path handling
Info "Creating deploy.zip"
try {
  tar -a -c -f $zip 'standalone' 'static' 'public' 'data' 'server.cjs' 'package.json' '.next/BUILD_ID'
} catch {
  # Fallback to Compress-Archive if tar not available
  Compress-Archive -Path @('standalone','static','public','data','server.cjs','package.json','.next/BUILD_ID') -DestinationPath $zip -Force
}

if (-not (Test-Path $zip)) { Fail "deploy.zip not created" }

# Verify contents quickly
Add-Type -AssemblyName System.IO.Compression.FileSystem
$z = [System.IO.Compression.ZipFile]::OpenRead($zip)
$entries = $z.Entries | Select-Object -ExpandProperty FullName
$mustHave = @(
  'standalone/server.js',
  'standalone/node_modules/next/package.json',
  '.next/BUILD_ID'
)
foreach ($m in $mustHave) {
  if (-not ($entries -contains $m)) { $z.Dispose(); Fail "deploy.zip missing $m" }
}
$z.Dispose()
Info "deploy.zip is ready: $zip"
