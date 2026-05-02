'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createPricingRange(input: {
  min_miles: number
  max_miles: number | null
  price_per_cuft: number
  sort_order: number
}) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('moving_pricing_ranges').insert({
    min_miles: input.min_miles,
    max_miles: input.max_miles,
    price_per_cuft: input.price_per_cuft,
    sort_order: input.sort_order,
    is_active: true,
  })
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/settings/moving-pricing')
  return { success: true }
}

export async function updatePricingRange(
  id: string,
  updates: {
    min_miles?: number
    max_miles?: number | null
    price_per_cuft?: number
    sort_order?: number
    is_active?: boolean
  }
) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('moving_pricing_ranges')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/settings/moving-pricing')
  return { success: true }
}

export async function deletePricingRange(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('moving_pricing_ranges')
    .update({ is_active: false })
    .eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/settings/moving-pricing')
  return { success: true }
}