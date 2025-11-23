import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(req: Request) {
  const cookie = (req as any).cookies?.get?.('rcc_token')?.value
  const token = cookie || ''
  const data = verifyToken(token)
  if (!data) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const admin = await prisma.user.findUnique({ where: { id: (data as any).id } })
  if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const type = searchParams.get('type')
  const users = await prisma.user.findMany({ include: { orders: { include: { items: { include: { ticketType: true } }, payment: true } }, tickets: { include: { type: true } } } })
  const filtered = users.map(u => {
    const latestOrder = u.orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]
    return { id: u.id, name: u.name, email: u.email, phone: u.phone, cpf: u.cpf, age: u.age, address: u.address, latestOrder }
  }).filter(r => {
    if (status && r.latestOrder?.status !== status) return false
    if (type && !(r.latestOrder?.items || []).some(i => i.ticketType.name === type)) return false
    return true
  })
  return NextResponse.json(filtered)
}
