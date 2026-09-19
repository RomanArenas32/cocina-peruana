'use client'

import { useState } from 'react'
import { Plus, Minus, Check } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useCart } from './CartProvider'
import type { CartItem } from './CartProvider'

export default function AddToCartButton({ item }: { item: CartItem }) {
  const { items, addItem, updateCantidad } = useCart()
  const [open, setOpen] = useState(false)
  const [seleccion, setSeleccion] = useState<Record<string, string>>({})

  const hasOpciones = (item.opciones?.length ?? 0) > 0
  const existing = items.find(i => i.id === item.id)
  const allSelected = !hasOpciones || item.opciones!.every(g => seleccion[g.nombre])

  function handleClose(v: boolean) {
    setOpen(v)
    if (!v) setSeleccion({})
  }

  function handleConfirmar() {
    if (!allSelected) return
    const sufijo = Object.values(seleccion).join(', ')
    const seleccionKey = Object.values(seleccion).join('_').replace(/\s+/g, '-')
    const itemConSeleccion: CartItem = {
      ...item,
      id: `${item.id}__${seleccionKey}`,
      nombre: `${item.nombre} (${sufijo})`,
      opciones: undefined,
    }
    addItem(itemConSeleccion)
    toast.success('Agregado al pedido', { description: itemConSeleccion.nombre })
    setOpen(false)
    setSeleccion({})
  }

  // Sin opciones + ya en carrito → mostrar +/-
  if (!hasOpciones && existing) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateCantidad(existing.id, existing.cantidad - 1)}
          className="w-8 h-8 rounded-full bg-primary/10 text-primary hover:bg-primary/20 flex items-center justify-center transition-colors"
          aria-label="Quitar uno"
        >
          <Minus size={13} />
        </button>
        <span className="text-sm font-semibold text-primary w-5 text-center tabular-nums">
          {existing.cantidad}
        </span>
        <button
          onClick={() => addItem(item)}
          className="w-8 h-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center transition-colors"
          aria-label="Agregar uno"
        >
          <Plus size={13} />
        </button>
      </div>
    )
  }

  return (
    <>
      <button
        onClick={() => {
          if (hasOpciones) {
            setOpen(true)
          } else {
            addItem(item)
            toast.success('Agregado al pedido', { description: item.nombre })
          }
        }}
        className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/15 text-primary text-sm font-semibold py-2 px-4 rounded-full transition-all hover:scale-[1.02]"
      >
        <Plus size={14} />
        Agregar al pedido
      </button>

      {hasOpciones && (
        <Sheet open={open} onOpenChange={handleClose}>
          <SheetContent
            side="bottom"
            className="rounded-t-2xl max-h-[85vh] overflow-y-auto pb-safe"
            showCloseButton={false}
          >
            <SheetHeader className="pb-5">
              <div className="flex items-start justify-between">
                <SheetTitle className="font-heading text-lg text-foreground">{item.nombre}</SheetTitle>
                <button
                  onClick={() => handleClose(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors mt-0.5"
                  aria-label="Cerrar"
                >
                  ✕
                </button>
              </div>
            </SheetHeader>

            <div className="space-y-5 pb-2">
              {item.opciones!.map(grupo => (
                <div key={grupo.nombre} className="space-y-2.5">
                  <p className="text-sm font-semibold text-foreground tracking-wide">
                    {grupo.nombre}
                    {!seleccion[grupo.nombre] && (
                      <span className="text-primary/50 font-normal ml-1.5 text-xs">— elegí una opción</span>
                    )}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {grupo.opciones.map(op => {
                      const selected = seleccion[grupo.nombre] === op
                      return (
                        <button
                          key={op}
                          onClick={() => setSeleccion(prev => ({ ...prev, [grupo.nombre]: op }))}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all ${
                            selected
                              ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                              : 'bg-background text-foreground border-border hover:border-primary/40 hover:bg-primary/5'
                          }`}
                        >
                          {selected && <Check size={12} />}
                          {op}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}

              <Button
                onClick={handleConfirmar}
                disabled={!allSelected}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-12 font-semibold mt-2"
              >
                <Plus size={16} />
                Agregar al pedido
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  )
}
