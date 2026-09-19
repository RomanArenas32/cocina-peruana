'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAdminForm } from '@/components/admin/AdminFormContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ImagePlus, PlusCircle, Search, UtensilsCrossed, Tag, X } from 'lucide-react'
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

export default function CartaPlatoForm({ platos }: { platos: Plato[] }) {
  const router = useRouter()
  const { setPlatoDia, setPromocion } = useAdminForm()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState('')
  const [imagen, setImagen] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const filtered = query.trim()
    ? platos.filter(p => p.nombre.toLowerCase().includes(query.toLowerCase()))
    : []

  function handleImagen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImagen(file)
    setPreview(URL.createObjectURL(file))
  }

  function usarComoPlatoDia(plato: Plato) {
    setPlatoDia({
      nombre: plato.nombre,
      descripcion: plato.descripcion ?? '',
      precio: plato.precio?.toString() ?? '',
      imagen: null,
      preview: plato.imagen_url,
    })
    setOpen(false)
    router.push('/admin')
  }

  function usarEnPromocion(plato: Plato) {
    setPromocion({
      titulo: plato.nombre,
      descripcion: plato.descripcion ?? '',
      imagen: null,
      preview: plato.imagen_url,
    })
    setOpen(false)
    router.push('/admin/promociones')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    let imagen_url: string | null = null

    if (imagen) {
      const compressed = await compressImage(imagen)
      const path = `carta/${Date.now()}.webp`
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

    const { error } = await supabase.from('platos').insert({
      nombre,
      descripcion: descripcion || null,
      precio: precio ? parseFloat(precio) : null,
      imagen_url,
    })

    if (error) {
      toast.error('Error al guardar el plato')
    } else {
      toast.success('Plato agregado a la carta')
      setNombre('')
      setDescripcion('')
      setPrecio('')
      setImagen(null)
      setPreview(null)
      setQuery('')
      setOpen(false)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 hover:cursor-pointer"
      >
        <PlusCircle size={16} />
        Agregar plato
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-[480px] flex flex-col p-0 gap-0"
          showCloseButton={false}
        >
          {/* Header con tema primary */}
          <SheetHeader className="bg-primary text-primary-foreground px-6 py-4 flex-row items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center">
                <PlusCircle size={14} className="text-accent" />
              </div>
              <SheetTitle className="font-heading text-primary-foreground text-base">
                Agregar plato
              </SheetTitle>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

            {/* Buscador */}
            <div className="space-y-1.5">
              <Label className="text-foreground font-medium">Buscar en la carta</Label>
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Ej: ceviche, lomo saltado..."
                  className="pl-9 border-border focus-visible:ring-primary/30"
                />
              </div>
            </div>

            {/* Resultados del buscador */}
            {query.trim() && (
              <div className="space-y-2">
                {filtered.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-2 italic">
                    Sin resultados para &quot;{query}&quot;
                  </p>
                ) : (
                  filtered.map(plato => (
                    <div key={plato.id} className="flex items-center gap-3 p-3 border border-border rounded-lg bg-background hover:bg-muted/30 transition-colors">
                      {plato.imagen_url ? (
                        <div className="relative w-11 h-11 rounded-md overflow-hidden shrink-0">
                          <Image src={plato.imagen_url} alt={plato.nombre} fill sizes="44px" className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-11 h-11 rounded-md bg-primary/8 flex items-center justify-center shrink-0">
                          <UtensilsCrossed size={16} className="text-primary/40" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground leading-tight truncate">{plato.nombre}</p>
                        {plato.precio && (
                          <p className="text-xs text-accent font-semibold mt-0.5">${plato.precio.toLocaleString('es-AR')}</p>
                        )}
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 text-xs h-8 px-2.5 border-primary/20 text-primary hover:bg-primary/5"
                          onClick={() => usarComoPlatoDia(plato)}
                        >
                          <UtensilsCrossed size={11} />
                          Plato del día
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 text-xs h-8 px-2.5 border-accent/30 text-accent hover:bg-accent/5"
                          onClick={() => usarEnPromocion(plato)}
                        >
                          <Tag size={11} />
                          Promo
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Divisor */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Nuevo plato</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Formulario de creación */}
            <form id="form-nuevo-plato" onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Nombre</Label>
                  <Input
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    required
                    placeholder="Ej: Ceviche clásico"
                    className="border-border focus-visible:ring-primary/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Precio ($)</Label>
                  <Input
                    type="number"
                    value={precio}
                    onChange={e => setPrecio(e.target.value)}
                    placeholder="Ej: 3500"
                    step="0.01"
                    className="border-border focus-visible:ring-primary/30"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Descripción</Label>
                <RichTextEditor value={descripcion} onChange={setDescripcion} placeholder="Ingredientes, acompañamientos..." />
              </div>

              <div className="space-y-1.5">
                <Label>Foto</Label>
                <label
                  htmlFor="img-carta-modal"
                  className="flex items-center gap-2 border border-dashed border-accent/30 rounded-lg px-4 py-3 cursor-pointer hover:bg-accent/5 transition-colors text-sm text-muted-foreground"
                >
                  <ImagePlus size={17} className="text-accent/60" />
                  {imagen ? imagen.name : 'Elegir imagen...'}
                </label>
                <Input id="img-carta-modal" type="file" accept="image/*" onChange={handleImagen} className="hidden" />
                {preview && (
                  <div className="relative w-full h-36 mt-2 rounded-lg overflow-hidden ring-1 ring-border">
                    <Image src={preview} alt="Preview" fill sizes="100vw" className="object-cover" />
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border bg-muted/40 shrink-0">
            <Button
              type="submit"
              form="form-nuevo-plato"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-11 font-semibold"
              disabled={loading}
            >
              <PlusCircle size={16} />
              {loading ? 'Guardando...' : 'Agregar a la carta'}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
