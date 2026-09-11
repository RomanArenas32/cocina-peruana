'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'

interface Promocion {
  id: string
  titulo: string
  descripcion: string | null
  imagen_url: string | null
  activa: boolean
}

export default function PromocionList({ promociones }: { promociones: Promocion[] }) {
  const router = useRouter()

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

  if (promociones.length === 0) {
    return <p className="text-gray-500 text-sm">No hay promociones cargadas.</p>
  }

  return (
    <div className="space-y-4">
      {promociones.map((promo) => (
        <Card key={promo.id}>
          <CardContent className="p-4 flex gap-4 items-start">
            {promo.imagen_url && (
              <div className="relative w-20 h-20 rounded overflow-hidden shrink-0">
                <Image src={promo.imagen_url} alt={promo.titulo} fill className="object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-sm">{promo.titulo}</h3>
                <Badge className={promo.activa ? 'bg-green-600 text-white' : 'bg-gray-400 text-white'}>
                  {promo.activa ? 'Activa' : 'Pausada'}
                </Badge>
              </div>
              {promo.descripcion && (
                <p className="text-xs text-gray-500 mt-1 truncate">{promo.descripcion}</p>
              )}
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleActiva(promo.id, promo.activa)}
                >
                  {promo.activa ? 'Pausar' : 'Activar'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => eliminar(promo.id)}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
