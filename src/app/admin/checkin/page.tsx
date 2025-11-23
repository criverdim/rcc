"use client"
import { Html5QrcodeScanner } from "html5-qrcode"
import { useEffect } from "react"

export default function Checkin() {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', { fps: 10, qrbox: { width: 250, height: 250 } }, false)
    scanner.render(async (text) => {
      await fetch('/api/admin/checkin', { method: 'POST', body: JSON.stringify({ qrCode: text }) })
    }, () => {})
    return () => { try { (scanner as any).clear() } catch {} }
  }, [])
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Check-in</h1>
      <div id="reader" className="mt-4" />
    </main>
  )
}
