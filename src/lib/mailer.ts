import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'

export async function sendMail(to: string, subject: string, html: string) {
  const dir = path.join(process.cwd(), 'emails')
  if (!fs.existsSync(dir)) fs.mkdirSync(dir)
  const ts = Date.now()
  const file = path.join(dir, `${ts}-${to.replace(/[^a-zA-Z0-9]/g, '_')}.html`)
  fs.writeFileSync(file, html)
  return { preview: file }
}
