import { createClient } from '@/lib/supabase/server'
import ConfigForm from '@/components/admin/ConfigForm'

export default async function ConfiguracionPage() {
  const supabase = await createClient()

  const { data: config } = await supabase
    .from('config')
    .select('*')
    .limit(1)
    .single()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading">Configuración</h1>
        <p className="text-muted-foreground text-sm mt-1">Información del negocio que aparece en tu web.</p>
      </div>
      <ConfigForm config={config} />
    </div>
  )
}
