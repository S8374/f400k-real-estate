import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const buyerId = '321f195b-f49d-4889-af70-f1c39d7c3a25';
  
  console.log('--- Inspecting MilestonePayments for Buyer ---');
  const payments = await prisma.milestonePayment.findMany({
    where: { buyerId },
    include: {
      milestone: true,
    }
  });
  
  console.log(JSON.stringify(payments, null, 2));
  
  console.log('\n--- Inspecting PaymentPlanAcceptance for Buyer ---');
  const acceptance = await prisma.paymentPlanAcceptance.findFirst({
    where: { buyerId },
    include: {
      property: true,
    }
  });
  console.log(JSON.stringify(acceptance, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
