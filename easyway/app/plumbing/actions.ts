'use server'

import { createAdminClient } from '@/lib/supabase/server'

type SubmitInput = { answers: Record<string, string> }
type Result = { success: true } | { success: false; error: string }

export async function submitPlumbingQuote(input: SubmitInput): Promise<Result> {
  const supabase = await createAdminClient()
  const a = input.answers

  // Mirror common keys into legacy columns if they're present
  const { error } = await supabase.from('plumbing_quotes').insert({
    zip_code:        a.zipCode        ?? '',
    city:            a.city           ?? '',
    address:         a.address        ?? '',
    job_description: a.jobDescription ?? '',
    first_name:      a.firstName      ?? '',
    last_name:       a.lastName       ?? '',
    email:           a.email          ?? '',
    phone:           a.phone          ?? '',
    answers:         a,
    reference_id:    `PLB-${Date.now().toString(36).toUpperCase()}`,
  })

  if (error) return { success: false, error: error.message }
  return { success: true }
}