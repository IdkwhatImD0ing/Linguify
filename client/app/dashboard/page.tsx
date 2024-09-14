"use client";

import Image from "next/legacy/image";
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

    const titles = ["Coffee Shop", "House hunting", "Eating out", "Shopping"];
    
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

            <main className="flex-grow px-4 space-y-4 flex flex-col overflow-hidden">
                <div className="bg-[#F5F5F5] p-4 rounded-lg shadow-md"> 
                    <h2 className="text-xl font-bold text-[#385664]">Daily Challenge 🏆</h2>
                    <p className="text-gray-600 mb-2">Describe a picture to our AI!</p>
                    <button className="bg-[#30B8FB] text-white flex justify-left items-center rounded-full w-18 h-7 px-3 py-3 font-semibold cursor-pointer hover:bg-[#355361] transition-all duration-300">Start!</button>
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Learning Journey</h1>
                <div className="flex-grow overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4 pb-4">
                    {titles.map((title, index) => (
                        <div key={index} className="rounded-lg overflow-hidden shadow-lg">
                            <div className="h-[8.5rem] bg-[#AADF69]"></div>
                            <div className="h-24 bg-[#F5F5F5] flex flex-col justify-between">
                                <div>
                                    <p className="text-[14px] font-semibold text-[#ADADAD] pt-2 px-2">English</p>
                                    <h2 className="font-bold text-xl text-[#385664] px-2">{title}</h2>
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
