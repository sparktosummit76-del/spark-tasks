# run-digest.ps1 – run the Weekly Digest from Windows Task Scheduler.

# Work from the project folder (the folder above tools\).
$project = Split-Path -Parent $PSScriptRoot
Set-Location -Path $project

# If a fresh export is in Downloads, copy it into the project.
$export = Join-Path $HOME 'Downloads\tasks-export.json'
if (Test-Path $export) { Copy-Item $export 'data\tasks-export.json' -Force }

# Build the digest from the exported tasks.
npm run digest -- data\tasks-export.json
