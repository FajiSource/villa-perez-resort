import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Room, BookingFormData } from "../types/booking";
import { apiService } from "../services/apiService";
import { useAuth } from "../context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: Room;
  onBookingSuccess?: () => void;
}

export function BookingModal({
  open,
  onOpenChange,
  room,
  onBookingSuccess,
}: BookingModalProps) {
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<BookingFormData>({
    defaultValues: {
      roomId: room.id,
      guests: 1,
    },
  });

  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");
  const guests = watch("guests");

  // Calculate price based on dates and guests
  useEffect(() => {
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      
      if (checkOutDate > checkInDate) {
        const nights = Math.ceil(
          (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        const totalPrice = room.price * nights;
        setCalculatedPrice(totalPrice);
      } else {
        setCalculatedPrice(0);
      }
    } else {
      setCalculatedPrice(0);
    }
  }, [checkIn, checkOut, room.price]);

  const onSubmit = async (data: BookingFormData) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to make a booking");
      onOpenChange(false);
      navigate("/auth");
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        ...data,
        totalPrice: calculatedPrice,
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
      reset();
      onOpenChange(false);
      if (onBookingSuccess) {
        onBookingSuccess();
      }
    } catch (error: any) {
      console.error("Booking error:", error);
      toast.error(error.message || "Failed to submit booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-amber-700">Book {room.name}</DialogTitle>
          <DialogDescription>
            {room.description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkIn">Check-in Date *</Label>
              <Input
                id="checkIn"
                type="date"
                min={today}
                {...register("checkIn", {
                  required: "Check-in date is required",
                  validate: (value) => {
                    if (checkOut && new Date(value) >= new Date(checkOut)) {
                      return "Check-in must be before check-out";
                    }
                    return true;
                  },
                })}
              />
              {errors.checkIn && (
                <p className="text-sm text-red-500">{errors.checkIn.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkOut">Check-out Date *</Label>
              <Input
                id="checkOut"
                type="date"
                min={checkIn || tomorrow}
                {...register("checkOut", {
                  required: "Check-out date is required",
                  validate: (value) => {
                    if (checkIn && new Date(value) <= new Date(checkIn)) {
                      return "Check-out must be after check-in";
                    }
                    return true;
                  },
                })}
              />
              {errors.checkOut && (
                <p className="text-sm text-red-500">{errors.checkOut.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="guests">Number of Guests *</Label>
            <Input
              id="guests"
              type="number"
              min={1}
              max={room.maxGuests}
              {...register("guests", {
                required: "Number of guests is required",
                min: { value: 1, message: "At least 1 guest is required" },
                max: {
                  value: room.maxGuests,
                  message: `Maximum ${room.maxGuests} guests allowed`,
                },
                valueAsNumber: true,
              })}
            />
            {errors.guests && (
              <p className="text-sm text-red-500">{errors.guests.message}</p>
            )}
            <p className="text-xs text-gray-500">
              Maximum {room.maxGuests} guests
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="guestName">Full Name *</Label>
            <Input
              id="guestName"
              type="text"
              {...register("guestName", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
            />
            {errors.guestName && (
              <p className="text-sm text-red-500">{errors.guestName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="guestEmail">Email *</Label>
            <Input
              id="guestEmail"
              type="email"
              {...register("guestEmail", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.guestEmail && (
              <p className="text-sm text-red-500">{errors.guestEmail.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="guestPhone">Phone Number *</Label>
            <Input
              id="guestPhone"
              type="tel"
              {...register("guestPhone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9+\-\s()]+$/,
                  message: "Invalid phone number format",
                },
              })}
            />
            {errors.guestPhone && (
              <p className="text-sm text-red-500">{errors.guestPhone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialRequests">Special Requests</Label>
            <textarea
              id="specialRequests"
              className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              {...register("specialRequests")}
              placeholder="Any special requests or notes..."
            />
          </div>

          {calculatedPrice > 0 && (
            <div className="bg-amber-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Total Price:</span>
                <span className="text-2xl font-bold text-amber-700">
                  ₱{calculatedPrice.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {checkIn && checkOut
                  ? `${Math.ceil(
                      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )} night(s) × ₱${room.price.toLocaleString()}`
                  : ""}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700"
              disabled={isSubmitting || calculatedPrice === 0}
            >
              {isSubmitting ? "Submitting..." : "Confirm Booking"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

