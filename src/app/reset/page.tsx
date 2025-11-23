"use client"
import { useForm } from "react-hook-form"

export default function Reset() {
  const { register, handleSubmit } = useForm()
  async function onSubmit(data: any) {
    await fetch('/api/auth/reset', { method: 'POST', body: JSON.stringify(data) })
  }
  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Recuperar Senha</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-3">
        <input className="border p-2" placeholder="Email" type="email" {...register('email')} />
        <button className="px-4 py-2 rounded bg-black text-white" type="submit">Enviar</button>
      </form>
    </main>
  )
}
