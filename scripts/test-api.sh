#!/bin/bash
# Script test nhanh cho Linux/Mac
# Chạy: chmod +x test-api.sh && ./test-api.sh

echo "========================================"
echo "  TEST HỆ THỐNG AI CHAT"
echo "========================================"
echo ""

# Test 1: Inference Server Health
echo "[1/4] Testing Inference Server Health..."
if curl -s http://localhost:8080/health > /dev/null 2>&1; then
    RESPONSE=$(curl -s http://localhost:8080/health)
    STATUS=$(echo $RESPONSE | jq -r '.status')
    MODEL=$(echo $RESPONSE | jq -r '.model_id')
    echo "✅ Inference Server: OK"
    echo "   Status: $STATUS"
    echo "   Model: $MODEL"
else
    echo "❌ Inference Server: FAILED"
    echo "   → Đảm bảo inference server đang chạy: cd inference_server && python -m src.api"
fi
echo ""

# Test 2: Backend Health
echo "[2/4] Testing Backend Health..."
if curl -s http://localhost:4000/chat/health > /dev/null 2>&1; then
    RESPONSE=$(curl -s http://localhost:4000/chat/health)
    STATUS=$(echo $RESPONSE | jq -r '.status')
    MODEL=$(echo $RESPONSE | jq -r '.model_id')
    echo "✅ Backend: OK"
    echo "   Status: $STATUS"
    echo "   Model: $MODEL"
else
    echo "❌ Backend: FAILED"
    echo "   → Đảm bảo backend đang chạy: cd backend && npm run dev"
fi
echo ""

# Test 3: Login
echo "[3/4] Testing Login..."
TOKEN=$(curl -s -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@techxen.org","password":"admin123"}' | jq -r '.token')

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
    echo "✅ Login: OK"
    echo "   Token: ${TOKEN:0:20}..."
else
    echo "❌ Login: FAILED"
    echo "   → Kiểm tra backend và credentials"
fi
echo ""

# Test 4: Chat API
echo "[4/4] Testing Chat API..."
if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
    RESPONSE=$(curl -s -X POST http://localhost:4000/chat/ask \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"question":"Bác sĩ ơi, tôi hay đau ngực khi leo cầu thang?","session_id":"test-session"}')
    
    SUCCESS=$(echo $RESPONSE | jq -r '.success')
    if [ "$SUCCESS" = "true" ]; then
        REPLY=$(echo $RESPONSE | jq -r '.reply')
        CONFIDENCE=$(echo $RESPONSE | jq -r '.confidence')
        CITATIONS=$(echo $RESPONSE | jq -r '.citations | length')
        echo "✅ Chat API: OK"
        echo "   Reply: ${REPLY:0:100}..."
        echo "   Confidence: $CONFIDENCE"
        echo "   Citations: $CITATIONS"
    else
        echo "❌ Chat API: FAILED"
        echo "   Response: $RESPONSE"
    fi
else
    echo "⏭️  Chat API: SKIPPED (cần token từ login)"
fi
echo ""

echo "========================================"
echo "  TEST HOÀN TẤT"
echo "========================================"
echo ""
echo "💡 Tip: Mở trình duyệt và vào http://localhost:3000/dashboard/ai-chat để test giao diện"

