'use client'

import { useState } from 'react'
import { Eye, EyeOff, ChefHat } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email o contraseña incorrectos')
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <main className="h-dvh overflow-hidden flex">

      {/* Panel izquierdo — solo desktop */}
      <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-red-700 text-white px-12 text-center">
        <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-2xl mb-6">
          <Image src="/logo.jpeg" alt="Logo" width={144} height={144} className="object-cover w-full h-full" />
        </div>
        <h1 className="text-4xl font-bold">Sabores del Perú</h1>
        <p className="mt-2 text-amber-200 text-sm tracking-widest uppercase">Panel de administración</p>
        <p className="mt-6 text-white/60 text-sm leading-relaxed max-w-xs">
          Gestioná tu menú, plato del día y promociones desde acá.
        </p>
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 bg-amber-50 px-6">
        <Card className="w-full max-w-sm shadow-xl border-0">
          <CardHeader className="items-center text-center pb-4">
            {/* Logo solo en mobile */}
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-red-700 shadow mb-2 md:hidden">
              <Image src="/logo.jpeg" alt="Logo" width={56} height={56} className="object-cover w-full h-full" />
            </div>
            <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
              <ChefHat size={20} className="text-red-700" />
              Ingresar
            </CardTitle>
            <CardDescription>Sabores del Perú</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="tu@email.com"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-md">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-red-700 hover:bg-red-800 text-white font-semibold"
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Ingresar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

    </main>
  )
}
