// app/admin/settings/coupons/page.tsx
import { createAdminClient } from '@/lib/supabase/server'
import CouponsManager from './CouponsManager'

export default async function CouponsPage() {
  const supabase = createAdminClient()
  const { data: coupons } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false })

  return <CouponsManager initialCoupons={coupons ?? []} />
}