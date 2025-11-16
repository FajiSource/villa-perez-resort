import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { type BookingFormData } from "../types/booking";
import { apiService } from "../services/apiService";
import { useAuth } from "../context/AuthContext";
import { type Villa, type VillaApiResponse } from "../types/villa";
import { type Room } from "../types/booking";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ImageWithFallback } from "../components/ui/ImageWithFallback";

export default function BookingPage() {
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const roomId = searchParams.get("roomId");

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please sign in to make a booking");
      navigate("/auth");
      return;
    }

    if (roomId) {
      fetchVillaData(roomId);
    } else {
      toast.error("No room selected");
      navigate("/");
    }
  }, [roomId, isAuthenticated, navigate, token]);

  const fetchVillaData = async (id: string) => {
    try {
      setLoading(true);

      // Extract rc_id from roomId (format: "villa-{rc_id}")
      let rcId: number | null = null;
      if (id.startsWith("villa-")) {
        rcId = parseInt(id.replace("villa-", ""));
      } else {
        // Fallback: try to parse as number directly
        rcId = parseInt(id);
      }

      if (!rcId || isNaN(rcId)) {
        toast.error("Invalid villa ID");
        navigate("/");
        return;
      }

      const headers: HeadersInit = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      // Helper function to normalize API response to Villa format
      const normalizeVilla = (apiVilla: VillaApiResponse): Villa => {
        const API_BASE_URL =
          import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
        const imageUrl = apiVilla.image?.startsWith("http")
          ? apiVilla.image
          : `${API_BASE_URL}${apiVilla.image}`;

        return {
          id: `villa-${apiVilla.id}`,
          rc_id: apiVilla.id,
          name: apiVilla.name,
          type: apiVilla.type,
          description: apiVilla.description,
          price: apiVilla.price,
          image_url: imageUrl,
          max_guests: apiVilla.maxGuests,
          amenities: apiVilla.amenities || [],
          status: apiVilla.status.toLowerCase() as
            | "available"
            | "booked"
            | "maintenance",
        };
      };

      // Try to fetch specific villa by ID first, fallback to fetching all
      let villa: Villa | undefined;
      try {
        const response = await apiService.get<
          VillaApiResponse | { data?: VillaApiResponse }
        >(`/api/villas/${rcId}`, { headers });
        const apiVilla =
          (response as any)?.data || (response as VillaApiResponse);
        villa = normalizeVilla(apiVilla);
      } catch (error) {
        // If specific endpoint doesn't exist, fetch all and find the matching one
        console.log(
          "Specific villa endpoint not available, fetching all villas..."
        );
        const response = await apiService.get<
          { data?: VillaApiResponse[] } | VillaApiResponse[]
        >("/api/villas", { headers });

        let apiVillas: VillaApiResponse[] = [];
        if (Array.isArray(response)) {
          apiVillas = response;
        } else if (response?.data && Array.isArray(response.data)) {
          apiVillas = response.data;
        }

        const matchingVilla = apiVillas.find((v) => v.id === rcId);
        if (matchingVilla) {
          villa = normalizeVilla(matchingVilla);
        }
      }

      if (!villa) {
        toast.error("Villa not found");
        navigate("/");
        return;
      }

      // Convert Villa to Room format for compatibility
      const room: Room = {
        id: `villa-${villa.rc_id}`,
        name: villa.name,
        type: villa.type,
        description: villa.description,
        price: villa.price,
        image: villa.image_url,
        maxGuests: villa.max_guests,
        amenities: villa.amenities || [],
      };

      setSelectedRoom(room);
    } catch (error: any) {
      console.error("Error fetching villa:", error);
      toast.error("Failed to load villa details");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<BookingFormData>({
    defaultValues: {
      rc_id: selectedRoom
        ? parseInt(selectedRoom.id.replace("villa-", "") || "1")
        : 1,
      pax: 1,
    },
  });

  // Update form when selectedRoom changes
  useEffect(() => {
    if (selectedRoom) {
      const rcId = parseInt(selectedRoom.id.replace("villa-", "") || "1");
      reset({
        rc_id: rcId,
        pax: 1,
      });
    }
  }, [selectedRoom, reset]);

  const checkIn = watch("check_in");
  const checkOut = watch("check_out");

  // Calculate price based on dates
  useEffect(() => {
    if (checkIn && checkOut && selectedRoom) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      if (checkOutDate > checkInDate) {
        const nights = Math.ceil(
          (checkOutDate.getTime() - checkInDate.getTime()) /
            (1000 * 60 * 60 * 24)
        );
        const totalPrice = selectedRoom.price * nights;
        setCalculatedPrice(totalPrice);
      } else {
        setCalculatedPrice(0);
      }
    } else {
      setCalculatedPrice(0);
    }
  }, [checkIn, checkOut, selectedRoom]);

  // Update rc_id when room changes
  useEffect(() => {
    if (selectedRoom) {
      // Map room IDs to database rc_id
      // This mapping should match your backend database
      // The rc_id is set in the form defaultValues
    }
  }, [selectedRoom]);

  // Comprehensive error message handler
  const getErrorMessage = (error: any): string => {
    // Check for status code first (422, 400, etc.)
    if (error?.status === 422) {
      return (
        error.message ||
        "Invalid booking data. The selected villa/cottage may not exist. Please try again."
      );
    }

    // Handle Error objects with message property
    if (error instanceof Error) {
      const message = error.message.toLowerCase();

      // Network/Connection errors
      if (
        message.includes("failed to fetch") ||
        message.includes("network error")
      ) {
        return "Network error. Please check your internet connection and try again.";
      }

      if (
        message.includes("unable to connect") ||
        message.includes("connection refused")
      ) {
        return "Cannot connect to the server. Please ensure the backend API is running.";
      }

      if (message.includes("timeout") || message.includes("timed out")) {
        return "Request timed out. Please try again.";
      }

      // CORS errors
      if (message.includes("cors") || message.includes("cross-origin")) {
        return "CORS error. Please check server configuration.";
      }

      // Authentication errors
      if (message.includes("unauthorized") || message.includes("401")) {
        return "Authentication failed. Please sign in again.";
      }

      if (message.includes("forbidden") || message.includes("403")) {
        return "You don't have permission to perform this action.";
      }

      // Not found errors
      if (message.includes("not found") || message.includes("404")) {
        return "Booking endpoint not found. Please contact support.";
      }

      // Server errors
      if (
        message.includes("500") ||
        message.includes("internal server error")
      ) {
        return "Server error. Please try again later or contact support.";
      }

      if (message.includes("502") || message.includes("bad gateway")) {
        return "Server is temporarily unavailable. Please try again later.";
      }

      if (message.includes("503") || message.includes("service unavailable")) {
        return "Service is temporarily unavailable. Please try again later.";
      }

      // 422 Unprocessable Entity errors (validation/entity errors)
      if (message.includes("422") || message.includes("unprocessable")) {
        return (
          error.message ||
          "Invalid booking data. Please check your inputs and try again."
        );
      }

      // Validation errors
      if (message.includes("validation") || message.includes("invalid")) {
        return (
          error.message || "Invalid booking data. Please check your inputs."
        );
      }

      // Entity/villa not found errors
      if (
        message.includes("does not exist") ||
        message.includes("not exist") ||
        message.includes("not found")
      ) {
        return (
          error.message ||
          "The selected villa/cottage is not available. Please select another option."
        );
      }

      // Bad request errors
      if (message.includes("400") || message.includes("bad request")) {
        return (
          error.message || "Invalid request. Please check your booking details."
        );
      }

      // Return the original message if it's meaningful
      if (
        error.message &&
        error.message.length > 0 &&
        error.message.length < 200
      ) {
        return error.message;
      }
    }

    // Handle string errors
    if (typeof error === "string") {
      return error;
    }

    // Handle objects with message property
    if (error && typeof error === "object" && "message" in error) {
      return String(error.message);
    }

    // Default fallback
    return "An unexpected error occurred. Please try again or contact support if the problem persists.";
  };

  const onSubmit = async (data: BookingFormData) => {
    if (!selectedRoom) {
      toast.error("Please select a room");
      return;
    }

    // Clear any previous error messages
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      // Extract rc_id from selectedRoom.id (format: "villa-{rc_id}")
      const rcId = parseInt(selectedRoom.id.replace("villa-", "") || "1");

      if (!rcId || isNaN(rcId)) {
        toast.error("Invalid villa ID");
        return;
      }

      const bookingData = {
        rc_id: rcId,
        name: data.name,
        contact: data.contact,
        check_in: data.check_in,
        check_out: data.check_out,
        pax: data.pax,
        special_req: data.special_req || "",
      };

      const headers: HeadersInit = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      await apiService.post<{ id: string; message: string }>(
        "/api/bookings",
        bookingData,
        { headers }
      );

      toast.success("Booking submitted successfully!");
      navigate("/bookings");
    } catch (error: any) {
      console.error("Booking error:", error);
      console.error("Error type:", typeof error);
      console.error("Error message:", error?.message);

      const errorMsg = getErrorMessage(error);
      console.log("Displaying error message:", errorMsg);

      // Set error message to display on the page
      setErrorMessage(errorMsg || "An error occurred. Please try again.");

      // Also show toast notification
      if (errorMsg) {
        toast.error(errorMsg, {
          duration: 5000,
        });
      } else {
        toast.error("An error occurred. Please try again.", {
          duration: 5000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !selectedRoom) {
    return (
      <div className="min-h-screen w-screen overflow-x-hidden relative bg-gradient-to-br from-[#e82574]/5 via-[#e82574]/3 to-[#e82574]/5">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-[#e82574]/20 border-t-[#e82574] mx-auto !mb-4"></div>
            <p className="text-gray-600 text-sm sm:text-base font-medium">
              Loading villa details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  return (
    <div className="min-h-screen w-screen overflow-x-hidden relative bg-gradient-to-br from-[#e82574]/5 via-[#e82574]/3 to-[#e82574]/5">
      <div className="max-w-7xl mx-auto  relative">
        {/* Header Section */}
        <div className="bg-white shadow-lg border border-[#e82574]/20 mb-6! sm:mb-8! w-screen">
          <div className="px-6! sm:px-8! lg:px-10! py-3! sm:py-2! lg:py-2!">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between !gap-4 sm:!gap-6">
              <div className="space-y-2">
                <div className="flex items-center !gap-3">
                  <div className="w-12 h-12 bg-[#e82574] flex items-center justify-center shadow-md">
                    <span className="text-2xl">📝</span>
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#bc1c5c]">
                      Complete Your Booking
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base !mt-1">
                      Fill in your details to reserve {selectedRoom.name}
                    </p>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="border-[#e82574] text-[#e82574] hover:bg-[#e82574]/10 shadow-sm hover:shadow-md transition-all duration-200 w-full sm:w-auto !px-6 !py-2.5"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>

        {/* Room Info & Booking Form Section */}
        <div className="flex items-center justify-center w-screen">
          <div className="grid grid-cols-1 lg:grid-cols-2 !gap-6 sm:!gap-8">
            {/* Left side - Room Image & Info */}
            <div className="bg-white shadow-xl border border-[#e82574]/20 overflow-hidden w-screen lg:w-auto">
              <div className="relative h-64 sm:h-80 lg:h-full min-h-[400px] overflow-hidden">
                <ImageWithFallback
                  src={selectedRoom.image}
                  alt={selectedRoom.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
                <div className="relative z-10 !p-6 sm:!p-8 lg:!p-10 flex flex-col justify-end text-white h-full">
                  <h2 className="text-3xl sm:text-4xl font-bold !mb-4">
                    {selectedRoom.name}
                  </h2>
                  <p className="text-white/90 max-w-md text-base sm:text-lg !mb-6">
                    {selectedRoom.description}
                  </p>
                  <div className="space-y-2 mb-2!">
                    <p className="text-2xl sm:text-3xl font-semibold">
                      ₱{selectedRoom.price.toLocaleString()}
                      <span className="text-lg font-normal"> / night</span>
                    </p>
                    <p className="text-white/80 text-sm sm:text-base">
                      Maximum {selectedRoom.maxGuests} guests
                    </p>
                    <div className="flex flex-wrap !gap-2 !mt-4">
                      {selectedRoom.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          className="!px-3 !py-1.5 bg-white/20 backdrop-blur-sm text-sm font-medium"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Booking Form */}
            <div className="bg-white shadow-xl border border-[#e82574]/20 overflow-hidden w-screen lg:w-auto">
              <div className="!p-6 sm:!p-8 lg:!p-10">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Error Message Display */}
                  {errorMessage && (
                    <div className="bg-red-50 border-2 border-red-200 !p-4 !mb-4">
                      <div className="flex items-start !gap-3">
                        <div className="flex-shrink-0">
                          <span className="text-2xl">⚠️</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-red-800 font-semibold !mb-1">
                            Booking Error
                          </h3>
                          <p className="text-red-700 text-sm">{errorMessage}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setErrorMessage(null)}
                          className="flex-shrink-0 text-red-600 hover:text-red-800 !ml-2"
                          aria-label="Close error message"
                        >
                          <span className="text-xl">×</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 !gap-4 sm:!gap-6">
                    <div className="space-y-2 mb-2!">
                      <Label
                        htmlFor="check_in"
                        className="text-gray-700 font-medium"
                      >
                        Check-in Date *
                      </Label>
                      <Input
                        id="check_in"
                        type="date"
                        min={today}
                        className="border-gray-300 focus:border-[#e82574] focus:ring-[#e82574] !px-4 !py-3 !mt-2"
                        {...register("check_in", {
                          required: "Check-in date is required",
                          onChange: () => setErrorMessage(null),
                          validate: (value) => {
                            if (
                              checkOut &&
                              new Date(value) >= new Date(checkOut)
                            ) {
                              return "Check-in must be before check-out";
                            }
                            return true;
                          },
                        })}
                      />
                      {errors.check_in && (
                        <p className="text-sm text-red-500 !mt-1">
                          {errors.check_in.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 mb-2!">
                      <Label
                        htmlFor="check_out"
                        className="text-gray-700 font-medium"
                      >
                        Check-out Date *
                      </Label>
                      <Input
                        id="check_out"
                        type="date"
                        min={checkIn || tomorrow}
                        className="border-gray-300 focus:border-[#e82574] focus:ring-[#e82574] !px-4 !py-3 !mt-2"
                        {...register("check_out", {
                          required: "Check-out date is required",
                          onChange: () => setErrorMessage(null),
                          validate: (value) => {
                            if (
                              checkIn &&
                              new Date(value) <= new Date(checkIn)
                            ) {
                              return "Check-out must be after check-in";
                            }
                            return true;
                          },
                        })}
                      />
                      {errors.check_out && (
                        <p className="text-sm text-red-500 !mt-1">
                          {errors.check_out.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Number of Guests */}
                  <div className="space-y-2 mb-2!">
                    <Label htmlFor="pax" className="text-gray-700 font-medium">
                      Number of Guests *
                    </Label>
                    <Input
                      id="pax"
                      type="number"
                      min={1}
                      max={selectedRoom.maxGuests}
                      className="border-gray-300 focus:border-[#e82574] focus:ring-[#e82574] !px-4 !py-3 !mt-2"
                      {...register("pax", {
                        required: "Number of guests is required",
                        min: {
                          value: 1,
                          message: "At least 1 guest is required",
                        },
                        max: {
                          value: selectedRoom.maxGuests,
                          message: `Maximum ${selectedRoom.maxGuests} guests allowed`,
                        },
                        valueAsNumber: true,
                      })}
                    />
                    {errors.pax && (
                      <p className="text-sm text-red-500 !mt-1">
                        {errors.pax.message}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 !mt-1">
                      Maximum {selectedRoom.maxGuests} guests
                    </p>
                  </div>

                  {/* Name */}
                  <div className="space-y-2 mb-2!">
                    <Label htmlFor="name" className="text-gray-700 font-medium">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      className="border-gray-300 focus:border-[#e82574] focus:ring-[#e82574] !px-4 !py-3 !mt-2"
                      {...register("name", {
                        required: "Name is required",
                        minLength: {
                          value: 2,
                          message: "Name must be at least 2 characters",
                        },
                      })}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 !mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Contact */}
                  <div className="space-y-2 mb-2!">
                    <Label
                      htmlFor="contact"
                      className="text-gray-700 font-medium"
                    >
                      Contact Number *
                    </Label>
                    <Input
                      id="contact"
                      type="tel"
                      className="border-gray-300 focus:border-[#e82574] focus:ring-[#e82574] !px-4 !py-3 !mt-2"
                      placeholder="+63 9XX XXX XXXX"
                      {...register("contact", {
                        required: "Contact number is required",
                        pattern: {
                          value: /^[0-9+\-\s()]+$/,
                          message: "Invalid contact number format",
                        },
                      })}
                    />
                    {errors.contact && (
                      <p className="text-sm text-red-500 !mt-1">
                        {errors.contact.message}
                      </p>
                    )}
                  </div>

                  {/* Special Requests */}
                  <div className="space-y-2 mb-2!">
                    <Label
                      htmlFor="special_req"
                      className="text-gray-700 font-medium"
                    >
                      Special Requests
                    </Label>
                    <textarea
                      id="special_req"
                      className="w-full min-h-[120px] !px-4 !py-4 !mt-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#e82574] focus:border-[#e82574] resize-none"
                      {...register("special_req")}
                      placeholder="Any special requests or notes..."
                    />
                  </div>

                  {/* Price Summary */}
                  {calculatedPrice > 0 && (
                    <div className="bg-gradient-to-r from-[#e82574]/10 to-[#e82574]/5 !p-6 border-2 border-[#e82574]/30">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center !gap-3 !mb-3">
                        <span className="font-semibold text-gray-700 text-base sm:text-lg">
                          Total Price:
                        </span>
                        <span className="text-2xl sm:text-3xl font-bold text-[#bc1c5c]">
                          ₱{calculatedPrice.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {checkIn && checkOut
                          ? `${Math.ceil(
                              (new Date(checkOut).getTime() -
                                new Date(checkIn).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )} night(s) × ₱${selectedRoom.price.toLocaleString()} per night`
                          : ""}
                      </p>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row !gap-4 !pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/")}
                      className="flex-1 border-gray-300 hover:bg-gray-50 shadow-sm hover:shadow-md transition-all duration-200 !py-3 !h-auto"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-[#e82574] hover:bg-[#bc1c5c] text-white shadow-md hover:shadow-lg transition-all duration-200 !py-3 !h-auto"
                      disabled={isSubmitting || calculatedPrice === 0}
                    >
                      {isSubmitting ? "Submitting..." : "Confirm Booking"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
