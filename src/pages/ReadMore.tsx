import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Waves,
  Home,
  UtensilsCrossed,
  Car,
  Wifi,
  Tv,
  Wind,
  Dumbbell,
  MapPin,
  Phone,
  Mail,
  Clock,
  Star,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import aboutImage from "../assets/about.jpeg";

export default function ReadMore() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Wifi,
      title: "Free WiFi",
      description: "High-speed internet throughout the resort",
    },
    {
      icon: Tv,
      title: "Entertainment",
      description: "Smart TVs in all accommodations",
    },
    {
      icon: Wind,
      title: "Air Conditioning",
      description: "Climate-controlled comfort",
    },
    {
      icon: UtensilsCrossed,
      title: "Dining",
      description: "On-site restaurant and bar",
    },
    { icon: Car, title: "Parking", description: "Free parking available" },
    { icon: Dumbbell, title: "Fitness", description: "Recreation facilities" },
  ];

  const amenities = [
    "Private swimming pools",
    "BBQ facilities",
    "Garden areas",
    "24/7 Security",
    "Room service",
    "Laundry service",
    "Tour assistance",
    "Beach access",
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4! sm:px-6! lg:px-8! py-4!">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-700 hover:text-[#e82574]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-xl font-bold text-[#e82574]">
              Villa Perez Resort
            </h1>
            <div className="w-20"></div> 
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center">
        <div className="relative h-96 w-full overflow-hidden">
          <img
            src={aboutImage}
            alt="Villa Perez Resort"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8! sm:p-12!">
            <div className="max-w-4xl mx-auto">
              <p className="text-white/90 text-sm font-medium mb-2!">
                ABOUT US
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4!">
                Swim All Day, Stay All Night
              </h1>
              <p className="text-white/90 text-lg max-w-2xl">
                Your perfect getaway destination for relaxation, adventure, and
                unforgettable memories
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4! sm:px-6! lg:px-8! py-12!">
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8! mb-12!">
            {/* Main Story */}
            <div className="lg:col-span-2 space-y-6!">
              <div className="bg-white rounded-xl shadow-lg p-6! sm:p-8!">
                <h2 className="text-3xl font-bold text-gray-800 mb-4!">
                  Welcome to Villa Perez Resort
                </h2>
                <div className="space-y-4! text-gray-700 leading-relaxed">
                  <p>
                    Nestled in a serene location, Villa Perez Resort offers a
                    perfect blend of luxury, comfort, and natural beauty. Our
                    resort is designed to provide you with an exceptional
                    experience that combines modern amenities with the
                    tranquility of nature.
                  </p>
                  <p>
                    Whether you're planning a romantic getaway, a family
                    vacation, or a corporate retreat, we have the perfect
                    accommodation to suit your needs. Each of our villas and
                    cottages is thoughtfully designed to ensure your comfort and
                    relaxation.
                  </p>
                  <p>
                    Our commitment to excellence is reflected in every aspect of
                    your stay. From the moment you arrive, our dedicated staff
                    is here to ensure that your experience exceeds expectations.
                    We focus on quality accommodations, personalized
                    experiences, and seamless booking to make your dream holiday
                    a reality.
                  </p>
                </div>
              </div>

              {/* Features Grid */}
              <div className="bg-white rounded-xl shadow-lg p-6! sm:p-8!">
                <h2 className="text-2xl font-bold text-gray-800 mb-6!">
                  Resort Features
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4!">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4! rounded-lg bg-gradient-to-br from-blue-50 to-slate-50 hover:shadow-md transition-all duration-200"
                      >
                        <div className="p-2! rounded-lg bg-[#e82574]/10">
                          <Icon className="h-5 w-5 text-[#e82574]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-1!">
                            {feature.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Amenities */}
              <div className="bg-white rounded-xl shadow-lg p-6! sm:p-8!">
                <h2 className="text-2xl font-bold text-gray-800 mb-6!">
                  Amenities & Services
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3!">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6!">
              {/* Contact Card */}
              <div className="bg-white rounded-xl shadow-lg p-6!">
                <h3 className="text-xl font-bold text-gray-800 mb-4!">
                  Contact Information
                </h3>
                <div className="space-y-3!">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-[#e82574] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Address
                      </p>
                      <p className="text-sm text-gray-600">
                        Villa Perez Resort
                        <br />
                        Your Destination Location
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-[#e82574] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Phone</p>
                      <p className="text-sm text-gray-600">+63 XXX XXX XXXX</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-[#e82574] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Email</p>
                      <p className="text-sm text-gray-600">
                        info@villaperezresort.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-[#e82574] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Check-in/out
                      </p>
                      <p className="text-sm text-gray-600">
                        Check-in: 2:00 PM
                        <br />
                        Check-out: 12:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why Choose Us */}
              <div className="bg-gradient-to-br from-[#e82574]/10 to-[#bc1c5c]/10 rounded-xl shadow-lg p-6!">
                <h3 className="text-xl font-bold text-gray-800 mb-4!">
                  Why Choose Us?
                </h3>
                <div className="space-y-3!">
                  <div className="flex items-start gap-2">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700">
                      Premium accommodations with modern amenities
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700">
                      Exceptional customer service and support
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700">
                      Prime location with easy access to attractions
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700">
                      Flexible booking options and competitive rates
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="bg-white rounded-xl shadow-lg p-6!">
                <h3 className="text-lg font-bold text-gray-800 mb-3!">
                  Ready to Book?
                </h3>
                <p className="text-sm text-gray-600 mb-4!">
                  Start planning your perfect getaway today!
                </p>
                <Button
                  onClick={() => navigate("/villas")}
                  className="w-full bg-[#e82574] hover:bg-[#bc1c5c] text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  View Accommodations
                </Button>
              </div>
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="bg-white rounded-xl shadow-lg p-6! sm:p-8! mb-12!">
            <h2 className="text-2xl font-bold text-gray-800 mb-6!">
              What Our Guests Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6!">
              <div className="border-l-4 border-[#e82574] pl-4!">
                <div className="flex items-center gap-1 mb-2!">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-yellow-500 fill-yellow-500"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-2! italic">
                  "An absolutely amazing experience! The resort exceeded all our
                  expectations."
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  - Maria S.
                </p>
              </div>
              <div className="border-l-4 border-[#e82574] pl-4!">
                <div className="flex items-center gap-1 mb-2!">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-yellow-500 fill-yellow-500"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-2! italic">
                  "Perfect for families! Clean, comfortable, and the staff was
                  incredibly helpful."
                </p>
                <p className="text-sm font-semibold text-gray-800">- John D.</p>
              </div>
              <div className="border-l-4 border-[#e82574] pl-4!">
                <div className="flex items-center gap-1 mb-2!">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-yellow-500 fill-yellow-500"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-2! italic">
                  "Beautiful location and excellent service. We'll definitely be
                  back!"
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  - Sarah L.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-[#e82574] to-[#bc1c5c] rounded-xl shadow-xl p-8! sm:p-12! text-center text-white">
            <Waves className="h-16 w-16 mx-auto mb-4! opacity-80" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4!">
              Start Your Perfect Getaway Today
            </h2>
            <p className="text-lg mb-6! text-white/90 max-w-2xl mx-auto">
              Book your stay with us and experience the perfect blend of luxury,
              comfort, and natural beauty.
            </p>
            <div className="flex flex-col sm:flex-row gap-4! justify-center">
              <Button
                onClick={() => navigate("/villas")}
                variant="outline"
                className="bg-white text-[#e82574] hover:bg-gray-100 border-white shadow-lg"
              >
                Browse Accommodations
              </Button>
              <Button
                onClick={() => navigate("/dashboard")}
                variant="outline"
                className="bg-transparent text-white hover:bg-white/10 border-white shadow-lg"
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
