// app/admin/settings/coupons/actions.ts
'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCoupon(data: {
  code: string
  description: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  expiry_date: string | null
  usage_limit: number | null
}) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('coupons').insert({
    code: data.code.trim().toUpperCase(),
    description: data.description.trim() || null,
    discount_type: data.discount_type,
    discount_value: data.discount_value,
    expiry_date: data.expiry_date || null,
    usage_limit: data.usage_limit || null,
    is_active: true,
  })
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/settings/coupons')
  return { success: true }
}

export async function updateCoupon(id: string, data: Partial<{
  code: string
  description: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  expiry_date: string | null
  usage_limit: number | null
  is_active: boolean
}>) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('coupons').update(data).eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/settings/coupons')
  return { success: true }
}

export async function deleteCoupon(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('coupons').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/settings/coupons')
  return { success: true }
}