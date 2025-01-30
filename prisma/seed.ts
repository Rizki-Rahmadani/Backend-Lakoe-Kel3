import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Check if the default roles already exist
  const adminRole = await prisma.roles.findFirst({
    where: { name: 'admin' },
  });

  const sellerRole = await prisma.roles.findFirst({
    where: { name: 'seller' },
  });

  // If the roles don't exist, create them
  if (!adminRole) {
    await prisma.roles.create({
      data: {
        name: 'admin',
      },
    });
    console.log('Admin role created');
  }

  if (!sellerRole) {
    await prisma.roles.create({
      data: {
        name: 'seller',
      },
    });
    console.log('Seller role created');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
