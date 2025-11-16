// API Response format
export interface VillaApiResponse {
  id: number;
  name: string;
  type: "room" | "cottage" | "party-space";
  description: string;
  price: number;
  image: string;
  maxGuests: number;
  amenities: string[];
  status: string; // "Available", "Booked", etc.
}

// Internal Villa format (normalized)
export interface Villa {
  id: string;
  rc_id: number;
  name: string;
  type: "room" | "cottage" | "party-space";
  description: string;
  price: number;
  image_url: string;
  max_guests: number;
  amenities?: string[];
  status: "available" | "booked" | "maintenance";
  created_at?: string;
  updated_at?: string;
}

