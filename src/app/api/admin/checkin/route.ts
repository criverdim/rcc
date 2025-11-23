import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const cookie = request.cookies.get('rcc_token')?.value
  const token = cookie || ''
  const data = verifyToken(token)
  if (!data) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const admin = await prisma.user.findUnique({ where: { id: (data as any).id } })
  if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const body = await request.json()
  const { qrCode } = body as { qrCode: string }
  const ticket = await prisma.ticket.findFirst({ where: { qrCode } })
  if (!ticket) return NextResponse.json({ error: 'ticket not found' }, { status: 404 })
  if (ticket.checkedInAt) return NextResponse.json({ error: 'already checked in' }, { status: 400 })
  await prisma.ticket.update({ where: { id: ticket.id }, data: { checkedInAt: new Date() } })
  await prisma.checkinLog.create({ data: { ticketId: ticket.id, adminId: admin.id } })
  return NextResponse.json({ ok: true })
}
