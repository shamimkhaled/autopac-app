import { PrismaClient } from '@prisma/client';

async function main() {
  // Test with ssl-mode=REQUIRED
  const url = "mysql://autopacb_user:Autopac970742Secure@103.159.36.250:3306/autopacb_backend_db?ssl-mode=REQUIRED";
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: url,
      },
    },
  });

  try {
    console.log('Attempting to connect with ssl-mode=REQUIRED...');
    await prisma.$connect();
    console.log('Successfully connected with ssl-mode=REQUIRED!');
    await prisma.$disconnect();
  } catch (error) {
    console.error('ssl-mode=REQUIRED connection failed:');
    console.error(error);
  }
}

main();
