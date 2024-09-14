"use client";

import { ArrowLeft, TrendingUp } from 'lucide-react';
import { useUser } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import { LabelList, RadialBar, RadialBarChart } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation"; 

// Arrange colors from lightest to darkest
const colorPalette = ['#F5CA31', '#AADF69', '#30B8FB', '#ED8B35', '#385664'];

const chartData = [
    { skill: "Grammar", value: 80, fill: colorPalette[0] },
    { skill: "Listening", value: 70, fill: colorPalette[1] },
    { skill: "Speaking", value: 60, fill: colorPalette[2] },
    { skill: "Vocabulary", value: 75, fill: colorPalette[3] },
    { skill: "Pronunciation", value: 65, fill: colorPalette[4] },
];

const chartConfig = {
    value: {
        label: "Skill Level",
        color: colorPalette[0],
    },
    Grammar: {
        label: "Grammar",
        color: colorPalette[0],
    },
    Listening: {
        label: "Listening",
        color: colorPalette[1],
    },
    Speaking: {
        label: "Speaking",
        color: colorPalette[2],
    },
    Vocabulary: {
        label: "Vocabulary",
        color: colorPalette[3],
    },
    Pronunciation: {
        label: "Pronunciation",
        color: colorPalette[4],
    },
} satisfies ChartConfig;

export default function ProfilePage() {
    const { user } = useUser();
    const router = useRouter();

    const handleNavigation = (route: string) => {
        router.push(route);
    };

    return (
        <BackgroundGradientAnimation className="min-h-screen relative">
            <div className="relative z-10">
                <div className="pt-8 p-4">
                    <header className="flex items-center p-4 relative">
                        <ArrowLeft 
                            className="absolute left-4 w-6 h-6 text-[#385664] cursor-pointer" 
                            onClick={() => handleNavigation('/dashboard')}
                        />
                        <h1 className="flex-grow text-center ml-4 text-lg font-semibold text-[#385664]">
                            Profile
                        </h1>
                    </header>

                    <main className="flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full bg-[#385664] flex items-center justify-center mb-4">
                            {user?.imageUrl ? (
                                <img 
                                    src={user.imageUrl} 
                                    alt="Profile" 
                                    className="w-full h-full rounded-full object-cover" 
                                />
                            ) : (
                                <img 
                                    src="/assets/icon-dark.png" 
                                    alt="Profile" 
                                    className="w-full h-full rounded-full object-cover" 
                                />
                            )}
                        </div>

                        <h2 className="text-2xl font-bold mb-1 text-[#385664]">{user?.fullName || 'Name'}</h2>
                        <p className="text-sm text-gray-600 mb-6">
                            joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'date'}
                        </p>

                        <Card className="w-full max-w-md mb-6 text-[#385664] border-[#385664]">
                            <CardHeader>
                                <CardTitle>Language Progress</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-2">
                                    <div className="flex justify-between mb-1 text-[#385664]">
                                        <span className="text-sm font-medium">Language #1</span>
                                        <span className="text-sm font-medium ">75%</span>
                                    </div>
                                    <Progress value={75} className="h-2 bg-[#AADF69]/20" indicatorClassName="bg-[#AADF69]" />
                                </div>
                                <div>
                                    <div className="flex justify-between mb-1 text-[#385664]">
                                        <span className="text-sm font-medium">Language #2</span>
                                        <span className="text-sm font-medium">50%</span>
                                    </div>
                                    <Progress value={50} className="h-2 bg-[#AADF69]/20" indicatorClassName="bg-[#AADF69]" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="w-full max-w-md text-[#385664] border-none">
                            <CardHeader>
                                <CardTitle className="mt-[-20px]">Overall Statistics</CardTitle>
                                <CardDescription>Your language skills breakdown</CardDescription>
                            </CardHeader>
                            <CardContent className="pb-0 mt-[-20px]">
                                <ChartContainer
                                    config={chartConfig}
                                    className="mx-auto aspect-square max-h-[225px] w-full"
                                >
                                    <RadialBarChart
                                        data={chartData}
                                        startAngle={-90}
                                        endAngle={380}
                                        innerRadius={30}
                                        outerRadius={110}
                                    >
                                        <ChartTooltip
                                            cursor={false}
                                            content={<ChartTooltipContent hideLabel nameKey="skill" />}
                                        />
                                        <RadialBar dataKey="value" background>
                                            <LabelList
                                                position="insideStart"
                                                dataKey="skill"
                                                className="fill-white capitalize mix-blend-luminosity"
                                                fontSize={11}
                                            />
                                        </RadialBar>
                                    </RadialBarChart>
                                </ChartContainer>
                            </CardContent>
                            <CardFooter className="flex-col gap-2 text-sm mb-[-10px]">
                                <div className="flex items-center gap-2 font-medium leading-none">
                                    Improving by 5.2% this month <TrendingUp className="h-4 w-4" />
                                </div>
                                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                                    Based on your recent activities
                                </div>
                            </CardFooter>
                        </Card>
                    </main>
                </div>
            </div>
        </BackgroundGradientAnimation>
    );
}
