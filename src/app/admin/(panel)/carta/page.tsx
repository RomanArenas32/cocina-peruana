import { createClient } from '@/lib/supabase/server'
import CartaPlatoForm from '@/components/admin/CartaPlatoForm'
import CartaList from '@/components/admin/CartaList'

export default async function CartaPage() {
  const supabase = await createClient()

  const { data: platos } = await supabase
    .from('platos')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Mi carta</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Guardá tus platos acá. No se muestran en la web — los usás para armar el plato del día y promociones rápidamente.
          </p>
        </div>
        <CartaPlatoForm platos={platos ?? []} />
      </div>

      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Platos guardados ({platos?.length ?? 0})
        </h2>
        <CartaList platos={platos ?? []} />
      </div>
    </div>
  )
}
