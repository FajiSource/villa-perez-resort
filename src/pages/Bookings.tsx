import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { apiService } from "../services/apiService";
import { type Booking } from "../types/booking";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Bookings() {
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    fetchBookings();
  }, [isAuthenticated, token]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const headers: HeadersInit = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await apiService.get<{ data?: Booking[] } | Booking[]>("/api/bookings", { headers });
      console.log("Bookings response:", response);
      // Handle different response formats
      let bookingsData: Booking[] = [];
      if (Array.isArray(response)) {
        bookingsData = response;
      } else if (response?.data && Array.isArray(response.data)) {
        bookingsData = response.data;
      } else {
        console.error("Unexpected response format:", response);
        setBookings([]);
        return;
      }

      setBookings(bookingsData);
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
      setBookings([]); // Ensure bookings is always an array
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      const headers: HeadersInit = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      await apiService.delete(`/api/bookings/${bookingId}`, { headers });
      toast.success("Booking cancelled successfully");
      
      fetchBookings();
    } catch (error: any) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen w-screen overflow-x-hidden relative bg-gradient-to-br from-[#e82574]/5 via-[#e82574]/3 to-[#e82574]/5">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-[#e82574]/20 border-t-[#e82574] mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm sm:text-base font-medium">Loading bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-x-hidden relative bg-gradient-to-br from-[#e82574]/5 via-[#e82574]/3 to-[#e82574]/5">
      <div className="max-w-7xl mx-auto relative">
        {/* Header Section */}
        <div className="bg-white shadow-xl border border-[#e82574]/20 w-screen">
          <div className="!px-6 sm:!px-8 lg:!px-10 !py-3 sm:!py-2 lg:!py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between !gap-4 sm:!gap-6">
              <div className="space-y-2">
                <div className="flex items-center !gap-3">
                  <div className="w-12 h-12 bg-[#e82574] flex items-center justify-center shadow-md">
                    <span className="text-2xl">📋</span>
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#bc1c5c]">
                      My Bookings
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base !mt-1">
                      View and manage your reservations at Villa Perez Resort
                    </p>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="border-[#e82574] text-[#e82574] hover:bg-[#e82574]/10 shadow-sm hover:shadow-md transition-all duration-200 w-full sm:w-auto !px-6 !py-2.5"
              >
                Book Another Room
              </Button>
            </div>
          </div>
        </div>

        {/* Bookings Content Section */}
        <div className="bg-white  border border-[#e82574]/20 overflow-hidde w-screen h-screen">
          <div className="!p-6 sm:!p-8 lg:!p-10">
            {bookings.length === 0 ? (
              <div className="text-center !py-16 sm:!py-20">
                <div className="w-28 h-28 bg-gradient-to-br from-[#e82574]/20 to-[#e82574]/10 rounded-full flex items-center justify-center mx-auto !mb-6 shadow-lg">
                  <span className="text-5xl">📅</span>
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-700 !mb-3">
                  No bookings yet
                </h2>
                <p className="text-gray-600 text-sm sm:text-base !mb-8 max-w-md mx-auto">
                  Start planning your stay at Villa Perez Resort!
                </p>
                <Button
                  onClick={() => navigate("/")}
                  className="bg-[#e82574] hover:bg-[#bc1c5c] text-white shadow-lg hover:shadow-xl transition-all duration-200 !px-8 !py-3"
                >
                  Browse Rooms
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border border-gray-200 !p-5 sm:!p-6 hover:shadow-md transition-all duration-200 hover:border-[#e82574]/30 bg-gray-50/50"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between !gap-5">
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap items-center !gap-3">
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                            Booking #{booking.id}
                          </h3>
                          <span className="!px-3 !py-1.5 text-xs sm:text-sm font-medium bg-blue-100 text-blue-800">
                            RC ID: {booking.rc_id}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 !gap-3 text-sm">
                          <div className="flex items-start !gap-2">
                            <span className="text-gray-400 mt-0.5">👤</span>
                            <div>
                              <span className="font-medium text-gray-700">Name:</span>
                              <p className="text-gray-600">{booking.name}</p>
                            </div>
                          </div>
                          <div className="flex items-start !gap-2">
                            <span className="text-gray-400 mt-0.5">📞</span>
                            <div>
                              <span className="font-medium text-gray-700">Contact:</span>
                              <p className="text-gray-600">{booking.contact}</p>
                            </div>
                          </div>
                          <div className="flex items-start !gap-2">
                            <span className="text-gray-400 mt-0.5">📅</span>
                            <div>
                              <span className="font-medium text-gray-700">Check-in:</span>
                              <p className="text-gray-600">{formatDate(booking.check_in)}</p>
                            </div>
                          </div>
                          <div className="flex items-start !gap-2">
                            <span className="text-gray-400 mt-0.5">📅</span>
                            <div>
                              <span className="font-medium text-gray-700">Check-out:</span>
                              <p className="text-gray-600">{formatDate(booking.check_out)}</p>
                            </div>
                          </div>
                          <div className="flex items-start !gap-2">
                            <span className="text-gray-400 mt-0.5">👥</span>
                            <div>
                              <span className="font-medium text-gray-700">Guests (PAX):</span>
                              <p className="text-gray-600">{booking.pax}</p>
                            </div>
                          </div>
                        </div>

                        {booking.special_req && (
                          <div className="bg-[#e82574]/10 border border-[#e82574]/30 !p-3">
                            <span className="font-medium text-gray-700 text-sm">Special Requests:</span>
                            <p className="text-gray-600 text-sm !mt-1">{booking.special_req}</p>
                          </div>
                        )}

                        <div className="text-xs text-gray-500 !pt-2 border-t border-gray-200">
                          Booked on: {booking.created_at ? formatDate(booking.created_at) : "N/A"}
                        </div>
                      </div>

                      <div className="flex flex-col !gap-2 lg:min-w-[140px]">
                        <Button
                          variant="outline"
                          className="border-red-600 text-red-600 hover:bg-red-50 shadow-sm hover:shadow-md transition-all duration-200 w-full"
                          onClick={() => handleCancelBooking(booking.id!)}
                        >
                          Cancel Booking
                        </Button>
                      </div>
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

