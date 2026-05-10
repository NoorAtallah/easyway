'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

type Result = { success: true } | { success: false; error: string }
type CreateResult = { success: true; id: string } | { success: false; error: string }

type PoolFieldType = 'text' | 'email' | 'tel' | 'number' | 'textarea' | 'select'

// ── Pool Care Fields ─────────────────────────────────────────

export async function createPoolCareField(input: {
  key: string; label: string; type: PoolFieldType
  placeholder?: string; help_text?: string; icon?: string
  required?: boolean; sort_order?: number
}): Promise<CreateResult> {
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('pool_care_fields')
    .insert({
      key: input.key,
      label: input.label,
      type: input.type,
      placeholder: input.placeholder ?? '',
      help_text: input.help_text ?? '',
      icon: input.icon ?? 'FileText',
      required: input.required ?? true,
      sort_order: input.sort_order ?? 999,
    })
    .select('id')
    .single()
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/services')
  return { success: true, id: data.id }
}

export async function updatePoolCareField(
  id: string,
  changes: Partial<{
    key: string; label: string; placeholder: string; help_text: string
    type: PoolFieldType; icon: string; required: boolean
    sort_order: number; is_active: boolean
  }>
): Promise<Result> {
  const supabase = await createAdminClient()
  const { error } = await supabase
    .from('pool_care_fields')
    .update({ ...changes, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/services')
  return { success: true }
}

export async function deletePoolCareField(id: string): Promise<Result> {
  const supabase = await createAdminClient()
  const { error } = await supabase.from('pool_care_fields').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/services')
  return { success: true }
}

export async function createPoolCareFieldOption(input: {
  field_id: string; label: string; value: string; sort_order?: number
}): Promise<CreateResult> {
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('pool_care_field_options')
    .insert({
      field_id: input.field_id,
      label: input.label,
      value: input.value,
      sort_order: input.sort_order ?? 999,
    })
    .select('id')
    .single()
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/services')
  return { success: true, id: data.id }
}

export async function updatePoolCareFieldOption(
  id: string,
  changes: Partial<{ label: string; value: string; sort_order: number }>
): Promise<Result> {
  const supabase = await createAdminClient()
  const { error } = await supabase.from('pool_care_field_options').update(changes).eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/services')
  return { success: true }
}

export async function deletePoolCareFieldOption(id: string): Promise<Result> {
  const supabase = await createAdminClient()
  const { error } = await supabase.from('pool_care_field_options').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/services')
  return { success: true }
}

// ── Pool Filling Fields ──────────────────────────────────────

export async function createPoolFillingField(input: {
  key: string; label: string; type: PoolFieldType
  placeholder?: string; help_text?: string; icon?: string
  required?: boolean; sort_order?: number
}): Promise<CreateResult> {
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('pool_filling_fields')
    .insert({
      key: input.key,
      label: input.label,
      type: input.type,
      placeholder: input.placeholder ?? '',
      help_text: input.help_text ?? '',
      icon: input.icon ?? 'FileText',
      required: input.required ?? true,
      sort_order: input.sort_order ?? 999,
    })
    .select('id')
    .single()
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/services')
  return { success: true, id: data.id }
}

export async function updatePoolFillingField(
  id: string,
  changes: Partial<{
    key: string; label: string; placeholder: string; help_text: string
    type: PoolFieldType; icon: string; required: boolean
    sort_order: number; is_active: boolean
  }>
): Promise<Result> {
  const supabase = await createAdminClient()
  const { error } = await supabase
    .from('pool_filling_fields')
    .update({ ...changes, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/services')
  return { success: true }
}

export async function deletePoolFillingField(id: string): Promise<Result> {
  const supabase = await createAdminClient()
  const { error } = await supabase.from('pool_filling_fields').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/services')
  return { success: true }
}

export async function createPoolFillingFieldOption(input: {
  field_id: string; label: string; value: string; sort_order?: number
}): Promise<CreateResult> {
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('pool_filling_field_options')
    .insert({
      field_id: input.field_id,
      label: input.label,
      value: input.value,
      sort_order: input.sort_order ?? 999,
    })
    .select('id')
    .single()
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/services')
  return { success: true, id: data.id }
}

export async function updatePoolFillingFieldOption(
  id: string,
  changes: Partial<{ label: string; value: string; sort_order: number }>
): Promise<Result> {
  const supabase = await createAdminClient()
  const { error } = await supabase.from('pool_filling_field_options').update(changes).eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/services')
  return { success: true }
}

export async function deletePoolFillingFieldOption(id: string): Promise<Result> {
  const supabase = await createAdminClient()
  const { error } = await supabase.from('pool_filling_field_options').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/services')
  return { success: true }
}

// ── State Pricing ────────────────────────────────────────────

export async function upsertStatePricing(
  state: string,
  price_per_gallon: number
): Promise<Result> {
  const supabase = await createAdminClient()
  const { error } = await supabase
    .from('pool_state_pricing')
    .upsert(
      { state, price_per_gallon, updated_at: new Date().toISOString() },
      { onConflict: 'state' }
    )
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/services')
  return { success: true }
}

export async function upsertManyStatePricing(
  rows: { state: string; price_per_gallon: number; is_active: boolean }[]
): Promise<Result> {
  const supabase = await createAdminClient()
  const { error } = await supabase
    .from('pool_state_pricing')
    .upsert(
      rows.map(r => ({ ...r, updated_at: new Date().toISOString() })),
      { onConflict: 'state' }
    )
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/services')
  return { success: true }
}

export async function getStatePricing(): Promise<{
  success: true
  data: { state: string; price_per_gallon: number; is_active: boolean }[]
} | { success: false; error: string }> {
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('pool_state_pricing')
    .select('state, price_per_gallon, is_active')
    .order('state')
  if (error) return { success: false, error: error.message }
  return { success: true, data: data ?? [] }
}