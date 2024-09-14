"use client";

import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useState } from 'react';
import Image from "next/image";
import { ArrowLeft, Home, Camera, User, Globe } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function UploadPage() {
    const router = useRouter();
    const pathname = usePathname();
    const [file, setFile] = useState<File | null>(null);
    const [language, setLanguage] = useState('en');

    const convertBlobToBase64 = async (blob: any) => {
        return await blobToBase64(blob);
    }
    
    const blobToBase64 = (blob: any) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
    
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const b64 = await convertBlobToBase64(selectedFile);
            console.log(b64);
            console.log("File uploaded:", selectedFile.name);
        }
    };

    const handleNavigation = (route: string) => {
        router.push(route);
    };

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(e.target.value);
        // Here you would typically update the app's language setting
        // For example: updateAppLanguage(e.target.value)
    };

    const handleStartCall = () => {
        // Here you would implement the logic to start the call
        // For example: startBackendCall()
        console.log("Starting call to backend...");
    };

    return (
        <div className="h-screen w-full flex flex-col bg-cover bg-center pt-8"
            style={{ backgroundImage: `url('/assets/bgc.png')` }}>
            <header className="flex flex-col items-center justify-between p-4 relative">
                <div className="flex items-center justify-between w-full">
                    <ArrowLeft className="w-6 h-6 text-[#385664] cursor-pointer" onClick={() => handleNavigation('/dashboard')}/>
                    <h1 className="text-center text-lg font-semibold text-[#385664] flex-grow">Linguify your conversation</h1>                
                </div>
                
                <div className="flex items-center mt-2">
                    <Globe className="w-5 h-5 text-[#385664] mr-2" />
                    <select
                        value={language}
                        onChange={handleLanguageChange}
                        className="bg-transparent text-[#385664] border border-[#385664] rounded-md px-2 py-1 text-sm"
                    >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="zh">中文</option>
                        <option value="ko">한국어</option>
                        <option value="ja">日本語</option>
                        <option value="ar">العربية</option>
                        <option value="hi">हिन्दी</option>
                        <option value="pt">Português</option>
                        <option value="ru">Русский</option>
                        <option value="it">Italiano</option>
                    </select>
                </div>
            </header>

            <main className="flex-grow flex flex-col items-center justify-center px-4 space-y-6">
                <label 
                    htmlFor="file-upload" 
                    className={cn(
                        "cursor-pointer",
                        "relative group rounded-xl p-1",
                        "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-[#AADF69] before:to-[#30B8FB] before:opacity-0 before:transition-opacity before:duration-500",
                        "hover:before:opacity-100"
                    )}
                >
                    <div className="relative z-10 bg-white rounded-xl p-6 flex flex-col items-center">
                        <div className="relative w-40 h-40 mb-4">
                            <Image
                                src="/assets/icon-dark.png"
                                alt="Linguify Logo"
                                layout="fill"
                                objectFit="contain"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-[#385664]">Take a picture</h2>
                            <p className="text-[#385664] font-bold">or add a file</p>
                        </div>
                    </div>
                </label>

                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*"
                />

                {file ? (
                    <button
                        onClick={handleStartCall}
                        className="bg-[#AADF69] text-white px-14 py-3 rounded-full text-lg font-semibold hover:bg-green-500 transition-colors cursor-pointer"
                    >
                        Start call »
                    </button>
                ) : (
                    <p className="text-[#385664]">Upload a file to start the call</p>
                )}

                {file && <p className="text-[#3F3F44] mt-2">File: {file.name} uploaded!</p>}
            </main>

            <nav className="bg-[#385664] text-[#F5F5F5] shadow-lg my-3 mx-10 py-4 flex justify-around items-center rounded-full">
                <Home
                    className="w-9 h-9 cursor-pointer"
                    onClick={() => handleNavigation('/dashboard')}
                />
                <Camera
                    className={`w-9 h-9 cursor-pointer ${pathname === '/camera' ? 'text-[#AADF69]' : 'text-white'}`}
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
