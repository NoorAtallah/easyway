// app/admin/page.tsx
import { createServerClient, createAdminClient } from '@/lib/supabase/server'
import AdminOverview from './Adminoverview'

export default async function AdminPage() {
  const sessionClient = await createServerClient()
  const { data: { user } } = await sessionClient.auth.getUser()

  const admin = createAdminClient()

  const [
    { data: landscaping },
    { data: plumbing },
    { data: cleaning },
    { data: poolCare },
    { data: poolFilling },
    { data: moving },
  ] = await Promise.all([
    admin.from('landscaping_quotes').select('id, first_name, last_name, email, status, created_at').order('created_at', { ascending: false }),
    admin.from('plumbing_quotes').select('id, first_name, last_name, email, status, created_at').order('created_at', { ascending: false }),
    admin.from('cleaning_quotes').select('id, name, email, status, created_at').order('created_at', { ascending: false }),
    admin.from('pool_care_quotes').select('id, first_name, last_name, email, status, created_at').order('created_at', { ascending: false }),
    admin.from('pool_filling_quotes').select('id, first_name, last_name, email, status, created_at').order('created_at', { ascending: false }),
    admin.from('moving_quotes').select('id, first_name, last_name, email, status, created_at').order('created_at', { ascending: false }),
  ])

  return (
    <AdminOverview
      userName={user?.email ?? ''}
      landscaping={landscaping ?? []}
      plumbing={plumbing ?? []}
      cleaning={cleaning ?? []}
      poolCare={poolCare ?? []}
      poolFilling={poolFilling ?? []}
      moving={moving ?? []}
    />
  )
}