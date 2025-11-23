import { NextResponse } from 'next/server'
import { ticketPdf } from '@/lib/tickets'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const buf = await ticketPdf(params.id)
  if (!buf) return NextResponse.json({ error: 'not found' }, { status: 404 })
  return new NextResponse(buf, { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="ticket-${params.id}.pdf"` } })
}
