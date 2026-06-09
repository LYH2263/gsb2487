#!/bin/sh
set -e

echo "Waiting for database to be ready and sync schema..."
# Prisma db push internally handles waiting/retrying if configured correctly with DATABASE_URL
npx prisma db push --accept-data-loss

echo "Seeding initial data..."
npx prisma db seed || echo "Seed failed (non-fatal). Continuing..."

echo "Starting backend..."
npm run start
