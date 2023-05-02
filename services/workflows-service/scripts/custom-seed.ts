import { PrismaClient } from '@prisma/client';

export async function customSeed() {
  const client = new PrismaClient();
  const email = 'admin@admin.com';

  //replace this sample code to populate your database
  //with data that is required for your service to start
  await client.user.update({
    where: { email: email },
    data: {
      email,
    },
  });

  client.$disconnect();
}
