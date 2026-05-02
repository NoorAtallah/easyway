// app/admin/settings/reviews/page.tsx
import { getReviews } from './actions'
import ReviewsManager from './ReviewsManager'

export default async function ReviewsPage() {
  const reviews = await getReviews()
  return <ReviewsManager initialReviews={reviews} />
}