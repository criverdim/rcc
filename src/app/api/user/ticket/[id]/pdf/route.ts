import { NextRequest, NextResponse } from 'next/server'
import { ticketPdf } from '@/lib/tickets'
export const runtime = 'nodejs'

export async function GET(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const buf = await ticketPdf(id)
  if (!buf) return NextResponse.json({ error: 'not found' }, { status: 404 })
  return new NextResponse(buf, { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="ticket-${id}.pdf"` } })
}
