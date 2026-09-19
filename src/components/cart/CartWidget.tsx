'use client'

import { useState } from 'react'
import { ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCart } from './CartProvider'

const WA_ICON = (
  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.532 5.859L.057 23.428a.75.75 0 00.916.916l5.569-1.475A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.692-.502-5.23-1.378l-.374-.216-3.875 1.026 1.026-3.875-.216-.374A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
  </svg>
)

export default function CartWidget({ whatsappNumber }: { whatsappNumber: string }) {
  const { items, count, total, addItem, updateCantidad, removeItem, clearCart } = useCart()
  const [open, setOpen] = useState(false)
  const [nombre, setNombre] = useState('')
  const [direccion, setDireccion] = useState('')
  const [notas, setNotas] = useState('')

  function handleEnviar() {
    if (!nombre.trim() || !direccion.trim() || items.length === 0) return

    const lineas = items.map(item => {
      const subtotal = item.precio
        ? ` — $${(item.precio * item.cantidad).toLocaleString('es-AR')}`
        : ''
      return `• ${item.cantidad}x ${item.nombre}${subtotal}`
    })

    let msg = `Hola! Quiero hacer el siguiente pedido:\n\n${lineas.join('\n')}`

    if (total > 0) {
      msg += `\n\n*Total estimado: $${total.toLocaleString('es-AR')}*`
    }

    msg += `\n\n👤 Nombre: ${nombre.trim()}`
    msg += `\n📦 Delivery`
    msg += `\n📍 Dirección: ${direccion.trim()}`

    if (notas.trim()) {
      msg += `\n📝 Referencia: ${notas.trim()}`
    }

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank')

    clearCart()
    setNombre('')
    setDireccion('')
    setNotas('')
    setOpen(false)
  }

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Ver pedido"
        className="fixed top-4 right-4 z-40 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 hover:shadow-xl"
      >
        <ShoppingBag size={22} />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-[11px] font-bold rounded-full flex items-center justify-center tabular-nums">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md flex flex-col p-0 gap-0"
          showCloseButton={false}
        >
          {/* Header */}
          <SheetHeader className="px-5 pt-5 pb-4 border-b border-border flex-row items-center justify-between shrink-0">
            <SheetTitle className="flex items-center gap-2 text-base">
              <ShoppingBag size={17} className="text-primary" />
              Tu pedido
            </SheetTitle>
            <button
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </SheetHeader>

          {items.length === 0 ? (
            /* Estado vacío */
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground px-6 py-12">
              <ShoppingBag size={44} className="opacity-15" />
              <p className="text-sm font-medium">Tu pedido está vacío</p>
              <p className="text-xs text-center leading-relaxed">
                Agregá el plato del día o una promoción usando el botón &quot;Agregar al pedido&quot;
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden flex flex-col min-h-0">

              {/* Body scrollable: items + formulario */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

                {/* Lista de items */}
                <div className="space-y-1">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center gap-2 py-3 border-b border-border/40 last:border-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground leading-tight truncate">{item.nombre}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.precio
                            ? `$${Number(item.precio).toLocaleString('es-AR')} c/u`
                            : 'Consultar precio'}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => updateCantidad(item.id, item.cantidad - 1)}
                          className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="text-sm font-semibold w-5 text-center tabular-nums">{item.cantidad}</span>
                        <button
                          onClick={() => addItem(item)}
                          className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                        >
                          <Plus size={11} />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-7 h-7 ml-0.5 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      {item.precio && (
                        <p className="text-sm font-semibold text-primary w-14 text-right shrink-0 tabular-nums">
                          ${(Number(item.precio) * item.cantidad).toLocaleString('es-AR')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Total */}
                {total > 0 && (
                  <div className="flex justify-between items-center py-2 border-t border-border/60">
                    <p className="text-sm font-semibold text-foreground">Total estimado</p>
                    <p className="text-xl font-bold text-primary font-heading tabular-nums">
                      ${total.toLocaleString('es-AR')}
                    </p>
                  </div>
                )}

                {/* Formulario de checkout */}
                <div className="space-y-3 pt-1">
                  <div className="space-y-1.5">
                    <Label htmlFor="cart-nombre">Tu nombre</Label>
                    <Input
                      id="cart-nombre"
                      value={nombre}
                      onChange={e => setNombre(e.target.value)}
                      placeholder="Ej: Juan García"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="cart-direccion">Dirección de entrega</Label>
                    <Input
                      id="cart-direccion"
                      value={direccion}
                      onChange={e => setDireccion(e.target.value)}
                      placeholder="Ej: Calle 8 n° 123"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="cart-notas">
                      Referencia <span className="text-muted-foreground font-normal">(opcional)</span>
                    </Label>
                    <Textarea
                      id="cart-notas"
                      value={notas}
                      onChange={e => setNotas(e.target.value)}
                      placeholder="Ej: puerta negra, timbre roto, piso 2..."
                      rows={2}
                      className="resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Botón — fijo al fondo */}
              <div className="px-5 py-4 border-t border-border bg-muted/40 shrink-0">
                <Button
                  onClick={handleEnviar}
                  disabled={!nombre.trim() || !direccion.trim()}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold gap-2 py-5"
                >
                  {WA_ICON}
                  Enviar pedido por WhatsApp
                </Button>
              </div>

            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
