import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, setAuthCookie } from '@/lib/auth'
import { sendMail } from '@/lib/mailer'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, email, phone, cpf, age, address, password } = body
  const exists = await prisma.user.findFirst({ where: { OR: [{ email }, { cpf }] } })
  if (exists) return NextResponse.json({ error: 'Já existe usuário com email ou CPF' }, { status: 400 })
  const passwordHash = await hashPassword(password)
  const user = await prisma.user.create({ data: { name, email, phone, cpf, age, address, passwordHash } })
  await sendMail(email, 'Confirmação de cadastro', `<p>Olá ${name}, seu cadastro foi realizado.</p>`)
  const res = NextResponse.json({ id: user.id })
  await setAuthCookie(res, user.id)
  return res
}
