import Image from 'next/image'
import LogoutButton from '@/components/admin/LogoutButton'
import Sidebar from '@/components/admin/Sidebar'
import { AdminFormProvider } from '@/components/admin/AdminFormContext'
import { Toaster } from '@/components/ui/sonner'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminFormProvider>
    <div className="h-dvh overflow-hidden flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-red-700 text-white px-6 py-3 flex items-center justify-between shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/60 shrink-0">
            <Image src="/logo.jpeg" alt="Logo" width={36} height={36} className="object-cover w-full h-full" />
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">Sabores del Perú</p>
            <p className="text-amber-200 text-xs leading-tight">Panel de administración</p>
          </div>
        </div>
        <LogoutButton />
      </header>

      {/* Body: sidebar + contenido */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 pb-24 md:p-8 md:pb-8">
          {children}
        </main>
      </div>
    </div>
    <Toaster richColors position="top-right" />
    </AdminFormProvider>
  )
}
