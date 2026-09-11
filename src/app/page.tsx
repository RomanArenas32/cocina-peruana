import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'

export const revalidate = 60

export default async function Home() {
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
    .eq('activa', true)
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-amber-50">
      {/* Header */}
      <header className="bg-red-700 text-white py-6 px-4 text-center shadow-md">
        <h1 className="text-4xl font-bold tracking-tight">Cocina Peruana</h1>
        <p className="mt-1 text-amber-200 text-sm">Azul, Buenos Aires</p>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-10">

        {/* Plato del dia */}
        {platoDia && (
          <section>
            <h2 className="text-2xl font-bold text-red-700 mb-4">Plato del dia</h2>
            <Card className="overflow-hidden shadow-md">
              {platoDia.imagen_url && (
                <div className="relative w-full h-56">
                  <Image
                    src={platoDia.imagen_url}
                    alt={platoDia.nombre}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardContent className="p-4">
                <h3 className="text-xl font-semibold">{platoDia.nombre}</h3>
                {platoDia.descripcion && (
                  <p className="text-gray-600 mt-1 text-sm">{platoDia.descripcion}</p>
                )}
                {platoDia.precio && (
                  <p className="mt-2 text-lg font-bold text-red-700">
                    ${platoDia.precio}
                  </p>
                )}
              </CardContent>
            </Card>
          </section>
        )}

        {/* Promociones */}
        {promociones && promociones.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-red-700 mb-4">Promociones</h2>
            <div className="space-y-4">
              {promociones.map((promo) => (
                <Card key={promo.id} className="overflow-hidden shadow-md">
                  {promo.imagen_url && (
                    <div className="relative w-full h-48">
                      <Image
                        src={promo.imagen_url}
                        alt={promo.titulo}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-semibold">{promo.titulo}</h3>
                      <Badge className="bg-red-700 text-white shrink-0">Promo</Badge>
                    </div>
                    {promo.descripcion && (
                      <p className="text-gray-600 mt-1 text-sm">{promo.descripcion}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Contacto */}
        <section className="text-center text-sm text-gray-500 border-t pt-6">
          <p className="font-semibold text-gray-700">Encontranos en Azul, Buenos Aires</p>
          <p className="mt-1">Pedidos por WhatsApp</p>
        </section>

      </div>
    </main>
  )
}
