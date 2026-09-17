'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Save } from 'lucide-react'
import { toast } from 'sonner'

interface Config {
  id: string
  horarios: string | null
  direccion: string | null
  descripcion_negocio: string | null
}

export default function ConfigForm({ config }: { config: Config | null }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [horarios, setHorarios] = useState(config?.horarios ?? '')
  const [direccion, setDireccion] = useState(config?.direccion ?? '')
  const [descripcion, setDescripcion] = useState(config?.descripcion_negocio ?? '')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    const payload = {
      horarios: horarios || null,
      direccion: direccion || null,
      descripcion_negocio: descripcion || null,
      updated_at: new Date().toISOString(),
    }

    const { error } = config
      ? await supabase.from('config').update(payload).eq('id', config.id)
      : await supabase.from('config').insert(payload)

    if (error) {
      toast.error('Error al guardar la configuración')
    } else {
      toast.success('Configuración guardada')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Horarios de atención</CardTitle>
          <CardDescription>Se muestran en el pie de página de tu web.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="horarios">Horarios</Label>
              <Textarea
                id="horarios"
                value={horarios}
                onChange={(e) => setHorarios(e.target.value)}
                placeholder={'Lunes a Sábado · 12:00 – 22:00 hs\nDomingos · 12:00 – 20:00 hs'}
                rows={3}
              />
              <p className="text-xs text-gray-400">Una línea por franja horaria. Si está vacío no se muestra nada.</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Ej: Av. San Martín 450, Azul"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="descripcion">Descripción del negocio</Label>
              <Textarea
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="La auténtica cocina peruana en el corazón de la provincia de Buenos Aires."
                rows={2}
              />
              <p className="text-xs text-gray-400">Aparece en el hero de la web. Si está vacío se usa el texto por defecto.</p>
            </div>

            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2" disabled={loading}>
              <Save size={16} />
              {loading ? 'Guardando...' : 'Guardar configuración'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
