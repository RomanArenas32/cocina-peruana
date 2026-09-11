'use client'

import { createContext, useContext, useState } from 'react'

interface PlatoDiaState {
  nombre: string
  descripcion: string
  precio: string
  imagen: File | null
  preview: string | null
}

interface PromocionState {
  titulo: string
  descripcion: string
  fechaExpiracion: string
  imagen: File | null
  preview: string | null
}

interface AdminFormContextType {
  platoDia: PlatoDiaState
  setPlatoDia: (s: Partial<PlatoDiaState>) => void
  promocion: PromocionState
  setPromocion: (s: Partial<PromocionState>) => void
  resetPromocion: () => void
}

const defaultPlatoDia: PlatoDiaState = {
  nombre: '',
  descripcion: '',
  precio: '',
  imagen: null,
  preview: null,
}

const defaultPromocion: PromocionState = {
  titulo: '',
  descripcion: '',
  fechaExpiracion: '',
  imagen: null,
  preview: null,
}

const AdminFormContext = createContext<AdminFormContextType | null>(null)

export function AdminFormProvider({ children }: { children: React.ReactNode }) {
  const [platoDia, setPlatoDiaState] = useState<PlatoDiaState>(defaultPlatoDia)
  const [promocion, setPromocionState] = useState<PromocionState>(defaultPromocion)

  function setPlatoDia(partial: Partial<PlatoDiaState>) {
    setPlatoDiaState((prev) => ({ ...prev, ...partial }))
  }

  function setPromocion(partial: Partial<PromocionState>) {
    setPromocionState((prev) => ({ ...prev, ...partial }))
  }

  function resetPromocion() {
    setPromocionState(defaultPromocion)
  }

  return (
    <AdminFormContext.Provider value={{ platoDia, setPlatoDia, promocion, setPromocion, resetPromocion }}>
      {children}
    </AdminFormContext.Provider>
  )
}

export function useAdminForm() {
  const ctx = useContext(AdminFormContext)
  if (!ctx) throw new Error('useAdminForm debe usarse dentro de AdminFormProvider')
  return ctx
}
