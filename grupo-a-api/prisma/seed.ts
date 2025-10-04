import { PrismaClient } from '@prisma/client';
import { hash } from 'argon2';
const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@demo.local';
  const pass = await hash('admin123');
  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, password: pass }
  });
  console.log('seed ok:', adminEmail, '/ admin123');
}

main().finally(()=>prisma.$disconnect());
