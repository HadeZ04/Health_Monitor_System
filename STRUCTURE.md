# 📂 Project Structure

> Clean and organized structure for Health Monitor Chatbot System

---

## 🗂️ Root Directory

```
Health_Monitor_System/
├── .env.example                              # Environment template
├── .gitignore                                # Git ignore rules
├── README.md                                 # Main documentation
├── docker-compose.yml                        # Docker orchestration
├── qwen_router_server.py                    # Qwen classification server
├── requirements.txt                          # Python dependencies
│
├── backend/                                  # Express + TypeScript API
├── frontend/                                 # Next.js 14 App Router
├── database/                                 # Prisma schema + migrations
├── inference_server/                         # OLD RAG system (kept for reference)
├── scripts/                                  # Utility & test scripts
└── docs/                                     # Documentation files
```

---

## 🎯 Backend (`backend/`)

```
backend/
├── src/
│   ├── types/
│   │   └── chatbot.types.ts                 # All TypeScript interfaces
│   │
│   ├── config/
│   │   └── chatbot.config.ts                # Configuration, patterns, prompts
│   │
│   ├── services/                            # Business logic layer
│   │   ├── qwenRouter.service.ts            # Intent classification (Qwen)
│   │   ├── piiSanitization.service.ts       # PII/PHI detection & removal
│   │   ├── medicalDB.service.ts             # Database queries
│   │   ├── gemini.service.ts                # Gemini API integration
│   │   ├── safetyGate.service.ts            # Emergency & safety checks
│   │   └── auditLog.service.ts              # Compliance & audit logging
│   │
│   ├── controllers/
│   │   └── chatController.ts                # Main orchestrator (10-step flow)
│   │
│   ├── routes/
│   │   ├── auth.ts                          # Authentication routes
│   │   ├── chatbot.ts                       # Chatbot API routes
│   │   ├── patients.ts                      # Patient data routes
│   │   └── ...                              # Other routes
│   │
│   ├── middleware/
│   │   └── auth.ts                          # JWT authentication
│   │
│   └── server.ts                            # Express app entry point
│
├── env.example.txt                          # Environment template
├── .env                                     # Configuration (create this!)
├── package.json                             # Node.js dependencies
└── tsconfig.json                            # TypeScript config
```

**Key Files:**
- **chatController.ts**: Main controller implementing 10-step secure flow
- **qwenRouter.service.ts**: Routes requests to appropriate handler
- **piiSanitization.service.ts**: Removes sensitive data before Gemini call
- **gemini.service.ts**: Google Gemini API integration for medical Q&A
- **safetyGate.service.ts**: Detects emergencies and high-risk situations

---

## 🖥️ Frontend (`frontend/`)

```
frontend/
├── app/
│   ├── auth/
│   │   └── login/page.tsx                   # Login page
│   │
│   ├── dashboard/
│   │   ├── ai-chat/
│   │   │   └── page.tsx                     # 🤖 AI Chatbot interface
│   │   ├── patients/                        # Patient management
│   │   ├── monitoring/                      # Real-time monitoring
│   │   ├── analytics/                       # Analytics dashboard
│   │   └── ...
│   │
│   ├── layout.tsx                           # Root layout
│   └── page.tsx                             # Landing page
│
├── components/                              # Reusable UI components
│   ├── ui/                                  # Shadcn components
│   ├── chat/                                # Chat-related components
│   └── ...
│
├── lib/
│   ├── api.ts                               # API client (with JWT)
│   └── session.ts                           # Session management
│
├── hooks/                                   # Custom React hooks
├── package.json
└── next.config.mjs
```

