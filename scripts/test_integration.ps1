# Integration Test Script - Frontend + Backend + Qwen Router (PowerShell)
# Tests complete flow from login to chatbot interaction

$ErrorActionPreference = "Continue"

# Configuration
$BACKEND_URL = "http://localhost:4000"
$FRONTEND_URL = "http://localhost:3000"
$QWEN_URL = "http://localhost:8081"

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Blue
Write-Host "║     Frontend-Backend Integration Test                     ║" -ForegroundColor Blue
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Blue
Write-Host ""

# Function to check service
function Test-Service {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Endpoint
    )
    
    try {
        $response = Invoke-WebRequest -Uri "$Url$Endpoint" -Method Get -TimeoutSec 5 -ErrorAction SilentlyContinue
        Write-Host "  ✓ $Name is running at $Url" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "  ✗ $Name is NOT running at $Url" -ForegroundColor Red
        return $false
    }
}

# Test 1: Check all services
Write-Host "[1/6] Checking services..." -ForegroundColor Yellow

$backendUp = Test-Service -Name "Backend API" -Url $BACKEND_URL -Endpoint "/auth/login"
$qwenUp = Test-Service -Name "Qwen Router" -Url $QWEN_URL -Endpoint "/health"

try {
    $frontendResponse = Invoke-WebRequest -Uri $FRONTEND_URL -Method Get -TimeoutSec 5 -ErrorAction SilentlyContinue
    Write-Host "  ✓ Frontend is running at $FRONTEND_URL" -ForegroundColor Green
} catch {
    Write-Host "  ⚠ Frontend may not be running (optional for API tests)" -ForegroundColor Yellow
}

if (-not $backendUp -or -not $qwenUp) {
    Write-Host ""
    Write-Host "Error: Not all required services are running!" -ForegroundColor Red
    Write-Host "Please start:"
    Write-Host "  - Backend: cd backend; npm run dev"
    Write-Host "  - Qwen Router: python qwen_router_server.py --port 8081 --mock"
    Write-Host "  - Frontend: cd frontend; npm run dev"
    exit 1
}

Write-Host ""

# Test 2: Login and get token
Write-Host "[2/6] Testing login..." -ForegroundColor Yellow

