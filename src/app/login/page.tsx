"use client"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"

export default function Login() {
  const { register, handleSubmit } = useForm()
  const router = useRouter()
  async function onSubmit(data: any) {
    const res = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify(data) })
    if (res.ok) router.push('/tickets')
  }
  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid grid-cols-1 gap-3">
        <input className="border p-2" placeholder="Email" type="email" {...register('email')} />
        <input className="border p-2" placeholder="Senha" type="password" {...register('password')} />
        <button className="px-4 py-2 rounded bg-black text-white" type="submit">Entrar</button>
      </form>
    </main>
  )
}
