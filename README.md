# Health Monitoring Monorepo

This project keeps your existing landing-page aesthetics while layering a full-stack architecture for the connected-care platform. Everything is split into frontend, backend, and database packages so you can extend each feature independently.

## Structure

```
frontend/  Next.js 14 (App Router) + Tailwind + ShadCN UI, Recharts, Leaflet
backend/   Express + TypeScript REST API with JWT, WebSocket + MQTT hooks
database/  Prisma schema + migrations targeting PostgreSQL
```

Supporting files: `.env.example`, `docker-compose.yml`, README.

## Frontend (Next.js)

- App Router scaffolds every requested page: auth, main dashboard, live monitoring, replay, analytics, alerts, AI chatbot, patients, doctor chat, IoT control, emergency, metrics (ECG/SpO2/HR/PPG/PCG/GPS).
- Component library includes monitoring widgets, AI insight cards, file uploads, voice control, patient EHR timelines, doctor chat, firmware tables, emergency boards, etc.
- Recharts + Leaflet placeholders visualize vitals, analytics, GPS tracking, and future heatmaps. React Query provider ready for API wiring.

Run the UI:

```bash
cd frontend
npm install
npm run dev
```

## Backend (Express + TypeScript)

- Routes now cover auth, users, devices, signals, monitoring (streams/replay/export), patients (EHR, vitals), alerts (rules + triggers), analytics (trends + GPS), reports, chat, and IoT firmware endpoints.
- Controllers return stub JSON so you can connect Prisma + real integrations later.
- WebSocket + MQTT bootstrap remain in place for realtime signal delivery.

Run the API:

```bash
cd backend
npm install
npm run dev
```

## Database (Prisma + PostgreSQL)

- `schema.prisma` includes base tables plus extended models: patient profiles, medications, medical files, vital trends, alert rules/events/deliveries, device firmware queue, doctor/patient relationships, chat messages, and reports.
- Add migrations via `npx prisma migrate dev --name init` after configuring `.env`.

## Docker Compose

```bash
docker compose up --build
```

Services: Postgres (`db`), API dev server (`backend`), Next.js dev server (`frontend`). Update `.env.example` → `.env` to propagate MQTT/RAG/voice/messaging secrets.

## Extension ideas

- Wire Role-Based Access Control (patient/doctor/admin/researcher) to the new routes and sidebar navigation.
- Plug in realtime pipelines (WebSocket, MQTT, TimescaleDB/InfluxDB) and connect the monitoring UI components.
- Implement AI chatbot logic (RAG, speech, file parsing) + alert delivery (SMS, Email, Telegram, Zalo) by filling the stub endpoints.
- Add automated tests + CI workflows before production rollout.
