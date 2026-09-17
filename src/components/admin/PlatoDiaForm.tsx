'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ImagePlus, Save, Trash2 } from 'lucide-react'
import { compressImage } from '@/lib/compress-image'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { useAdminForm } from '@/components/admin/AdminFormContext'
import Image from 'next/image'
import { toast } from 'sonner'

interface PlatoDia {
  id: string
  nombre: string
  descripcion: string | null
  precio: number | null
  imagen_url: string | null
}

export default function PlatoDiaForm({ platoDia }: { platoDia: PlatoDia | null }) {
  const router = useRouter()
  const { platoDia: form, setPlatoDia } = useAdminForm()
  const [loading, setLoading] = useState(false)
  const [eliminando, setEliminando] = useState(false)

  // Inicializar con datos de la DB si el form está vacío
  const nombre = form.nombre || platoDia?.nombre || ''
  const descripcion = form.descripcion || platoDia?.descripcion || ''
  const precio = form.precio || platoDia?.precio?.toString() || ''
  const preview = form.preview ?? platoDia?.imagen_url ?? null

  async function handleEliminar() {
    if (!platoDia) return
    setEliminando(true)
    const supabase = createClient()
    const { error } = await supabase.from('plato_dia').delete().eq('id', platoDia.id)
    if (error) {
      toast.error('Error al eliminar el plato')
    } else {
      toast.success('Plato del día eliminado')
      setPlatoDia({ nombre: '', descripcion: '', precio: '', imagen: null, preview: null })
      router.refresh()
    }
    setEliminando(false)
  }

  function handleImagen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPlatoDia({ imagen: file, preview: URL.createObjectURL(file) })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    let imagen_url = platoDia?.imagen_url ?? (form.preview?.startsWith('http') ? form.preview : null)

    if (form.imagen) {
      const compressed = await compressImage(form.imagen)
      const path = `plato-dia/actual.webp`
      const { error: uploadError } = await supabase.storage
        .from('imagenes')
        .upload(path, compressed, { upsert: true, contentType: 'image/webp' })

      if (uploadError) {
        toast.error('Error al subir la imagen')
        setLoading(false)
        return
      }

      const { data: urlData } = supabase.storage.from('imagenes').getPublicUrl(path)
      imagen_url = urlData.publicUrl
    }

    const payload = {
      nombre,
      descripcion: descripcion || null,
      precio: precio ? parseFloat(precio) : null,
      imagen_url,
    }

    const { error } = platoDia
      ? await supabase.from('plato_dia').update(payload).eq('id', platoDia.id)
      : await supabase.from('plato_dia').insert(payload)

    if (error) {
      toast.error('Error al guardar el plato del día')
    } else {
      toast.success('Plato del día guardado')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Plato del día</CardTitle>
        <CardDescription>Este plato aparecerá destacado en tu página principal.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="nombre">Nombre del plato</Label>
              <Input
                id="nombre"
                value={nombre}
                onChange={(e) => setPlatoDia({ nombre: e.target.value })}
                required
                placeholder="Ej: Lomo Saltado"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="precio">Precio ($)</Label>
              <Input
                id="precio"
                type="number"
                value={precio}
                onChange={(e) => setPlatoDia({ precio: e.target.value })}
                placeholder="Ej: 2500"
                step="0.01"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Descripción</Label>
            <RichTextEditor
              value={descripcion}
              onChange={(v) => setPlatoDia({ descripcion: v })}
              placeholder="Describí el plato: ingredientes, acompañamientos..."
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="imagen">Foto del plato</Label>
            <label
              htmlFor="imagen"
              className="flex items-center gap-2 border border-dashed border-accent/30 rounded-lg px-4 py-3 cursor-pointer hover:bg-accent/5 transition-colors text-sm text-muted-foreground"
            >
              <ImagePlus size={18} className="text-muted-foreground" />
              {form.imagen ? form.imagen.name : 'Elegir imagen...'}
            </label>
            <Input id="imagen" type="file" accept="image/*" onChange={handleImagen} className="hidden" />
            {preview && (
              <div className="relative w-full h-44 mt-2 rounded-lg overflow-hidden">
                <Image src={preview} alt="Preview" fill className="object-cover" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2" disabled={loading}>
              <Save size={16} />
              {loading ? 'Guardando...' : 'Guardar plato del día'}
            </Button>
            {platoDia && (
              <Button
                type="button"
                variant="outline"
                className="gap-2 text-primary border-primary/20 hover:bg-primary/5"
                onClick={handleEliminar}
                disabled={eliminando}
              >
                <Trash2 size={15} />
                {eliminando ? 'Eliminando...' : 'Eliminar plato'}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
