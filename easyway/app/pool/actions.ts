'use server'

import { createAdminClient } from '@/lib/supabase/server'

export async function submitPoolCareQuote(data: Record<string, string>) {
  const admin = createAdminClient()
  const { error } = await admin.from('pool_care_quotes').insert({
    form_data: data,
    email: data['email'] ?? null,
  })
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function submitPoolFillingQuote(data: Record<string, string> & { estimatedTotal: number | null }) {
  const admin = createAdminClient()
  const { estimatedTotal, ...formData } = data
  const { error } = await admin.from('pool_filling_quotes').insert({
    form_data: formData,
    email: formData['email'] ?? null,
    estimated_total: estimatedTotal && !isNaN(estimatedTotal) ? estimatedTotal : null,
  })
  if (error) return { success: false, error: error.message }
  return { success: true }
}


export async function getPoolStatePricing(): Promise<Record<string, number>> {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('pool_state_pricing')
    .select('state, price_per_gallon, is_active')
    .eq('is_active', true)
  if (error || !data) return {}
  return Object.fromEntries(data.map(r => [r.state, r.price_per_gallon]))
}