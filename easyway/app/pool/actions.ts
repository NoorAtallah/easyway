'use server'

import { createAdminClient } from '@/lib/supabase/server'

export async function submitPoolCareQuote(data: {
  firstName: string; lastName: string; email: string; phone: string
  zipCode: string; city: string; address: string
  poolSize: string; notes: string
}) {
  const admin = createAdminClient()
  const { error } = await admin.from('pool_care_quotes').insert({
    first_name: data.firstName,
    last_name:  data.lastName,
    email:      data.email,
    phone:      data.phone,
    zip_code:   data.zipCode,
    city:       data.city,
    address:    data.address,
    pool_size:  data.poolSize || null,
    notes:      data.notes   || null,
  })
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function submitPoolFillingQuote(data: {
  firstName: string; lastName: string; email: string
  zipCode: string; street: string; city: string; state: string; gallons: string
}) {
  const admin = createAdminClient()
  const { error } = await admin.from('pool_filling_quotes').insert({
    first_name: data.firstName,
    last_name:  data.lastName,
    email:      data.email,
    zip_code:   data.zipCode,
    street:     data.street,
    city:       data.city,
    state:      data.state,
    gallons:    data.gallons,
  })
  if (error) return { success: false, error: error.message }
  return { success: true }
}