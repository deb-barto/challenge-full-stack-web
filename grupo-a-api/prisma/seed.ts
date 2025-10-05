/// <reference types="node" />
import { PrismaClient } from '@prisma/client'
import { hash } from 'argon2'

const prisma = new PrismaClient()

async function main() {
  const username = 'admin'
  const email = 'admin@demo.local'
  const password = await hash('admin123')

  await prisma.admin.upsert({
    where: { username },
    update: { email },
    create: { username, email, password },
  })

  console.log(`[seed] admin pronto: ${username} / admin123`)
}

main()
  .catch((err) => {
    console.error('[seed] erro:', err)
    process.exit(0)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
