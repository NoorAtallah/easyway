import { getActiveCleaningServices, getBookedSlots } from './actions'
import CleaningBooking from './CleaningBooking'

export default async function CleaningPage() {
  const [services, bookedSlots] = await Promise.all([
    getActiveCleaningServices(),
    getBookedSlots(),
  ])
  return <CleaningBooking services={services} bookedSlots={bookedSlots} />
}