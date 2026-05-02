'use server'

import { createAdminClient } from '@/lib/supabase/server'
import type { PlumbingQuoteFormData, SubmitPlumbingQuoteResult } from '@/types/plumbing'

export async function submitPlumbingQuote(
  data: PlumbingQuoteFormData
): Promise<SubmitPlumbingQuoteResult> {
  const required = [
    data.zipCode, data.city, data.address, data.jobDescription,
    data.firstName, data.lastName, data.email, data.phone,
  ]
  if (required.some(v => !v?.trim())) {
    return { success: false, error: 'All fields are required.' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(data.email)) {
    return { success: false, error: 'Please enter a valid email.' }
  }

  const supabase = createAdminClient()

  const { data: inserted, error } = await supabase
    .from('plumbing_quotes')
    .insert({
      zip_code: data.zipCode.trim(),
      city: data.city.trim(),
      address: data.address.trim(),
      job_description: data.jobDescription.trim(),
      first_name: data.firstName.trim(),
      last_name: data.lastName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
    })
    .select('id')
    .single()

  if (error) {
    console.error('Plumbing quote submission failed:', error)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }

  return { success: true, quoteId: inserted.id }
}