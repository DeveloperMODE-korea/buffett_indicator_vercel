#!/usr/bin/env pwsh

# PR 자동 처리 스크립트
Write-Host "🚀 PR 자동 처리 시작..." -ForegroundColor Green

# 열린 PR 목록 가져오기
$prs = gh pr list --state open --json number,title,author --limit 10 | ConvertFrom-Json

if ($prs.Count -eq 0) {
    Write-Host "✅ 처리할 PR이 없습니다." -ForegroundColor Yellow
    exit 0
}

Write-Host "📋 발견된 PR: $($prs.Count)개" -ForegroundColor Cyan

foreach ($pr in $prs) {
    Write-Host "`n🔍 PR #$($pr.number) 처리 중: $($pr.title)" -ForegroundColor Blue
    
    # PR 상태 확인 (수정된 JSON 필드)
    $checks = gh pr checks $pr.number --json state,conclusion,name
    $checkData = $checks | ConvertFrom-Json
    
    $failedChecks = $checkData | Where-Object { $_.conclusion -eq "failure" }
    
    if ($failedChecks.Count -gt 0) {
        Write-Host "⚠️  실패한 체크가 있습니다:" -ForegroundColor Yellow
        foreach ($check in $failedChecks) {
            Write-Host "   - $($check.name): $($check.state)" -ForegroundColor Red
        }
        continue
    }
    
    # PR 승인 (자신이 만든 PR이 아닌 경우)
    if ($pr.author.login -ne "DeveloperMODE-korea") {
        Write-Host "✅ PR #$($pr.number) 승인 중..." -ForegroundColor Green
        gh pr review $pr.number --approve --body "🤖 자동 승인 - CI/CD 체크 통과"
    } else {
        Write-Host "ℹ️  자신이 만든 PR이므로 승인 건너뜀" -ForegroundColor Gray
    }
    
    # PR 머지 시도 (개선된 로직)
    Write-Host "🔄 PR #$($pr.number) 머지 시도..." -ForegroundColor Yellow
    
    # 먼저 자동 머지 시도
    $autoResult = gh pr merge $pr.number --auto --delete-branch 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ PR #$($pr.number) 자동 머지 성공!" -ForegroundColor Green
    } else {
        Write-Host "🔄 일반 머지 시도..." -ForegroundColor Yellow
        $mergeResult = gh pr merge $pr.number --merge --delete-branch 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ PR #$($pr.number) 머지 성공!" -ForegroundColor Green
        } else {
            Write-Host "❌ PR #$($pr.number) 머지 실패: $mergeResult" -ForegroundColor Red
            Write-Host "💡 수동 처리가 필요할 수 있습니다." -ForegroundColor Yellow
        }
    }
}

Write-Host "`n🎉 PR 자동 처리 완료!" -ForegroundColor Green

# 최종 상태 확인
Write-Host "`n📊 최종 PR 상태:" -ForegroundColor Cyan
gh pr list --state open --limit 5
