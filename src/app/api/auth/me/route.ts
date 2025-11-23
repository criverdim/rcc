import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(req: Request) {
  const cookie = (req as any).cookies?.get?.('rcc_token')?.value
  const token = cookie || ''
  const data = verifyToken(token)
  if (!data) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const user = await prisma.user.findUnique({ where: { id: (data as any).id } })
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  return NextResponse.json({ id: user.id, name: user.name, email: user.email, phone: user.phone, cpf: user.cpf, age: user.age, address: user.address, role: user.role })
}

export async function PATCH(req: Request) {
  const cookie = (req as any).cookies?.get?.('rcc_token')?.value
  const token = cookie || ''
  const data = verifyToken(token)
  if (!data) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const body = await req.json()
  const updated = await prisma.user.update({ where: { id: (data as any).id }, data: body })
  return NextResponse.json({ id: updated.id })
}
