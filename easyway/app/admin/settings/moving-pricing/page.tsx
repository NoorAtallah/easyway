import { createAdminClient } from '@/lib/supabase/server'
import MovingPricingManager from './MovingPricingManager'

export default async function MovingPricingPage() {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('moving_pricing_ranges')
    .select('*')
    .order('sort_order')

  return <MovingPricingManager initialRanges={data ?? []} />
}