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
  const users = await prisma.user.findMany({ include: { orders: true, tickets: true } })
  const rows = [['id','name','email','phone','cpf','age','tickets','orders']]
  for (const u of users) {
    rows.push([u.id, u.name, u.email, u.phone, u.cpf, String(u.age), String(u.tickets.length), String(u.orders.length)])
  }
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n')
  return new NextResponse(csv, { headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="inscritos.csv"' } })
}
