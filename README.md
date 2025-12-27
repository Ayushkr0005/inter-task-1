# Project 1: Student Task Manager

End-to-end Task Manager with React (Vite) + Node/Express + MongoDB (with in-memory fallback).

## Structure
- `backend/` Express API with MongoDB or in-memory store
- `frontend/` Vite React app

## Quickstart (Local)

1) Backend
```
cd backend
cp .env.example .env   # on Windows, copy manually
npm install
npm run dev
```
- API: `http://localhost:5000`
- Health: `GET /api/health`

2) Frontend
```
cd frontend
cp .env.example .env   # on Windows, copy manually
npm install
npm run dev
```
- App: `http://localhost:5173`

Ensure `frontend/.env` has `VITE_API_BASE=http://localhost:5000` and `backend/.env` has `CORS_ORIGIN=http://localhost:5173`.

## Env
- Backend: `PORT`, `MONGO_URI` (optional), `CORS_ORIGIN`
- Frontend: `VITE_API_BASE`

## API Endpoints
- `POST /api/tasks`
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

## Deployment (Checklist)
- Frontend → Vercel (build: `npm run build`)
- Backend → Render/Heroku (env: `MONGO_URI`, `PORT`, `CORS_ORIGIN`)
- Set `VITE_API_BASE` to deployed backend URL

## Optional
- Auth scaffolding can be added later (JWT).
- Basic unit test for filter logic (Jest) can be added.
