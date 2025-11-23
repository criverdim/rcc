import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get('rcc_token')?.value
  const token = cookie || ''
  const data = verifyToken(token)
  if (!data) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const user = await prisma.user.findUnique({ where: { id: (data as any).id } })
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  return NextResponse.json({ id: user.id, name: user.name, email: user.email, phone: user.phone, cpf: user.cpf, age: user.age, address: user.address, role: user.role })
}

export async function PATCH(request: NextRequest) {
  const cookie = request.cookies.get('rcc_token')?.value
  const token = cookie || ''
  const data = verifyToken(token)
  if (!data) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const body = await request.json()
  const updated = await prisma.user.update({ where: { id: (data as any).id }, data: body })
  return NextResponse.json({ id: updated.id })
}
