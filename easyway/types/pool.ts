export type PoolCareQuote = {
  id: string
  reference_id: string | null
  first_name: string
  last_name: string
  email: string
  phone: string
  zip_code: string
  city: string
  address: string
  pool_size: string | null
  notes: string | null
  status: string
  created_at: string
  updated_at: string
}

export type PoolFillingQuote = {
  id: string
  reference_id: string | null
  first_name: string
  last_name: string
  email: string
  zip_code: string
  street: string
  city: string
  state: string
  gallons: string
  estimated_total: number | null
  status: string
  created_at: string
  updated_at: string
}