/// <reference types="node" />
import { PrismaClient } from '@prisma/client'
import { hash } from 'argon2'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@demo.local'
  const password = await hash('admin123')

  await prisma.admin.upsert({
    where: { email },
    update: {},                     
    create: { email, password },     
  })

  console.log(`[seed] admin pronto: ${email} / admin123`)
}

main()
  .catch((err) => {
    console.error('[seed] erro:', err)
    // não propaga erro pra não derrubar o container quando o entrypoint roda sempre
    process.exit(0)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
