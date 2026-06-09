const { PrismaClient } = require('@prisma/client');
let prisma;

try {
  // Prisma 7 requires providing an adapter (or accelerateUrl).
  // Use the official MariaDB adapter for MySQL-compatible servers.
  const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
  const adapter = new PrismaMariaDb({
    host: process.env.DB_HOST || 'db',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'blog',
    connectionLimit: Number(process.env.DB_POOL || 5),
  });
  prisma = new PrismaClient({ adapter });
} catch (e) {
  // Fallback with clear error if adapter is missing
  console.error('Prisma adapter not found. Please install @prisma/adapter-mariadb.');
  console.error('Run: npm i @prisma/adapter-mariadb');
  throw e;
}

module.exports = prisma;
