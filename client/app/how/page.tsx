'use client';  

import React from 'react';
import { X, Home, Camera, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

const HowToUse = () => {
    const router = useRouter();

    return (
        <div className="h-screen flex flex-col p-6 relative" style={{
            backgroundImage: `url('/assets/how.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.5)', // Adjust the last value (0.9) for opacity
            backgroundBlendMode: 'overlay'
        }}>
        {/* Close button */}
        <button onClick={() => router.back()} className="absolute top-4 right-4">
            <X className="w-6 h-6 text-gray-600" />
        </button>

        {/* Main content */}
        <div className="flex-grow flex flex-col justify-center">
            <div className="mb-8">
                <h1 className="text-5xl font-bold text-[#30B8FB] mb-2 text-left">How?</h1>
                <p className="text-lg text-[#3F3F44] text-left">Learn in just 3 steps!</p>
            </div>

            {/* Steps */}
            <div className="space-y-6 w-full max-w-lg mx-auto">
            {[
                { title: "Click on the CAMERA option", subtitle: "It only takes 1 second", number: 1 },
                { title: "Take a Picture", subtitle: "Another second...", number: 2 },
                { title: "Talk with our AI", subtitle: "And practice with our AI", number: 3 },
            ].map((step, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-md relative overflow-hidden">
                <h2 className="text-2xl font-semibold text-[#30B8FB] mb-2">{step.title}</h2>
                <p className="text-gray-600 text-lg">{step.subtitle}</p>
                <div className="absolute -right-4 -bottom-6 text-9xl font-bold text-[#30B8FB] opacity-20">
                    {step.number}
                </div>
                </div>
            ))}
            </div>
        </div>

        {/* Navigation bar */}
        <nav className="bg-[#385664] text-white py-4 px-6 rounded-full flex justify-between items-center mt-8">
            <Home className="w-6 h-6" onClick={() => router.push('/')} />
            <Camera className="w-6 h-6" onClick={() => router.push('/camera')} />
            <User className="w-6 h-6" onClick={() => router.push('/profile')} />
        </nav>
        </div>
    );
};

export default HowToUse;
