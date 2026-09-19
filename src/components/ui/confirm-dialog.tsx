'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-sm bg-background rounded-2xl shadow-2xl border border-border p-6 space-y-4">
        <div className="space-y-1.5">
          <h2 className="text-base font-semibold text-foreground font-heading">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          )}
        </div>

        <div className="flex gap-3 justify-end pt-1">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="border-border"
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className={
              destructive
                ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                : 'bg-primary hover:bg-primary/90 text-primary-foreground'
            }
          >
            {loading ? 'Eliminando...' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
