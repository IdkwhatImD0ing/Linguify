'use client';

import { useUser } from "@clerk/nextjs";
import * as Avatar from "@radix-ui/react-avatar";
import { Box, Heading, Card, CardBody, Text, Stack, StackDivider, Badge, Progress } from '@chakra-ui/react';
import { ArrowLeft, Home, Camera, User, Settings, LogOut, Book, Award, Activity } from "lucide-react";
import { useRouter, usePathname } from 'next/navigation';

export default function ProfilePage() {
    const router = useRouter();
    const { user } = useUser();
    const pathname = usePathname();

    const handleNavigation = (route: string) => {
        router.push(route);
    };

    return (
        <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
            <Box className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <Heading as="h1" size="xl">Profile</Heading>
            <Stack direction="row" spacing={4}>
                <button className="bg-gray-200 p-2 rounded-full">
                <Settings className="h-4 w-4" />
                </button>
                <button className="bg-gray-200 p-2 rounded-full">
                <LogOut className="h-4 w-4" />
                </button>
            </Stack>
            </Box>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Stack spacing={6} divider={<StackDivider />}>

            {/* Profile Card */}
            <Card>
                <CardBody>
                <Stack spacing={4} align="center">
                    <Avatar.Root className="inline-flex items-center justify-center align-middle overflow-hidden rounded-full bg-gray-200 w-24 h-24">
                    <Avatar.Image
                        className="w-full h-full object-cover"
                        src={user?.profileImageUrl}
                        alt={user?.firstName || "User"}
                    />
                    <Avatar.Fallback className="text-white font-bold">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </Avatar.Fallback>
                    </Avatar.Root>
                    <Box>
                    <Heading size="lg">{user?.firstName} {user?.lastName}</Heading>
                    <Text>Joined {new Date(user?.createdAt).toLocaleDateString()}</Text>
                    <Stack direction="row" spacing={2} mt={2}>
                        <Badge colorScheme="blue">English</Badge>
                        <Badge colorScheme="green">Spanish</Badge>
                        <Badge colorScheme="purple">French</Badge>
                    </Stack>
                    </Box>
                </Stack>
                </CardBody>
            </Card>

            {/* Language Progress */}
            <Card>
                <CardBody>
                <Heading size="md" mb={4}>Language Progress</Heading>
                <Stack spacing={4}>
                    <Box>
                    <Text>Spanish</Text>
                    <Progress colorScheme="blue" size="sm" value={60} />
                    </Box>
                    <Box>
                    <Text>French</Text>
                    <Progress colorScheme="green" size="sm" value={35} />
                    </Box>
                    <Box>
                    <Text>German</Text>
                    <Progress colorScheme="purple" size="sm" value={10} />
                    </Box>
                </Stack>
                </CardBody>
            </Card>

            {/* Recent Activity */}
            <Card>
                <CardBody>
                <Heading size="md" mb={4}>Recent Activity</Heading>
                <Stack spacing={4}>
                    <Box display="flex" alignItems="center">
                    <Book className="h-5 w-5 mr-3 text-blue-500" />
                    <Text>Completed Spanish Lesson 5 - 2 hours ago</Text>
                    </Box>
                    <Box display="flex" alignItems="center">
                    <Award className="h-5 w-5 mr-3 text-yellow-500" />
                    <Text>Earned "Early Bird" badge - Yesterday</Text>
                    </Box>
                    <Box display="flex" alignItems="center">
                    <Activity className="h-5 w-5 mr-3 text-green-500" />
                    <Text>7-day streak achieved - 3 days ago</Text>
                    </Box>
                </Stack>
                </CardBody>
            </Card>
            
            </Stack>
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
