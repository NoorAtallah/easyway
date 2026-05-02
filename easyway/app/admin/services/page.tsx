// app/admin/services/page.tsx
import { getCleaningServices, getMovingItemsAdmin } from './actions'
import ServicesTabs from './ServicesTabs'

export default async function ServicesPage() {
  const [services, movingItems] = await Promise.all([
    getCleaningServices(),
    getMovingItemsAdmin(),
  ])
  return <ServicesTabs services={services} movingItems={movingItems} />
}