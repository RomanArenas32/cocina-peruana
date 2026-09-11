'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Pause, Play, Trash2, CalendarPlus } from 'lucide-react'
import Image from 'next/image'

interface Promocion {
  id: string
  titulo: string
  descripcion: string | null
  imagen_url: string | null
  activa: boolean
  fecha_expiracion: string | null
}

function estadoExpiracion(fecha: string | null): 'vigente' | 'vence-hoy' | 'expirada' | null {
  if (!fecha) return null
  const hoy = new Date().toISOString().split('T')[0]
  if (fecha < hoy) return 'expirada'
  if (fecha === hoy) return 'vence-hoy'
  return 'vigente'
}

export default function PromocionList({ promociones }: { promociones: Promocion[] }) {
  const router = useRouter()
  const [extendiendo, setExtendiendo] = useState<string | null>(null)
  const [nuevaFecha, setNuevaFecha] = useState('')

  async function toggleActiva(id: string, activa: boolean) {
    const supabase = createClient()
    await supabase.from('promociones').update({ activa: !activa }).eq('id', id)
    router.refresh()
  }

  async function eliminar(id: string) {
    const supabase = createClient()
    await supabase.from('promociones').delete().eq('id', id)
    router.refresh()
  }

  async function extenderFecha(id: string) {
    if (!nuevaFecha) return
    const supabase = createClient()
    await supabase.from('promociones').update({ fecha_expiracion: nuevaFecha }).eq('id', id)
    setExtendiendo(null)
    setNuevaFecha('')
    router.refresh()
  }

  if (promociones.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 border border-dashed rounded-lg">
        <p className="text-sm">No hay promociones cargadas todavía.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {promociones.map((promo) => {
        const estado = estadoExpiracion(promo.fecha_expiracion)

        return (
          <Card key={promo.id} className={`overflow-hidden ${estado === 'expirada' ? 'opacity-60' : ''}`}>
            <CardContent className="p-0 flex items-stretch">
              {promo.imagen_url && (
                <div className="relative w-24 shrink-0">
                  <Image src={promo.imagen_url} alt={promo.titulo} fill className="object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0 p-4 flex flex-col justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-sm">{promo.titulo}</h3>
                    <Badge className={promo.activa ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}>
                      {promo.activa ? 'Activa' : 'Pausada'}
                    </Badge>
                    {estado === 'expirada' && (
                      <Badge className="bg-red-100 text-red-700 border border-red-200">Expirada</Badge>
                    )}
                    {estado === 'vence-hoy' && (
                      <Badge className="bg-amber-100 text-amber-700 border border-amber-200">Vence hoy</Badge>
                    )}
                  </div>

                  {promo.descripcion && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{promo.descripcion}</p>
                  )}

                  {promo.fecha_expiracion && (
                    <p className="text-xs text-gray-400 mt-1">
                      Expira: {new Date(promo.fecha_expiracion + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-xs"
                    onClick={() => toggleActiva(promo.id, promo.activa)}
                  >
                    {promo.activa ? <Pause size={13} /> : <Play size={13} />}
                    {promo.activa ? 'Pausar' : 'Activar'}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-xs"
                    onClick={() => {
                      setExtendiendo(extendiendo === promo.id ? null : promo.id)
                      setNuevaFecha('')
                    }}
                  >
                    <CalendarPlus size={13} />
                    {promo.fecha_expiracion ? 'Extender' : 'Agregar fecha'}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-xs text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => eliminar(promo.id)}
                  >
                    <Trash2 size={13} />
                    Eliminar
                  </Button>
                </div>

                {extendiendo === promo.id && (
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="date"
                      value={nuevaFecha}
                      onChange={(e) => setNuevaFecha(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="h-8 text-xs"
                    />
                    <Button
                      size="sm"
                      className="bg-red-700 hover:bg-red-800 text-white text-xs h-8"
                      onClick={() => extenderFecha(promo.id)}
                      disabled={!nuevaFecha}
                    >
                      Guardar
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
