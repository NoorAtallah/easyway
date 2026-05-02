import { getMovingItems } from './actions'
import MovingQuotePage from './MovingQuotePage'
import { createAdminClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = createAdminClient()

  const [items, { data: pricingRanges }] = await Promise.all([
    getMovingItems(),
    supabase
      .from('moving_pricing_ranges')
      .select('*')
      .eq('is_active', true)
      .order('sort_order'),
  ])

  return <MovingQuotePage items={items} pricingRanges={pricingRanges ?? []} />
}