const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function run() {
  const types = [
    { name: 'Completo', description: 'Ingresso completo com hospedagem', priceCents: 45000, capacity: 200 },
    { name: 'Sem Hospedagem', description: 'Ingresso completo sem hospedagem', priceCents: 30000, capacity: 300 },
    { name: 'Day-use', description: 'Acesso por um dia', priceCents: 12000, capacity: 400 }
  ]
  for (const t of types) {
    await prisma.ticketType.upsert({
      where: { name: t.name },
      update: {},
      create: t
    })
  }
  const adminEmail = 'admin@retirorc.local'
  const admin = await prisma.user.findUnique({ where: { email: adminEmail } })
  if (!admin) {
    await prisma.user.create({ data: { name: 'Admin', email: adminEmail, phone: '0000000000', cpf: '00000000000', age: 30, address: 'Sede', passwordHash: '$2b$10$hZlqgO8GIt3FJQwKcVb3Ne7g9V2d8T9b1K0KkG8JYwEwUlZcO0l/G', role: 'ADMIN' } })
  }
}

run().finally(async () => {
  await prisma.$disconnect()
})
