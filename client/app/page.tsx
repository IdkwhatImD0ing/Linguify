"use client";

import Image from "next/image";
import { ArrowRight } from 'lucide-react'; 
import { useRouter } from 'next/navigation'; // Use next/navigation

export default function LinguifyLanding() {
  const router = useRouter();

  const handleJoinClick = () => {
    router.push('/dashboard'); // Navigate to the dashboard page
  };

  return (
    <div className="h-screen w-full bg-blue-100 bg-gradient-to-br from-blue-100 via-green-100 to-blue-100 flex flex-col items-center justify-center p-6 relative">
      <div className="flex flex-col items-center justify-center">
        <div className="w-64 h-64 rounded-full bg-white bg-opacity-50 flex items-center justify-center">
          <div className="relative w-48 h-48">
            <Image
              src="/assets/landingLogo.png" 
              alt="Linguify Logo"
              layout="fill"
              objectFit="contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>
      </div>
      <div className="flex">      
        <button
          className="bg-gray-700 text-white px-6 py-3 rounded-full flex items-center space-x-2 absolute bottom-10 right-10 hover:bg-gray-600 transition-colors"
          onClick={handleJoinClick} // Add onClick handler for navigation
        >
          <span>Join in</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
