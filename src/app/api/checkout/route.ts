import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { createPayment } from '@/lib/payments'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const cookie = request.cookies.get('rcc_token')?.value
  const token = cookie || ''
  const data = verifyToken(token)
  if (!data) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const body = await request.json()
  const { items, method } = body as { items: { ticketTypeId: string; quantity: number }[]; method: 'PIX' | 'CARD' | 'BOLETO' }
  const types = await prisma.ticketType.findMany({ where: { id: { in: items.map(i => i.ticketTypeId) } } })
  let total = 0
  const order = await prisma.order.create({ data: { userId: (data as any).id, status: 'PENDING', totalCents: 0 } })
  for (const it of items) {
    const tt = types.find(t => t.id === it.ticketTypeId)
    if (!tt) continue
    total += tt.priceCents * it.quantity
    await prisma.orderItem.create({ data: { orderId: order.id, ticketTypeId: tt.id, quantity: it.quantity, unitCents: tt.priceCents } })
  }
  await prisma.order.update({ where: { id: order.id }, data: { totalCents: total } })
  const origin = new URL(request.url).origin
  const pay = await createPayment({ orderId: order.id, amountCents: total, method, baseUrl: origin })
  const payment = await prisma.payment.create({ data: { orderId: order.id, provider: pay.provider, providerRef: (pay as any).providerRef || null, status: 'PENDING', method, pixQrData: (pay as any).pixQrData || null, boletoNumber: (pay as any).boletoNumber || null } })
  return NextResponse.json({ orderId: order.id, totalCents: total, payment: { ...payment, initPoint: (pay as any).initPoint || null } })
}
