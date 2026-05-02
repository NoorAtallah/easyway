"use server";

import { createAdminClient } from "@/lib/supabase/server";
import type { QuoteFormData, SubmitQuoteResult } from "@/types/landscaping";

export async function submitLandscapingQuote(
  data: QuoteFormData
): Promise<SubmitQuoteResult> {
  // Server-side validation
  const required = [
    data.zipCode, data.city, data.address, data.jobSizeId,
    data.firstName, data.lastName, data.email, data.phone,
  ];
  if (required.some((v) => !v?.trim())) {
    return { success: false, error: "All fields are required." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { success: false, error: "Please enter a valid email." };
  }

  const supabase = createAdminClient();

  // Look up job size (to snapshot the label and confirm it's valid/active)
  const { data: jobSize, error: jobSizeError } = await supabase
    .from("job_sizes")
    .select("id, label")
    .eq("id", data.jobSizeId)
    .eq("is_active", true)
    .single();

  if (jobSizeError || !jobSize) {
    return { success: false, error: "Invalid job size selected." };
  }

  // Insert quote
  const { data: inserted, error } = await supabase
    .from("landscaping_quotes")
    .insert({
      zip_code: data.zipCode.trim(),
      city: data.city.trim(),
      address: data.address.trim(),
      job_size_id: jobSize.id,
      job_size_label: jobSize.label,
      first_name: data.firstName.trim(),
      last_name: data.lastName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
    })
    .select("id")
    .single();

  if (error) {
    console.error("Quote submission failed:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }

  return { success: true, quoteId: inserted.id };
}

export async function getActiveJobSizes() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("job_sizes")
    .select("id, label, description")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch job sizes:", error);
    return [];
  }
  return data;
}