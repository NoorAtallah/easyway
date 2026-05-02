export type CleaningQuote = {
  id: string
  service_id: string | null
  service_key: string
  service_name: string
  line_items: { key: string; label: string; qty: number; price: number }[]
  total: number
  date: string | null
  time: string | null
  address: string | null
  access_notes: string | null
  focus_areas: string | null
  name: string
  phone: string
  email: string
  sms_opt_in: boolean
  coupon: string | null
  status: string
  notes: string | null
  created_at: string
  updated_at: string
  reference_id: string | null
}

export type SubmitCleaningQuoteResult =
  | { success: true; quoteId: string }
  | { success: false; error: string }