'use client';

import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import {
    Home,
    Camera,
    User,
    X
} from "lucide-react";

const ranks = [
    {
    name: 'Novice',
    description: 'You are just starting to acquire basic knowledge and skills in the area and you’re doing good! Let’s continue building a foundational understanding and practice more.',
    image: '/assets/novice.png',
    },
    {
        name: 'Proficient',
        description: 'You are proficient and gaining solid knowledge and skills. Keep up the great work and aim for the next level!',
        image: '/assets/proficient.png', 
    },
    {
        name: 'Expert',
        description: 'You have mastered the core knowledge and skills. You are well on your way to being a leader in this area!',
        image: '/assets/expert.png',
    },
    {
        name: 'Elite',
        description: 'You are at the top of your game! Your knowledge and skills are exceptional. Continue leading and inspiring others!',
        image: '/assets/elite.png',
    },
];

export default function RankPlacement() {
    const pathname = usePathname();
    const router = useRouter();
    const [score, setScore] = useState(0); 
    const [currentRank, setCurrentRank] = useState(ranks[0]); 
    const handleNavigation = (route: string) => {
        router.push(route);
    };

    useEffect(() => {
        const backendScore = 75; 
        setScore(backendScore);

        if (backendScore < 25) {
        setCurrentRank(ranks[0]); // Novice
        } else if (backendScore >= 25 && backendScore < 50) {
        setCurrentRank(ranks[1]); // Proficient
        } else if (backendScore >= 50 && backendScore < 75) {
        setCurrentRank(ranks[2]); // Expert
        } else if (backendScore >= 75) {
        setCurrentRank(ranks[3]); // Elite
        }
    }, []);

    return (
        <div className="h-screen w-full flex flex-col bg-[#F5F5F5] items-center justify-center p-4 relative">
        <header className="absolute top-4 right-4">
            <button onClick={() => router.push('/dashboard')}>
                <X className="w-6 h-6 text-gray-500" />
            </button>
        </header>

        <div className="w-60 h-60 mb-8 relative">
            <Image
            src={currentRank.image}
            alt={`${currentRank.name} Rank Image`}
            layout="fill"
            objectFit="contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
        </div>

        <h1 className="text-5xl font-bold text-[#30B8FB] mb-4">{currentRank.name}</h1>

        <div className="bg-white p-4 rounded-lg shadow-lg text-center max-w-md">
            <p className="text-[#385664] text-md">{currentRank.description}</p>
        </div>

        <nav className="fixed bottom-3 left-10 right-10 bg-[#385664] text-[#F5F5F5] shadow-lg py-4 flex justify-around items-center rounded-full">
            <Home
            className={`w-9 h-9 cursor-pointer ${
                pathname === "/dashboard" ? "text-[#AADF69]" : "text-white"
            }`}
            onClick={() => handleNavigation("/dashboard")}
            />
            <Camera
            className={`w-9 h-9 cursor-pointer ${
                pathname === "/camera" ? "text-[#AADF69]" : "text-white"
            }`}
            onClick={() => handleNavigation("/camera")}
            />
            <User
            className={`w-9 h-9 cursor-pointer ${
                pathname === "/profile" ? "text-[#AADF69]" : "text-white"
            }`}
            onClick={() => handleNavigation("/profile")}
            />
        </nav>
        </div>
    );
}
