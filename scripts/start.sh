#!/bin/bash
# Quick Start Script for Chatbot System

set -e  # Exit on error

# Get the root directory (parent of scripts/)
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "🚀 Starting Health Monitor Chatbot System..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from template...${NC}"
    cp backend/env.example.txt backend/.env
    echo -e "${YELLOW}📝 Please edit backend/.env and add your GEMINI_API_KEY${NC}"
    echo -e "${YELLOW}   Get key from: https://makersuite.google.com/app/apikey${NC}"
    echo ""
    read -p "Press Enter after you've added the API key..."
fi

# Check if node_modules exists
if [ ! -d "backend/node_modules" ]; then
    echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
    cd backend
    npm install
    cd ..
fi

# Start Qwen Router in background
echo -e "${GREEN}🤖 Starting Qwen Router (Mock mode)...${NC}"
if command -v python3 &> /dev/null; then
    python3 qwen_router_server.py --port 8081 --mock > qwen.log 2>&1 &
    QWEN_PID=$!
    echo "   PID: $QWEN_PID"
    echo "   Log: qwen.log"
else
    echo -e "${RED}❌ Python3 not found. Please install Python 3.10+${NC}"
    exit 1
fi

# Wait for Qwen to start
echo -e "${YELLOW}⏳ Waiting for Qwen Router to start...${NC}"
sleep 3

# Check Qwen health
if curl -s http://localhost:8081/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Qwen Router is running${NC}"
else
    echo -e "${RED}❌ Qwen Router failed to start. Check qwen.log${NC}"
    kill $QWEN_PID 2>/dev/null || true
    exit 1
fi

# Start Backend
echo ""
echo -e "${GREEN}🔧 Starting Backend API...${NC}"
cd backend
npm run dev &
BACKEND_PID=$!
echo "   PID: $BACKEND_PID"
cd ..

# Wait for backend to start
echo -e "${YELLOW}⏳ Waiting for Backend to start...${NC}"
sleep 5

# Check backend health
if curl -s http://localhost:4000/chat/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend API is running${NC}"
else
    echo -e "${YELLOW}⚠️  Backend may still be starting...${NC}"
fi

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✨ Chatbot System is Ready!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "📍 Services:"
echo "   - Qwen Router:  http://localhost:8081"
echo "   - Backend API:  http://localhost:4000"
echo ""
echo "🧪 Quick Test:"
echo "   1. Get JWT token:"
echo '      curl -X POST http://localhost:4000/auth/login \'
echo '        -H "Content-Type: application/json" \'
echo "        -d '{\"email\":\"admin@techxen.org\",\"password\":\"admin123\"}'"
echo ""
echo "   2. Test chatbot:"
echo '      curl -X POST http://localhost:4000/chat/ask \'
echo '        -H "Content-Type: application/json" \'
echo '        -H "Authorization: Bearer YOUR_TOKEN" \'
echo "        -d '{\"question\":\"Triệu chứng COVID-19 là gì?\"}'"
echo ""
echo "📚 Documentation:"
echo "   - Setup Guide:      CHATBOT_SECURE_SETUP.md"
echo "   - Architecture:     ARCHITECTURE.md"
echo "   - Test Scenarios:   TEST_CHATBOT_SCENARIOS.md"
echo "   - Implementation:   IMPLEMENTATION_SUMMARY.md"
echo ""
echo "🛑 To stop:"
echo "   kill $QWEN_PID $BACKEND_PID"
echo "   Or run: ./stop.sh"
echo ""

# Create stop script
cat > stop.sh << 'EOF'
#!/bin/bash
echo "🛑 Stopping Chatbot System..."
pkill -f "qwen_router_server.py"
pkill -f "npm run dev"
echo "✅ All services stopped"
EOF
chmod +x stop.sh

# Save PIDs for stop script
echo $QWEN_PID > .qwen.pid
echo $BACKEND_PID > .backend.pid

echo -e "${GREEN}System is running. Press Ctrl+C to view logs, or run ./stop.sh to stop.${NC}"
echo ""

# Follow logs
tail -f backend/logs/*.log qwen.log 2>/dev/null || tail -f qwen.log
