// app/admin/settings/reviews/actions.ts
'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getReviews() {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('reviews')
    .select('*')
    .order('sort_order')
  return data ?? []
}

export async function createReview(data: {
  name: string
  avatar: string
  service: string
  rating: number
  text: string
  helpful: number
  date_label: string
  sort_order: number
}) {
  const supabase = createAdminClient()
  const { data: review, error } = await supabase
    .from('reviews')
    .insert(data)
    .select('id')
    .single()
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/settings/reviews')
  return { success: true, id: review.id }
}

export async function updateReview(id: string, data: Partial<{
  name: string
  avatar: string
  service: string
  rating: number
  text: string
  helpful: number
  date_label: string
  sort_order: number
  is_active: boolean
}>) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('reviews').update(data).eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/settings/reviews')
  return { success: true }
}

export async function deleteReview(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('reviews').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/settings/reviews')
  return { success: true }
}