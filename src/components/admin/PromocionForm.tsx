'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'

export default function PromocionForm() {
  const router = useRouter()
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [imagen, setImagen] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState('')

  function handleImagen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImagen(file)
    setPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMensaje('')

    const supabase = createClient()
    let imagen_url: string | null = null

    if (imagen) {
      const ext = imagen.name.split('.').pop()
      const path = `promociones/${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('imagenes')
        .upload(path, imagen)

      if (uploadError) {
        setMensaje('Error al subir la imagen')
        setLoading(false)
        return
      }

      const { data: urlData } = supabase.storage
        .from('imagenes')
        .getPublicUrl(path)
      imagen_url = urlData.publicUrl
    }

    const { error } = await supabase.from('promociones').insert({
      titulo,
      descripcion: descripcion || null,
      imagen_url,
      activa: true,
    })

    if (error) {
      setMensaje('Error al crear la promocion')
    } else {
      setMensaje('Promocion creada')
      setTitulo('')
      setDescripcion('')
      setImagen(null)
      setPreview(null)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <Card>
      <CardContent className="p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="titulo">Titulo</Label>
            <Input
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              placeholder="Ej: 2x1 en ceviche los viernes"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="desc">Descripcion</Label>
            <Textarea
              id="desc"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Detalle de la promocion..."
              rows={3}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="img-promo">Imagen (opcional)</Label>
            <Input
              id="img-promo"
              type="file"
              accept="image/*"
              onChange={handleImagen}
            />
            {preview && (
              <div className="relative w-full h-40 mt-2 rounded overflow-hidden">
                <Image src={preview} alt="Preview" fill className="object-cover" />
              </div>
            )}
          </div>
          {mensaje && (
            <p className={`text-sm ${mensaje.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {mensaje}
            </p>
          )}
          <Button
            type="submit"
            className="bg-red-700 hover:bg-red-800 text-white"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Publicar promocion'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
