@echo off
echo 🚀 Setting up DailyCare Scheduler...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

echo 📦 Installing dependencies...

REM Install root dependencies
npm install

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
npm install
cd ..

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
npm install
cd ..

echo 🗄️ Setting up database...
echo Creating database 'dailycare_dev'...
createdb dailycare_dev 2>nul || echo Database might already exist

echo 🔄 Running database migrations...
cd backend
npm run migrate
cd ..

echo ✅ Setup complete!
echo.
echo To start development:
echo   npm run dev
echo.
echo To start backend only:
echo   npm run dev:backend
echo.
echo To start frontend only:
echo   npm run dev:frontend
echo.
echo Backend will be available at: http://localhost:3001
echo Frontend will be available at: http://localhost:3000
