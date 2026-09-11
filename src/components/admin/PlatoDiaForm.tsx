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

interface PlatoDia {
  id: string
  nombre: string
  descripcion: string | null
  precio: number | null
  imagen_url: string | null
}

export default function PlatoDiaForm({ platoDia }: { platoDia: PlatoDia | null }) {
  const router = useRouter()
  const [nombre, setNombre] = useState(platoDia?.nombre ?? '')
  const [descripcion, setDescripcion] = useState(platoDia?.descripcion ?? '')
  const [precio, setPrecio] = useState(platoDia?.precio?.toString() ?? '')
  const [imagen, setImagen] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(platoDia?.imagen_url ?? null)
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
    let imagen_url = platoDia?.imagen_url ?? null

    if (imagen) {
      const ext = imagen.name.split('.').pop()
      const path = `plato-dia/actual.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('imagenes')
        .upload(path, imagen, { upsert: true })

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
      setMensaje('Error al guardar')
    } else {
      setMensaje('Guardado correctamente')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <Card>
      <CardContent className="p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="nombre">Nombre del plato</Label>
            <Input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              placeholder="Ej: Lomo Saltado"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="descripcion">Descripcion</Label>
            <Textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripcion del plato..."
              rows={3}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="precio">Precio ($)</Label>
            <Input
              id="precio"
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              placeholder="Ej: 2500"
              step="0.01"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="imagen">Foto del plato</Label>
            <Input
              id="imagen"
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
            {loading ? 'Guardando...' : 'Guardar plato del dia'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
