export type LandscapingFieldType = 'text' | 'email' | 'tel' | 'number' | 'textarea' | 'select'
export type LandscapingQuote = {
  id: string
  reference_id?: string
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  city: string
  zip_code: string
  job_size_label: string
  status: 'new' | 'contacted' | 'quoted' | 'won' | 'lost'
  created_at: string
}
export type LandscapingFieldOption = {
  id: string
  field_id: string
  label: string
  value: string
  sort_order: number
}

export type LandscapingField = {
  id: string
  key: string
  label: string
  placeholder: string
  help_text: string
  type: LandscapingFieldType
  icon: string
  required: boolean
  sort_order: number
  is_active: boolean
  landscaping_field_options: LandscapingFieldOption[]
}