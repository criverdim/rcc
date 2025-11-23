import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { prisma } from './prisma'

const COOKIE_NAME = 'rcc_token'

export function signToken(payload: object) {
  const secret = process.env.JWT_SECRET || 'dev'
  return jwt.sign(payload, secret, { expiresIn: '7d' })
}

export function verifyToken(token: string) {
  const secret = process.env.JWT_SECRET || 'dev'
  try {
    return jwt.verify(token, secret) as any
  } catch {
    return null
  }
}

export async function getAuthUser() {
  const c = await cookies()
  const token = c.get(COOKIE_NAME)?.value
  if (!token) return null
  const data = verifyToken(token)
  if (!data) return null
  return prisma.user.findUnique({ where: { id: data.id } })
}

export async function requireAuth(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value
  if (!token) return null
  const data = verifyToken(token)
  if (!data) return null
  return prisma.user.findUnique({ where: { id: data.id } })
}

export async function setAuthCookie(res: NextResponse, userId: string) {
  const token = signToken({ id: userId })
  res.cookies.set({ name: COOKIE_NAME, value: token, httpOnly: true, secure: false, sameSite: 'lax', path: '/' })
}

export async function hashPassword(p: string) {
  const saltRounds = 10
  return bcrypt.hash(p, saltRounds)
}

export async function comparePassword(p: string, h: string) {
  return bcrypt.compare(p, h)
}
