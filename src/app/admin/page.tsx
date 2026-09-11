import { createClient } from '@/lib/supabase/server'
import PlatoDiaForm from '@/components/admin/PlatoDiaForm'
import PromocionForm from '@/components/admin/PromocionForm'
import PromocionList from '@/components/admin/PromocionList'

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: platoDia } = await supabase
    .from('plato_dia')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const { data: promociones } = await supabase
    .from('promociones')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Plato del dia</h2>
        <PlatoDiaForm platoDia={platoDia} />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Nueva Promocion</h2>
        <PromocionForm />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Promociones activas</h2>
        <PromocionList promociones={promociones ?? []} />
      </section>
    </div>
  )
}
