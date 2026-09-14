'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAdminForm } from '@/components/admin/AdminFormContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Trash2, UtensilsCrossed, Tag, Pencil, ImagePlus, Save } from 'lucide-react'
import { compressImage } from '@/lib/compress-image'
import RichTextEditor from '@/components/admin/RichTextEditor'
import Image from 'next/image'
import { toast } from 'sonner'

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
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {platos.map((plato) => (
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

      <Sheet open={!!editando} onOpenChange={(open) => { if (!open) setEditando(null) }}>
        <SheetContent side="right" className="w-full sm:w-[560px] sm:max-w-[560px] flex flex-col p-0 overflow-hidden">
          <SheetHeader className="px-6 py-5 border-b">
            <SheetTitle className="text-lg">Editar plato</SheetTitle>
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
                className="flex items-center gap-2 border border-dashed border-gray-300 rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors text-sm text-gray-500"
              >
                <ImagePlus size={18} className="text-gray-400" />
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

          <div className="px-6 py-4 border-t bg-white">
            <Button
              className="w-full bg-red-700 hover:bg-red-800 text-white gap-2 h-11"
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
