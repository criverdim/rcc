import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { issueTickets } from '@/lib/tickets'
import { sendMail } from '@/lib/mailer'

export async function POST(req: Request) {
  const body = await req.json()
  const { orderId } = body as { orderId: string }
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { payment: true } })
  if (!order) return NextResponse.json({ error: 'order not found' }, { status: 404 })
  if (order.payment?.provider !== 'SIMULATOR') return NextResponse.json({ error: 'not simulator' }, { status: 400 })
  await prisma.payment.update({ where: { id: order.payment!.id }, data: { status: 'PAID' } })
  await prisma.order.update({ where: { id: order.id }, data: { status: 'PAID' } })
  await issueTickets(order.id)
  const u = await prisma.user.findUnique({ where: { id: order.userId } })
  if (u) await sendMail(u.email, 'Confirmação de pagamento', `<p>Pagamento confirmado. Seus ingressos estão disponíveis na Área do Usuário.</p>`)
  return NextResponse.json({ ok: true })
}
