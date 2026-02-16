-- ============================================
-- PostgreSQL Setup Script
-- Calendar Booking Service Database
-- ============================================

-- Step 1: Create Database
-- Run this first (connect as postgres user)
-- ============================================

-- Create the database
CREATE DATABASE calendar_booking_db;

-- Connect to the database
\c calendar_booking_db

-- ============================================
-- Step 2: Create Tables
-- ============================================

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add comment to table
COMMENT ON TABLE users IS 'Stores user information for the calendar booking system';

-- Add comments to columns
COMMENT ON COLUMN users.id IS 'Primary key, auto-incrementing';
COMMENT ON COLUMN users.name IS 'User full name, required';
COMMENT ON COLUMN users.email IS 'User email address, must be unique';
COMMENT ON COLUMN users.created_at IS 'Timestamp when user was created';
COMMENT ON COLUMN users.updated_at IS 'Timestamp when user was last updated';

-- Create meetings table
CREATE TABLE meetings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT check_time_range
        CHECK (start_time < end_time)
);

-- Add comment to table
COMMENT ON TABLE meetings IS 'Stores meeting information with conflict prevention';

-- Add comments to columns
COMMENT ON COLUMN meetings.id IS 'Primary key, auto-incrementing';
COMMENT ON COLUMN meetings.user_id IS 'Foreign key referencing users table';
COMMENT ON COLUMN meetings.title IS 'Meeting title, required';
COMMENT ON COLUMN meetings.description IS 'Optional meeting description';
COMMENT ON COLUMN meetings.start_time IS 'Meeting start time';
COMMENT ON COLUMN meetings.end_time IS 'Meeting end time';
COMMENT ON COLUMN meetings.created_at IS 'Timestamp when meeting was created';
COMMENT ON COLUMN meetings.updated_at IS 'Timestamp when meeting was last updated';

-- ============================================
-- Step 3: Create Indexes for Performance
-- ============================================

-- Index for faster conflict checking queries
-- This is the most important index for performance
CREATE INDEX idx_meetings_user_time 
ON meetings(user_id, start_time, end_time);

COMMENT ON INDEX idx_meetings_user_time IS 'Composite index for fast conflict detection queries';

-- Index for filtering by date range
CREATE INDEX idx_meetings_time_range 
ON meetings(start_time, end_time);

COMMENT ON INDEX idx_meetings_time_range IS 'Index for filtering meetings by date range';

-- Index for user lookups
CREATE INDEX idx_meetings_user_id 
ON meetings(user_id);

COMMENT ON INDEX idx_meetings_user_id IS 'Index for filtering meetings by user';

-- Index for email lookups (already unique, but explicit index helps)
CREATE INDEX idx_users_email 
ON users(email);

COMMENT ON INDEX idx_users_email IS 'Index for fast email lookups and uniqueness checks';

-- ============================================
-- Step 4: Create Trigger for Updated_at
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for meetings table
CREATE TRIGGER update_meetings_updated_at
    BEFORE UPDATE ON meetings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Step 5: Insert Sample Data (Optional)
-- ============================================

-- Insert sample users
INSERT INTO users (name, email) VALUES
('John Doe', 'john@example.com'),
('Jane Smith', 'jane@example.com'),
('Bob Johnson', 'bob@example.com');

-- Insert sample meetings
INSERT INTO meetings (user_id, title, description, start_time, end_time) VALUES
(1, 'Team Standup', 'Daily standup meeting', '2024-02-11 09:00:00', '2024-02-11 09:30:00'),
(1, 'Client Call', 'Quarterly review with client', '2024-02-11 10:00:00', '2024-02-11 11:00:00'),
(1, 'Lunch Break', 'Team lunch', '2024-02-11 12:00:00', '2024-02-11 13:00:00'),
(2, 'Project Planning', 'Sprint planning session', '2024-02-11 09:00:00', '2024-02-11 10:30:00'),
(2, 'Code Review', 'Review PRs', '2024-02-11 14:00:00', '2024-02-11 15:00:00'),
(3, 'Interview', 'Technical interview', '2024-02-11 11:00:00', '2024-02-11 12:00:00');

-- ============================================
-- Step 6: Verification Queries
-- ============================================

-- Check if tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check users table structure
\d users

-- Check meetings table structure
\d meetings

-- View all indexes
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Count records
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'meetings' as table_name, COUNT(*) as count FROM meetings;

-- View all users
SELECT * FROM users;

-- View all meetings with user details
SELECT 
    m.id,
    m.title,
    m.description,
    m.start_time,
    m.end_time,
    u.name as user_name,
    u.email as user_email
FROM meetings m
JOIN users u ON m.user_id = u.id
ORDER BY m.start_time;

-- ============================================
-- Conflict Detection Query (Test)
-- ============================================

-- Example: Check if time slot 09:15-09:45 conflicts for user 1
-- This should return the 09:00-09:30 meeting (conflict exists)
SELECT 
    id,
    title,
    start_time,
    end_time
FROM meetings
WHERE user_id = 1
    AND start_time < '2024-02-11 09:45:00'
    AND end_time > '2024-02-11 09:15:00';

-- ============================================
-- Useful Queries for Testing
-- ============================================

-- Get all meetings for a specific user
SELECT * FROM meetings WHERE user_id = 1 ORDER BY start_time;

-- Get meetings in a date range
SELECT * FROM meetings 
WHERE start_time >= '2024-02-11 00:00:00' 
    AND end_time <= '2024-02-12 00:00:00'
ORDER BY start_time;

-- Get meetings with user details
SELECT 
    m.*,
    u.name as user_name,
    u.email as user_email
FROM meetings m
JOIN users u ON m.user_id = u.id
WHERE m.user_id = 1;

-- Find users with most meetings
SELECT 
    u.id,
    u.name,
    COUNT(m.id) as meeting_count
FROM users u
LEFT JOIN meetings m ON u.id = m.user_id
GROUP BY u.id, u.name
ORDER BY meeting_count DESC;

-- ============================================
-- Database Maintenance Commands
-- ============================================

-- Show table sizes
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Show database size
SELECT pg_size_pretty(pg_database_size('calendar_booking_db'));

-- Vacuum tables (cleanup)
VACUUM ANALYZE users;
VACUUM ANALYZE meetings;

-- ============================================
-- Drop Everything (Clean Slate)
-- ============================================

-- WARNING: This will delete all data!
-- Uncomment only if you want to start fresh

-- DROP TRIGGER IF EXISTS update_meetings_updated_at ON meetings;
-- DROP TRIGGER IF EXISTS update_users_updated_at ON users;
-- DROP FUNCTION IF EXISTS update_updated_at_column();
-- DROP TABLE IF EXISTS meetings CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;
-- DROP DATABASE IF EXISTS calendar_booking_db;

-- ============================================
-- Grant Permissions (if needed)
-- ============================================

-- If you create a specific user for the application
-- CREATE USER calendar_app_user WITH PASSWORD 'your_secure_password';
-- GRANT ALL PRIVILEGES ON DATABASE calendar_booking_db TO calendar_app_user;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO calendar_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO calendar_app_user;

-- ============================================
-- End of Setup Script
-- ============================================

-- Success message
SELECT 'Database setup completed successfully!' AS status;