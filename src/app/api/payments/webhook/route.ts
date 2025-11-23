import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { issueTickets } from '@/lib/tickets'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) return NextResponse.json({ ok: true })
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const buf = await request.text()
  const sig = request.headers.get('stripe-signature')
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(buf, sig as string, process.env.STRIPE_WEBHOOK_SECRET)
  } catch {
    return NextResponse.json({ error: 'invalid signature' }, { status: 400 })
  }
  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as Stripe.PaymentIntent
    const orderId = pi.metadata?.orderId
    if (orderId) {
      const order = await prisma.order.findUnique({ where: { id: orderId }, include: { payment: true } })
      if (order && order.payment) {
        await prisma.payment.update({ where: { id: order.payment.id }, data: { status: 'PAID' } })
        await prisma.order.update({ where: { id: order.id }, data: { status: 'PAID' } })
        await issueTickets(order.id)
      }
    }
  }
  return NextResponse.json({ received: true })
}
