import { createAdminClient, createServerClient } from '@/lib/supabase/server'
import BookingsTabs from './BookingsTabs'

export default async function BookingsPage() {
  const sessionClient = await createServerClient()
  const { data: { user } } = await sessionClient.auth.getUser()

  let role: 'admin' | 'manager' | 'staff' = 'staff'
  if (user) {
    const { data: profile } = await sessionClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    if (profile?.role) role = profile.role
  }

  const admin = createAdminClient()

const [
  { data: landscapingQuotes, count: lCount },
  { data: plumbingQuotes,    count: pCount },
  { data: cleaningQuotes,    count: cCount },
  { data: poolCareQuotes,    count: pcCount },
  { data: poolFillingQuotes, count: pfCount },
  { data: movingQuotes,      count: mCount },
  { data: movingItems },
] = await Promise.all([
  admin.from('landscaping_quotes').select('*', { count: 'exact' }).order('created_at', { ascending: false }),
  admin.from('plumbing_quotes').select('*', { count: 'exact' }).order('created_at', { ascending: false }),
  admin.from('cleaning_quotes').select('*', { count: 'exact' }).order('created_at', { ascending: false }),
  admin.from('pool_care_quotes').select('*', { count: 'exact' }).order('created_at', { ascending: false }),
  admin.from('pool_filling_quotes').select('*', { count: 'exact' }).order('created_at', { ascending: false }),
  admin.from('moving_quotes').select('*', { count: 'exact' }).order('created_at', { ascending: false }),
  admin.from('moving_items').select('id, name, section, cuft').eq('is_active', true),
])

  const counts = {
    landscaping: lCount ?? 0,
    moving:      mCount ?? 0,
    cleaning:    cCount ?? 0,
    pool:        (pcCount ?? 0) + (pfCount ?? 0),
    plumbing:    pCount ?? 0,
  }

  return (
    <BookingsTabs
      counts={counts}
      landscapingQuotes={landscapingQuotes ?? []}
      plumbingQuotes={plumbingQuotes ?? []}
      cleaningQuotes={cleaningQuotes ?? []}
      poolCareQuotes={poolCareQuotes ?? []}
      poolFillingQuotes={poolFillingQuotes ?? []}
      movingItems={movingItems ?? []}
      movingQuotes={movingQuotes ?? []}
      userRole={role}
    />
  )
}