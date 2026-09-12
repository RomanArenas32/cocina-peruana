'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UtensilsCrossed, Tag, BookOpen } from 'lucide-react'

const links = [
  { href: '/admin', label: 'Plato del día', icon: UtensilsCrossed },
  { href: '/admin/promociones', label: 'Promociones', icon: Tag },
  { href: '/admin/carta', label: 'Mi carta', icon: BookOpen },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* Sidebar — solo desktop */}
      <aside className="hidden md:flex w-52 shrink-0 bg-white border-r border-gray-200 flex-col py-4">
        <nav className="flex flex-col gap-1 px-3">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-red-50 text-red-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon size={17} className={active ? 'text-red-700' : 'text-gray-400'} />
                {label}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Bottom nav — solo mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-50">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 text-xs font-medium transition-colors ${
                active ? 'text-red-700' : 'text-gray-400'
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
