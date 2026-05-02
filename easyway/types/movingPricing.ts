export type PricingRange = {
  id: string
  min_miles: number
  max_miles: number | null
  price_per_cuft: number
  sort_order: number
  is_active: boolean
}

export function getRateForDistance(
  distanceMiles: number,
  ranges: PricingRange[]
): number | null {
  const active = ranges
    .filter(r => r.is_active)
    .sort((a, b) => a.sort_order - b.sort_order)

  const match = active.find(r =>
    distanceMiles >= r.min_miles &&
    (r.max_miles === null || distanceMiles <= r.max_miles)
  )

  return match ? match.price_per_cuft : null
}

export function calcEstimatedPrice(
  distanceMiles: number,
  totalCuft: number,
  ranges: PricingRange[]
): number | null {
  const rate = getRateForDistance(distanceMiles, ranges)
  if (rate === null) return null
  return Math.round(totalCuft * rate)
}