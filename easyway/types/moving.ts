export type MovingQuote = {
  id: string;
  reference_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  pickup_zip: string;
  pickup_city: string;
  pickup_state: string;
  dropoff_zip: string;
  dropoff_city: string;
  dropoff_state: string;
  distance_miles: number;
  preferred_date: string | null;
  need_vehicle: boolean;
  items: Record<string, number>;
  total_cuft: number;
  status: "new" | "contacted" | "quoted" | "won" | "lost";
  created_at: string;
};
export type MovingItem = {
  id: string
  section: string
  name: string
  cuft: number
  image_url: string | null
  sort_order: number
  is_active: boolean
  created_at: string
}
export type SubmitMovingQuoteResult =
  | { success: true; quoteId: string; referenceId: string }
  | { success: false; error: string };