"use client";

import { useState } from 'react';
import { ArrowLeft, Mic} from 'lucide-react';
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
        <div className="h-screen w-full flex flex-col bg-cover bg-center pt-8"
            style={{ backgroundImage: `url('/assets/bgc.png')` }}>
            <header className="flex items-center p-4 relative">
                <ArrowLeft className="absolute left-4 w-6 h-6 text-[#385664] cursor-pointer" onClick={() => handleNavigation('/camera')}/>
                <h1 className="flex-grow text-center ml-4 text-lg font-semibold text-[#385664]">Working with Linguify</h1>
            </header>


            <div className="flex justify-center mt-8 mb-10">
                <button className="bg-gray-600 text-white rounded-full p-6">
                    <Mic className="w-8 h-8" />
                </button>
            </div>
        </div>
    );
}
