import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { apiService } from "../services/apiService";
import { type Booking } from "../types/booking";

export default function Dashboard() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentBookings();
  }, [token]);

  const fetchRecentBookings = async () => {
    try {
      setLoading(true);
      const headers: HeadersInit = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const bookings = await apiService.get<Booking[]>("/api/bookings", {
        headers,
      });
      // Extract bookings array from response
      const bookingsArray = Array.isArray(bookings) ? bookings : (bookings as any)?.data || [];
      // Get the 3 most recent bookings
      const sorted = bookingsArray.sort(
        (a, b) =>
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime()
      );
      setRecentBookings(sorted.slice(0, 3));
    } catch (error) {
      console.error("Error fetching bookings:", error);
      // Don't show error if it's just that there are no bookings
    } finally {
      setLoading(false);
    }
  };


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusBadge = (status?: string) => {
    const bookingStatus = (status || 'pending').toLowerCase();
    
    if (bookingStatus === 'approved') {
      return (
        <span className="text-xs sm:text-sm px-3! py-1! rounded-full bg-green-100 text-green-800 font-medium">
          ✓ Approved
        </span>
      );
    }
    if (bookingStatus === 'declined') {
      return (
        <span className="text-xs sm:text-sm px-3! py-1! rounded-full bg-red-100 text-red-800 font-medium">
          ✗ Declined
        </span>
      );
    }
    if (bookingStatus === 'cancelled' || bookingStatus === 'canceled') {
      return (
        <span className="text-xs sm:text-sm px-3! py-1! rounded-full bg-gray-100 text-gray-800 font-medium">
          ⊗ Cancelled
        </span>
      );
    }
    return (
      <span className="text-xs sm:text-sm px-3! py-1! rounded-full bg-yellow-100 text-yellow-800 font-medium">
        ⏳ Pending
      </span>
    );
  };

  return (
    <div className="min-h-full w-full overflow-x-hidden relative bg-gradient-to-br from-[#e82574]/5 via-white to-[#e82574]/5">
      <div className="max-w-7xl mx-auto px-4! sm:px-6! lg:px-8! py-6! sm:py-8! lg:py-12! relative">
        {/* Header Section */}
        <div className="bg-white shadow-xl border border-[#e82574]/20 mb-6! sm:mb-8! rounded-2xl overflow-hidden">
          <div className="px-6! sm:px-8! lg:px-10! py-6! sm:py-8!">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4! sm:gap-6!">
              <div className="space-y-2">
                <div className="flex items-center gap-3!">
                  <div className="w-12 h-12 bg-[#e82574] rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-2xl">🏖️</span>
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#bc1c5c]">
                      Dashboard
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base mt-1!">
                      Welcome back! Manage your bookings and reservations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Card */}
        {/* <div className="w-screen shadow-lg p-6! sm:p-8! mb-6! sm:mb-8! border border-none bg-gradient-to-r from-[#e82574]/10 to-[#e82574]/5">
          <div className="flex items-start gap-4! h-64">
            <div className="shrink-0">
              <div className="w-14 h-14 bg-[#e82574] rounded-full flex items-center justify-center shadow-md">
                <span className="text-3xl">👋</span>
              </div>
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#bc1c5c] mb-2">
                Welcome to Your Dashboard
              </h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                Manage your bookings and reservations at Villa Perez Resort.
                Your perfect getaway is just a click away.
              </p>
            </div>
          </div>
        </div> */}

        {/* Quick Actions Grid */}
        <div className="flex items-center justify-center relative w-full mt-5!">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4! gap-4! sm:gap-6! mb-6! sm:mb-8! w-full">
            <button
              onClick={() => navigate("/bookings")}
              className=" group bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 hover:border-blue-300 p-6! sm:p-7! transition-all duration-300 text-left cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">📋</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">
                    My Bookings
                  </h3>
                  <p className="text-xs text-gray-500">View all</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                View and manage your reservations
              </p>
              <div className="flex items-center text-blue-600 text-sm font-semibold">
                <span>View all bookings</span>
                <span className="ml-2 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </button>

            <button
              onClick={() => navigate("/villas")}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 hover:border-green-300 p-6! sm:p-7! transition-all duration-300 text-left cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-linear-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🏨</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">
                    View Villas
                  </h3>
                  <p className="text-xs text-gray-500">Browse villas</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                Explore accommodations
              </p>
              <div className="flex items-center text-green-600 text-sm font-semibold">
                <span>View villas</span>
                <span className="ml-2 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </button>

            <button
              onClick={() => navigate("/notifications")}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 hover:border-purple-300 p-6! sm:p-7! transition-all duration-300 text-left cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-linear-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🔔</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">
                    Notifications
                  </h3>
                  <p className="text-xs text-gray-500">View updates</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                Check your alerts
              </p>
              <div className="flex items-center text-purple-600 text-sm font-semibold">
                <span>View notifications</span>
                <span className="ml-2 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </button>

            <button
              onClick={() => navigate("/account")}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 hover:border-[#e82574]/30 p-6! sm:p-7! transition-all duration-300 text-left cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-[#e82574] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">👤</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">
                    My Account
                  </h3>
                  <p className="text-xs text-gray-500">Manage profile</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                Manage your profile
              </p>
              <div className="flex items-center text-[#e82574] text-sm font-semibold">
                <span>Manage account</span>
                <span className="ml-2 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Bookings Section */}
        <div className="bg-white border border-[#e82574]/20 overflow-hidden rounded-2xl shadow-lg">
          <div className="p-6! sm:p-8! lg:p-10!">
            <div className="flex flex-col sm:flex-row! sm:items-center! sm:justify-between! gap-4! mb-6! sm:mb-8!">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2!">
                  Recent Bookings
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Your latest reservations at Villa Perez Resort
                </p>
              </div>
              {recentBookings.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => navigate("/bookings")}
                  className="border-[#e82574] text-[#e82574] hover:bg-[#e82574]/10 shadow-sm hover:shadow-md transition-all duration-200 w-full sm:w-auto"
                >
                  View All
                </Button>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12! sm:py-16!">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12! w-1!2 border-4 border-[#e82574]/20 border-t-[#e82574] mx-auto mb-4"></div>
                  <p className="text-gray-600 text-sm sm:text-base font-medium">
                    Loading recent bookings...
                  </p>
                </div>
              </div>
            ) : recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border border-gray-200 rounded-xl p-5! sm:p-6! hover:shadow-md transition-all duration-200 hover:border-[#e82574]/30 bg-gray-50/50"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3! mb-3! flex-wrap">
                          <h4 className="font-bold text-gray-800 text-lg sm:text-xl">
                            {booking.name}
                          </h4>
                          <span className="text-xs sm:text-sm px-3! py-1! rounded-full bg-blue-100 text-blue-800 font-medium">
                            RC ID: {booking.rc_id}
                          </span>
                          {getStatusBadge(booking.status)}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2! text-sm text-gray-600">
                          <div className="flex items-center gap-2!">
                            <span className="text-gray-400">📅</span>
                            <span>
                              {formatDate(booking.check_in)} -{" "}
                              {formatDate(booking.check_out)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2!">
                            <span className="text-gray-400">👥</span>
                            <span>
                              {booking.pax} guest{booking.pax !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12! sm:py-16!">
                <div className="w-24 h-24 bg-gradient-to-br from-[#e82574]/20 to-[#e82574]/10 rounded-full flex items-center justify-center mx-auto mb-6!">
                  <span className="text-5xl">📅</span>
                </div>
                <h4 className="text-xl sm:text-2xl font-bold text-gray-700 mb-2!">
                  No bookings yet
                </h4>
                <p className="text-gray-600 text-sm sm:text-base mb-6!">
                  Start planning your stay at Villa Perez Resort!
                </p>
                <Button
                  onClick={() => navigate("/")}
                  className="bg-[#e82574] hover:bg-[#bc1c5c] text-white shadow-lg hover:shadow-xl transition-all duration-200 px-5!"
                >
                  Book Your First Stay
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
