@echo off
echo Setting up DailyCare Database...

REM Check if psql is available
psql --version >nul 2>&1
if errorlevel 1 (
    echo PostgreSQL is not installed or not in PATH.
    echo Please install PostgreSQL first from: https://www.postgresql.org/download/windows/
    echo.
    echo After installation, restart your command prompt and run this script again.
    pause
    exit /b 1
)

echo PostgreSQL found! Setting up database...

REM Create database
echo Creating database 'dailycare_dev'...
psql -U postgres -c "CREATE DATABASE dailycare_dev;" 2>nul || echo Database might already exist

echo Database setup complete!
echo.
echo Next steps:
echo 1. Make sure your backend/.env file has the correct database credentials
echo 2. Run: cd backend && npm run migrate
echo 3. Start the application: npm run dev
echo.
pause
