# Local PostgreSQL Setup Guide

This guide explains how to set up and run a local PostgreSQL database instead of using Supabase.

## Prerequisites

- PostgreSQL 14 or higher installed on your system
- Basic familiarity with command line tools

## Installation

### macOS (using Homebrew)
```bash
# Install PostgreSQL
brew install postgresql@16

# Start PostgreSQL service
brew services start postgresql@16

# Verify installation
psql --version
```

### Linux (Ubuntu/Debian)
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify installation
psql --version
```

### Windows
Download and install from [PostgreSQL official website](https://www.postgresql.org/download/windows/)

## Database Setup

### 1. Create Database and User

```bash
# Connect to PostgreSQL as superuser
psql postgres

# In the PostgreSQL prompt, run:
CREATE DATABASE caliway;
CREATE USER caliway_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE caliway TO caliway_user;

# Exit PostgreSQL prompt
\q
```

### 2. Run Database Schema

```bash
# Navigate to project directory
cd /Users/mihailmarincea/Documents/caliway

# Run the schema file (modified version without RLS)
psql -U caliway_user -d caliway -f database/schema-local.sql
```

### 3. Configure Environment Variables

Update your `.env` file with local PostgreSQL connection details:

```env
# Local PostgreSQL Configuration
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=local-development-key
SUPABASE_SERVICE_ROLE_KEY=local-development-service-key

# Or use direct Postgres connection (alternative)
DATABASE_URL=postgresql://caliway_user:your_secure_password@localhost:5432/caliway

# Application Configuration
PORT=3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_change_this_in_production
BASE_URL=http://localhost:3000
```

**Note:** The Supabase client can connect directly to PostgreSQL using PostgREST. For simplicity, we'll keep using the Supabase client library but point it to your local Postgres instance via a local PostgREST server (optional) or modify the config to use a direct Postgres driver.

## Running PostgREST Locally (Optional)

If you want to keep using the Supabase client without modifications:

```bash
# Install PostgREST
brew install postgrest  # macOS
# or download from https://postgrest.org/

# Create postgrest.conf
cat > postgrest.conf << EOF
db-uri = "postgres://caliway_user:your_secure_password@localhost:5432/caliway"
db-schemas = "public"
db-anon-role = "caliway_user"
server-port = 54321
EOF

# Run PostgREST
postgrest postgrest.conf
```

## Verification

### 1. Test Database Connection

```bash
# Connect to the database
psql -U caliway_user -d caliway

# List tables
\dt

# Check a table
SELECT * FROM companies LIMIT 5;

# Exit
\q
```

### 2. Test Application Connection

```bash
# Run the connection test script
node test-basic-connection.js

# Expected output:
# ✅ Supabase connection and database setup successful!
# 📊 Companies table accessible
```

### 3. Start the Application

```bash
npm run dev
```

Visit `http://localhost:3000` to verify the application is running.

## Creating Test Data

Use the existing test scripts to create sample data:

```bash
# Create a test user and company
node create-test-user.js

# Verify tables have data
node test-tables.js
```

## Troubleshooting

### Connection Refused
- Ensure PostgreSQL is running: `brew services list` (macOS) or `sudo systemctl status postgresql` (Linux)
- Check if PostgreSQL is listening on port 5432: `lsof -i :5432`

### Authentication Failed
- Verify username and password in `.env` match what you created
- Check PostgreSQL user permissions: `psql -U caliway_user -d caliway`

### Tables Not Found
- Ensure schema was applied: `psql -U caliway_user -d caliway -c "\dt"`
- Re-run schema if needed: `psql -U caliway_user -d caliway -f database/schema-local.sql`

## Switching Back to Supabase

To switch back to Supabase, simply update your `.env` file with the original Supabase credentials:

```env
SUPABASE_URL=https://supabase.caliway.thisisfruit.com
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

No code changes are required!
