"use client";

import { useState } from 'react';
import Image from "next/image";
import { ArrowLeft, Home, Camera, User } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export default function UploadPage() {
    const router = useRouter();
    const pathname = usePathname();
    const [file, setFile] = useState<File | null>(null); 

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            console.log("File uploaded:", selectedFile.name);
        }
    };

    const handleNavigation = (route: string) => {
        router.push(route);
    };

    return (
        <div className="h-screen w-full bg-gradient-to-b from-green-50 to-blue-50 flex flex-col">
            <header className="flex items-center p-4">
                <ArrowLeft className="w-6 h-6 text-gray-600" onClick={() => handleNavigation('/dashboard')}/>
                <h1 className="ml-4 text-lg font-semibold text-gray-700">Linguify your conversation</h1>
            </header>

            <main className="flex-grow flex flex-col items-center justify-center px-4 space-y-6">
                <div className="relative w-64 h-64">
                    <Image
                        src="/assets/icon-dark.png"
                        alt="Linguify Logo"
                        layout="fill"
                        objectFit="contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>

                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">Take a picture</h2>
                    <p className="text-gray-600">or add a file</p>
                </div>

                {/* File Input */}
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileChange} // File change handler
                />
                <label
                    htmlFor="file-upload"
                    className="bg-green-400 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-500 transition-colors cursor-pointer"
                >
                    Upload file »
                </label>

                {file && <p className="text-green-600 mt-2">File: {file.name} uploaded!</p>}
            </main>

            <nav className="bg-gray-700 text-white m-5 p-4 flex justify-around items-center rounded-lg">
                <Home
                    className="w-6 h-6 cursor-pointer"
                    onClick={() => handleNavigation('/dashboard')}
                />
                <Camera
                    className={`w-6 h-6 cursor-pointer ${pathname === '/camera' ? 'text-green-500' : 'text-white'}`}
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
