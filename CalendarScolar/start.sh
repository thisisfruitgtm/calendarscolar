#!/bin/bash
set -e

DB_FILE="/data/calendarscolar.db"

# Ensure persistent data directory exists
mkdir -p /data

if [ ! -f "$DB_FILE" ]; then
  echo "First run - initializing database..."
  npx prisma db push
  echo "Seeding database..."
  npx tsx prisma/seed.ts
  echo "Database initialized!"
else
  echo "Checking for schema updates..."
  npx prisma db push
fi

echo "Starting server on port ${PORT:-3000}..."
HOSTNAME=0.0.0.0 npx next start -H 0.0.0.0 -p ${PORT:-3000}
