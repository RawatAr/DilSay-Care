# Deployment Guide for DailyCare Scheduler

## Project Overview
A scheduler system with recurring weekly slots built with React + TypeScript + Tailwind (frontend) and Node.js + TypeScript + PostgreSQL with Knex (backend).

## Features Implemented
✅ Recurring weekly slots
✅ Maximum 2 slots per day
✅ Exception handling for specific dates
✅ Weekly calendar view with infinite scroll
✅ Create, update, delete operations
✅ Full REST API implementation

## Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

## Local Setup

### Backend Setup
```bash
cd backend
npm install
```

### Create `.env` file in backend directory:
```
PORT=3001
DATABASE_URL=postgresql://username:password@localhost:5432/dailycare_dev
FRONTEND_URL=http://localhost:3000
```

### Run Database Migrations:
```bash
npm run migrate
```

### Start Backend:
```bash
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
```

### Create `.env` file in frontend directory:
```
VITE_API_URL=http://localhost:3001/api
```

### Start Frontend:
```bash
npm run dev
```

## Deployment Steps

### 1. Deploy Database (Render PostgreSQL)
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "PostgreSQL"
3. Configure database settings
4. Copy the **External Database URL** after creation

### 2. Deploy Backend (Render)
1. Go to Render Dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: dailycare-backend
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   - `DATABASE_URL`: (Paste External Database URL from step 1)
   - `FRONTEND_URL`: (Will add after frontend deployment)
   - `PORT`: 3001
6. Click "Create Web Service"
7. Wait for deployment to complete
8. Copy your backend URL (e.g., `https://dailycare-backend.onrender.com`)

### 3. Run Migrations on Production Database
```bash
# Update DATABASE_URL in backend/.env with production URL
cd backend
npm run migrate
```

### 4. Deploy Frontend (Vercel)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   - `VITE_API_URL`: (Paste backend URL from step 2 + `/api`)
   - Example: `https://dailycare-backend.onrender.com/api`
6. Click "Deploy"
7. Copy your frontend URL

### 5. Update Backend CORS
1. Go back to Render Dashboard
2. Open your backend service
3. Update Environment Variable:
   - `FRONTEND_URL`: (Paste frontend URL from step 4)
4. Click "Save Changes" and wait for redeployment

## Alternative Deployment: Netlify (Frontend)
1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub repository
4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
5. Add Environment Variable:
   - `VITE_API_URL`: Your backend URL + `/api`
6. Click "Deploy site"

## API Endpoints

### Slots
- `POST /api/slots` - Create a new slot
- `GET /api/slots/week?startDate=YYYY-MM-DD` - Get slots for a specific week
- `GET /api/slots/date/:date` - Get slots for a specific date
- `PUT /api/slots/:id` - Update a slot (affects all recurring instances)
- `DELETE /api/slots/:id` - Delete a slot (affects all recurring instances)
- `PUT /api/slots/:id/date` - Update a slot for a specific date (creates exception)
- `DELETE /api/slots/:id/date` - Delete a slot for a specific date (creates exception)

## Verification

### Backend Health Check
Visit: `https://your-backend-url.onrender.com/health`

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2025-01-04T..."
}
```

### Test API
```bash
curl https://your-backend-url.onrender.com/api/slots/week?startDate=2025-01-06
```

## Troubleshooting

### Backend not starting
- Check Render logs for errors
- Verify DATABASE_URL is correct
- Ensure migrations ran successfully

### Frontend not loading
- Check browser console for CORS errors
- Verify VITE_API_URL is correct
- Check Vercel/Netlify deployment logs

### Database connection issues
- Verify DATABASE_URL format
- Check if database is accessible from Render
- Run migrations again if needed

## Project Structure
```
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── config/
│   │   ├── migrations/
│   │   └── types/
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Support
For issues or questions, please check:
1. Render logs for backend issues
2. Vercel/Netlify logs for frontend issues
3. Browser console for client-side errors
