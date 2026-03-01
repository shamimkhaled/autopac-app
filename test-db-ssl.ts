import { PrismaClient } from '@prisma/client';

async function main() {
  // Test with ssl-mode=DISABLED
  const url = "mysql://autopacb_user:Autopac970742Secure@103.159.36.250:3306/autopacb_backend_db?ssl-mode=DISABLED";
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: url,
      },
    },
  });

  try {
    console.log('Attempting to connect with ssl-mode=DISABLED...');
    await prisma.$connect();
    console.log('Successfully connected with ssl-mode=DISABLED!');
    await prisma.$disconnect();
  } catch (error) {
    console.error('ssl-mode=DISABLED connection failed:');
    console.error(error);
  }
}

main();
