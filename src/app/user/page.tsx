"use client"
import { useEffect, useState } from "react"

export default function UserArea() {
  const [me, setMe] = useState<any>(null)
  const [tickets, setTickets] = useState<any[]>([])
  useEffect(() => { (async () => {
    const m = await fetch('/api/auth/me'); if (m.ok) setMe(await m.json())
    const t = await fetch('/api/user/tickets'); if (t.ok) setTickets(await t.json())
  })() }, [])
  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Área do Usuário</h1>
      {me && (
        <div className="border rounded p-4">
          <div className="font-semibold">Dados pessoais</div>
          <div>{me.name}</div>
          <div>{me.email}</div>
          <div>{me.phone}</div>
          <div>{me.cpf}</div>
          <div>{me.address}</div>
        </div>
      )}
      <div className="border rounded p-4">
        <div className="font-semibold">Ingressos</div>
        <div className="grid gap-3">
          {tickets.map(t => (
            <div key={t.id} className="flex items-center justify-between border p-3 rounded">
              <div>
                <div className="font-medium">{t.type.name}</div>
                <div className="text-sm">Status: {t.status} {t.checkedInAt ? '• Check-in realizado' : ''}</div>
              </div>
              <a className="px-3 py-2 rounded border" href={`/api/user/ticket/${t.id}/pdf`}>Download PDF</a>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
