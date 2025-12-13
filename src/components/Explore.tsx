import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAnnouncements, type Announcement } from "../lib/api/announcementApi";
import { Button } from "../components/ui/button";
import { Calendar, ChevronRight } from "lucide-react";
import { getImageUrl } from "../utils/imageUtils";

export default function Explore() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            // Backend already filters to show only active, published, non-expired announcements for clients
            // So we can trust the backend response and just sort by priority
            const data = await getAnnouncements();
            console.log(data);
            console.log("Explore - fetched announcements:", data);
            // Ensure data is an array
            const announcementsArray = Array.isArray(data) ? data : [];
            // Sort by priority (highest first) - backend already returns active announcements only
            const sortedAnnouncements = announcementsArray.sort((a, b) => (b.priority || 0) - (a.priority || 0));
            console.log("Explore - sorted announcements:", sortedAnnouncements);
            setAnnouncements(sortedAnnouncements);
        } catch (error) {
            console.error("Explore - Error fetching announcements:", error);
            setAnnouncements([]);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const featuredAnnouncement = announcements[0];

    return (
        <>
            <section className="section__container banner__container">
                <div className="banner__content">
                    <div className="banner__card">
                        <h4>1</h4>
                        <p>Properties Available</p>
                    </div>
                    <div className="banner__card">
                        <h4>100+</h4>
                        <p>Reservation Completed</p>
                    </div>
                    <div className="banner__card">
                        <h4>400+</h4>
                        <p>Happy Customers</p>
                    </div>
                </div>
            </section>
            <section className="explore" id="explore">
                <p className="section__subheader">EXPLORE</p>
                <h2 className="section__header">What's New Today.</h2>
                {loading ? (
                    <div className="explore__bg">
                        <div className="explore__content">
                            <div className="animate-pulse">
                                <div className="h-4 bg-white/20 rounded w-32 mb-4"></div>
                                <div className="h-6 bg-white/20 rounded w-48 mb-4"></div>
                                <div className="h-10 bg-white/20 rounded w-24"></div>
                            </div>
                        </div>
                    </div>
                ) : featuredAnnouncement ? (
                    <div 
                        className="explore__bg"
                        style={{
                            backgroundImage: featuredAnnouncement.image 
                                ? `url(${getImageUrl(featuredAnnouncement.image)})` 
                                : undefined
                        }}
                    >
                        <div className="explore__content">
                            {featuredAnnouncement.published_at && (
                                <p className="section__description">
                                    <Calendar className="inline h-4 w-4 mr-1" />
                                    {formatDate(featuredAnnouncement.published_at)}
                                </p>
                            )}
                            <h4>{featuredAnnouncement.title}</h4>
                            <p className="text-white/90 text-sm mb-4 line-clamp-2">
                                {featuredAnnouncement.content}
                            </p>
                            <button 
                                className="btn"
                                onClick={() => navigate("/villas")}
                            >
                                Continue
                                <ChevronRight className="inline h-4 w-4 ml-1" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="explore__bg">
                        <div className="explore__content">
                            <p className="section__description">Stay Tuned</p>
                            <h4>New Updates Coming Soon</h4>
                            <button 
                                className="btn"
                                onClick={() => navigate("/villas")}
                            >
                                View Accommodations
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </>
    );
}
