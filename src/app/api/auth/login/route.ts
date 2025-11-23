import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword, setAuthCookie } from '@/lib/auth'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { email, password } = body
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 400 })
  const ok = await comparePassword(password, user.passwordHash)
  if (!ok) return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 400 })
  const res = NextResponse.json({ id: user.id, role: user.role })
  await setAuthCookie(res, user.id)
  return res
}
