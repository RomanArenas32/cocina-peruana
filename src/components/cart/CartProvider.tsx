'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const STORAGE_KEY = 'carrito'

export interface OpcionGrupo {
  nombre: string
  opciones: string[]
}

export interface CartItem {
  id: string
  nombre: string
  precio: number | null
  tipo: 'plato_dia' | 'promocion'
  opciones?: OpcionGrupo[]
}

interface CartItemWithQty extends CartItem {
  cantidad: number
}

interface CartContextType {
  items: CartItemWithQty[]
  addItem: (item: CartItem) => void
  updateCantidad: (id: string, cantidad: number) => void
  removeItem: (id: string) => void
  clearCart: () => void
  count: number
  total: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemWithQty[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {}
  }, [items])

  function addItem(item: CartItem) {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, cantidad: i.cantidad + 1 } : i)
      }
      return [...prev, { ...item, cantidad: 1 }]
    })
  }

  function updateCantidad(id: string, cantidad: number) {
    if (cantidad < 1) {
      removeItem(id)
      return
    }
    setItems(prev => prev.map(i => i.id === id ? { ...i, cantidad } : i))
  }

  function removeItem(id: string) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  function clearCart() {
    setItems([])
  }

  const count = items.reduce((acc, i) => acc + i.cantidad, 0)
  const total = items.reduce((acc, i) => acc + (Number(i.precio) || 0) * i.cantidad, 0)

  return (
    <CartContext.Provider value={{ items, addItem, updateCantidad, removeItem, clearCart, count, total }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider')
  return ctx
}
