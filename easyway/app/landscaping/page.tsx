import { getActiveJobSizes } from "./actions";
import LandscapingForm from "./LandscapingForm";

export default async function LandscapingPage() {
  const jobSizes = await getActiveJobSizes();
  return <LandscapingForm jobSizes={jobSizes} />;
}