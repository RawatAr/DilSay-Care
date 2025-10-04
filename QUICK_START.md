# Quick Start Guide - DailyCare Scheduler

## ✅ Project Status: COMPLETE & READY!

All syntax errors have been fixed and the project builds successfully!

## Prerequisites
- Node.js v16+ installed
- PostgreSQL database running
- Git installed

## 🚀 Quick Start (Development)

### 1. Setup Database

First, create a PostgreSQL database:
```sql
CREATE DATABASE dailycare_dev;
```

### 2. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies (if not already installed)
npm install

# Configure environment
# Make sure backend/.env has:
# PORT=3001
# DATABASE_URL=postgresql://username:password@localhost:5432/dailycare_dev
# FRONTEND_URL=http://localhost:3000

# Run migrations
npm run migrate

# Start backend server
npm run dev
```

Backend will be running at: `http://localhost:3001`

### 3. Frontend Setup

```bash
# Open a new terminal
# Navigate to frontend folder
cd frontend

# Install dependencies (if not already installed)
npm install

# Configure environment
# Make sure frontend/.env has:
# VITE_API_URL=http://localhost:3001/api

# Start frontend server
npm run dev
```

Frontend will be running at: `http://localhost:3000` (or the port shown in terminal)

### 4. Test the Application

1. Open browser to `http://localhost:3000`
2. You should see the weekly calendar view
3. Try creating a slot:
   - Click the "+" button on any day
   - Enter start and end times
   - Click "Create Slot"
4. The slot will appear and automatically recur for that day of the week

## 📋 Available Commands

### Backend
```bash
npm run dev          # Start development server with hot reload
npm run build        # Compile TypeScript to JavaScript
npm start            # Start production server
npm run migrate      # Run database migrations
npm run migrate:rollback  # Rollback last migration
npm test             # Run tests
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build locally
```

## 🔍 Verify Everything Works

### Check Backend Health
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2025-01-04T..."
}
```

### Test API Endpoints
```bash
# Get slots for current week
curl "http://localhost:3001/api/slots/week?startDate=2025-01-06"

# Should return array of 7 days with slots
```

## 📖 How to Use

### Creating a Slot
1. Click the "+" button next to any date
2. Enter start time (e.g., 09:00)
3. Enter end time (e.g., 11:00)  
4. Click "Create Slot"
5. Slot automatically recurs every week on that day

### Editing a Slot
1. Click the edit icon (pencil) on any slot
2. Modify the start/end times
3. Click "Update Slot"
4. Creates an exception for ONLY that specific date
5. Other recurring instances remain unchanged

### Deleting a Slot
1. Click the delete icon (trash) on any slot
2. Confirm deletion
3. Creates an exception for ONLY that specific date
4. Other recurring instances remain unchanged

### Scrolling Through Weeks
- Scroll down to load more upcoming weeks
- Infinite scroll automatically loads more data
- Calendar shows Monday - Sunday format

## 🎯 Features Implemented

✅ **Recurring Weekly Slots**
- Create a slot on any day → Automatically repeats every week
- Example: Monday 9AM-11AM repeats every Monday

✅ **Maximum 2 Slots Per Day**
- Backend validates and prevents creating more than 2 slots per date

✅ **Exception Handling**
- Edit/delete affects only the specific date
- Other recurring instances unaffected
- Stored as exceptions in database

✅ **Weekly Calendar View**
- Shows Monday - Sunday
- Current week highlighted
- Infinite scroll for future weeks

✅ **Full CRUD Operations**
- Create: Add new recurring slots
- Read: View all slots for weeks
- Update: Edit specific dates (exceptions)
- Delete: Remove specific dates (exceptions)

## 🗄️ Database Structure

### `slots` Table
```sql
CREATE TABLE slots (
  id SERIAL PRIMARY KEY,
  day_of_week INTEGER NOT NULL,  -- 0=Sunday, 1=Monday, ..., 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_for_date DATE NOT NULL,
  is_recurring BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### `slot_exceptions` Table
```sql
CREATE TABLE slot_exceptions (
  id SERIAL PRIMARY KEY,
  slot_id INTEGER REFERENCES slots(id) ON DELETE CASCADE,
  exception_date DATE NOT NULL,
  start_time TIME,  -- NULL means slot deleted for this date
  end_time TIME,    -- NULL means slot deleted for this date
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(slot_id, exception_date)
);
```

## 🐛 Troubleshooting

### Backend won't start
**Issue**: `Error: listen EADDRINUSE: address already in use :::3001`

**Solution**: Port 3001 is already in use
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3001 | xargs kill -9
```

### Database connection error
**Issue**: `Error: connect ECONNREFUSED`

**Solution**: Check PostgreSQL is running
```bash
# Windows
services.msc → PostgreSQL service → Start

# Mac
brew services start postgresql

# Linux
sudo service postgresql start
```

### Frontend can't connect to backend
**Issue**: CORS errors in browser console

**Solution**: Check FRONTEND_URL in backend/.env matches your frontend URL

### Migrations not running
**Issue**: `Migrations are already up to date`

**Solution**: Check if tables already exist
```sql
\dt  -- List tables in PostgreSQL

-- If tables exist and you want to reset:
DROP TABLE slot_exceptions CASCADE;
DROP TABLE slots CASCADE;

-- Then run migrations again:
npm run migrate
```

## 📁 Project Structure
```
DailyCare/
├── backend/
│   ├── dist/              # Compiled JavaScript (generated)
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── migrations/    # Database migrations
│   │   ├── types/         # TypeScript types
│   │   └── index.ts       # Entry point
│   ├── .env               # Environment variables
│   ├── knexfile.js        # Database config
│   └── package.json
│
├── frontend/
│   ├── dist/              # Production build (generated)
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   ├── .env               # Environment variables
│   ├── vite.config.ts     # Vite configuration
│   └── package.json
│
├── QUICK_START.md         # This file
├── DEPLOYMENT_GUIDE.md    # Production deployment guide
├── PROJECT_STATUS.md      # Complete project status
└── README.md              # General information
```

## ✨ What's Next?

### Ready for Development
✅ All syntax errors fixed
✅ Both backend and frontend compile successfully
✅ Database schema ready
✅ All CRUD operations implemented
✅ Error handling in place

### Before Deployment
1. Review environment variables for production
2. Test all features thoroughly
3. Run migrations on production database
4. Follow DEPLOYMENT_GUIDE.md for step-by-step deployment

## 🎉 Success!

Your project is **100% complete** and ready to use!

To start developing:
1. Run `npm run dev` in backend terminal
2. Run `npm run dev` in frontend terminal
3. Open browser to http://localhost:3000
4. Start creating slots!

For deployment instructions, see **DEPLOYMENT_GUIDE.md**
