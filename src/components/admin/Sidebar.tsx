'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UtensilsCrossed, Tag, BookOpen, Settings } from 'lucide-react'

const links = [
  { href: '/admin', label: 'Plato del día', icon: UtensilsCrossed },
  { href: '/admin/promociones', label: 'Promociones', icon: Tag },
  { href: '/admin/carta', label: 'Mi carta', icon: BookOpen },
  { href: '/admin/configuracion', label: 'Configuración', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* Sidebar — solo desktop */}
      <aside className="hidden md:flex w-52 shrink-0 bg-card border-r border-border flex-col py-4">
        <nav className="flex flex-col gap-1 px-3">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent rounded-full" />
                )}
                <Icon size={17} className={active ? 'text-primary' : 'text-muted-foreground'} />
                {label}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Bottom nav — solo mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex z-50">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 text-xs font-medium transition-colors ${
                active ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon size={20} />
              {label}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
