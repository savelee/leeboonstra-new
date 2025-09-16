# Test the AI commit message functionality directly

Write-Host "🧪 Testing AI commit message generation..."

# Check if there are staged changes
$stagedFiles = git diff --cached --name-only
if (-not $stagedFiles) {
    Write-Host "❌ No staged changes found. Please stage some changes first with 'git add'"
    exit
}

Write-Host "📋 Staged files:"
$stagedFiles | ForEach-Object { Write-Host "  $_" }

Write-Host "`n🤖 Generating AI commit message with gemini-1.5-flash..."

$changes = git diff --cached --name-status | Out-String
$stats = git diff --cached --stat | Out-String
$prompt = "Analyze these git changes and suggest a concise, conventional commit message: `n$changes`n$stats`nGenerate a single line commit message following conventional commit format (type(scope): description). Output only the commit message, no explanation."

$suggestion = & gemini -m gemini-1.5-flash $prompt 2>&1

Write-Host "`n📤 Raw AI Response:"
Write-Host $suggestion

if ($suggestion -match 'ApiError|status 429|RESOURCE_EXHAUSTED|exceeded your current quota') {
    Write-Host "`n❌ AI suggestion failed due to quota limits"
} else {
    Write-Host "`n✅ AI Suggestion:"
    Write-Host "   $($suggestion.Trim())"
    Write-Host "`n💡 To use this suggestion:"
    Write-Host "   git commit -m `"$($suggestion.Trim())`""
}
