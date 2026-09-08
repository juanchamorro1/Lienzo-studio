const { PrismaClient } = require('@prisma/client');

// Reuse a single client across hot reloads / requests instead of opening a
// new pool connection per import.
const prisma = global.__prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}

module.exports = prisma;
