'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const admin = () => createAdminClient()

// ── Services ────────────────────────────────────────────────────────────────

export async function getCleaningServices() {
  const { data } = await admin()
    .from('cleaning_services')
    .select('*')
    .order('sort_order')
  return data ?? []
}

export async function getServiceWithSteps(id: string) {
  const { data: service } = await admin()
    .from('cleaning_services')
    .select('*')
    .eq('id', id)
    .single()

  const { data: steps } = await admin()
    .from('cleaning_steps')
    .select('*, cleaning_step_items(*)')
    .eq('service_id', id)
    .order('sort_order')

  if (!service) return null

  const stepsWithItems = (steps ?? []).map(s => ({
    ...s,
    cleaning_step_items: (s.cleaning_step_items ?? []).sort(
      (a: any, b: any) => a.sort_order - b.sort_order
    ),
  }))

  return { ...service, steps: stepsWithItems }
}

export async function createService(data: {
  name: string
  description: string
  image_url: string
  flow_type: 'wizard' | 'quote'
}) {
  const key = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const { data: existing } = await admin()
    .from('cleaning_services')
    .select('id')
    .eq('key', key)
    .single()

  const finalKey = existing ? `${key}-${Date.now()}` : key

  const { data: service, error } = await admin()
    .from('cleaning_services')
    .insert({ ...data, key: finalKey, sort_order: 99 })
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/services')
  return { success: true, id: service.id }
}

export async function updateService(id: string, data: {
  name?: string
  description?: string
  image_url?: string
  flow_type?: 'wizard' | 'quote'
  is_active?: boolean
  sort_order?: number
}) {
  const { error } = await admin()
    .from('cleaning_services')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/services')
  return { success: true }
}

export async function deleteService(id: string) {
  const { error } = await admin()
    .from('cleaning_services')
    .delete()
    .eq('id', id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/services')
  return { success: true }
}

// ── Steps ────────────────────────────────────────────────────────────────────

export async function addStep(serviceId: string, data: {
  type: string
  title: string
  sub?: string
  field?: string
}) {
  const { data: last } = await admin()
    .from('cleaning_steps')
    .select('sort_order')
    .eq('service_id', serviceId)
    .order('sort_order', { ascending: false })
    .limit(1)
    .single()

  const { data: step, error } = await admin()
    .from('cleaning_steps')
    .insert({
      service_id: serviceId,
      type: data.type,
      title: data.title,
      sub: data.sub ?? '',
      field: data.field ?? null,
      sort_order: (last?.sort_order ?? 0) + 1,
    })
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/services')
  return { success: true, step }
}

export async function updateStep(id: string, data: {
  title?: string
  sub?: string
  type?: string
  field?: string
  is_active?: boolean
}) {
  const { error } = await admin()
    .from('cleaning_steps')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/services')
  return { success: true }
}

export async function deleteStep(id: string) {
  const { error } = await admin()
    .from('cleaning_steps')
    .delete()
    .eq('id', id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/services')
  return { success: true }
}

export async function reorderSteps(steps: { id: string; sort_order: number }[]) {
  await Promise.all(
    steps.map(s =>
      admin().from('cleaning_steps').update({ sort_order: s.sort_order }).eq('id', s.id)
    )
  )
  revalidatePath('/admin/services')
  return { success: true }
}

// ── Items ────────────────────────────────────────────────────────────────────

export async function addItem(stepId: string, data: {
  key: string
  label: string
  description?: string
  price: number
}) {
  const { data: last } = await admin()
    .from('cleaning_step_items')
    .select('sort_order')
    .eq('step_id', stepId)
    .order('sort_order', { ascending: false })
    .limit(1)
    .single()

  const { error } = await admin()
    .from('cleaning_step_items')
    .insert({
      step_id: stepId,
      key: data.key,
      label: data.label,
      description: data.description ?? '',
      price: data.price,
      sort_order: (last?.sort_order ?? 0) + 1,
    })

  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/services')
  return { success: true }
}

export async function updateItem(id: string, data: {
  label?: string
  description?: string
  price?: number
  is_active?: boolean
}) {
  const { error } = await admin()
    .from('cleaning_step_items')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/services')
  return { success: true }
}

export async function deleteItem(id: string) {
  const { error } = await admin()
    .from('cleaning_step_items')
    .delete()
    .eq('id', id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/services')
  return { success: true }
}

export async function reorderItems(items: { id: string; sort_order: number }[]) {
  await Promise.all(
    items.map(i =>
      admin().from('cleaning_step_items').update({ sort_order: i.sort_order }).eq('id', i.id)
    )
  )
  revalidatePath('/admin/services')
  return { success: true }
}



export async function getMovingItemsAdmin() {
  const { data } = await admin()
    .from('moving_items')
    .select('*')
    .order('section')
    .order('sort_order')
  return data ?? []
}

export async function createMovingItem(data: {
  section: string; name: string; cuft: number; sort_order: number
}) {
  const { data: item, error } = await admin()
    .from('moving_items')
    .insert(data)
    .select('id')
    .single()
  if (error) return { success: false, error: error.message }
  return { success: true, id: item.id }
}

export async function updateMovingItem(id: string, data: Partial<{
  name: string; section: string; cuft: number;
  image_url: string | null; is_active: boolean; sort_order: number
}>) {
  const { error } = await admin().from('moving_items').update(data).eq('id', id)
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function deleteMovingItem(id: string) {
  const { error } = await admin().from('moving_items').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function uploadMovingItemImage(id: string, file: FormData) {
  const supabase = createAdminClient()
  const fileData = file.get('file') as File
  if (!fileData) return { success: false, error: 'No file provided' }
  const ext = fileData.name.split('.').pop()
  const path = `${id}.${ext}`
  const { error: uploadError } = await supabase.storage
    .from('moving-items')
    .upload(path, fileData, { upsert: true })
  if (uploadError) return { success: false, error: uploadError.message }
  const { data: { publicUrl } } = supabase.storage.from('moving-items').getPublicUrl(path)
  await admin().from('moving_items').update({ image_url: publicUrl }).eq('id', id)
  return { success: true, url: publicUrl }
}