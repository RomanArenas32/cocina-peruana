'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ImagePlus, PlusCircle } from 'lucide-react'
import { compressImage } from '@/lib/compress-image'
import Image from 'next/image'

export default function CartaPlatoForm() {
  const router = useRouter()
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState('')
  const [imagen, setImagen] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null)

  function handleImagen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImagen(file)
    setPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMensaje(null)

    const supabase = createClient()
    let imagen_url: string | null = null

    if (imagen) {
      const compressed = await compressImage(imagen)
      const path = `carta/${Date.now()}.webp`
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

    const { error } = await supabase.from('platos').insert({
      nombre,
      descripcion: descripcion || null,
      precio: precio ? parseFloat(precio) : null,
      imagen_url,
    })

    if (error) {
      setMensaje({ tipo: 'error', texto: 'Error al guardar el plato' })
    } else {
      setMensaje({ tipo: 'ok', texto: 'Plato agregado a la carta' })
      setNombre('')
      setDescripcion('')
      setPrecio('')
      setImagen(null)
      setPreview(null)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Agregar plato</CardTitle>
        <CardDescription>Los platos de la carta no se muestran en la web. Los usás para armar el plato del día y promociones.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="nombre-carta">Nombre</Label>
              <Input
                id="nombre-carta"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                placeholder="Ej: Ceviche clásico"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="precio-carta">Precio ($)</Label>
              <Input
                id="precio-carta"
                type="number"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                placeholder="Ej: 3500"
                step="0.01"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="desc-carta">Descripción</Label>
            <Textarea
              id="desc-carta"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ingredientes, acompañamientos..."
              rows={2}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="img-carta">Foto</Label>
            <label
              htmlFor="img-carta"
              className="flex items-center gap-2 border border-dashed border-gray-300 rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors text-sm text-gray-500"
            >
              <ImagePlus size={18} className="text-gray-400" />
              {imagen ? imagen.name : 'Elegir imagen...'}
            </label>
            <Input id="img-carta" type="file" accept="image/*" onChange={handleImagen} className="hidden" />
            {preview && (
              <div className="relative w-full h-36 mt-2 rounded-lg overflow-hidden">
                <Image src={preview} alt="Preview" fill sizes="100vw" className="object-cover" />
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
            {loading ? 'Guardando...' : 'Agregar a la carta'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
