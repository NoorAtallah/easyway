// Replace your existing ReviewsSection with this server component wrapper
// Keep the client component as ReviewsSectionClient.tsx

import { createAdminClient } from '@/lib/supabase/server'
import ReviewsSectionClient from './ReviewsSectionClient'

export default async function ReviewsSection() {
  const supabase = createAdminClient()
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  return <ReviewsSectionClient reviews={reviews ?? []} />
}