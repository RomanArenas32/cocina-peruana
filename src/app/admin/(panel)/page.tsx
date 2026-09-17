import { createClient } from '@/lib/supabase/server'
import PlatoDiaForm from '@/components/admin/PlatoDiaForm'

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: platoDia } = await supabase
    .from('plato_dia')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading">Plato del día</h1>
        <p className="text-muted-foreground text-sm mt-1">Este plato aparecerá destacado en tu página principal.</p>
      </div>
      <PlatoDiaForm platoDia={platoDia} />
    </div>
  )
}