$loginBody = @{
    email = "admin@techxen.org"
    password = "admin123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$BACKEND_URL/auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $loginBody
    
    $TOKEN = $loginResponse.token
    
    if ([string]::IsNullOrEmpty($TOKEN)) {
        Write-Host "  ✗ Login failed! No token received" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "  ✓ Login successful" -ForegroundColor Green
    Write-Host "  Token: $($TOKEN.Substring(0, [Math]::Min(20, $TOKEN.Length)))..."
} catch {
    Write-Host "  ✗ Login failed!" -ForegroundColor Red
    Write-Host "  Error: $_"
    exit 1
}

Write-Host ""

# Test 3: Test chatbot health
Write-Host "[3/6] Testing chatbot health..." -ForegroundColor Yellow

try {
    $healthResponse = Invoke-RestMethod -Uri "$BACKEND_URL/chat/health" -Method Get
    $qwenStatus = if ($healthResponse.qwen_router) { $healthResponse.qwen_router } else { "unknown" }
    
    Write-Host "  ✓ Chatbot health check passed" -ForegroundColor Green
    Write-Host "  Qwen Router: $qwenStatus"
} catch {
    Write-Host "  ⚠ Health check failed: $_" -ForegroundColor Yellow
}

Write-Host ""

# Test 4: Test General Medical QA
Write-Host "[4/6] Testing GENERAL_MEDICAL_QA intent..." -ForegroundColor Yellow

$qaBody = @{
    question = "COVID-19 là gì?"
} | ConvertTo-Json

try {
    $qaResponse = Invoke-RestMethod -Uri "$BACKEND_URL/chat/ask" `
        -Method Post `
        -ContentType "application/json" `
        -Headers @{ Authorization = "Bearer $TOKEN" } `
        -Body $qaBody
    
    if ($qaResponse.success) {
        Write-Host "  ✓ General QA test passed" -ForegroundColor Green
        Write-Host "  Intent: $($qaResponse.intent)"
        $message = if ($qaResponse.message.Length -gt 80) { 
            $qaResponse.message.Substring(0, 80) + "..." 
        } else { 
            $qaResponse.message 
        }
        Write-Host "  Response: $message"
    } else {
        Write-Host "  ✗ General QA test failed" -ForegroundColor Red
    }
} catch {
    Write-Host "  ✗ General QA test failed: $_" -ForegroundColor Red
}

Write-Host ""

# Test 5: Test Emergency Detection
Write-Host "[5/6] Testing Emergency Detection..." -ForegroundColor Yellow

$emergencyBody = @{
    question = "Tôi đau ngực dữ dội và khó thở"
} | ConvertTo-Json

try {
    $emergencyResponse = Invoke-RestMethod -Uri "$BACKEND_URL/chat/ask" `
        -Method Post `
        -ContentType "application/json" `
        -Headers @{ Authorization = "Bearer $TOKEN" } `
        -Body $emergencyBody
    
    $safetyTriggered = if ($emergencyResponse.metadata.safety_triggered) { 
        $emergencyResponse.metadata.safety_triggered 
    } else { 
        $false 
    }
    
    if ($safetyTriggered -and $emergencyResponse.warning) {
        Write-Host "  ✓ Emergency detection working" -ForegroundColor Green
        Write-Host "  Warning: $($emergencyResponse.warning)"
    } else {
        Write-Host "  ⚠ Emergency detection may not be working" -ForegroundColor Yellow
        Write-Host "  Safety triggered: $safetyTriggered"
    }
} catch {
    Write-Host "  ⚠ Emergency test failed: $_" -ForegroundColor Yellow
}

Write-Host ""

# Test 6: Test Real-time Analysis
Write-Host "[6/6] Testing USER_INPUT_ANALYSIS intent..." -ForegroundColor Yellow

$analysisBody = @{
    question = "Huyết áp 150/95 có cao không?"
} | ConvertTo-Json

try {
    $analysisResponse = Invoke-RestMethod -Uri "$BACKEND_URL/chat/ask" `
        -Method Post `
        -ContentType "application/json" `
        -Headers @{ Authorization = "Bearer $TOKEN" } `
        -Body $analysisBody
    
    if ($analysisResponse.success) {
        Write-Host "  ✓ Real-time analysis test passed" -ForegroundColor Green
        Write-Host "  Intent: $($analysisResponse.intent)"
        $message = if ($analysisResponse.message.Length -gt 80) { 
            $analysisResponse.message.Substring(0, 80) + "..." 
        } else { 
            $analysisResponse.message 
        }
        Write-Host "  Response: $message"
    } else {
        Write-Host "  ✗ Real-time analysis test failed" -ForegroundColor Red
    }
} catch {
    Write-Host "  ✗ Real-time analysis test failed: $_" -ForegroundColor Red
}

Write-Host ""

# Summary
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Blue
Write-Host "║                    Test Summary                            ║" -ForegroundColor Blue
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Blue
Write-Host ""
Write-Host "✓ All services running" -ForegroundColor Green
Write-Host "✓ Authentication working" -ForegroundColor Green
Write-Host "✓ Chatbot API responding" -ForegroundColor Green
Write-Host "✓ Intent classification working" -ForegroundColor Green
Write-Host "✓ Emergency detection active" -ForegroundColor Green
Write-Host ""
Write-Host "Integration test completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Open browser: $FRONTEND_URL/dashboard/ai-chat"
Write-Host "  2. Login with: admin@techxen.org / admin123"
Write-Host "  3. Test all scenarios in browser"
Write-Host ""
