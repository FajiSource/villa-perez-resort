export interface Room {
  id: string;
  name: string;
  type: "room" | "cottage" | "party-space";
  description: string;
  price: number;
  image: string;
  maxGuests: number;
  amenities: string[];
}

export interface Booking {
  id?: string;
  user_id?: number;
  rc_id: number; // FK → villas_and_cottages
  name: string;
  contact: string;
  check_in: string;
  check_out: string;
  pax: number; // number of people/guests
  special_req?: string;
  created_at?: string;
  updated_at?: string;
  status?: string; // pending, approved, declined, cancelled, completed
  feedback?: {
    id: number;
    rating: number;
    comment?: string;
    created_at: string;
  } | null;
}

export interface BookingFormData {
  rc_id: number;
  name: string;
  contact: string;
  check_in: string;
  check_out: string;
  pax: number;
  special_req?: string;
}

