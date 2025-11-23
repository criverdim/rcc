"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type TicketType = { id: string; name: string; description: string; priceCents: number }

export default function Tickets() {
  const [types, setTypes] = useState<TicketType[]>([])
  const [quant, setQuant] = useState<Record<string, number>>({})
  const [method, setMethod] = useState<'PIX'|'CARD'|'BOLETO'>('PIX')
  const [payment, setPayment] = useState<any>(null)
  const router = useRouter()
  useEffect(() => { (async () => { const r = await fetch('/api/tickets/types'); setTypes(await r.json()) })() }, [])
  const total = types.reduce((s, t) => s + (quant[t.id] || 0) * t.priceCents, 0)
  async function checkout() {
    const items = types.map(t => ({ ticketTypeId: t.id, quantity: quant[t.id] || 0 })).filter(i => i.quantity > 0)
    if (!items.length) return
    const res = await fetch('/api/checkout', { method: 'POST', body: JSON.stringify({ items, method }) })
    const data = await res.json()
    setPayment({ ...data.payment, orderId: data.orderId })
  }
  async function confirmSim() {
    if (!payment) return
    await fetch('/api/payments/confirm', { method: 'POST', body: JSON.stringify({ orderId: payment.orderId }) })
    router.push('/user')
  }
  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Ingressos</h1>
      <div className="grid gap-4">
        {types.map(t => (
          <div key={t.id} className="border rounded p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold">{t.name}</div>
              <div className="text-sm text-gray-600">{t.description}</div>
            </div>
            <div className="flex items-center gap-3">
              <span>R$ {(t.priceCents/100).toFixed(2)}</span>
              <input type="number" className="border w-20 p-2" value={quant[t.id]||0} onChange={e=>setQuant(p=>({ ...p, [t.id]: Number(e.target.value) }))} />
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2"><input type="radio" checked={method==='PIX'} onChange={()=>setMethod('PIX')} /> PIX</label>
        <label className="flex items-center gap-2"><input type="radio" checked={method==='CARD'} onChange={()=>setMethod('CARD')} /> Cartão</label>
        <label className="flex items-center gap-2"><input type="radio" checked={method==='BOLETO'} onChange={()=>setMethod('BOLETO')} /> Boleto</label>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-xl">Total: R$ {(total/100).toFixed(2)}</div>
        <button className="px-4 py-2 rounded bg-black text-white" onClick={checkout}>Continuar</button>
      </div>
      {payment && (
        <div className="border rounded p-4 space-y-2">
          <div className="font-semibold">Pagamento</div>
          {payment.pixQrData && <img src={payment.pixQrData} alt="PIX" className="w-48 h-48" />}
          {payment.boletoNumber && <div>Boleto: {payment.boletoNumber}</div>}
          {payment.initPoint && <a className="px-4 py-2 rounded bg-blue-600 text-white inline-block" href={payment.initPoint} target="_blank">Pagar no Mercado Pago</a>}
          <button className="px-4 py-2 rounded bg-green-600 text-white" onClick={confirmSim}>Confirmar (Simulador)</button>
        </div>
      )}
    </main>
  )
}
