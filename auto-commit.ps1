$repoPath = "C:\Users\User\screen-recorder-v0.1"
$pollIntervalSec = 3
$debounceSec = 5

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "  AUTO-COMMIT RUNNING" -ForegroundColor Cyan
Write-Host "  Repo: $repoPath" -ForegroundColor Cyan
Write-Host "  Branch: main -> origin/main" -ForegroundColor Cyan
Write-Host "  Polling every $pollIntervalSec seconds" -ForegroundColor Cyan
Write-Host "  Press Ctrl+C to stop." -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan

$lastCommit = (Get-Date).AddSeconds(-$debounceSec)

while ($true) {
    try {
        $status = git -C $repoPath status --short 2>&1
        if (-not [string]::IsNullOrWhiteSpace($status)) {
            $now = Get-Date
            if (($now - $lastCommit).TotalSeconds -ge $debounceSec) {
                $lastCommit = $now
                Write-Host "[$($now.ToString('HH:mm:ss'))] Changes detected" -ForegroundColor Yellow
                git -C $repoPath status --short 2>&1 | ForEach-Object { Write-Host "  $_" -ForegroundColor DarkYellow }

                git -C $repoPath add -A 2>&1 | Out-Null
                $count = ($status | Measure-Object -Line).Lines
                if ($count -gt 3) { $summary = "$count files" } else { $summary = ($status -replace '\s+', ' ').Trim() }
                $msg = "auto-commit: $($summary)"
                git -C $repoPath commit -m $msg 2>&1 | Out-Null
                Write-Host "  Committed: $msg" -ForegroundColor Green
                git -C $repoPath push origin main 2>&1 | Out-Null
                Write-Host "  Pushed to origin/main" -ForegroundColor Green
            }
        }
    } catch {
        Write-Host "  Error: $_" -ForegroundColor Red
    }
    Start-Sleep -Seconds $pollIntervalSec
}
