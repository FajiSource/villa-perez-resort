import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../services/apiService";
import { useAuth } from "../context/AuthContext";
import { Notification } from "../types/user";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

export default function Notifications() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, [token]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const headers: HeadersInit = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const data = await apiService.get<Notification[]>("/api/notifications", { headers });
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const headers: HeadersInit = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      await apiService.patch(`/api/notifications/${id}/read`, {}, { headers });
      toast.success("Notification marked as read.");
      fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read.");
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!confirm("Are you sure you want to mark all notifications as read?")) {
      return;
    }
    try {
      const headers: HeadersInit = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      await apiService.patch("/api/notifications/mark-all-read", {}, { headers });
      toast.success("All notifications marked as read.");
      fetchNotifications();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Failed to mark all notifications as read.");
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "booking":
        return "🏨";
      case "system":
        return "⚙️";
      case "promotion":
        return "🎉";
      default:
        return "💬";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen w-screen overflow-x-hidden relative bg-gradient-to-br from-[#e82574]/5 via-[#e82574]/3 to-[#e82574]/5">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-[#e82574]/20 border-t-[#e82574] mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm sm:text-base font-medium">Loading notifications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen overflow-x-hidden relative bg-gradient-to-br from-[#e82574]/5 via-[#e82574]/3 to-[#e82574]/5">
      <div className="max-w-7xl mx-auto !px-4 sm:!px-6 lg:!px-8 !py-6 sm:!py-8 lg:!py-12 relative">
        {/* Header Section */}
        <div className="bg-white shadow-xl border border-[#e82574]/20 !mb-6 sm:!mb-8 w-screen">
          <div className="!px-6 sm:!px-8 lg:!px-10 !py-3 sm:!py-2 lg:!py-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between !gap-4 sm:!gap-6">
              <div className="space-y-2">
                <div className="flex items-center !gap-3">
                  <div className="w-12 h-12 bg-[#e82574] flex items-center justify-center shadow-md">
                    <span className="text-2xl">🔔</span>
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#bc1c5c]">
                      Notifications
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base !mt-1">
                      Stay updated with your bookings and important alerts
                    </p>
                  </div>
                </div>
              </div>
              {notifications.length > 0 && (
                <Button
                  onClick={handleMarkAllAsRead}
                  variant="outline"
                  className="border-[#e82574] text-[#e82574] hover:bg-[#e82574]/10 shadow-sm hover:shadow-md transition-all duration-200 w-full sm:w-auto !px-6 !py-2.5"
                >
                  Mark All as Read
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Notifications Content Section */}
        <div className="bg-white shadow-xl border border-[#e82574]/20 overflow-hidden w-screen">
          <div className="!p-6 sm:!p-8 lg:!p-10">
            {notifications.length === 0 ? (
              <div className="text-center !py-16 sm:!py-20">
                <div className="w-28 h-28 bg-gradient-to-br from-[#e82574]/20 to-[#e82574]/10 rounded-full flex items-center justify-center mx-auto !mb-6 shadow-lg">
                  <span className="text-5xl">🔔</span>
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-700 !mb-3">
                  No New Notifications
                </h2>
                <p className="text-gray-600 text-sm sm:text-base !mb-8 max-w-md mx-auto">
                  You're all caught up! Check back later for updates.
                </p>
                <Button
                  onClick={() => navigate("/dashboard")}
                  className="bg-[#e82574] hover:bg-[#bc1c5c] text-white shadow-lg hover:shadow-xl transition-all duration-200 !px-8 !py-3"
                >
                  Go to Dashboard
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start !gap-4 !p-5 transition-all duration-200 ${
                      notification.status === "unread"
                        ? "bg-[#e82574]/10 border border-[#e82574]/30 shadow-md hover:shadow-lg"
                        : "bg-gray-50 border border-gray-200 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex-shrink-0 text-2xl mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center !mb-1">
                        <h3 className="font-semibold text-gray-800 text-lg">
                          {notification.title}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {formatDate(notification.created_at)}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm !mb-2">
                        {notification.message}
                      </p>
                      {notification.status === "unread" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#e82574] text-[#e82574] hover:bg-[#e82574]/10 !px-4 !py-1.5 text-xs"
                          onClick={() => handleMarkAsRead(notification.id!)}
                        >
                          Mark as Read
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

