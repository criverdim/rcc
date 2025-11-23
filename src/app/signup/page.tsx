"use client"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"

export default function Signup() {
  const { register, handleSubmit } = useForm()
  const router = useRouter()
  async function onSubmit(data: any) {
    const res = await fetch('/api/auth/signup', { method: 'POST', body: JSON.stringify({ ...data, age: Number(data.age) }) })
    if (res.ok) router.push('/tickets')
  }
  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Inscrição</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid grid-cols-1 gap-3">
        <input className="border p-2" placeholder="Nome completo" {...register('name')} />
        <input className="border p-2" placeholder="Email" type="email" {...register('email')} />
        <input className="border p-2" placeholder="Telefone" {...register('phone')} />
        <input className="border p-2" placeholder="CPF" {...register('cpf')} />
        <input className="border p-2" placeholder="Idade" type="number" {...register('age')} />
        <input className="border p-2" placeholder="Endereço" {...register('address')} />
        <input className="border p-2" placeholder="Senha" type="password" {...register('password')} />
        <button className="px-4 py-2 rounded bg-black text-white" type="submit">Cadastrar</button>
      </form>
    </main>
  )
}
