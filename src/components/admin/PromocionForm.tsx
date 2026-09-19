'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ImagePlus, PlusCircle, CalendarDays } from 'lucide-react'
import { compressImage } from '@/lib/compress-image'
import { useAdminForm } from '@/components/admin/AdminFormContext'
import OpcionesEditor from '@/components/admin/OpcionesEditor'
import RichTextEditor from '@/components/admin/RichTextEditor'
import Image from 'next/image'
import { toast } from 'sonner'

export default function PromocionForm() {
  const router = useRouter()
  const { promocion: form, setPromocion, resetPromocion } = useAdminForm()
  const [loading, setLoading] = useState(false)

  function handleImagen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPromocion({ imagen: file, preview: URL.createObjectURL(file) })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    let imagen_url: string | null = form.preview?.startsWith('http') ? form.preview : null

    if (form.imagen) {
      const compressed = await compressImage(form.imagen)
      const path = `promociones/${Date.now()}.webp`
      const { error: uploadError } = await supabase.storage
        .from('imagenes')
        .upload(path, compressed, { contentType: 'image/webp' })

      if (uploadError) {
        toast.error('Error al subir la imagen')
        setLoading(false)
        return
      }

      const { data: urlData } = supabase.storage.from('imagenes').getPublicUrl(path)
      imagen_url = urlData.publicUrl
    }

    const { error } = await supabase.from('promociones').insert({
      titulo: form.titulo,
      descripcion: form.descripcion || null,
      precio: form.precio ? parseFloat(form.precio) : null,
      opciones: form.opciones.length ? form.opciones : null,
      imagen_url,
      activa: true,
      fecha_expiracion: form.fechaExpiracion || null,
    })

    if (error) {
      toast.error('Error al crear la promoción')
    } else {
      toast.success('Promoción publicada')
      resetPromocion()
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Nueva promoción</CardTitle>
        <CardDescription>Se publicará de inmediato en tu página.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                value={form.titulo}
                onChange={(e) => setPromocion({ titulo: e.target.value })}
                required
                placeholder="Ej: Ají de Gallina"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="precio-promo">Precio ($) <span className="text-muted-foreground font-normal">(opcional)</span></Label>
              <Input
                id="precio-promo"
                type="number"
                value={form.precio}
                onChange={(e) => setPromocion({ precio: e.target.value })}
                placeholder="Ej: 2500"
                step="0.01"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Descripción</Label>
            <RichTextEditor
              value={form.descripcion}
              onChange={(v) => setPromocion({ descripcion: v })}
              placeholder="Detalle de la promoción..."
            />
          </div>

          <div className="space-y-1.5">
            <Label>Opciones / variantes <span className="text-muted-foreground font-normal">(opcional)</span></Label>
            <p className="text-xs text-muted-foreground">Ej: grupo &quot;Tipo&quot; con opciones California, Spicy Tuna...</p>
            <OpcionesEditor
              value={form.opciones}
              onChange={(opciones) => setPromocion({ opciones })}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="expiracion" className="flex items-center gap-1.5">
              <CalendarDays size={14} className="text-muted-foreground" />
              Fecha de expiración (opcional)
            </Label>
            <Input
              id="expiracion"
              type="date"
              value={form.fechaExpiracion}
              onChange={(e) => setPromocion({ fechaExpiracion: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="img-promo">Imagen (opcional)</Label>
            <label
              htmlFor="img-promo"
              className="flex items-center gap-2 border border-dashed border-accent/30 rounded-lg px-4 py-3 cursor-pointer hover:bg-accent/5 transition-colors text-sm text-muted-foreground"
            >
              <ImagePlus size={18} className="text-muted-foreground" />
              {form.imagen ? form.imagen.name : 'Elegir imagen...'}
            </label>
            <Input id="img-promo" type="file" accept="image/*" onChange={handleImagen} className="hidden" />
            {form.preview && (
              <div className="relative w-full h-44 mt-2 rounded-lg overflow-hidden">
                <Image src={form.preview} alt="Preview" fill className="object-cover" />
              </div>
            )}
          </div>

          <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2" disabled={loading}>
            <PlusCircle size={16} />
            {loading ? 'Publicando...' : 'Publicar promoción'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
