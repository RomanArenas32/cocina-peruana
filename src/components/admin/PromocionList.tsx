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
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'

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
  const [eliminando, setEliminando] = useState<Promocion | null>(null)
  const [loadingEliminar, setLoadingEliminar] = useState(false)

  async function toggleActiva(id: string, activa: boolean) {
    const supabase = createClient()
    const { error } = await supabase.from('promociones').update({ activa: !activa }).eq('id', id)
    if (error) {
      toast.error('Error al actualizar la promoción')
    } else {
      toast.success(activa ? 'Promoción pausada' : 'Promoción activada')
    }
    router.refresh()
  }

  async function confirmarEliminar() {
    if (!eliminando) return
    setLoadingEliminar(true)
    const supabase = createClient()
    const { error } = await supabase.from('promociones').delete().eq('id', eliminando.id)
    if (error) {
      toast.error('Error al eliminar la promoción')
    } else {
      toast.success('Promoción eliminada')
    }
    setLoadingEliminar(false)
    setEliminando(null)
    router.refresh()
  }

  async function extenderFecha(id: string) {
    if (!nuevaFecha) return
    const supabase = createClient()
    const { error } = await supabase.from('promociones').update({ fecha_expiracion: nuevaFecha }).eq('id', id)
    if (error) {
      toast.error('Error al actualizar la fecha')
    } else {
      toast.success('Fecha actualizada')
      setExtendiendo(null)
      setNuevaFecha('')
    }
    router.refresh()
  }

  if (promociones.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-lg">
        <p className="text-sm">No hay promociones cargadas todavía.</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3">
      {promociones.map((promo) => {
        const estado = estadoExpiracion(promo.fecha_expiracion)

        return (
          <Card key={promo.id} className={`overflow-hidden ${estado === 'expirada' ? 'opacity-60' : ''}`}>
            <CardContent className="p-0 flex items-stretch">
              {promo.imagen_url && (
                <div className="relative w-24 shrink-0">
                  <Image src={promo.imagen_url} alt={promo.titulo} fill sizes="96px" className="object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0 p-4 flex flex-col justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-sm">{promo.titulo}</h3>
                    <Badge className={promo.activa ? 'bg-accent/15 text-foreground border border-accent/40' : 'bg-muted text-muted-foreground border border-border'}>
                      {promo.activa ? 'Activa' : 'Pausada'}
                    </Badge>
                    {estado === 'expirada' && (
                      <Badge className="bg-primary/10 text-primary border border-primary/20">Expirada</Badge>
                    )}
                    {estado === 'vence-hoy' && (
                      <Badge className="bg-accent/15 text-foreground border border-accent/30">Vence hoy</Badge>
                    )}
                  </div>

                  {promo.descripcion && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{promo.descripcion}</p>
                  )}

                  {promo.fecha_expiracion && (
                    <p className="text-xs text-muted-foreground mt-1">
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
                    className="gap-1.5 text-xs text-primary border-primary/20 hover:bg-primary/5"
                    onClick={() => setEliminando(promo)}
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
                      className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-8"
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

      <ConfirmDialog
        open={!!eliminando}
        title={`¿Eliminar "${eliminando?.titulo}"?`}
        description="Esta acción no se puede deshacer. La promoción dejará de mostrarse en la página."
        confirmLabel="Sí, eliminar"
        destructive
        loading={loadingEliminar}
        onConfirm={confirmarEliminar}
        onCancel={() => setEliminando(null)}
      />
    </>
  )
}
