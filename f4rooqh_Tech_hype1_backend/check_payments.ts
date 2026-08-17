import { PrismaClient } from './src/generated/prisma';

const prisma = new PrismaClient();

async function checkPayments() {
  const userId = '321f195b-f49d-4889-af70-f1c39d7c3a25';
  
  const payments = await prisma.milestonePayment.findMany({
    where: {
      OR: [
        { buyerId: userId },
        { agentId: userId },
        { adminId: userId }
      ]
    },
    include: {
      milestone: true
    }
  });

  console.log('--- Payments for User ---');
  console.log(JSON.stringify(payments, null, 2));
}

checkPayments().catch(console.error).finally(() => prisma.$disconnect());
