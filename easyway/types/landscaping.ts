export type LandscapingFieldType = 'text' | 'email' | 'tel' | 'number' | 'textarea' | 'select'

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