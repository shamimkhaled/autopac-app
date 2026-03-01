import { PrismaClient } from '@prisma/client';

async function main() {
  // Test with encoded password from encode.js
  const url = "mysql://autopacb_user:%7EDpw%24V%2Bm0dF%2AEaWa@103.159.36.250:3306/autopacb_backend_db";
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: url,
      },
    },
  });

  try {
    console.log('Attempting to connect to database with alternative password...');
    await prisma.$connect();
    console.log('Successfully connected to the database with alternative password!');
    const users = await prisma.user.count();
    console.log('Number of users in DB:', users);
  } catch (error) {
    console.error('Alternative database connection failed:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
