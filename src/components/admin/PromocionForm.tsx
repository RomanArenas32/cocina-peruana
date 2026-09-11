'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ImagePlus, PlusCircle, CalendarDays } from 'lucide-react'
import { compressImage } from '@/lib/compress-image'
import { useAdminForm } from '@/components/admin/AdminFormContext'
import Image from 'next/image'

export default function PromocionForm() {
  const router = useRouter()
  const { promocion: form, setPromocion, resetPromocion } = useAdminForm()
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null)

  function handleImagen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPromocion({ imagen: file, preview: URL.createObjectURL(file) })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMensaje(null)

    const supabase = createClient()
    let imagen_url: string | null = null

    if (form.imagen) {
      const compressed = await compressImage(form.imagen)
      const path = `promociones/${Date.now()}.webp`
      const { error: uploadError } = await supabase.storage
        .from('imagenes')
        .upload(path, compressed, { contentType: 'image/webp' })

      if (uploadError) {
        setMensaje({ tipo: 'error', texto: 'Error al subir la imagen' })
        setLoading(false)
        return
      }

      const { data: urlData } = supabase.storage.from('imagenes').getPublicUrl(path)
      imagen_url = urlData.publicUrl
    }

    const { error } = await supabase.from('promociones').insert({
      titulo: form.titulo,
      descripcion: form.descripcion || null,
      imagen_url,
      activa: true,
      fecha_expiracion: form.fechaExpiracion || null,
    })

    if (error) {
      setMensaje({ tipo: 'error', texto: 'Error al crear la promoción' })
    } else {
      setMensaje({ tipo: 'ok', texto: 'Promoción publicada' })
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
          <div className="space-y-1.5">
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              value={form.titulo}
              onChange={(e) => setPromocion({ titulo: e.target.value })}
              required
              placeholder="Ej: 2x1 en ceviche los viernes"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="desc">Descripción</Label>
            <Textarea
              id="desc"
              value={form.descripcion}
              onChange={(e) => setPromocion({ descripcion: e.target.value })}
              placeholder="Detalle de la promoción..."
              rows={3}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="expiracion" className="flex items-center gap-1.5">
              <CalendarDays size={14} className="text-gray-400" />
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
              className="flex items-center gap-2 border border-dashed border-gray-300 rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors text-sm text-gray-500"
            >
              <ImagePlus size={18} className="text-gray-400" />
              {form.imagen ? form.imagen.name : 'Elegir imagen...'}
            </label>
            <Input id="img-promo" type="file" accept="image/*" onChange={handleImagen} className="hidden" />
            {form.preview && (
              <div className="relative w-full h-44 mt-2 rounded-lg overflow-hidden">
                <Image src={form.preview} alt="Preview" fill className="object-cover" />
              </div>
            )}
          </div>

          {mensaje && (
            <p className={`text-sm px-3 py-2 rounded-md ${mensaje.tipo === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
              {mensaje.texto}
            </p>
          )}

          <Button type="submit" className="bg-red-700 hover:bg-red-800 text-white gap-2" disabled={loading}>
            <PlusCircle size={16} />
            {loading ? 'Publicando...' : 'Publicar promoción'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
