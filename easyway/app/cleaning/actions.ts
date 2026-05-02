'use server'

import { createAdminClient } from '@/lib/supabase/server'

export async function getActiveCleaningServices() {
  const admin = createAdminClient()

  const { data: services } = await admin
    .from('cleaning_services')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  if (!services) return []

  const { data: steps } = await admin
    .from('cleaning_steps')
    .select('*, cleaning_step_items(*)')
    .in('service_id', services.map(s => s.id))
    .eq('is_active', true)
    .order('sort_order')

  return services.map(service => ({
    ...service,
    steps: (steps ?? [])
      .filter(s => s.service_id === service.id)
      .map(s => ({
        ...s,
        cleaning_step_items: (s.cleaning_step_items ?? [])
          .filter((i: any) => i.is_active)
          .sort((a: any, b: any) => a.sort_order - b.sort_order),
      })),
  }))
}

export async function submitCleaningQuote(data: {
  serviceId: string
  serviceKey: string
  serviceName: string
  lineItems: { key: string; label: string; qty: number; price: number }[]
  total: number
  date: string
  time: string
  address: string
  accessNotes: string
  focusAreas: string
  name: string
  phone: string
  email: string
  smsOptIn: boolean
  coupon: string
}) {
  const required = [data.name, data.email, data.phone, data.address]
  if (required.some(v => !v?.trim())) {
    return { success: false, error: 'Name, email, phone and address are required.' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(data.email)) {
    return { success: false, error: 'Please enter a valid email.' }
  }

  const admin = createAdminClient()

  const { data: inserted, error } = await admin
    .from('cleaning_quotes')
    .insert({
      service_id: data.serviceId,
      service_key: data.serviceKey,
      service_name: data.serviceName,
      line_items: data.lineItems,
      total: data.total,
      date: data.date || null,
      time: data.time || null,
      address: data.address.trim(),
      access_notes: data.accessNotes.trim(),
      focus_areas: data.focusAreas.trim(),
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email.trim().toLowerCase(),
      sms_opt_in: data.smsOptIn,
      coupon: data.coupon.trim() || null,
    })
    .select('id')
    .single()

  if (error) {
    console.error('Cleaning quote submission failed:', error)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }

  return { success: true, quoteId: inserted.id }
}

export async function getBookedSlots() {
  const admin = createAdminClient()
  const { data } = await admin
    .from('cleaning_booked_slots')
    .select('date, time')
  return (data ?? []).map(s => `${s.date}__${s.time}`)
  // returns array like ['2026-04-28__10:00 AM', '2026-04-29__2:00 PM']
}