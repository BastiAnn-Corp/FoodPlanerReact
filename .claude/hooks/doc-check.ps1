# Runs at the end of each Claude session.
# Warns if source files were modified but docs/ was not touched.

$srcChanged = git status --porcelain 2>$null |
    Where-Object { $_ -match '^\s*[MAD?]\s+src/' }

$docsChanged = git status --porcelain 2>$null |
    Where-Object { $_ -match '^\s*[MAD?]\s+docs/' }

if ($srcChanged -and -not $docsChanged) {
    Write-Host ""
    Write-Host "doc-check: src/ has uncommitted changes but docs/ does not." -ForegroundColor Yellow
    Write-Host "           If this session implemented or changed a feature, update its use case doc." -ForegroundColor Yellow
    Write-Host ""
}
