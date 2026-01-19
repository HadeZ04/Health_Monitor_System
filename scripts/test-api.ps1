# Script test nhanh cho Windows PowerShell
# Chạy: .\test-api.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TEST HỆ THỐNG AI CHAT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Inference Server Health
Write-Host "[1/4] Testing Inference Server Health..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/health" -Method GET -ErrorAction Stop
    Write-Host "✅ Inference Server: OK" -ForegroundColor Green
    Write-Host "   Status: $($response.status)" -ForegroundColor Gray
    Write-Host "   Model: $($response.model_id)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Inference Server: FAILED" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
    Write-Host "   → Đảm bảo inference server đang chạy: cd inference_server && python -m src.api" -ForegroundColor Yellow
}
Write-Host ""

# Test 2: Backend Health
Write-Host "[2/4] Testing Backend Health..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:4000/chat/health" -Method GET -ErrorAction Stop
    Write-Host "✅ Backend: OK" -ForegroundColor Green
    Write-Host "   Status: $($response.status)" -ForegroundColor Gray
    Write-Host "   Model: $($response.model_id)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Backend: FAILED" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
    Write-Host "   → Đảm bảo backend đang chạy: cd backend && npm run dev" -ForegroundColor Yellow
}
Write-Host ""

# Test 3: Login
Write-Host "[3/4] Testing Login..." -ForegroundColor Yellow
$token = $null
try {
    $loginBody = @{
        email = "admin@techxen.org"
        password = "admin123"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "http://localhost:4000/auth/login" -Method POST -Body $loginBody -ContentType "application/json" -ErrorAction Stop
    $token = $response.token
    Write-Host "✅ Login: OK" -ForegroundColor Green
    Write-Host "   User: $($response.user.email)" -ForegroundColor Gray
    Write-Host "   Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "❌ Login: FAILED" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
    Write-Host "   → Kiểm tra backend và credentials" -ForegroundColor Yellow
}
Write-Host ""

# Test 4: Chat API
Write-Host "[4/4] Testing Chat API..." -ForegroundColor Yellow
if ($token) {
    try {
        $chatBody = @{
            question = "Bác sĩ ơi, tôi hay đau ngực khi leo cầu thang?"
            session_id = "test-session"
        } | ConvertTo-Json

        $headers = @{
            Authorization = "Bearer $token"
            "Content-Type" = "application/json"
        }

        $response = Invoke-RestMethod -Uri "http://localhost:4000/chat/ask" -Method POST -Headers $headers -Body $chatBody -ErrorAction Stop
        Write-Host "✅ Chat API: OK" -ForegroundColor Green
        Write-Host "   Reply: $($response.reply.Substring(0, [Math]::Min(100, $response.reply.Length)))..." -ForegroundColor Gray
        Write-Host "   Confidence: $($response.confidence)" -ForegroundColor Gray
        Write-Host "   Citations: $($response.citations.Count)" -ForegroundColor Gray
    } catch {
        Write-Host "❌ Chat API: FAILED" -ForegroundColor Red
        Write-Host "   Error: $_" -ForegroundColor Red
        Write-Host "   → Kiểm tra inference server và backend connection" -ForegroundColor Yellow
    }
} else {
    Write-Host "⏭️  Chat API: SKIPPED (cần token từ login)" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TEST HOÀN TẤT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Tip: Mở trình duyệt và vào http://localhost:3000/dashboard/ai-chat để test giao diện" -ForegroundColor Cyan

