import { createClient } from '@/lib/supabase/server'
import PromocionForm from '@/components/admin/PromocionForm'
import PromocionList from '@/components/admin/PromocionList'

export default async function PromocionesPage() {
  const supabase = await createClient()

  const { data: promociones } = await supabase
    .from('promociones')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Promociones</h1>
        <p className="text-gray-500 text-sm mt-1">Creá y gestioná tus promociones activas.</p>
      </div>
      <PromocionForm />
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Promociones cargadas</h2>
        <PromocionList promociones={promociones ?? []} />
      </div>
    </div>
  )
}
