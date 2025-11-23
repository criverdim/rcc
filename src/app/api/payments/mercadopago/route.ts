import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { issueTickets } from '@/lib/tickets'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const topic = url.searchParams.get('topic') || url.searchParams.get('type')
    const id = url.searchParams.get('id') || url.searchParams.get('data.id')
    if (topic !== 'payment' || !id) return NextResponse.json({ ok: true })
    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) return NextResponse.json({ ok: true })
    const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN })
    const mpPayment = new Payment(client)
    const payment = await mpPayment.get({ id })
    const orderId = payment.external_reference
    if (payment.status === 'approved' && orderId) {
      const order = await prisma.order.findUnique({ where: { id: orderId }, include: { payment: true } })
      if (order?.payment) {
        await prisma.payment.update({ where: { id: order.payment.id }, data: { status: 'PAID' } })
        await prisma.order.update({ where: { id: order.id }, data: { status: 'PAID' } })
        await issueTickets(order.id)
      }
    }
  } catch {}
  return NextResponse.json({ received: true })
}

export const POST = GET
