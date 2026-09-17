'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      size="sm"
      className="text-primary-foreground border-primary-foreground/30 hover:bg-primary/80 hover:text-primary-foreground bg-transparent hover:cursor-pointer"
    >
      Salir
    </Button>
  )
}
