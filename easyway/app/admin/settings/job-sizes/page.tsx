import { createAdminClient } from '@/lib/supabase/server'
import JobSizesManager from './JobSizesManager'

export default async function JobSizesPage() {
  const supabase = createAdminClient()
  const { data: jobSizes } = await supabase
    .from('job_sizes')
    .select('id, label, description, sort_order, is_active')
    .order('sort_order', { ascending: true })

  return <JobSizesManager initialJobSizes={jobSizes ?? []} />
}