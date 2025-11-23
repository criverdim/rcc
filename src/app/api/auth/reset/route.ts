import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import { sendMail } from '@/lib/mailer'

export async function POST(req: Request) {
  const body = await req.json()
  const { email } = body as { email: string }
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return NextResponse.json({ ok: true })
  const temp = Math.random().toString(36).slice(2, 8)
  const hash = await hashPassword(temp)
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hash } })
  await sendMail(email, 'Recuperação de senha', `<p>Nova senha temporária: <b>${temp}</b></p>`)
  return NextResponse.json({ ok: true })
}
