'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { OpcionGrupo } from '@/components/cart/CartProvider'

interface Props {
  value: OpcionGrupo[]
  onChange: (grupos: OpcionGrupo[]) => void
}

export default function OpcionesEditor({ value, onChange }: Props) {
  const [nuevoGrupo, setNuevoGrupo] = useState('')
  const [nuevaOpcion, setNuevaOpcion] = useState<Record<number, string>>({})

  function agregarGrupo() {
    if (!nuevoGrupo.trim()) return
    onChange([...value, { nombre: nuevoGrupo.trim(), opciones: [] }])
    setNuevoGrupo('')
  }

  function eliminarGrupo(i: number) {
    onChange(value.filter((_, idx) => idx !== i))
  }

  function agregarOpcion(gi: number) {
    const texto = nuevaOpcion[gi]?.trim()
    if (!texto) return
    onChange(value.map((g, i) =>
      i === gi ? { ...g, opciones: [...g.opciones, texto] } : g
    ))
    setNuevaOpcion(prev => ({ ...prev, [gi]: '' }))
  }

  function eliminarOpcion(gi: number, oi: number) {
    onChange(value.map((g, i) =>
      i === gi ? { ...g, opciones: g.opciones.filter((_, j) => j !== oi) } : g
    ))
  }

  return (
    <div className="space-y-3">
      {value.map((grupo, gi) => (
        <div key={gi} className="border border-border rounded-lg p-3 space-y-2 bg-background">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">{grupo.nombre}</p>
            <button
              type="button"
              onClick={() => eliminarGrupo(gi)}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 min-h-[24px]">
            {grupo.opciones.map((op, oi) => (
              <span
                key={oi}
                className="inline-flex items-center gap-1 bg-primary/8 text-primary text-xs px-2.5 py-0.5 rounded-full font-medium"
              >
                {op}
                <button
                  type="button"
                  onClick={() => eliminarOpcion(gi, oi)}
                  className="text-primary/50 hover:text-primary transition-colors"
                >
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={nuevaOpcion[gi] ?? ''}
              onChange={e => setNuevaOpcion(prev => ({ ...prev, [gi]: e.target.value }))}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); agregarOpcion(gi) } }}
              placeholder="Nueva opción..."
              className="h-8 text-sm"
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => agregarOpcion(gi)}
              className="h-8 px-3 shrink-0"
            >
              <Plus size={13} />
            </Button>
          </div>
        </div>
      ))}

      <div className="flex gap-2">
        <Input
          value={nuevoGrupo}
          onChange={e => setNuevoGrupo(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); agregarGrupo() } }}
          placeholder="Nombre del grupo (ej: Tipo, Cantidad)..."
          className="h-8 text-sm"
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={agregarGrupo}
          className="h-8 px-3 gap-1 text-xs shrink-0"
        >
          <Plus size={13} />
          Agregar grupo
        </Button>
      </div>
    </div>
  )
}
