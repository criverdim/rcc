import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get('rcc_token')?.value
  const token = cookie || ''
  const data = verifyToken(token)
  if (!data) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const tickets = await prisma.ticket.findMany({ where: { userId: (data as any).id }, include: { type: true, order: true } })
  return NextResponse.json(tickets)
}
