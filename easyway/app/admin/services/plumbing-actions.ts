'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { PlumbingFieldType } from '@/types/plumbing'
import { createClient } from '@supabase/supabase-js/dist/index.cjs'

type Result = { success: true } | { success: false; error: string }
type CreateResult = { success: true; id: string } | { success: false; error: string }

export async function createPlumbingField(input: {
  key: string
  label: string
  type: PlumbingFieldType
  placeholder?: string
  help_text?: string
  icon?: string
  required?: boolean
  sort_order?: number
}): Promise<CreateResult> {
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('plumbing_fields')
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

export async function updatePlumbingField(
  id: string,
  changes: Partial<{
    key: string
    label: string
    placeholder: string
    help_text: string
    type: PlumbingFieldType
    icon: string
    required: boolean
    sort_order: number
    is_active: boolean
  }>
): Promise<Result> {
  const supabase = await createAdminClient()
  const { error } = await supabase
    .from('plumbing_fields')
    .update({ ...changes, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/services')
  return { success: true }
}

export async function deletePlumbingField(id: string): Promise<Result> {
  const supabase = await createAdminClient()
  const { error } = await supabase.from('plumbing_fields').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/services')
  return { success: true }
}

export async function createPlumbingFieldOption(input: {
  field_id: string
  label: string
  value: string
  sort_order?: number
}): Promise<CreateResult> {
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('plumbing_field_options')
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

export async function updatePlumbingFieldOption(
  id: string,
  changes: Partial<{ label: string; value: string; sort_order: number }>
): Promise<Result> {
  const supabase = await createAdminClient()
  const { error } = await supabase.from('plumbing_field_options').update(changes).eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/services')
  return { success: true }
}

export async function deletePlumbingFieldOption(id: string): Promise<Result> {
  const supabase = await createAdminClient()
  const { error } = await supabase.from('plumbing_field_options').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/services')
  return { success: true }
}