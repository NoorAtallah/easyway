import { createAdminClient } from '@/lib/supabase/server'
import PoolCareFieldsManager from './pool-care-fields-manager'
import PoolFillingManager from './pool-filling-manager'

async function getPoolCareFields() {
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('pool_care_fields')
    .select('*, pool_care_field_options(*)')
    .order('sort_order')
  if (error) return []
  return data ?? []
}

async function getPoolFillingFields() {
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('pool_filling_fields')
    .select('*, pool_filling_field_options(*)')
    .order('sort_order')
  if (error) return []
  return data ?? []
}

async function getStatePricing() {
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('pool_state_pricing')
    .select('state, price_per_gallon, is_active')
    .order('state')
  if (error) return []
  return data ?? []
}

export default async function PoolAdminPage() {
  const [careFields, fillingFields, pricing] = await Promise.all([
    getPoolCareFields(),
    getPoolFillingFields(),
    getStatePricing(),
  ])

  return <PoolPageTabs careFields={careFields} fillingFields={fillingFields} pricing={pricing} />
}

// ── Tabbed wrapper (client) ──────────────────────────────────
// Needs to be a separate client component for tab state
import PoolPageTabs from './pool-page-tabs'