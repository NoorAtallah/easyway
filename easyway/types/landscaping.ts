export type LandscapingQuote = {
  id: string
  zip_code: string
  city: string
  address: string
  job_size_label: string
  first_name: string
  last_name: string
  email: string
  phone: string
  status: 'new' | 'contacted' | 'quoted' | 'won' | 'lost'
  notes: string | null
  created_at: string
  updated_at: string
  reference_id: string | null
}

export type JobSize = {
  id: string
  label: string
  description: string
}

export type QuoteFormData = {
  zipCode: string
  city: string
  address: string
  jobSizeId: string
  firstName: string
  lastName: string
  email: string
  phone: string
}

export type SubmitQuoteResult =
  | { success: true; quoteId: string }
  | { success: false; error: string }