"use client";

import Image from "next/image";
import { Home, Camera, User } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation'; 
import {UserButton, SignedIn} from '@clerk/nextjs';

export default function Dashboard() {
    const router = useRouter(); 
    const pathname = usePathname();

    const handleNavigation = (route:string) => {
        router.push(route); 
    };

    return (
        <div className="min-h-screen w-full bg-[#E9E6E6] flex flex-col pt-8">
            <header className="flex justify-between items-center p-4">
                <div className="flex items-center space-x-2">
                    <div className="relative w-10 h-10">
                        <Image
                        src="/assets/icon-dark.png"
                        alt="Linguify Logo"
                        layout="fill"
                        objectFit="contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                    <span className="font-bold text-lg text-gray-800">210</span>
                </div>
                <div className="w-8 h-8  rounded-full"> 
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </header>

            <main className="flex-grow px-4 space-y-4">
                <h1 className="text-2xl font-bold text-gray-800">Ongoing Lessons</h1>
                <div className="grid grid-cols-2 gap-4">
                {[...Array(6)].map((_, index) => (
                    <div key={index} className={`rounded-lg overflow-hidden ${index % 2 === 0 ? 'bg-blue-500' : 'bg-gray-300'}`}>
                    <div className={`h-24 bg-blue-400`}></div>
                    <div className="h-24 bg-white"></div>
                    </div>
                ))}
                </div>
            </main>

            <nav className="bg-[#385664] text-[#F5F5F5] shadow-lg my-3 mx-10 py-4 flex justify-around items-center rounded-full">
                <Home
                className={`w-9 h-9 cursor-pointer ${pathname === '/dashboard' ? 'text-[#AADF69]' : 'text-white'}`}
                onClick={() => handleNavigation('/dashboard')} 
                />
                <Camera
                className="w-9 h-9 cursor-pointer"
                onClick={() => handleNavigation('/camera')} 
                />
                <User
                className="w-9 h-9 cursor-pointer"
                onClick={() => handleNavigation('/profile')} 
                />
            </nav>
        </div>
    );
}
