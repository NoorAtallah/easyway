"use server";

import { createAdminClient } from "@/lib/supabase/server";
import type { SubmitMovingQuoteResult } from "@/types/moving";

export async function submitMovingQuote(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pickupZip: string;
  pickupCity: string;
  pickupState: string;
  dropoffZip: string;
  dropoffCity: string;
  dropoffState: string;
  distanceMiles: number;
  preferredDate: string;
  needVehicle: boolean;
  items: Record<string, number>;
  totalCuft: number;
}): Promise<SubmitMovingQuoteResult> {
  const required = [
    data.firstName, data.lastName, data.email,
    data.phone, data.pickupZip, data.dropoffZip,
  ];
  if (required.some((v) => !v?.trim())) {
    return { success: false, error: "All fields are required." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { success: false, error: "Please enter a valid email." };
  }

  const supabase = createAdminClient();

  const { data: inserted, error } = await supabase
    .from("moving_quotes")
    .insert({
      first_name:     data.firstName.trim(),
      last_name:      data.lastName.trim(),
      email:          data.email.trim().toLowerCase(),
      phone:          data.phone.trim(),
      pickup_zip:     data.pickupZip.trim(),
      pickup_city:    data.pickupCity.trim(),
      pickup_state:   data.pickupState.trim(),
      dropoff_zip:    data.dropoffZip.trim(),
      dropoff_city:   data.dropoffCity.trim(),
      dropoff_state:  data.dropoffState.trim(),
      distance_miles: data.distanceMiles,
      preferred_date: data.preferredDate || null,
      need_vehicle:   data.needVehicle,
      items:          data.items,
      total_cuft:     data.totalCuft,
    })
    .select("id, reference_id")
    .single();

  if (error) {
    console.error("Moving quote submission failed:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }

  return { success: true, quoteId: inserted.id, referenceId: inserted.reference_id };
}

export async function getMovingItems() {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('moving_items')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  if (error) {
    console.error('Failed to fetch moving items:', error)
    return []
  }

  return data
}