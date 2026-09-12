'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAdminForm } from '@/components/admin/AdminFormContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Trash2, UtensilsCrossed, Tag } from 'lucide-react'
import Image from 'next/image'

interface Plato {
  id: string
  nombre: string
  descripcion: string | null
  precio: number | null
  imagen_url: string | null
}

export default function CartaList({ platos }: { platos: Plato[] }) {
  const router = useRouter()
  const { setPlatoDia, setPromocion } = useAdminForm()

  async function eliminar(id: string) {
    const supabase = createClient()
    await supabase.from('platos').delete().eq('id', id)
    router.refresh()
  }

  function usarComoPlatoDia(plato: Plato) {
    setPlatoDia({
      nombre: plato.nombre,
      descripcion: plato.descripcion ?? '',
      precio: plato.precio?.toString() ?? '',
      imagen: null,
      preview: plato.imagen_url,
    })
    router.push('/admin')
  }

  function usarEnPromocion(plato: Plato) {
    setPromocion({
      titulo: plato.nombre,
      descripcion: plato.descripcion ?? '',
      imagen: null,
      preview: plato.imagen_url,
    })
    router.push('/admin/promociones')
  }

  if (platos.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400 border border-dashed rounded-lg">
        <p className="text-sm">No hay platos en la carta todavía.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {platos.map((plato) => (
        <Card key={plato.id} className="overflow-hidden">
          {plato.imagen_url && (
            <div className="relative w-full h-36">
              <Image
                src={plato.imagen_url}
                alt={plato.nombre}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          )}
          <CardContent className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-sm">{plato.nombre}</h3>
              {plato.precio && (
                <p className="text-xs text-gray-500 mt-0.5">${plato.precio}</p>
              )}
              {plato.descripcion && (
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{plato.descripcion}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 text-xs"
                onClick={() => usarComoPlatoDia(plato)}
              >
                <UtensilsCrossed size={13} />
                Plato del día
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 text-xs"
                onClick={() => usarEnPromocion(plato)}
              >
                <Tag size={13} />
                Promoción
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 text-xs text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => eliminar(plato.id)}
              >
                <Trash2 size={13} />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
