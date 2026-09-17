import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'

export const revalidate = 60

function WhatsAppButton({ number, message, label }: { number: string; message: string; label: string }) {
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2.5 px-5 rounded-full transition-all hover:scale-[1.02] shadow-sm"
    >
      <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.532 5.859L.057 23.428a.75.75 0 00.916.916l5.569-1.475A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.692-.502-5.23-1.378l-.374-.216-3.875 1.026 1.026-3.875-.216-.374A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
      </svg>
      {label}
    </a>
  )
}

const WHATSAPP_NUMBER = '5492281494327'
const INSTAGRAM_URL = 'https://www.instagram.com/cocina.peruana.azul/'

export default async function Home() {
  const supabase = await createClient()

  const { data: platoDia } = await supabase
    .from('plato_dia')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const hoy = new Date().toISOString().split('T')[0]
  const { data: promociones } = await supabase
    .from('promociones')
    .select('*')
    .eq('activa', true)
    .or(`fecha_expiracion.is.null,fecha_expiracion.gte.${hoy}`)
    .order('created_at', { ascending: false })

  const { data: config } = await supabase
    .from('config')
    .select('horarios, direccion, descripcion_negocio')
    .limit(1)
    .single()

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=Hola!%20Quiero%20hacer%20un%20pedido%20%F0%9F%8D%BD%EF%B8%8F`

  return (
    <main className="min-h-screen bg-background">

      {/* HERO */}
      <section className="relative bg-primary text-primary-foreground overflow-hidden">
        {/* Gradiente radial de profundidad */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.48 0.14 22), transparent)' }}
        />
        {/* Viñeta inferior */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, oklch(0.30 0.13 22))' }}
        />

        <div className="relative z-10 flex flex-col items-center px-4 pt-16 pb-20 text-center">

          {/* Logo con borde dorado */}
          <div className="w-40 h-40 rounded-full overflow-hidden shadow-2xl ring-2 ring-accent/60 ring-offset-4 ring-offset-primary mb-8">
            <Image
              src="/logo.jpeg"
              alt="Logo Sabores del Perú"
              width={160}
              height={160}
              className="object-cover w-full h-full"
              priority
            />
          </div>

          {/* Ornamento dorado superior */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-px bg-accent/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            <div className="w-10 h-px bg-accent/50" />
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight font-heading leading-tight">
            Sabores del Perú
          </h1>
          <p className="mt-3 text-accent text-xs font-semibold tracking-[0.35em] uppercase">
            Azul · Buenos Aires · Argentina
          </p>
          <p className="mt-6 text-primary-foreground/75 text-base sm:text-lg max-w-sm mx-auto leading-relaxed">
            {config?.descripcion_negocio ?? 'La auténtica cocina peruana en el corazón de la provincia de Buenos Aires.'}
          </p>

          {/* Ornamento dorado inferior */}
          <div className="flex items-center gap-3 mt-8 mb-10">
            <div className="w-16 h-px bg-accent/30" />
            <div className="w-1 h-1 rounded-full bg-accent/50" />
            <div className="w-16 h-px bg-accent/30" />
          </div>

          {/* Botones CTA */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 bg-green-600 hover:bg-green-700 text-white text-base font-semibold py-3.5 px-7 rounded-full shadow-lg transition-all hover:shadow-green-900/40 hover:scale-[1.02]"
            >
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.532 5.859L.057 23.428a.75.75 0 00.916.916l5.569-1.475A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.692-.502-5.23-1.378l-.374-.216-3.875 1.026 1.026-3.875-.216-.374A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              Hacer un pedido
            </a>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 border border-accent/60 hover:border-accent hover:bg-accent/10 text-primary-foreground text-base font-semibold py-3.5 px-7 rounded-full transition-all hover:scale-[1.02]"
            >
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
              Seguinos en Instagram
            </a>
          </div>

        </div>
      </section>

      {/* Franja decorativa */}
      <div className="h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-12">

        {/* Plato del dia */}
        {platoDia && (
          <section className="animate-fade-in-up animation-delay-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-0.5 bg-accent" />
              <h2 className="text-2xl font-bold text-primary font-heading">Plato del día</h2>
            </div>
            <Card className="overflow-hidden shadow-md border border-border/50 p-0 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
              {platoDia.imagen_url && (
                <div className="relative w-full aspect-video overflow-hidden">
                  <Image
                    src={platoDia.imagen_url}
                    alt={platoDia.nombre}
                    fill
                    sizes="(max-width: 672px) 100vw, 672px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <CardContent className="p-5">
                <h3 className="text-xl font-bold font-heading text-foreground">{platoDia.nombre}</h3>
                {platoDia.descripcion && (
                  <div
                    className="rich-content text-muted-foreground mt-2 text-sm"
                    dangerouslySetInnerHTML={{ __html: platoDia.descripcion }}
                  />
                )}
                <div className="flex items-center justify-between mt-4 gap-3 flex-wrap">
                  {platoDia.precio && (
                    <p className="text-2xl font-bold text-primary font-heading">${platoDia.precio}</p>
                  )}
                  <WhatsAppButton
                    number={WHATSAPP_NUMBER}
                    message={`Hola! Quiero pedir el plato del día: *${platoDia.nombre}* 🍽️`}
                    label="Pedir ahora"
                  />
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Promociones */}
        {promociones && promociones.length > 0 && (
          <section className="animate-fade-in-up animation-delay-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-0.5 bg-accent" />
              <h2 className="text-2xl font-bold text-primary font-heading">Promociones</h2>
            </div>
            <div className="space-y-4">
              {promociones.map((promo, i) => (
                <Card key={promo.id} className="overflow-hidden shadow-md border border-border/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
                  {promo.imagen_url && (
                    <div className="relative w-full aspect-video overflow-hidden">
                      <Image
                        src={promo.imagen_url}
                        alt={promo.titulo}
                        fill
                        sizes="(max-width: 672px) 100vw, 672px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        priority={i === 0}
                      />
                    </div>
                  )}
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-bold font-heading text-foreground">{promo.titulo}</h3>
                      <Badge className="bg-accent text-accent-foreground shrink-0">Promo</Badge>
                    </div>
                    {promo.descripcion && (
                      <div
                        className="rich-content text-muted-foreground mt-2 text-sm"
                        dangerouslySetInnerHTML={{ __html: promo.descripcion }}
                      />
                    )}
                    <div className="mt-4">
                      <WhatsAppButton
                        number={WHATSAPP_NUMBER}
                        message={`Hola! Me interesa la promoción: *${promo.titulo}* 🔥`}
                        label="Consultar promoción"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}


      </div>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground mt-4 animate-fade-in-up animation-delay-300">
        {/* Línea ornamental superior */}
        <div className="flex justify-center pt-12 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-14 h-px bg-accent/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-accent/70" />
            <div className="w-14 h-px bg-accent/40" />
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 pb-12 text-center space-y-8">

          {/* Logo + nombre */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-accent/40">
              <Image src="/logo.jpeg" alt="Logo" width={64} height={64} className="object-cover w-full h-full" />
            </div>
            <div>
              <p className="font-bold text-lg font-heading tracking-wide">Sabores del Perú</p>
              <p className="text-primary-foreground/50 text-xs tracking-[0.2em] uppercase mt-0.5">Azul · Buenos Aires</p>
            </div>
          </div>

          {/* Horarios */}
          {config?.horarios && (
            <div className="text-sm text-primary-foreground/65 space-y-1">
              <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-2">Horarios</p>
              {config.horarios.split('\n').filter(Boolean).map((linea: string, i: number) => (
                <p key={i}>{linea}</p>
              ))}
            </div>
          )}

          {/* Dirección */}
          {config?.direccion && (
            <p className="text-sm text-primary-foreground/50">{config.direccion}</p>
          )}

          {/* Íconos sociales discretos */}
          <div className="flex justify-center gap-5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-primary-foreground/15 hover:border-accent/50 hover:bg-accent/10 text-primary-foreground/50 hover:text-primary-foreground transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.532 5.859L.057 23.428a.75.75 0 00.916.916l5.569-1.475A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.692-.502-5.23-1.378l-.374-.216-3.875 1.026 1.026-3.875-.216-.374A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-primary-foreground/15 hover:border-accent/50 hover:bg-accent/10 text-primary-foreground/50 hover:text-primary-foreground transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
          </div>

          {/* Pie */}
          <div className="border-t border-primary-foreground/10 pt-6">
            <p className="text-xs text-primary-foreground/35 tracking-wide">
              © {new Date().getFullYear()} Sabores del Perú · Azul, Argentina
            </p>
          </div>

        </div>
      </footer>
    </main>
  )
}
