import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  try {
    console.log('Attempting to connect to database...');
    console.log('Using URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));
    await prisma.$connect();
    console.log('Successfully connected to the database!');
    const users = await prisma.user.count();
    console.log('Number of users in DB:', users);
  } catch (error) {
    console.error('Database connection failed:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
