import { createAdminClient } from '@/lib/supabase/server'
import PoolPage from './PoolPage'

async function getPoolCareFields() {
  const supabase = await createAdminClient()
  const { data } = await supabase
    .from('pool_care_fields')
    .select('*, pool_care_field_options(*)')
    .eq('is_active', true)
    .order('sort_order')
  return data ?? []
}

async function getPoolFillingFields() {
  const supabase = await createAdminClient()
  const { data } = await supabase
    .from('pool_filling_fields')
    .select('*, pool_filling_field_options(*)')
    .eq('is_active', true)
    .order('sort_order')
  return data ?? []
}

async function getPoolStatePricing() {
  const supabase = await createAdminClient()
  const { data } = await supabase
    .from('pool_state_pricing')
    .select('state, price_per_gallon')
    .eq('is_active', true)
    .order('state')
  return data ?? []
}

export default async function PoolServerPage() {
  const [careFields, fillingFields, statePricing] = await Promise.all([
    getPoolCareFields(),
    getPoolFillingFields(),
    getPoolStatePricing(),
  ])

  const pricingMap = Object.fromEntries(
    statePricing.map(r => [r.state, r.price_per_gallon])
  )

  return (
    <PoolPage
      careFields={careFields}
      fillingFields={fillingFields}
      pricingMap={pricingMap}
    />
  )
}