**Key Files:**
- **app/dashboard/ai-chat/page.tsx**: Main chatbot UI with message history
- **lib/api.ts**: API client that adds JWT token to requests
- **components/**: Reusable UI components (buttons, cards, etc.)

---

## 🗄️ Database (`database/`)

```
database/
├── schema.prisma                            # Prisma schema definition
└── migrations/                              # Database migrations
    └── ...
```

**Tables:**
- Users (with JWT authentication)
- Patients (medical records, vitals, allergies)
- Devices (IoT medical devices)
- Alerts (alert rules & events)
- Chat history (optional - currently in-memory)

---

## 🐍 Qwen Router Server

```
qwen_router_server.py                        # Python Flask server
```

**Purpose:** 
- Classifies user intent locally (without sending data to cloud)
- Uses Qwen 14B model (or mock mode for testing)
- Runs on port 8081

**Endpoints:**
- `POST /v1/chat/completions` - OpenAI-compatible
- `POST /classify` - Direct classification
- `GET /health` - Health check

---

## 📜 Scripts (`scripts/`)

```
scripts/
├── start.sh                                 # Auto-start all services (Linux/Mac)
├── test_integration.sh                      # Integration tests (bash)
├── test_integration.ps1                     # Integration tests (PowerShell)
├── test-api.sh                              # API tests (bash)
└── test-api.ps1                             # API tests (PowerShell)
```

**Usage:**
```bash
# Start all services
chmod +x scripts/start.sh
./scripts/start.sh

# Run integration tests
./scripts/test_integration.sh
```

---

## 📚 Documentation (`docs/`)

```
docs/
├── ARCHITECTURE.md                          # System design & data flows
├── CHATBOT_SECURE_SETUP.md                 # Setup guide
├── FRONTEND_INTEGRATION.md                 # FE-BE integration guide
├── TEST_CHATBOT_SCENARIOS.md               # Test scenarios & scripts
├── QUICK_REFERENCE.md                      # Quick commands & workflows
├── IMPLEMENTATION_SUMMARY.md               # What was built
├── FIX_401_ERROR.md                        # Troubleshooting auth errors
└── TEST_GUIDE.md                           # Testing guide (inference server)
```

**Reading Order:**
1. Start with **README.md** (root) for overview
2. **QUICK_REFERENCE.md** for quick start
3. **CHATBOT_SECURE_SETUP.md** for detailed setup
4. **ARCHITECTURE.md** for system design
5. **TEST_CHATBOT_SCENARIOS.md** for testing

---

## 🏥 Inference Server (`inference_server/`) - LEGACY

```
inference_server/
└── inference_server/
    ├── main.py                              # OLD inference server
    ├── rag_engine.py                        # RAG implementation
    ├── pubmed_retriever.py                  # PubMed search
    └── ...
```

**Status:** 
- ⚠️ **LEGACY CODE** - Kept for reference only
- Not used by new secure chatbot (uses Gemini instead)
- Contains RAG implementation with PubMed search
- May be useful for future enhancements

---

## 🐳 Docker Configuration

```
docker-compose.yml                           # Multi-service orchestration
```

**Services:**
- `db` - PostgreSQL database
- `backend` - Express API server
- `frontend` - Next.js frontend
- (Qwen router runs separately - Python)

---

## 📦 Configuration Files

### Root Level
- `.env.example` - Environment template for all services
- `requirements.txt` - Python dependencies (Flask, transformers, torch)
- `.gitignore` - Git ignore rules

### Backend
- `backend/.env` - Backend configuration (**create from env.example.txt**)
- `backend/tsconfig.json` - TypeScript configuration
- `backend/package.json` - Node.js dependencies

### Frontend
- `frontend/.env.local` - Frontend environment (optional)
- `frontend/next.config.mjs` - Next.js configuration
- `frontend/tsconfig.json` - TypeScript configuration

---

## 🔑 Environment Variables

### Backend (`.env`)
```env
# Required
GEMINI_API_KEY=your_key_here                 # Google Gemini API key
JWT_SECRET=your_secret_here                  # JWT signing secret

# Optional
QWEN_API_URL=http://localhost:8081           # Qwen router URL
PORT=4000                                    # Backend port
DATABASE_URL=postgresql://...                # PostgreSQL connection
```

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000    # Backend API URL
```

---

## 🚀 Quick Navigation

### Development
- Start system: `./scripts/start.sh`
- Backend code: `backend/src/`
- Frontend code: `frontend/app/`
- Run tests: `./scripts/test_integration.sh`

### Documentation
- Setup: `docs/CHATBOT_SECURE_SETUP.md`
- Architecture: `docs/ARCHITECTURE.md`
- API Integration: `docs/FRONTEND_INTEGRATION.md`
- Test Scenarios: `docs/TEST_CHATBOT_SCENARIOS.md`

### Configuration
- Backend env: `backend/.env`
- Frontend env: `frontend/.env.local`
- Docker: `docker-compose.yml`

---

## 📊 File Statistics

- **Backend Services**: 6 service files (Qwen, PII, DB, Gemini, Safety, Audit)
- **Frontend Pages**: 15+ pages (dashboard, monitoring, chat, etc.)
- **Documentation**: 8 markdown files
- **Test Scripts**: 5 scripts (bash + PowerShell)
- **Total TypeScript**: 50+ files
- **Total Python**: 2 files (qwen_router + old inference)

---

## 🎯 Next Steps

1. **Setup**: Follow `docs/CHATBOT_SECURE_SETUP.md`
2. **Start**: Run `./scripts/start.sh`
3. **Test**: Use `docs/TEST_CHATBOT_SCENARIOS.md`
4. **Customize**: Modify services in `backend/src/services/`
5. **Deploy**: Use `docker-compose.yml`

---

## 📞 Support

- **Main Docs**: [README.md](../README.md)
- **Quick Start**: [docs/QUICK_REFERENCE.md](QUICK_REFERENCE.md)
- **Issues**: Create GitHub issue

---

<div align="center">

**Clean Structure, Clear Purpose 🎯**

[← Back to README](../README.md)

</div>
