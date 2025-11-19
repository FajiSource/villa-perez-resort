import { apiService } from "../../services/apiService";

export interface Announcement {
  id: number;
  title: string;
  content: string;
  image?: string | null;
  published_at?: string | null;
  expires_at?: string | null;
  is_active: boolean;
  priority: number;
  created_at: string;
}

export const getAnnouncements = async (): Promise<Announcement[]> => {
  try {
    // Client side: Don't send auth token so backend knows it's a public request
    // This ensures only active announcements are returned
    const response = await apiService.get<any>("/api/announcements");
    console.log("Client API raw response:", response);
    
    // Backend returns { success: true, data: [...] }
    // apiService.get returns the JSON directly (not wrapped like axios)
    if (response && response.success && Array.isArray(response.data)) {
      console.log("Client found announcements in response.data:", response.data);
      return response.data;
    }
    // Handle case where response is directly the data array
    if (Array.isArray(response)) {
      console.log("Client response is direct array:", response);
      return response;
    }
    // Fallback: if data field exists without success
    if (response && Array.isArray(response.data)) {
      console.log("Client found announcements in response.data (no success field):", response.data);
      return response.data;
    }
    console.warn("Client: No announcements found. Response structure:", response);
    return [];
  } catch (error: any) {
    console.error("Client API error:", error);
    console.error("Error details:", error.message, error.status);
    return [];
  }
};

