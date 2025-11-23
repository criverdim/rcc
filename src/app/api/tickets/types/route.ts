import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
export const runtime = 'nodejs'

export async function GET() {
  const types = await prisma.ticketType.findMany({ where: { active: true }, orderBy: { priceCents: 'asc' } })
  return NextResponse.json(types)
}
