-- Database setup script for DailyCare Scheduler
-- Run this after PostgreSQL is installed

-- Create database
CREATE DATABASE dailycare_dev;

-- Connect to the database (you'll need to run this manually)
-- \c dailycare_dev;

-- Create user (optional, you can use postgres user)
-- CREATE USER dailycare_user WITH PASSWORD 'your_password_here';
-- GRANT ALL PRIVILEGES ON DATABASE dailycare_dev TO dailycare_user;

-- The tables will be created automatically by Knex migrations
-- Run: npm run migrate (from backend directory)
