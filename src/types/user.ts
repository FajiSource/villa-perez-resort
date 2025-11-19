export interface User {
  id: number;
  name: string;
  username?: string;
  email: string;
  phone?: string;
  status?: "active" | "inactive" | "suspended";
  role?: "customer" | "admin";
  google_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Notification {
  id: number | string;
  user_id: number;
  title: string;
  message: string;
  type: "booking" | "system" | "promotion";
  status: "read" | "unread";
  created_at: string;
}

