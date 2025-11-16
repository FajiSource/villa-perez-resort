import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../services/apiService";
import { useAuth } from "../context/AuthContext";
import { Villa } from "../types/villa";
import { Button } from "../components/ui/button";
import { ImageWithFallback } from "../components/ui/ImageWithFallback";

export default function ViewVillas() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [villas, setVillas] = useState<Villa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVillas();
  }, [token]);

  const fetchVillas = async () => {
    try {
      setLoading(true);
      const headers: HeadersInit = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const data = await apiService.get<Villa[]>("/api/villas", { headers });
      setVillas(data);
    } catch (error) {
      console.error("Error fetching villas:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-screen overflow-x-hidden relative bg-gradient-to-br from-[#e82574]/5 via-[#e82574]/3 to-[#e82574]/5">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-[#e82574]/20 border-t-[#e82574] mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm sm:text-base font-medium">Loading villas...</p>
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
                    <span className="text-2xl">🏨</span>
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#bc1c5c]">
                      View Villas
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base !mt-1">
                      Explore our luxurious accommodations at Villa Perez Resort
                    </p>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => navigate("/dashboard")}
                variant="outline"
                className="border-[#e82574] text-[#e82574] hover:bg-[#e82574]/10 shadow-sm hover:shadow-md transition-all duration-200 w-full sm:w-auto !px-6 !py-2.5"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>

        {/* Villas Content Section */}
        <div className="bg-white shadow-xl border border-[#e82574]/20 overflow-hidden w-screen">
          <div className="!p-6 sm:!p-8 lg:!p-10">
            {villas.length === 0 ? (
              <div className="text-center !py-16 sm:!py-20">
                <div className="w-28 h-28 bg-gradient-to-br from-[#e82574]/20 to-[#e82574]/10 rounded-full flex items-center justify-center mx-auto !mb-6 shadow-lg">
                  <span className="text-5xl">🏨</span>
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-700 !mb-3">
                  No Villas Available
                </h2>
                <p className="text-gray-600 text-sm sm:text-base !mb-8 max-w-md mx-auto">
                  Check back later for available accommodations.
                </p>
                <Button
                  onClick={() => navigate("/dashboard")}
                  className="bg-[#e82574] hover:bg-[#bc1c5c] text-white shadow-lg hover:shadow-xl transition-all duration-200 !px-8 !py-3"
                >
                  Go to Dashboard
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 !gap-6">
                {villas.map((villa) => (
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
                        className={`absolute top-4 right-4 !px-3 !py-1 text-xs font-semibold ${
                          villa.status === "available"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {villa.status?.toUpperCase()}
                      </span>
                    </div>

                    <div className="!p-6">
                      <h3 className="text-xl font-bold text-gray-800 !mb-2">{villa.name}</h3>
                      <p className="text-gray-600 text-sm !mb-4 line-clamp-2">{villa.description}</p>
                      <div className="flex items-center justify-between !mb-4">
                        <div>
                          <p className="text-2xl font-bold text-[#bc1c5c]">
                            ₱{villa.price.toLocaleString()}
                            <span className="text-sm font-normal text-gray-600">/night</span>
                          </p>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="text-[#e82574]">👥</span> {villa.max_guests} guests
                        </div>
                      </div>
                      {villa.amenities && villa.amenities.length > 0 && (
                        <div className="flex flex-wrap !gap-2 !mb-4">
                          {villa.amenities.slice(0, 3).map((amenity, index) => (
                            <span
                              key={index}
                              className="!px-2 !py-1 bg-[#e82574]/10 text-[#bc1c5c] text-xs font-medium"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      )}
                      <Button
                        onClick={() => navigate(`/book?roomId=villa-${villa.rc_id || villa.id}`)}
                        className="w-full bg-[#e82574] hover:bg-[#bc1c5c] text-white shadow-md hover:shadow-lg transition-all duration-200 !py-2.5"
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

