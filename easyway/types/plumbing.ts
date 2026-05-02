export type PlumbingQuoteFormData = {
  zipCode: string
  city: string
  address: string
  jobDescription: string
  firstName: string
  lastName: string
  email: string
  phone: string
}

export type PlumbingQuote = {
  id: string
  zip_code: string
  city: string
  address: string
  job_description: string
  first_name: string
  last_name: string
  email: string
  phone: string
  status: string
  notes: string | null
  created_at: string
  updated_at: string
  reference_id: string | null
}

export type SubmitPlumbingQuoteResult =
  | { success: true; quoteId: string }
  | { success: false; error: string }