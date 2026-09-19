'use client'

import { Plus, Minus } from 'lucide-react'
import { toast } from 'sonner'
import { useCart } from './CartProvider'
import type { CartItem } from './CartProvider'

export default function AddToCartButton({ item }: { item: CartItem }) {
  const { items, addItem, updateCantidad } = useCart()
  const existing = items.find(i => i.id === item.id)

  if (existing) {
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
    <button
      onClick={() => {
        addItem(item)
        toast.success('Agregado al pedido', { description: item.nombre })
      }}
      className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/15 text-primary text-sm font-semibold py-2 px-4 rounded-full transition-all hover:scale-[1.02]"
    >
      <Plus size={14} />
      Agregar al pedido
    </button>
  )
}
