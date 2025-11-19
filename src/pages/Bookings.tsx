import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { apiService } from "../services/apiService";
import { type Booking } from "../types/booking";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface RescheduleRequest {
  id: number;
  booking_id: number;
  new_check_in: string;
  new_check_out: string;
  reason?: string;
  status: 'pending' | 'approved' | 'declined';
  created_at: string;
  responded_at?: string;
}

export default function Bookings() {
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [rescheduleRequests, setRescheduleRequests] = useState<Record<string, RescheduleRequest[]>>({});
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [rescheduleForm, setRescheduleForm] = useState({
    new_check_in: '',
    new_check_out: '',
    reason: ''
  });
  const [submittingReschedule, setSubmittingReschedule] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedFeedbackBooking, setSelectedFeedbackBooking] = useState<Booking | null>(null);
  const [feedbackForm, setFeedbackForm] = useState({
    rating: 0,
    comment: ''
  });
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    fetchBookings();
  }, [isAuthenticated, token]);

  useEffect(() => {
    // Fetch reschedule requests for all bookings
    if (bookings.length > 0) {
      bookings.forEach(booking => {
        if (booking.id) {
          fetchRescheduleRequests(booking.id.toString());
        }
      });
    }
  }, [bookings]);

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

  const getStatusBadge = (status?: string) => {
    const bookingStatus = (status || 'pending').toLowerCase();
    
    if (bookingStatus === 'approved') {
      return (
        <span className="px-3! py-1.5! text-xs sm:text-sm font-medium bg-green-100 text-green-800 rounded">
          ✓ Approved
        </span>
      );
    }
    if (bookingStatus === 'declined') {
      return (
        <span className="px-3! py-1.5! text-xs sm:text-sm font-medium bg-red-100 text-red-800 rounded">
          ✗ Declined
        </span>
      );
    }
    if (bookingStatus === 'cancelled' || bookingStatus === 'canceled') {
      return (
        <span className="px-3! py-1.5! text-xs sm:text-sm font-medium bg-gray-100 text-gray-800 rounded">
          ⊗ Cancelled
        </span>
      );
    }
    return (
      <span className="px-3! py-1.5! text-xs sm:text-sm font-medium bg-yellow-100 text-yellow-800 rounded">
        ⏳ Pending
      </span>
    );
  };

  const canCancelBooking = (status?: string) => {
    const bookingStatus = (status || 'pending').toLowerCase();
    // Can cancel if pending or approved, but not if already cancelled or declined
    return bookingStatus === 'pending' || bookingStatus === 'approved';
  };

  const fetchRescheduleRequests = async (bookingId: string) => {
    try {
      const headers: HeadersInit = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await apiService.get<{ data?: RescheduleRequest[] } | RescheduleRequest[]>(
        `/api/reschedule-requests/booking/${bookingId}`,
        { headers }
      );

      let requests: RescheduleRequest[] = [];
      if (Array.isArray(response)) {
        requests = response;
      } else if (response?.data && Array.isArray(response.data)) {
        requests = response.data;
      }

      setRescheduleRequests(prev => ({
        ...prev,
        [bookingId]: requests
      }));
    } catch (error) {
      console.error("Error fetching reschedule requests:", error);
    }
  };

  const handleRescheduleClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setRescheduleForm({
      new_check_in: booking.check_in ? new Date(booking.check_in).toISOString().split('T')[0] : '',
      new_check_out: booking.check_out ? new Date(booking.check_out).toISOString().split('T')[0] : '',
      reason: ''
    });
    setShowRescheduleModal(true);
  };

  const handleSubmitReschedule = async () => {
    if (!selectedBooking?.id) return;

    if (!rescheduleForm.new_check_in || !rescheduleForm.new_check_out) {
      toast.error("Please select new check-in and check-out dates");
      return;
    }

    const newCheckIn = new Date(rescheduleForm.new_check_in);
    const newCheckOut = new Date(rescheduleForm.new_check_out);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (newCheckIn < today) {
      toast.error("New check-in date must be in the future");
      return;
    }

    if (newCheckOut <= newCheckIn) {
      toast.error("Check-out date must be after check-in date");
      return;
    }

    setSubmittingReschedule(true);
    try {
      const headers: HeadersInit = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      await apiService.post(
        '/api/reschedule-requests',
        {
          booking_id: selectedBooking.id,
          new_check_in: `${rescheduleForm.new_check_in} 14:00:00`,
          new_check_out: `${rescheduleForm.new_check_out} 11:00:00`,
          reason: rescheduleForm.reason || null
        },
        { headers }
      );

      toast.success("Reschedule request submitted successfully");
      setShowRescheduleModal(false);
      setSelectedBooking(null);
      setRescheduleForm({ new_check_in: '', new_check_out: '', reason: '' });
      
      // Refresh reschedule requests
      if (selectedBooking.id) {
        fetchRescheduleRequests(selectedBooking.id.toString());
      }
      fetchBookings();
    } catch (error: any) {
      console.error("Error submitting reschedule request:", error);
      toast.error(error.response?.data?.error || "Failed to submit reschedule request");
    } finally {
      setSubmittingReschedule(false);
    }
  };

  const getRescheduleStatus = (bookingId: string) => {
    const requests = rescheduleRequests[bookingId] || [];
    const pendingRequest = requests.find(r => r.status === 'pending');
    const approvedRequest = requests.find(r => r.status === 'approved');
    const declinedRequest = requests.find(r => r.status === 'declined');

    if (approvedRequest) {
      return { status: 'approved', request: approvedRequest };
    }
    if (pendingRequest) {
      return { status: 'pending', request: pendingRequest };
    }
    if (declinedRequest) {
      return { status: 'declined', request: declinedRequest };
    }
    return null;
  };

  const canReschedule = (booking: Booking) => {
    const bookingStatus = (booking.status || 'pending').toLowerCase();
    // Can reschedule if approved or pending, but not if cancelled or declined
    if (bookingStatus === 'cancelled' || bookingStatus === 'canceled' || bookingStatus === 'declined') {
      return false;
    }
    // Check if there's already a pending reschedule request
    const rescheduleStatus = getRescheduleStatus(booking.id?.toString() || '');
    return !rescheduleStatus || rescheduleStatus.status !== 'pending';
  };

  const isBookingCompleted = (booking: Booking) => {
    const bookingStatus = (booking.status || 'pending').toLowerCase();
    return bookingStatus === 'completed';
  };

  const canSubmitFeedback = (booking: Booking) => {
    return isBookingCompleted(booking) && !booking.feedback;
  };

  const handleFeedbackClick = (booking: Booking) => {
    setSelectedFeedbackBooking(booking);
    setFeedbackForm({ rating: 0, comment: '' });
    setShowFeedbackModal(true);
  };

  const handleSubmitFeedback = async () => {
    if (!selectedFeedbackBooking || !selectedFeedbackBooking.id) {
      return;
    }

    if (feedbackForm.rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setSubmittingFeedback(true);
    try {
      const headers: HeadersInit = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      await apiService.post(
        '/api/feedback',
        {
          booking_id: selectedFeedbackBooking.id,
          rating: feedbackForm.rating,
          comment: feedbackForm.comment || null
        },
        { headers }
      );

      toast.success("Feedback submitted successfully!");
      setShowFeedbackModal(false);
      setSelectedFeedbackBooking(null);
      setFeedbackForm({ rating: 0, comment: '' });
      fetchBookings();
    } catch (error: any) {
      console.error("Error submitting feedback:", error);
      toast.error(error.response?.data?.error || "Failed to submit feedback");
    } finally {
      setSubmittingFeedback(false);
    }
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
    <div className="h-screen w-full  overflow-x-hidden relative bg-gradient-to-br from-[#e82574]/5 via-[#e82574]/3 to-[#e82574]/5">
      <div className="w-full mx-auto relative">
        {/* Header Section */}
        <div className="sticky top-0 z-50 bg-white shadow-xl border border-[#e82574]/20 w-screen  mx-auto">
          <div className="px-6! sm:px-8! lg:px-10! py-3! sm:py-2! lg:py-4!">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4! sm:gap-6!">
              <div className="space-y-2">
                <div className="flex items-center gap-3!">
                  <div className="w-12 h-12 bg-[#e82574] flex items-center justify-center shadow-md">
                    <span className="text-2xl">📋</span>
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#bc1c5c]">
                      My Bookings
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base mt-1!">
                      View and manage your reservations at Villa Perez Resort
                    </p>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="border-[#e82574] text-[#e82574] hover:bg-[#e82574]/10 shadow-sm hover:shadow-md transition-all duration-200 w-full sm:w-auto px-6! py-2.5!"
              >
                Book Another Room
              </Button>
            </div>
          </div>
        </div>

        {/* Bookings Content Section */}
        <div className="bg-white  border border-[#e82574]/20 w-screen h-screen">
          <div className="p-6! sm:p-8! lg:p-10!">
            {bookings.length === 0 ? (
              <div className="text-center py-16! sm:py-2!0">
                <div className="w-28 h-28 bg-gradient-to-br from-[#e82574]/20 to-[#e82574]/10 rounded-full flex items-center justify-center mx-auto mb-6! shadow-lg">
                  <span className="text-5xl">📅</span>
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-700 mb-3!">
                  No bookings yet
                </h2>
                <p className="text-gray-600 text-sm sm:text-base mb-8! max-w-md mx-auto">
                  Start planning your stay at Villa Perez Resort!
                </p>
                <Button
                  onClick={() => navigate("/")}
                  className="bg-[#e82574] hover:bg-[#bc1c5c] text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8! py-3!"
                >
                  Browse Rooms
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="mb-10! max-w-7xl mx-auto border border-gray-200 p-5! sm:p-6! hover:shadow-md transition-all duration-200 hover:border-[#e82574]/30 bg-gray-50/50"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5!">
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap items-center gap-3!">
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                            Booking #{booking.id}
                          </h3>
                          <span className="px-3! py-1.5! text-xs sm:text-sm font-medium bg-blue-100 text-blue-800 rounded">
                            RC ID: {booking.rc_id}
                          </span>
                          {getStatusBadge(booking.status)}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3! text-sm">
                          <div className="flex items-start gap-2!">
                            <span className="text-gray-400 mt-0.5">👤</span>
                            <div>
                              <span className="font-medium text-gray-700">Name:</span>
                              <p className="text-gray-600">{booking.name}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2!">
                            <span className="text-gray-400 mt-0.5">📞</span>
                            <div>
                              <span className="font-medium text-gray-700">Contact:</span>
                              <p className="text-gray-600">{booking.contact}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2!">
                            <span className="text-gray-400 mt-0.5">📅</span>
                            <div>
                              <span className="font-medium text-gray-700">Check-in:</span>
                              <p className="text-gray-600">{formatDate(booking.check_in)}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2!">
                            <span className="text-gray-400 mt-0.5">📅</span>
                            <div>
                              <span className="font-medium text-gray-700">Check-out:</span>
                              <p className="text-gray-600">{formatDate(booking.check_out)}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2!">
                            <span className="text-gray-400 mt-0.5">👥</span>
                            <div>
                              <span className="font-medium text-gray-700">Guests (PAX):</span>
                              <p className="text-gray-600">{booking.pax}</p>
                            </div>
                          </div>
                        </div>

                        {booking.special_req && (
                          <div className="bg-[#e82574]/10 border border-[#e82574]/30 p-3!">
                            <span className="font-medium text-gray-700 text-sm">Special Requests:</span>
                            <p className="text-gray-600 text-sm mt-1!">{booking.special_req}</p>
                          </div>
                        )}

                        <div className="text-xs text-gray-500 pt-2! border-t border-gray-200">
                          Booked on: {booking.created_at ? formatDate(booking.created_at) : "N/A"}
                        </div>

                        {/* Reschedule Status */}
                        {(() => {
                          const rescheduleStatus = getRescheduleStatus(booking.id?.toString() || '');
                          if (rescheduleStatus) {
                            if (rescheduleStatus.status === 'approved') {
                              return (
                                <div className="bg-green-50! border! border-green-200! rounded-lg! p-3! mt-3!">
                                  <p className="text-sm! font-semibold! text-green-800! mb-1!">
                                    ✓ Reschedule Approved
                                  </p>
                                  <p className="text-xs! text-green-700!">
                                    New dates: {formatDate(rescheduleStatus.request.new_check_in)} - {formatDate(rescheduleStatus.request.new_check_out)}
                                  </p>
                                </div>
                              );
                            }
                            if (rescheduleStatus.status === 'pending') {
                              return (
                                <div className="bg-yellow-50! border! border-yellow-200! rounded-lg! p-3! mt-3!">
                                  <p className="text-sm! font-semibold! text-yellow-800!">
                                    ⏳ Reschedule Request Pending
                                  </p>
                                  <p className="text-xs! text-yellow-700! mt-1!">
                                    Waiting for admin approval
                                  </p>
                                </div>
                              );
                            }
                            if (rescheduleStatus.status === 'declined') {
                              return (
                                <div className="bg-red-50! border! border-red-200! rounded-lg! p-3! mt-3!">
                                  <p className="text-sm! font-semibold! text-red-800!">
                                    ✗ Reschedule Request Declined
                                  </p>
                                </div>
                              );
                            }
                          }
                          return null;
                        })()}

                        {/* Feedback Section */}
                        {isBookingCompleted(booking) && (
                          <div className="mt-4! border-t! border-gray-200! pt-4!">
                            {booking.feedback ? (
                              <div className="bg-green-50! border! border-green-200! rounded-lg! p-4!">
                                <div className="flex items-center gap-2! mb-2!">
                                  <span className="text-lg!">⭐</span>
                                  <span className="font-semibold! text-green-800!">
                                    Your Feedback
                                  </span>
                                </div>
                                <div className="flex items-center gap-1! mb-2!">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                      key={star}
                                      className={`text-xl! ${
                                        star <= booking.feedback!.rating
                                          ? 'text-yellow-400!'
                                          : 'text-gray-300!'
                                      }`}
                                    >
                                      ★
                                    </span>
                                  ))}
                                  <span className="text-sm! text-green-700! ml-2!">
                                    {booking.feedback.rating}/5
                                  </span>
                                </div>
                                {booking.feedback.comment && (
                                  <p className="text-sm! text-green-700! mt-2!">
                                    "{booking.feedback.comment}"
                                  </p>
                                )}
                                <p className="text-xs! text-green-600! mt-2!">
                                  Submitted on {formatDate(booking.feedback.created_at)}
                                </p>
                              </div>
                            ) : (
                              <Button
                                onClick={() => handleFeedbackClick(booking)}
                                className="bg-[#e82574]! hover:bg-[#bc1c5c]! text-white! shadow-sm! hover:shadow-md! transition-all! duration-200! w-full!"
                              >
                                ⭐ Submit Feedback
                              </Button>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2! lg:min-w-[140px]">
                        {canReschedule(booking) && (
                          <Button
                            variant="outline"
                            className="border-[#e82574]! text-[#e82574]! hover:bg-[#e82574]/10! shadow-sm! hover:shadow-md! transition-all! duration-200! w-full!"
                            onClick={() => handleRescheduleClick(booking)}
                          >
                            Reschedule
                          </Button>
                        )}
                        {canCancelBooking(booking.status) ? (
                          <Button
                            variant="outline"
                            className="border-red-600 text-red-600 hover:bg-red-50 shadow-sm hover:shadow-md transition-all duration-200 w-full"
                            onClick={() => handleCancelBooking(booking.id!)}
                          >
                            Cancel Booking
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            disabled
                            className="border-gray-300 text-gray-400 cursor-not-allowed w-full"
                          >
                            {booking.status?.toLowerCase() === 'cancelled' || booking.status?.toLowerCase() === 'canceled' 
                              ? 'Already Cancelled' 
                              : 'Cannot Cancel'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reschedule Modal */}
      <Dialog open={showRescheduleModal} onOpenChange={setShowRescheduleModal}>
        <DialogContent className="sm:max-w-md p-5!">
          <DialogHeader>
            <DialogTitle className="mb-2!">Reschedule Booking</DialogTitle>
            <DialogDescription>
              Request to change your booking dates. Admin will review your request.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4! py-4!">
            <div className="space-y-2!">
              <Label htmlFor="new_check_in">New Check-in Date</Label>
              <Input
                id="new_check_in"
                type="date"
                className="px-3!"
                value={rescheduleForm.new_check_in}
                onChange={(e) => setRescheduleForm(prev => ({ ...prev, new_check_in: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="space-y-2!">
              <Label htmlFor="new_check_out">New Check-out Date</Label>
              <Input
                id="new_check_out"
                type="date"
                className="px-3!"
                value={rescheduleForm.new_check_out}
                onChange={(e) => setRescheduleForm(prev => ({ ...prev, new_check_out: e.target.value }))}
                min={rescheduleForm.new_check_in || new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="space-y-2!">
              <Label htmlFor="reason">Reason (Optional)</Label>
              <textarea
                id="reason"
                className="w-full! min-h-[100px]! px-3! py-2! border! border-gray-300! rounded-md! focus:outline-none! focus:ring-2! focus:ring-[#e82574]! focus:border-transparent!"
                value={rescheduleForm.reason}
                onChange={(e) => setRescheduleForm(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Please provide a reason for rescheduling..."
              />
            </div>
          </div>

          <div className="flex! justify-end! gap-3! pt-4!">
            <Button
              variant="outline"
              className="px-5!"
              onClick={() => {
                setShowRescheduleModal(false);
                setSelectedBooking(null);
                setRescheduleForm({ new_check_in: '', new_check_out: '', reason: '' });
              }}
              disabled={submittingReschedule}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReschedule}
              disabled={submittingReschedule || !rescheduleForm.new_check_in || !rescheduleForm.new_check_out}
              className="bg-[#e82574]! hover:bg-[#bc1c5c]! text-white! px-5!"
            >
              {submittingReschedule ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Feedback Modal */}
      <Dialog open={showFeedbackModal} onOpenChange={setShowFeedbackModal}>
        <DialogContent className="sm:max-w-md p-5!">
          <DialogHeader>
            <DialogTitle className="mb-2!">Submit Feedback</DialogTitle>
            <DialogDescription>
              Share your experience with us! Your feedback helps us improve our services.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4! py-4!">
            <div className="space-y-2!">
              <Label>Rating *</Label>
              <div className="flex items-center gap-2!">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeedbackForm(prev => ({ ...prev, rating: star }))}
                    className={`text-3xl! cursor-pointer! transition-all! duration-200! ${
                      star <= feedbackForm.rating
                        ? 'text-yellow-400! scale-110!'
                        : 'text-gray-300! hover:text-yellow-300!'
                    }`}
                  >
                    ★
                  </button>
                ))}
                {feedbackForm.rating > 0 && (
                  <span className="text-sm! text-gray-600! ml-2!">
                    {feedbackForm.rating}/5
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2!">
              <Label htmlFor="comment">Comment (Optional)</Label>
              <textarea
                id="comment"
                className="w-full! min-h-[100px]! px-3! py-2! border! border-gray-300! rounded-md! focus:outline-none! focus:ring-2! focus:ring-[#e82574]! focus:border-transparent!"
                value={feedbackForm.comment}
                onChange={(e) => setFeedbackForm(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Tell us about your experience..."
                maxLength={1000}
              />
              <p className="text-xs! text-gray-500!">
                {feedbackForm.comment.length}/1000 characters
              </p>
            </div>
          </div>

          <div className="flex! justify-end! gap-3! pt-4!">
            <Button
              variant="outline"
              className="px-5!"
              onClick={() => {
                setShowFeedbackModal(false);
                setSelectedFeedbackBooking(null);
                setFeedbackForm({ rating: 0, comment: '' });
              }}
              disabled={submittingFeedback}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitFeedback}
              disabled={submittingFeedback || feedbackForm.rating === 0}
              className="bg-[#e82574]! hover:bg-[#bc1c5c]! text-white! px-5!"
            >
              {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

