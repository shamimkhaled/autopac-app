import { PrismaClient } from '@prisma/client';

async function main() {
  // Test with autopacb_db as database name
  const url = "mysql://autopacb_user:Autopac970742Secure@103.159.36.250:3306/autopacb_db";
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: url,
      },
    },
  });

  try {
    console.log('Attempting to connect to database with alternative DB name...');
    await prisma.$connect();
    console.log('Successfully connected to the database with alternative DB name!');
    await prisma.$disconnect();
  } catch (error) {
    console.error('Alternative DB name connection failed:');
    console.error(error);
  }
}

main();
