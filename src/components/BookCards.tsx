import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../services/apiService";
import { useAuth } from "../context/AuthContext";
import { type Villa, type VillaApiResponse } from "../types/villa";
import { ImageWithFallback } from "./ui/ImageWithFallback";

export default function BookCards() {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [villas, setVillas] = useState<Villa[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVillas();
    }, [token]);

    // Helper function to normalize API response to Villa format
    const normalizeVilla = (apiVilla: VillaApiResponse): Villa => {
        // Get base URL for images (assuming images are relative paths)
        const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
        const imageUrl = apiVilla.image?.startsWith("http") 
            ? apiVilla.image 
            : `${API_BASE_URL}${apiVilla.image}`;

        return {
            id: `villa-${apiVilla.id}`,
            rc_id: apiVilla.id, // Use id as rc_id
            name: apiVilla.name,
            type: apiVilla.type,
            description: apiVilla.description,
            price: apiVilla.price,
            image_url: imageUrl,
            max_guests: apiVilla.maxGuests,
            amenities: apiVilla.amenities || [],
            status: apiVilla.status.toLowerCase() as "available" | "booked" | "maintenance",
        };
    };

    const fetchVillas = async () => {
        try {
            setLoading(true);
            const headers: HeadersInit = {};
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const response = await apiService.get<{ data?: VillaApiResponse[] } | VillaApiResponse[]>("/api/villas", { headers });
            
            // Handle different response formats
            let apiVillas: VillaApiResponse[] = [];
            if (Array.isArray(response)) {
                apiVillas = response;
            } else if (response?.data && Array.isArray(response.data)) {
                apiVillas = response.data;
            } else {
                console.error("Unexpected response format:", response);
                setVillas([]);
                return;
            }

            // Normalize and filter available villas
            const normalizedVillas = apiVillas.map(normalizeVilla);
            const availableVillas = normalizedVillas.filter(
                (villa) => villa.status === "available"
            );
            
            setVillas(availableVillas);
        } catch (error) {
            console.error("Error fetching villas:", error);
            setVillas([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="section__container room__container">
                <p className="section__subheader">Villa Perez</p>
                <h2 className="section__header">The Most Memorable Rest Time Starts Here.</h2>
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#e82574]/20 border-t-[#e82574] mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading villas...</p>
                    </div>
                </div>
            </section>
        );
    }
    
    return (
        <section className="section__container room__container">
            <p className="section__subheader">Villa Perez</p>
            <h2 className="section__header">The Most Memorable Rest Time Starts Here.</h2>
            {villas.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-600">No villas available at the moment.</p>
                </div>
            ) : (
                <div className="room__grid">
                    {villas.map((villa) => (
                        <div key={villa.id} className="room__card">
                            <div className="room__card__image">
                                <ImageWithFallback
                                    src={villa.image_url}
                                    alt={villa.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="room__card__icons">
                                    <span><i className="ri-heart-fill"></i></span>
                                    <span><i className="ri-paint-fill"></i></span>
                                    <span><i className="ri-shield-star-line"></i></span>
                                </div>
                            </div>
                            <div className="room__card__details">
                                <h4>{villa.name}</h4>
                                <p>{villa.description}</p>
                                <h5>Starting from <span>₱{villa.price.toLocaleString()}</span></h5>
                                {villa.max_guests && (
                                    <p className="text-sm text-gray-600 mb-2">
                                        Max {villa.max_guests} guests
                                    </p>
                                )}
                                <button 
                                    className="btn"
                                    onClick={() => {
                                        // Use rc_id to match with backend
                                        navigate(`/book?roomId=villa-${villa.rc_id}`);
                                    }}
                                >
                                    Book Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}
