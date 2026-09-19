import Image from 'next/image'
import LogoutButton from '@/components/admin/LogoutButton'
import Sidebar from '@/components/admin/Sidebar'
import { AdminFormProvider } from '@/components/admin/AdminFormContext'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminFormProvider>
    <div className="h-dvh overflow-hidden flex flex-col bg-muted">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-6 py-3 flex items-center justify-between shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-accent/50 ring-offset-1 ring-offset-primary shrink-0">
            <Image src="/logo.jpeg" alt="Logo" width={36} height={36} className="object-cover w-full h-full" />
          </div>
          <div>
            <p className="font-bold text-sm leading-tight font-heading">Sabores del Perú</p>
            <p className="text-accent text-xs leading-tight">Panel de administración</p>
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
    </AdminFormProvider>
  )
}
