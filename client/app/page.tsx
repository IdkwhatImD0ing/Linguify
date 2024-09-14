"use client";

import { useEffect } from "react";
import Image from "next/image";
import { ArrowRight } from 'lucide-react';
import { SignInButton, useAuth } from "@clerk/nextjs";
import { useRouter } from 'next/navigation'; 

export default function LinguifyLanding() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);

  return (
    <div className="h-screen w-full flex items-center justify-center p-6 relative bg-cover bg-center"
      style={{ backgroundImage: `url('assets/bgs.png')` }}>

      <div className="flex flex-col items-center justify-center">
        <div className="w-80 h-80 rounded-full bg-white bg-opacity-25 shadow-lg flex items-center justify-center">
          <div className="relative w-60 h-60">
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

      {!isSignedIn && (
        <div className="flex">
          <SignInButton mode="modal">
            <button
              className="bg-gray-700 text-white px-6 py-3 rounded-full flex items-center space-x-2 absolute bottom-10 right-10 hover:bg-gray-600 transition-colors"
            >
              <span>Join in</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </SignInButton>
        </div>
      )}
    </div>
  );
}
