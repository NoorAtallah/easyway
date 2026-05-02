import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { AdminLayoutClient } from './AdminLayoutClient'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  const role = profile?.role ?? 'staff'

  return (
    <AdminLayoutClient
      userEmail={user.email ?? ''}
      userRole={role}
      userName={profile?.full_name ?? ''}
    >
      {children}
    </AdminLayoutClient>
  )
}