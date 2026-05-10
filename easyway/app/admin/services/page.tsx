import {
  getCleaningServices, getMovingItemsAdmin,
  getPlumbingFields, getLandscapingFields,
} from './actions'
import { createAdminClient } from '@/lib/supabase/server'
import ServicesTabs from './ServicesTabs'

async function getPoolCareFields() {
  const supabase = await createAdminClient()
  const { data } = await supabase
    .from('pool_care_fields')
    .select('*, pool_care_field_options(*)')
    .order('sort_order')
  return data ?? []
}

async function getPoolFillingFields() {
  const supabase = await createAdminClient()
  const { data } = await supabase
    .from('pool_filling_fields')
    .select('*, pool_filling_field_options(*)')
    .order('sort_order')
  return data ?? []
}

async function getPoolPricing() {
  const supabase = await createAdminClient()
  const { data } = await supabase
    .from('pool_state_pricing')
    .select('state, price_per_gallon, is_active')
    .order('state')
  return data ?? []
}

export default async function ServicesPage() {
  const [
    services, movingItems, plumbingFields, landscapingFields,
    poolCareFields, poolFillingFields, poolPricing,
  ] = await Promise.all([
    getCleaningServices(),
    getMovingItemsAdmin(),
    getPlumbingFields(),
    getLandscapingFields(),
    getPoolCareFields(),
    getPoolFillingFields(),
    getPoolPricing(),
  ])

  return (
    <ServicesTabs
      services={services}
      movingItems={movingItems}
      plumbingFields={plumbingFields}
      landscapingFields={landscapingFields}
      poolCareFields={poolCareFields}
      poolFillingFields={poolFillingFields}
      poolPricing={poolPricing}
    />
  )
}