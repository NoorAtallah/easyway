// app/admin/settings/email/actions.ts
'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getEmailSettings() {
  const supabase = createAdminClient()
  const { data } = await supabase.from('email_settings').select('key, value')
  const map: Record<string, string | null> = {}
  for (const row of data ?? []) map[row.key] = row.value
  return map
}

export async function updateEmailSetting(key: string, value: string | null) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('email_settings')
    .update({ value, updated_at: new Date().toISOString() })
    .eq('key', key)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/settings/email')
  return { success: true }
}

export async function uploadEmailAsset(key: string, file: FormData) {
  const supabase = createAdminClient()
  const fileData = file.get('file') as File
  if (!fileData) return { success: false, error: 'No file provided' }
  const ext = fileData.name.split('.').pop()
  const path = `${key}.${ext}`
  const { error: uploadError } = await supabase.storage
    .from('email-assets')
    .upload(path, fileData, { upsert: true })
  if (uploadError) return { success: false, error: uploadError.message }
  const { data: { publicUrl } } = supabase.storage.from('email-assets').getPublicUrl(path)
  await supabase
    .from('email_settings')
    .update({ value: publicUrl, updated_at: new Date().toISOString() })
    .eq('key', key)
  revalidatePath('/admin/settings/email')
  return { success: true, url: publicUrl }
}

export async function removeEmailAsset(key: string) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('email_settings')
    .update({ value: null, updated_at: new Date().toISOString() })
    .eq('key', key)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/settings/email')
  return { success: true }
}