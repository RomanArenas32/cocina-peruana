'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAdminForm } from '@/components/admin/AdminFormContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Trash2, UtensilsCrossed, Tag, Pencil, ImagePlus, Save, Search, X } from 'lucide-react'
import type { OpcionGrupo } from '@/components/cart/CartProvider'
import { compressImage } from '@/lib/compress-image'
import RichTextEditor from '@/components/admin/RichTextEditor'
import Image from 'next/image'
import { toast } from 'sonner'

const PAGE_SIZE = 12

interface Plato {
  id: string
  nombre: string
  descripcion: string | null
  precio: number | null
  imagen_url: string | null
  opciones: OpcionGrupo[] | null
}

export default function CartaList({ platos }: { platos: Plato[] }) {
  const router = useRouter()
  const { setPlatoDia, setPromocion } = useAdminForm()

  const [query, setQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const filtered = query.trim()
    ? platos.filter(p => p.nombre.toLowerCase().includes(query.toLowerCase()))
    : platos

  const visible = query.trim() ? filtered : filtered.slice(0, visibleCount)
  const hasMore = !query.trim() && visibleCount < platos.length

  const loadMore = useCallback(() => {
    setVisibleCount(n => Math.min(n + PAGE_SIZE, platos.length))
  }, [platos.length])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore() },
      { rootMargin: '120px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [loadMore])

  const [editando, setEditando] = useState<Plato | null>(null)
  const [editNombre, setEditNombre] = useState('')
  const [editDescripcion, setEditDescripcion] = useState('')
  const [editPrecio, setEditPrecio] = useState('')
  const [editImagen, setEditImagen] = useState<File | null>(null)
  const [editPreview, setEditPreview] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)

  function abrirEdicion(plato: Plato) {
    setEditando(plato)
    setEditNombre(plato.nombre)
    setEditDescripcion(plato.descripcion ?? '')
    setEditPrecio(plato.precio?.toString() ?? '')
    setEditImagen(null)
    setEditPreview(plato.imagen_url)
  }

  function handleEditImagen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setEditImagen(file)
    setEditPreview(URL.createObjectURL(file))
  }

  async function guardarEdicion() {
    if (!editando) return
    setGuardando(true)
    const supabase = createClient()

    let imagen_url = editando.imagen_url

    if (editImagen) {
      const compressed = await compressImage(editImagen)
      const path = `carta/${Date.now()}.webp`
      const { error: uploadError } = await supabase.storage
        .from('imagenes')
        .upload(path, compressed, { contentType: 'image/webp' })

      if (!uploadError) {
        const { data: urlData } = supabase.storage.from('imagenes').getPublicUrl(path)
        imagen_url = urlData.publicUrl
      }
    }

    const { error } = await supabase.from('platos').update({
      nombre: editNombre,
      descripcion: editDescripcion || null,
      precio: editPrecio ? parseFloat(editPrecio) : null,
      imagen_url,
    }).eq('id', editando.id)

    if (error) {
      toast.error('Error al guardar los cambios')
    } else {
      toast.success('Plato actualizado')
      setEditando(null)
    }
    setGuardando(false)
    router.refresh()
  }

  async function eliminar(id: string) {
    const supabase = createClient()
    const { error } = await supabase.from('platos').delete().eq('id', id)
    if (error) {
      toast.error('Error al eliminar el plato')
    } else {
      toast.success('Plato eliminado')
    }
    router.refresh()
  }

  function usarComoPlatoDia(plato: Plato) {
    setPlatoDia({
      nombre: plato.nombre,
      descripcion: plato.descripcion ?? '',
      precio: plato.precio?.toString() ?? '',
      opciones: plato.opciones ?? [],
      imagen: null,
      preview: plato.imagen_url,
    })
    router.push('/admin')
  }

  function usarEnPromocion(plato: Plato) {
    setPromocion({
      titulo: plato.nombre,
      descripcion: plato.descripcion ?? '',
      opciones: plato.opciones ?? [],
      imagen: null,
      preview: plato.imagen_url,
    })
    router.push('/admin/promociones')
  }

  if (platos.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground border border-dashed border-border rounded-lg">
        <p className="text-sm">No hay platos en la carta todavía.</p>
      </div>
    )
  }

  return (
    <>
      {/* Buscador */}
      <div className="relative mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          value={query}
          onChange={e => { setQuery(e.target.value); setVisibleCount(PAGE_SIZE) }}
          placeholder="Buscar platos..."
          className="pl-9 pr-9 border-border focus-visible:ring-primary/30"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setVisibleCount(PAGE_SIZE) }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Sin resultados */}
      {query.trim() && filtered.length === 0 && (
        <div className="text-center py-10 text-muted-foreground border border-dashed border-border rounded-lg">
          <p className="text-sm">Sin resultados para &quot;{query}&quot;</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {visible.map((plato) => (
          <Card key={plato.id} className="overflow-hidden p-0">
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
                  <div
                    className="rich-content text-xs text-gray-400 mt-1 line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: plato.descripcion }}
                  />
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
                  className="gap-1.5 text-xs"
                  onClick={() => abrirEdicion(plato)}
                >
                  <Pencil size={13} />
                  Editar
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

      {/* Sentinel para infinite scroll */}
      {hasMore && <div ref={sentinelRef} className="h-8" />}

      <Sheet open={!!editando} onOpenChange={(open) => { if (!open) setEditando(null) }}>
        <SheetContent side="right" className="w-full sm:w-[560px] sm:max-w-[560px] flex flex-col p-0 overflow-hidden" showCloseButton={false}>
          <SheetHeader className="bg-primary text-primary-foreground px-6 py-4 flex-row items-center justify-between shrink-0">
            <SheetTitle className="font-heading text-primary-foreground text-base">Editar plato</SheetTitle>
            <button onClick={() => setEditando(null)} className="text-primary-foreground/60 hover:text-primary-foreground transition-colors" aria-label="Cerrar">
              <X size={18} />
            </button>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Nombre</Label>
                <Input value={editNombre} onChange={(e) => setEditNombre(e.target.value)} placeholder="Ej: Ceviche clásico" />
              </div>
              <div className="space-y-1.5">
                <Label>Precio ($)</Label>
                <Input
                  type="number"
                  value={editPrecio}
                  onChange={(e) => setEditPrecio(e.target.value)}
                  placeholder="Ej: 3500"
                  step="0.01"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Descripción</Label>
              <RichTextEditor
                value={editDescripcion}
                onChange={setEditDescripcion}
                placeholder="Ingredientes, acompañamientos..."
              />
            </div>

            <div className="space-y-1.5">
              <Label>Foto</Label>
              <label
                htmlFor="edit-img"
                className="flex items-center gap-2 border border-dashed border-accent/30 rounded-lg px-4 py-3 cursor-pointer hover:bg-accent/5 transition-colors text-sm text-muted-foreground"
              >
                <ImagePlus size={18} className="text-accent/60" />
                {editImagen ? editImagen.name : 'Cambiar imagen...'}
              </label>
              <Input id="edit-img" type="file" accept="image/*" onChange={handleEditImagen} className="hidden" />
              {editPreview && (
                <div className="relative w-full h-52 mt-2 rounded-xl overflow-hidden border">
                  <Image src={editPreview} alt="Preview" fill className="object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="px-6 py-4 border-t border-border bg-muted/40">
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-11 font-semibold"
              onClick={guardarEdicion}
              disabled={guardando}
            >
              <Save size={16} />
              {guardando ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
