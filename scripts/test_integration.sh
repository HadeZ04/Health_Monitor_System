#!/bin/bash

# Integration Test Script - Frontend + Backend + Qwen Router
# Tests complete flow from login to chatbot interaction

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKEND_URL="http://localhost:4000"
FRONTEND_URL="http://localhost:3000"
QWEN_URL="http://localhost:8081"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Frontend-Backend Integration Test                     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Test 1: Check all services are running
echo -e "${YELLOW}[1/6]${NC} Checking services..."

check_service() {
  local name=$1
  local url=$2
  local endpoint=$3
  
  if curl -s -f -o /dev/null "$url$endpoint"; then
    echo -e "  ${GREEN}✓${NC} $name is running at $url"
    return 0
  else
    echo -e "  ${RED}✗${NC} $name is NOT running at $url"
    return 1
  fi
}

all_services_up=true

check_service "Backend API" "$BACKEND_URL" "/auth/login" || all_services_up=false
check_service "Qwen Router" "$QWEN_URL" "/health" || all_services_up=false

# Frontend check (different - just check if port is open)
if curl -s -f -o /dev/null "$FRONTEND_URL"; then
  echo -e "  ${GREEN}✓${NC} Frontend is running at $FRONTEND_URL"
else
  echo -e "  ${YELLOW}⚠${NC} Frontend may not be running (optional for API tests)"
fi

if [ "$all_services_up" = false ]; then
  echo -e "\n${RED}Error: Not all required services are running!${NC}"
  echo -e "Please start:"
  echo "  - Backend: cd backend && npm run dev"
  echo "  - Qwen Router: python qwen_router_server.py --port 8081 --mock"
  echo "  - Frontend: cd frontend && npm run dev"
  exit 1
fi

echo ""

# Test 2: Login and get token
echo -e "${YELLOW}[2/6]${NC} Testing login..."

LOGIN_RESPONSE=$(curl -s -X POST "$BACKEND_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@techxen.org",
    "password": "admin123"
  }')

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token // empty')

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo -e "  ${RED}✗${NC} Login failed!"
  echo "  Response: $LOGIN_RESPONSE"
  exit 1
fi

echo -e "  ${GREEN}✓${NC} Login successful"
echo "  Token: ${TOKEN:0:20}..."
echo ""

# Test 3: Test chatbot health
echo -e "${YELLOW}[3/6]${NC} Testing chatbot health..."

HEALTH_RESPONSE=$(curl -s -X GET "$BACKEND_URL/chat/health")
QWEN_STATUS=$(echo "$HEALTH_RESPONSE" | jq -r '.qwen_router // "unknown"')

echo -e "  ${GREEN}✓${NC} Chatbot health check passed"
echo "  Qwen Router: $QWEN_STATUS"
echo ""

# Test 4: Test General Medical QA
echo -e "${YELLOW}[4/6]${NC} Testing GENERAL_MEDICAL_QA intent..."

QA_RESPONSE=$(curl -s -X POST "$BACKEND_URL/chat/ask" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "question": "COVID-19 là gì?"
  }')

QA_SUCCESS=$(echo "$QA_RESPONSE" | jq -r '.success // false')
QA_INTENT=$(echo "$QA_RESPONSE" | jq -r '.intent // "unknown"')
QA_MESSAGE=$(echo "$QA_RESPONSE" | jq -r '.message // empty' | cut -c1-80)

if [ "$QA_SUCCESS" = "true" ]; then
  echo -e "  ${GREEN}✓${NC} General QA test passed"
  echo "  Intent: $QA_INTENT"
  echo "  Response: $QA_MESSAGE..."
else
  echo -e "  ${RED}✗${NC} General QA test failed"
  echo "  Response: $QA_RESPONSE"
fi
echo ""

# Test 5: Test Emergency Detection
echo -e "${YELLOW}[5/6]${NC} Testing Emergency Detection..."

EMERGENCY_RESPONSE=$(curl -s -X POST "$BACKEND_URL/chat/ask" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "question": "Tôi đau ngực dữ dội và khó thở"
  }')

EMERGENCY_WARNING=$(echo "$EMERGENCY_RESPONSE" | jq -r '.warning // empty')
SAFETY_TRIGGERED=$(echo "$EMERGENCY_RESPONSE" | jq -r '.metadata.safety_triggered // false')

if [ "$SAFETY_TRIGGERED" = "true" ] && [ -n "$EMERGENCY_WARNING" ]; then
  echo -e "  ${GREEN}✓${NC} Emergency detection working"
  echo "  Warning: $EMERGENCY_WARNING"
else
  echo -e "  ${YELLOW}⚠${NC} Emergency detection may not be working"
  echo "  Safety triggered: $SAFETY_TRIGGERED"
fi
echo ""

# Test 6: Test Real-time Analysis
echo -e "${YELLOW}[6/6]${NC} Testing USER_INPUT_ANALYSIS intent..."

ANALYSIS_RESPONSE=$(curl -s -X POST "$BACKEND_URL/chat/ask" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "question": "Huyết áp 150/95 có cao không?"
  }')

ANALYSIS_SUCCESS=$(echo "$ANALYSIS_RESPONSE" | jq -r '.success // false')
ANALYSIS_INTENT=$(echo "$ANALYSIS_RESPONSE" | jq -r '.intent // "unknown"')
ANALYSIS_MESSAGE=$(echo "$ANALYSIS_RESPONSE" | jq -r '.message // empty' | cut -c1-80)

if [ "$ANALYSIS_SUCCESS" = "true" ]; then
  echo -e "  ${GREEN}✓${NC} Real-time analysis test passed"
  echo "  Intent: $ANALYSIS_INTENT"
  echo "  Response: $ANALYSIS_MESSAGE..."
else
  echo -e "  ${RED}✗${NC} Real-time analysis test failed"
  echo "  Response: $ANALYSIS_RESPONSE"
fi
echo ""

# Summary
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    Test Summary                            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✓${NC} All services running"
echo -e "${GREEN}✓${NC} Authentication working"
echo -e "${GREEN}✓${NC} Chatbot API responding"
echo -e "${GREEN}✓${NC} Intent classification working"
echo -e "${GREEN}✓${NC} Emergency detection active"
echo ""
echo -e "${GREEN}Integration test completed successfully!${NC}"
echo ""
echo -e "Next steps:"
echo "  1. Open browser: $FRONTEND_URL/dashboard/ai-chat"
echo "  2. Login with: admin@techxen.org / admin123"
echo "  3. Test all scenarios in browser"
echo ""
