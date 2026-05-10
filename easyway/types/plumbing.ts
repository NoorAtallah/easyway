export type PlumbingFieldType = 'text' | 'email' | 'tel' | 'number' | 'textarea' | 'select'

export type PlumbingFieldOption = {
  id: string
  field_id: string
  label: string
  value: string
  sort_order: number
}
export type PlumbingQuote = {
  id: string
  reference_id?: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  address?: string
  created_at: string
  status?: string
  [key: string]: unknown
}
export type PlumbingField = {
  id: string
  key: string
  label: string
  placeholder: string
  help_text: string
  type: PlumbingFieldType
  icon: string
  required: boolean
  sort_order: number
  is_active: boolean
  plumbing_field_options: PlumbingFieldOption[]
}

// kept for backwards compat with the old static form (no longer used)
export type PlumbingQuoteFormData = Record<string, string>