"use client"
import { useEffect, useState } from "react"

export default function Admin() {
  const [items, setItems] = useState<any[]>([])
  useEffect(() => { (async () => { const r = await fetch('/api/admin/inscritos'); if (r.ok) setItems(await r.json()) })() }, [])
  const total = items.length
  const pagos = items.filter(i => i.latestOrder?.status === 'PAID').length
  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Painel Administrativo</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded p-4"><div className="text-sm">Total de inscritos</div><div className="text-3xl font-semibold">{total}</div></div>
        <div className="border rounded p-4"><div className="text-sm">Total pagos</div><div className="text-3xl font-semibold">{pagos}</div></div>
      </div>
      <div className="border rounded p-4">
        <div className="font-semibold">Inscritos</div>
        <div className="grid gap-3">
          {items.map(it => (
            <div key={it.id} className="flex items-center justify-between border rounded p-3">
              <div>
                <div className="font-medium">{it.name}</div>
                <div className="text-sm">{it.email} • {it.cpf}</div>
              </div>
              <div className="text-sm">{it.latestOrder?.status || '—'}</div>
            </div>
          ))}
        </div>
        <a className="mt-4 inline-block px-3 py-2 rounded border" href="/api/admin/export">Exportar CSV</a>
      </div>
    </main>
  )
}
