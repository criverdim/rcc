import PDFDocument from 'pdfkit'
import QRCode from 'qrcode'
import { prisma } from './prisma'

export async function issueTickets(orderId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: { include: { ticketType: true } }, user: true } })
  if (!order) return []
  const created: string[] = []
  for (const item of order.items) {
    for (let i = 0; i < item.quantity; i++) {
      const qrData = `TICKET|ORDER:${order.id}|USER:${order.userId}|TYPE:${item.ticketType.name}|SEQ:${i + 1}`
      const qr = await QRCode.toDataURL(qrData)
      const t = await prisma.ticket.create({ data: { userId: order.userId, orderId: order.id, ticketTypeId: item.ticketTypeId, qrCode: qr } })
      created.push(t.id)
    }
  }
  return created
}

export async function ticketPdf(ticketId: string) {
  const ticket = await prisma.ticket.findUnique({ where: { id: ticketId }, include: { user: true, type: true, order: true } })
  if (!ticket) return null
  const doc = new PDFDocument({ size: 'A4' })
  const chunks: Buffer[] = []
  doc.on('data', d => chunks.push(d))
  const base64 = ticket.qrCode.split(',')[1]
  const qrPng = Buffer.from(base64, 'base64')
  doc.fontSize(20).text('Retiro de Carnaval - Ingresso')
  doc.moveDown()
  doc.fontSize(14).text(`Nome: ${ticket.user.name}`)
  doc.text(`Tipo: ${ticket.type.name}`)
  doc.text(`Ingresso: ${ticket.id}`)
  doc.moveDown()
  doc.image(qrPng, { width: 200, height: 200 })
  doc.end()
  await new Promise(r => doc.on('end', r))
  return Buffer.concat(chunks)
}
