const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const buyerId = '321f195b-f49d-4889-af70-f1c39d7c3a25';
  
  console.log('--- ALL MilestonePayments for Buyer ---');
  const allPayments = await prisma.milestonePayment.findMany({
    where: { buyerId },
    include: {
      milestone: true
    }
  });
  console.log(JSON.stringify(allPayments, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
