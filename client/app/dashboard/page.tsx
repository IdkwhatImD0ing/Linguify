"use client";

import Image from "next/image";
import { Home, Camera, User } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation'; 
import {UserButton, SignedIn} from '@clerk/nextjs';
import { useState, useEffect } from 'react';

export default function Dashboard() {
    const router = useRouter(); 
    const pathname = usePathname();
    const [visitCount, setVisitCount] = useState(0);

    useEffect(() => {
        const currentCount = parseInt(localStorage.getItem('visitCount') || '0');
        const newCount = currentCount + 1;

        localStorage.setItem('visitCount', newCount.toString());
        setVisitCount(newCount);
    }, []); 

    const handleNavigation = (route:string) => {
        router.push(route); 
    };

    return (
        <div className="h-screen w-full bg-[#E9E6E6] flex flex-col">
            <header className="flex justify-between items-center py-2 px-4">
                <div className="flex items-center space-x-2">
                    <div className="relative w-12 h-12">
                        <Image
                        src="/assets/icon-dark.png"
                        alt="Linguify Logo"
                        layout="fill"
                        objectFit="contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                    <span className="font-bold text-lg text-gray-800">{visitCount}</span>
                </div>
                <div className="w-11 h-7 rounded-full"> 
                    <SignedIn>
                        <UserButton 
                            appearance={{
                                elements: {
                                    avatarBox: 'w-10 h-10',
                                },
                            }}
                        />
                    </SignedIn>
                </div>
            </header>

            <main className="flex-grow px-4 space-y-4 overflow-hidden">
                <h1 className="text-2xl font-bold text-gray-800">Ongoing Lessons</h1>
                <div className="h-[calc(100vh-200px)] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4 pb-4">
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="rounded-lg overflow-hidden shadow-lg">
                            <div className="h-24 bg-[#AADF69]"></div>
                            <div className="h-24 bg-[#F5F5F5] flex flex-col justify-between">
                                <div>
                                    <h4 className="text-sm font-semibold text-[#ADADAD] pt-2 px-2">English</h4>
                                    <h2 className="font-bold text-2xl text-[#385664] px-2">Title</h2>
                                </div>
                                <div className="flex justify-center pb-2">
                                    <button className="bg-[#30B8FB] text-white flex justify-center items-center rounded-full w-32 h-7 px-3 py-2 font-semibold cursor-pointer hover:bg-[#355361] transition-all duration-300">
                                        Enter
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
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
