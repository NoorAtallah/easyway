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
  { data: rawCareQuotes,     count: pcCount },
  { data: rawFillingQuotes,  count: pfCount },
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

const poolCareQuotes = (rawCareQuotes ?? []).map(q => ({
  ...q,
  first_name: q.form_data?.first_name ?? q.first_name ?? null,
  last_name:  q.form_data?.last_name  ?? q.last_name  ?? null,
  email:      q.form_data?.email      ?? q.email      ?? null,
  phone:      q.form_data?.phone      ?? q.phone      ?? null,
  zip_code:   q.form_data?.zip_code   ?? q.zip_code   ?? null,
  city:       q.form_data?.city       ?? q.city       ?? null,
  address:    q.form_data?.address    ?? q.address    ?? null,
  pool_size:  q.form_data?.pool_size  ?? q.pool_size  ?? null,
  notes:      q.form_data?.notes      ?? q.notes      ?? null,
}))

const poolFillingQuotes = (rawFillingQuotes ?? []).map(q => ({
  ...q,
  first_name: q.form_data?.first_name ?? q.first_name ?? null,
  last_name:  q.form_data?.last_name  ?? q.last_name  ?? null,
  email:      q.form_data?.email      ?? q.email      ?? null,
  zip_code:   q.form_data?.zip_code   ?? q.zip_code   ?? null,
  street:     q.form_data?.street     ?? q.street     ?? null,
  city:       q.form_data?.city       ?? q.city       ?? null,
  state:      q.form_data?.state      ?? q.state      ?? null,
  gallons:    q.form_data?.gallons    ?? q.gallons     ?? null,
  estimated_total: q.estimated_total ?? null,
}))

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