'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createJobSize(input: {
  label: string
  description: string
  sort_order: number
}) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('job_sizes').insert({
    label: input.label.trim(),
    description: input.description.trim(),
    sort_order: input.sort_order,
    is_active: true,
  })
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/settings/job-sizes')
  return { success: true }
}

export async function updateJobSize(
  id: string,
  updates: { label?: string; description?: string; sort_order?: number; is_active?: boolean }
) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('job_sizes').update(updates).eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/settings/job-sizes')
  return { success: true }
}

export async function deleteJobSize(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('job_sizes')
    .update({ is_active: false })
    .eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/settings/job-sizes')
  return { success: true }
}