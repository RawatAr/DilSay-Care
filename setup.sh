#!/bin/bash

echo "🚀 Setting up DailyCare Scheduler..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    exit 1
fi

echo "📦 Installing dependencies..."

# Install root dependencies
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend && npm install && cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend && npm install && cd ..

echo "🗄️ Setting up database..."

# Create database (you may need to adjust the connection details)
echo "Creating database 'dailycare_dev'..."
createdb dailycare_dev 2>/dev/null || echo "Database might already exist"

# Run migrations
echo "🔄 Running database migrations..."
cd backend && npm run migrate && cd ..

echo "✅ Setup complete!"
echo ""
echo "To start development:"
echo "  npm run dev"
echo ""
echo "To start backend only:"
echo "  npm run dev:backend"
echo ""
echo "To start frontend only:"
echo "  npm run dev:frontend"
echo ""
echo "Backend will be available at: http://localhost:3001"
echo "Frontend will be available at: http://localhost:3000"
