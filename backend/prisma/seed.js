require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { seedDatabase } = require('../src/seed-data');

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@console.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const log = await seedDatabase(prisma, { adminEmail, adminPassword });
  log.forEach((line) => console.log(line));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
