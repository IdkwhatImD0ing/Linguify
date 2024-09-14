"use client";

import { ArrowLeft } from 'lucide-react'
import { Progress, ChakraProvider } from "@chakra-ui/react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
    const { user } = useUser()
    const router = useRouter()

    const handleNavigation = (route: string) => {
        router.push(route)
    }

    return (
        <ChakraProvider>
        <div className="min-h-screen bg-gray-100 p-4">
        <header className="flex items-center p-4 relative">
                <ArrowLeft 
                    className="absolute left-4 w-6 h-6 text-[#385664] cursor-pointer" 
                    onClick={() => handleNavigation('/dashboard')}
                />
                <h1 className="flex-grow text-center ml-4 text-lg font-semibold text-[#385664]">Profile</h1>
            </header>

        <main className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center mb-4">
            {user?.imageUrl ? (
                <img src={user.imageUrl} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
                <svg className="w-16 h-16 text-gray-600" viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 95C74.8528 95 95 74.8528 95 50C95 25.1472 74.8528 5 50 5C25.1472 5 5 25.1472 5 50C5 74.8528 25.1472 95 50 95Z" />
                <path d="M65 45C65 45 60 40 50 40C40 40 35 45 35 45" stroke="white" strokeWidth="4" strokeLinecap="round" />
                <circle cx="35" cy="30" r="5" fill="white" />
                <circle cx="65" cy="30" r="5" fill="white" />
                <path d="M40 60C40 60 45 70 50 70C55 70 60 60 60 60" stroke="white" strokeWidth="4" strokeLinecap="round" />
                </svg>
            )}
            </div>

            <h2 className="text-2xl font-bold mb-1">{user?.fullName || 'Name'}</h2>
            <p className="text-sm text-gray-600 mb-6">joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'date'}</p>

            <div className="w-full max-w-md space-y-4 mb-6">
            <h3 className="text-lg font-semibold mb-2">Language Progress</h3>
            <div>
                <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Language #1</span>
                <span className="text-sm font-medium">75%</span>
                </div>
                <Progress value={75} size="sm" colorScheme="blue" />
            </div>
            <div>
                <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Language #2</span>
                <span className="text-sm font-medium">50%</span>
                </div>
                <Progress value={50} size="sm" colorScheme="green" />
            </div>
            </div>

            <div className="w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">Overall Statistic</h3>
            <div className="bg-gray-700 p-4 rounded-lg">
                <svg viewBox="0 0 200 200" className="w-full h-auto">
                <polygon points="100,10 190,80 160,190 40,190 10,80" fill="none" stroke="white" strokeWidth="0.5" />
                <polygon points="100,40 160,80 140,150 60,150 40,80" fill="none" stroke="white" strokeWidth="0.5" />
                <polygon points="100,70 130,90 120,130 80,130 70,90" fill="none" stroke="white" strokeWidth="0.5" />
                <polygon points="100,100 100,10 190,80 100,100 160,190 100,100 40,190 100,100 10,80" fill="none" stroke="white" strokeWidth="0.5" />
                <polygon points="100,10 145,60 160,120 120,170 80,170 40,120 55,60" fill="#3B82F6" fillOpacity="0.6" />
                <text x="100" y="5" textAnchor="middle" fill="white" fontSize="8">Grammar</text>
                <text x="195" y="85" textAnchor="start" fill="white" fontSize="8">Listening</text>
                <text x="165" y="195" textAnchor="middle" fill="white" fontSize="8">Speaking</text>
                <text x="35" y="195" textAnchor="middle" fill="white" fontSize="8">Vocabulary</text>
                <text x="5" y="85" textAnchor="end" fill="white" fontSize="8">Pronunciation</text>
                </svg>
            </div>
            </div>
        </main>
        </div>
        </ChakraProvider>
    )
}