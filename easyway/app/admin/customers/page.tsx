// app/admin/customers/page.tsx
import { createAdminClient } from '@/lib/supabase/server'
import CustomersClient from './CustomersClient'

export default async function CustomersPage() {
  const admin = createAdminClient()

  const [
    { data: landscaping },
    { data: plumbing },
    { data: cleaning },
    { data: poolCare },
    { data: poolFilling },
    { data: moving },
  ] = await Promise.all([
    admin.from('landscaping_quotes').select('id, reference_id, first_name, last_name, email, phone, status, created_at').order('created_at', { ascending: false }),
    admin.from('plumbing_quotes').select('id, reference_id, first_name, last_name, email, phone, status, created_at').order('created_at', { ascending: false }),
    admin.from('cleaning_quotes').select('id, reference_id, name, email, phone, status, created_at').order('created_at', { ascending: false }),
    admin.from('pool_care_quotes').select('id, reference_id, first_name, last_name, email, phone, status, created_at').order('created_at', { ascending: false }),
    admin.from('pool_filling_quotes').select('id, reference_id, first_name, last_name, email, status, created_at').order('created_at', { ascending: false }),
    admin.from('moving_quotes').select('id, reference_id, first_name, last_name, email, phone, status, created_at').order('created_at', { ascending: false }),
  ])

  return (
    <CustomersClient
      landscaping={landscaping ?? []}
      plumbing={plumbing ?? []}
      cleaning={cleaning ?? []}
      poolCare={poolCare ?? []}
      poolFilling={poolFilling ?? []}
      moving={moving ?? []}
    />
  )
}