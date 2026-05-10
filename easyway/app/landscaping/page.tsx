import LandscapingForm from "./LandscapingForm"
import { getActiveLandscapingFields } from "./actions"

export default async function LandscapingPage() {
  const fields = await getActiveLandscapingFields()
  return <LandscapingForm fields={fields} />
}