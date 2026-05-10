"use server"

import { createAdminClient } from "@/lib/supabase/server"
import type { LandscapingField } from "@/types/landscaping"

type SubmitInput = { answers: Record<string, string> }
type SubmitResult = { success: true; quoteId: string } | { success: false; error: string }

export async function submitLandscapingQuote(input: SubmitInput): Promise<SubmitResult> {
  const supabase = createAdminClient()
  const a = input.answers ?? {}

  // Fetch active fields to validate against
  const { data: activeFields, error: fieldsError } = await supabase
    .from("landscaping_fields")
    .select("key, label, required, type, is_active")
    .eq("is_active", true)

  if (fieldsError) {
    console.error("Failed to fetch fields for validation:", fieldsError)
    return { success: false, error: "Something went wrong. Please try again." }
  }

  // Validate required fields
  for (const f of activeFields ?? []) {
    if (f.required && !a[f.key]?.trim()) {
      return { success: false, error: `Please fill in "${f.label}"` }
    }
  }

  // Validate email format if present
  if (a.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email)) {
    return { success: false, error: "Please enter a valid email." }
  }

  // Build insert payload — mirror well-known keys into legacy columns
  const { data: inserted, error } = await supabase
    .from("landscaping_quotes")
    .insert({
      zip_code:       a.zipCode   ?? "",
      city:           a.city      ?? "",
      address:        a.address   ?? "",
      job_size_label: a.jobSize   ?? "",
      first_name:     a.firstName ?? "",
      last_name:      a.lastName  ?? "",
      email:          (a.email    ?? "").toLowerCase().trim(),
      phone:          a.phone     ?? "",
      answers:        a,
    })
    .select("id")
    .single()

  if (error) {
    console.error("Quote submission failed:", error)
    return { success: false, error: "Something went wrong. Please try again." }
  }

  return { success: true, quoteId: inserted.id }
}

export async function getActiveLandscapingFields(): Promise<LandscapingField[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("landscaping_fields")
    .select("*, landscaping_field_options(*)")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("Failed to fetch landscaping fields:", error)
    return []
  }
  return (data ?? []) as LandscapingField[]
}