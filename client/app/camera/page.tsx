"use client";

import { useState } from 'react';
import Image from "next/image";
import { ArrowLeft, Home, Camera, User } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export default function UploadPage() {
    const router = useRouter();
    const pathname = usePathname();
    const [file, setFile] = useState<File | null>(null); 

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
            const reader = new FileReader();
            reader.onload = (e) => {
              setFile(selectedFile);
            }

            const b64 = await convertBlobToBase64(selectedFile);
            console.log(b64);

            console.log("File uploaded:", selectedFile.name);
        }
    };

    const handleNavigation = (route: string) => {
        router.push(route);
    };

    return (
        <div className="h-screen w-full flex flex-col bg-cover bg-center"
             style={{ backgroundImage: `url('/assets/bgc.png')` }}>
            <header className="flex items-center p-4 relative">
                <ArrowLeft className="absolute left-4 w-6 h-6 text-[#385664] cursor-pointer" onClick={() => handleNavigation('/dashboard')}/>
                <h1 className="flex-grow text-center ml-4 text-lg font-semibold text-[#385664]">Linguify your conversation</h1>
            </header>

            <main className="flex-grow flex flex-col items-center justify-center px-4 space-y-6">
                <div className="relative w-40 h-40">
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

                {/* File Input */}
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileChange} // File change handler
                />
                <label
                    htmlFor="file-upload"
                    className="bg-[#AADF69] text-white px-14 py-3 rounded-full text-lg font-semibold hover:bg-green-500 transition-colors cursor-pointer"
                >
                    Upload file »
                </label>

                {file && <p className="text-[#AADF69] font-bold mt-2">File: {file.name} uploaded!</p>}
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
