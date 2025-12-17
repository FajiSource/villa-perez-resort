import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../services/apiService";
import { useAuth } from "../context/AuthContext";
import type { Villa } from "../types/villa";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ImageWithFallback } from "../components/ui/ImageWithFallback";
import { getImageUrl } from "../utils/imageUtils";

export default function ViewVillas() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [villas, setVillas] = useState<Villa[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [unavailableVillaIds, setUnavailableVillaIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchVillas();
  }, [token]);

  useEffect(() => {
    if (selectedDate && villas.length > 0 && token) {
      setUnavailableVillaIds(new Set());
      checkVillaAvailability();
    } else if (!selectedDate) {
      setUnavailableVillaIds(new Set());
    }
  }, [selectedDate, villas, token]);

  const fetchVillas = async () => {
    try {
      setLoading(true);
      const headers: HeadersInit = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await apiService.get<any>("/api/villas", { headers });
      const villasArray = Array.isArray(response) 
        ? response 
        : (response?.data || []);
      
      const transformedVillas = villasArray.map((villa: any) => ({
        id: String(villa.id || villa.rc_id || ''),
        name: villa.name || '',
        type: villa.type || 'Room',
        description: villa.description || '',
        price: Number(villa.price || villa.price_per_night || 0),
        image_url: getImageUrl(villa.image || villa.image_url),
        max_guests: Number(villa.maxGuests || villa.max_guests || villa.capacity || 0),
        amenities: Array.isArray(villa.amenities) ? villa.amenities : [],
        status: (villa.status?.toLowerCase() || 'available') as "available" | "booked" | "maintenance",
        rc_id: Number(villa.rc_id || villa.id || 0),
      }));
      
      setVillas(transformedVillas);
    } catch (error) {
      console.error("Error fetching villas:", error);
      setVillas([]);
    } finally {
      setLoading(false);
    }
  };

  const checkVillaAvailability = async () => {
    if (!selectedDate) {
      setUnavailableVillaIds(new Set());
      return;
    }

    if (!token) {
      setUnavailableVillaIds(new Set());
      return;
    }

    if (villas.length === 0) {
      setUnavailableVillaIds(new Set());
      return;
    }

    const selectedDateStr = selectedDate;

    try {
      setCheckingAvailability(true);
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
      };

      const availabilityResults = await Promise.all(
        villas.map(async (villa) => {
          try {
            const response = await apiService.get<{
              success: boolean;
              unavailable_dates?: string[];
            }>(`/api/bookings/availability/check?rc_id=${villa.rc_id}`, { headers });

            if (response?.success && Array.isArray(response?.unavailable_dates)) {
              const isUnavailable = response.unavailable_dates.includes(selectedDateStr);
              return { rc_id: villa.rc_id, isUnavailable };
            }
            return { rc_id: villa.rc_id, isUnavailable: false };
          } catch (error) {
            console.error(`Error checking availability for villa ${villa.rc_id}:`, error);
            return { rc_id: villa.rc_id, isUnavailable: false };
          }
        })
      );

      const unavailableIds = new Set<number>();
      availabilityResults.forEach((result) => {
        if (result.isUnavailable) {
          unavailableIds.add(result.rc_id);
        }
      });

      setUnavailableVillaIds(unavailableIds);
    } catch (error) {
      console.error("Error checking villa availability:", error);
      setUnavailableVillaIds(new Set());
    } finally {
      setCheckingAvailability(false);
    }
  };

  const filteredVillas = useMemo(() => {
    if (!selectedDate) {
      return villas;
    }

    if (checkingAvailability) {
      return villas;
    }

    return villas.filter((villa) => {
      return !unavailableVillaIds.has(villa.rc_id);
    });
  }, [villas, unavailableVillaIds, selectedDate, checkingAvailability]);

  const accommodationCounts = useMemo(() => {
    const counts = {
      room: 0,
      cottage: 0,
      villa: 0,
    };

    filteredVillas.forEach((villa) => {
      const villaType = String(villa.type || '').trim();
      if (villaType === 'Room' || villaType.toLowerCase() === 'room') {
        counts.room++;
      } else if (villaType === 'Cottage' || villaType.toLowerCase() === 'cottage') {
        counts.cottage++;
      } else if (villaType === 'Villa' || villaType.toLowerCase() === 'villa') {
        counts.villa++;
      }
    });

    return counts;
  }, [filteredVillas]);

  if (loading) {
    return (
      <div className="h-screen w-full overflow-x-hidden relative bg-gradient-to-br from-[#e82574]/5 via-[#e82574]/3 to-[#e82574]/5">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-[#e82574]/20 border-t-[#e82574] mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm sm:text-base font-medium">Loading villas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-y-auto overflow-x-hidden relative bg-gradient-to-br from-[#e82574]/5 via-[#e82574]/3 to-[#e82574]/5">
      <div className="w-full mx-auto relative">
        <div className="shadow-xl border border-[#e82574]/20 w-full mx-auto">
          <div className="px-6! sm:px-8! lg:px-10! py-3! sm:py-2! lg:py-4!">
            <div className="flex flex-col gap-4! sm:gap-6!">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4!">
                <div className="space-y-2">
                  <div className="flex items-center gap-3!">
                    <div className="w-12 h-12 bg-[#e82574] flex items-center justify-center shadow-md">
                      <span className="text-2xl">🏨</span>
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#bc1c5c]">
                        View Villas
                      </h1>
                      <p className="text-gray-600 text-sm sm:text-base mt-1!">
                        Explore our luxurious accommodations at Villa Perez Resort
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => navigate("/dashboard")}
                  variant="outline"
                  className="border-[#e82574] text-[#e82574] hover:bg-[#e82574]/10 shadow-sm hover:shadow-md transition-all duration-200 w-full sm:w-auto px-6! py-2.5!"
                >
                  Back to Dashboard
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-end gap-3! pt-2! border-t border-[#e82574]/10">
                <div className="flex-1">
                  <Label htmlFor="date-filter" className="text-sm font-medium text-gray-700 mb-2! block">
                    Filter by Date
                  </Label>
                  <Input
                    id="date-filter"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border-[#e82574]/20 focus:border-[#e82574] focus:ring-[#e82574]/20"
                    placeholder="Select a date to see available accommodations"
                  />
                  <p className="text-xs text-gray-500 mt-1!">
                    {checkingAvailability 
                      ? "Checking availability..."
                      : selectedDate 
                        ? `Showing accommodations available on ${new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
                        : "Select a date to filter available accommodations"}
                  </p>
                </div>
                {selectedDate && (
                  <Button
                    onClick={() => setSelectedDate("")}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md transition-all duration-200 px-4! py-2.5! h-auto"
                  >
                    Clear Filter
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#e82574]/20 w-full">
          <div className="p-6! sm:p-8! lg:p-10!">
            <div className="mb-6! flex flex-wrap gap-4! justify-center sm:justify-start">
              <div className="flex items-center gap-2! px-4! py-2! bg-blue-50 border border-blue-200 rounded-lg">
                <span className="text-blue-600 font-semibold">Rooms:</span>
                <span className="text-blue-800 font-bold text-lg">
                  {checkingAvailability ? "..." : accommodationCounts.room}
                </span>
              </div>
              <div className="flex items-center gap-2! px-4! py-2! bg-green-50 border border-green-200 rounded-lg">
                <span className="text-green-600 font-semibold">Cottages:</span>
                <span className="text-green-800 font-bold text-lg">
                  {checkingAvailability ? "..." : accommodationCounts.cottage}
                </span>
              </div>
              <div className="flex items-center gap-2! px-4! py-2! bg-purple-50 border border-purple-200 rounded-lg">
                <span className="text-purple-600 font-semibold">Villas:</span>
                <span className="text-purple-800 font-bold text-lg">
                  {checkingAvailability ? "..." : accommodationCounts.villa}
                </span>
              </div>
            </div>
            {filteredVillas.length === 0 ? (
              <div className="text-center py-16! sm:py-20!">
                <div className="w-28 h-28 bg-gradient-to-br from-[#e82574]/20 to-[#e82574]/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-5xl">🏨</span>
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-700 mb-3!">
                  {selectedDate ? "No Available Accommodations" : "No Villas Available"}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base mb-8! max-w-md mx-auto">
                  {selectedDate 
                    ? `No accommodations are available on ${new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}. Try selecting a different date.`
                    : "Check back later for available accommodations."}
                </p>
                {selectedDate ? (
                  <Button
                    onClick={() => setSelectedDate("")}
                    className="bg-[#e82574] hover:bg-[#bc1c5c] text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8! py-3!"
                  >
                    Clear Date Filter
                  </Button>
                ) : (
                  <Button
                    onClick={() => navigate("/dashboard")}
                    className="bg-[#e82574] hover:bg-[#bc1c5c] text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8! py-3!"
                  >
                    Go to Dashboard
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6! max-w-7xl mx-auto">
                {Array.isArray(filteredVillas) && filteredVillas.map((villa) => (
                  <div
                    key={villa.id}
                    className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-[#e82574]/30 overflow-hidden"
                  >
                    <div className="relative h-48 sm:h-56 w-full overflow-hidden">
                      <ImageWithFallback
                        src={villa.image_url || "https://via.placeholder.com/400"}
                        alt={villa.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <span
                        className={`absolute top-4 right-4 px-3 py-1 text-xs font-semibold ${
                          villa.status === "available"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {villa.status?.toUpperCase()}
                      </span>
                    </div>

                    <div className="p-6!">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{villa.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{villa.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-2xl font-bold text-[#bc1c5c]">
                            ₱{villa.price?.toLocaleString() || '0'}
                            <span className="text-sm font-normal text-gray-600">/night</span>
                          </p>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="text-[#e82574]">👥</span> {villa.max_guests || 0} guests
                        </div>
                      </div>
                      {villa.amenities && Array.isArray(villa.amenities) && villa.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-2! mb-4">
                          {villa.amenities.slice(0, 3).map((amenity: string, index: number) => (
                            <span
                              key={index}
                              className="px-2! py-1! bg-[#e82574]/10 text-[#bc1c5c] text-xs font-medium"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      )}
                      <Button
                        onClick={() => navigate(`/book?roomId=villa-${villa.rc_id || villa.id}`)}
                        className="w-full bg-[#e82574] hover:bg-[#bc1c5c] text-white shadow-md hover:shadow-lg transition-all duration-200 py-2.5!"
                        disabled={villa.status !== "available"}
                      >
                        {villa.status === "available" ? "Book Now" : "Not Available"}
                      </Button>
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

