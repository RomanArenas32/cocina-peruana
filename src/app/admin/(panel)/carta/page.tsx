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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Mi carta</h1>
        <p className="text-gray-500 text-sm mt-1">
          Guardá tus platos acá. No se muestran en la web — los usás para armar el plato del día y promociones rápidamente.
        </p>
      </div>

      <CartaPlatoForm />

      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Platos guardados ({platos?.length ?? 0})
        </h2>
        <CartaList platos={platos ?? []} />
      </div>
    </div>
  )
}
