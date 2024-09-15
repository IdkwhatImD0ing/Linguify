'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';

// Sample ranks array (replace image paths with your actual paths)
const ranks = [
  {
    name: 'Novice',
    description: 'You are just starting to acquire basic knowledge and skills in the area and you’re doing good! Let’s continue building a foundational understanding and practice more.',
    image: '/assets/novice.png', // Replace with the actual path for Novice image
  },
  {
    name: 'Proficient',
    description: 'You are proficient and gaining solid knowledge and skills. Keep up the great work and aim for the next level!',
    image: '/assets/proficient.png', // Replace with the actual path for Proficient image
  },
  {
    name: 'Expert',
    description: 'You have mastered the core knowledge and skills. You are well on your way to being a leader in this area!',
    image: '/assets/expert.png', // Replace with the actual path for Expert image
  },
  {
    name: 'Elite',
    description: 'You are at the top of your game! Your knowledge and skills are exceptional. Continue leading and inspiring others!',
    image: '/assets/elite.png', // Replace with the actual path for Elite image
  },
];

export default function RankPlacement() {
  const router = useRouter();
  const [score, setScore] = useState(0); // Replace with real score logic from backend
  const [currentRank, setCurrentRank] = useState(ranks[0]); // Default to first rank (Novice)

  // Simulate fetching score and determining rank (this should come from your backend)
  useEffect(() => {
    // Example: Replace this with an actual score fetching mechanism
    const backendScore = 75; // Replace with real score from backend
    setScore(backendScore);

    // Determine rank based on score
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
          <span className="text-gray-500">X</span>
        </button>
      </header>

      {/* Image */}
      <div className="w-56 h-56 mb-8 relative">
        <Image
          src={currentRank.image}
          alt={`${currentRank.name} Rank Image`}
          layout="fill"
          objectFit="contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Rank Name */}
      <h1 className="text-4xl font-bold text-[#30B8FB] mb-4">{currentRank.name}</h1>

      {/* Description */}
      <div className="bg-white p-4 rounded-lg shadow-lg text-center max-w-md">
        <p className="text-[#385664] text-lg">{currentRank.description}</p>
      </div>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-4 bg-[#385664] text-[#F5F5F5] shadow-lg py-4 px-8 flex justify-around items-center rounded-full w-full max-w-xs">
        <button onClick={() => router.push('/home')}>
          <Image src="/assets/home-icon.svg" alt="Home" width={24} height={24} />
        </button>
        <button onClick={() => router.push('/camera')}>
          <Image src="/assets/camera-icon.svg" alt="Camera" width={24} height={24} />
        </button>
        <button onClick={() => router.push('/profile')}>
          <Image src="/assets/profile-icon.svg" alt="Profile" width={24} height={24} />
        </button>
      </nav>
    </div>
  );
}
