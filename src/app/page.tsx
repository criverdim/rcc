export default function Home() {
  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <section className="rounded-lg border p-6 bg-white">
        <h1 className="text-3xl font-bold">Retiro de Carnaval 2025</h1>
        <p className="mt-2">Data: 01–04 de Março • Local: Sítio Esperança • Atividades: Louvor, palestras, dinâmicas, convivência e espiritualidade.</p>
        <p className="mt-2">Valores e tipos de ingressos disponíveis em Ingressos. Regras: documento obrigatório, respeito às normas do local, horários de silêncio.</p>
        <div className="mt-4 flex gap-3">
          <a href="/signup" className="px-4 py-2 rounded bg-black text-white">Inscreva-se</a>
          <a href="/tickets" className="px-4 py-2 rounded border">Comprar Ingresso</a>
        </div>
      </section>
      <section className="rounded-lg border p-6 bg-white">
        <h2 className="text-xl font-semibold">Informações</h2>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Check-in a partir das 08:00</li>
          <li>Opções com e sem hospedagem</li>
          <li>Alimentação inclusa no ingresso completo</li>
          <li>Transporte coletivo opcional</li>
        </ul>
      </section>
    </main>
  )
}
