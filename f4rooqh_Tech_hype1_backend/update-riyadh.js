const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.zone.updateMany({
    where: { name: 'Riyadh Region' },
    data: { latitude: 24.7135, longitude: 46.6753 }
  });
  console.log('Updated Riyadh Region coordinates');
}

main().catch(console.error).finally(() => prisma.$disconnect());
