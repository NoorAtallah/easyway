import { createAdminClient } from '@/lib/supabase/server'
import PlumbingForm from './PlumbingForm'
import type { PlumbingField } from '@/types/plumbing'

export default async function PlumbingPage() {
  const supabase = await createAdminClient()

  const { data } = await supabase
    .from('plumbing_fields')
    .select('*, plumbing_field_options(*)')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  const fields = (data ?? []) as PlumbingField[]

  return <PlumbingForm fields={fields} />
}