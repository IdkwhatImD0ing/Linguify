"use client";

import Image from "next/image";
import { Home, Camera, User } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation'; 

export default function Dashboard() {
    const router = useRouter(); 
    const pathname = usePathname();

    const handleNavigation = (route:string) => {
        router.push(route); 
    };

    return (
        <div className="min-h-screen w-full bg-gray-100 flex flex-col">
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
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </header>

            <main className="flex-grow px-4 py-6 space-y-4">
                <h1 className="text-2xl font-bold text-gray-800">Ongoing Lesson</h1>
                <div className="grid grid-cols-2 gap-4">
                {[...Array(6)].map((_, index) => (
                    <div key={index} className={`rounded-lg overflow-hidden ${index % 2 === 0 ? 'bg-blue-500' : 'bg-gray-300'}`}>
                    <div className={`h-24 ${index % 2 === 0 ? 'bg-blue-400' : 'bg-gray-200'}`}></div>
                    <div className="h-24 bg-white"></div>
                    </div>
                ))}
                </div>
            </main>

            <nav className="bg-gray-700 text-white m-5 p-4 flex justify-around items-center rounded-lg">
                <Home
                className={`w-6 h-6 cursor-pointer ${pathname === '/dashboard' ? 'text-green-500' : 'text-white'}`}
                onClick={() => handleNavigation('/dashboard')} 
                />
                <Camera
                className="w-6 h-6 cursor-pointer"
                onClick={() => handleNavigation('/camera')} 
                />
                <User
                className="w-6 h-6 cursor-pointer"
                onClick={() => handleNavigation('/profile')} 
                />
            </nav>
        </div>
    );
}
