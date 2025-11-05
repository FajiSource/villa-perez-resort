import { useState } from "react";
import { SignIn } from "../pages/SignIn";
import { ImageWithFallback } from "../components/ui/ImageWithFallback";
import backgroundImage from "../assets/beach-bg.jpeg";
import { SignUp } from "../pages/SignUp";

export default function AuthLayout() {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <ImageWithFallback
          src={backgroundImage}
          alt="Luxury villa resort"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
        <div className="relative z-10 p-12 flex flex-col justify-end text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome to Paradise Villa Resort</h1>
          <p className="text-white/90 max-w-md text-lg">
            Experience luxury and tranquility in our exclusive beachfront villas. Your perfect getaway awaits.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-r from-amber-50 to-orange-50 p-10">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-20">
          {isSignIn ? (
            <SignIn onToggle={() => setIsSignIn(false)} />
          ) : (
            <SignUp onToggle={() => setIsSignIn(true)} />
          )}
        </div>
      </div>
    </div>
  );
}
