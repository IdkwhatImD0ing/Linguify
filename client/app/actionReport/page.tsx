'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import Link from 'next/link' 
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts"

interface SkillData {
    rating: string;
    summary: string;
}

interface FeedbackData {
    grammar: SkillData;
    listening: SkillData;
    speaking: SkillData;
    vocabulary: SkillData;
    pronunciation: SkillData;
}

interface ActionReportProps {
    feedback: FeedbackData;
}

const chartData = [
    { skill: "Grammar", value: 80 },
    { skill: "Listening", value: 70 },
    { skill: "Speaking", value: 60 },
    { skill: "Vocabulary", value: 75 },
    { skill: "Pronunciation", value: 65 },
]

export default function ActionReport({ feedback }: ActionReportProps) {
    const [selectedSkill, setSelectedSkill] = useState<keyof FeedbackData>('grammar')

    // Add this check at the beginning of your component
    if (!feedback) {
        return <div>Loading...</div>; // Or any other loading indicator
    }

    return (
        <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4" style={{ backgroundImage: `url('/assets/diamond.png')` }}>
            <Card className="w-full max-w-m border-none">
                <CardHeader className="flex flex-col items-center justify-between pb-4">
                    <CardTitle className="text-[#F5F5F5] text-xl w-full text-center">Action Report</CardTitle>
                    <Link href="/dashboard" className="absolute right-2 top-2">
                        <Button variant="ghost" size="icon">
                            <X className="h-6 w-6 text-[#F5F5F5]" />
                        </Button>
                    </Link>
                </CardHeader>
                
                <CardContent className="space-y-6">
                    {/* Radar Chart */}
                    <div className="bg-opacity-20 rounded-xl p-6 shadow-md">
                        <ResponsiveContainer width="100%" height={300}>
                            <RadarChart data={chartData}>
                                <PolarGrid stroke="#F5F5F5" />
                                <PolarAngleAxis dataKey="skill" tick={{ fill: '#F5F5F5', fontSize: 14 }} />
                                <Radar
                                    name="Skill Level"
                                    dataKey="value"
                                    stroke="#4299e1"
                                    fill="#30B8FB"
                                    fillOpacity={0.6}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Learn More Section */}
                    <div className="rounded-xl p-4">
                        <h3 className="text-lg font-semibold text-[#F5F5F5] mb-4">Learn More</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="text-center p-4 bg-[#355361] rounded-lg">
                                <p className="text-lg text-left font-semibold text-[#F5F5F5]">Ratings</p>
                                <p className="text-4xl text-[#F5F5F5] font-bold">{feedback[selectedSkill]?.rating || '-'}/10</p>
                            </div>
                            <div className="text-center p-4 bg-[#355361] rounded-lg">
                                <p className="text-lg text-left font-semibold text-[#F5F5F5]">Summary</p>
                                <p className="text-lg text-[#F5F5F5]">{feedback[selectedSkill]?.summary || '-'}</p>
                            </div>
                        </div>
                        <div className="mt-4 bg-[#355361] rounded-lg overflow-hidden">
                            {Object.keys(feedback).map((skill, index) => (
                                <div
                                    key={skill}
                                    className={`text-center p-3 text-[#F5F5F5] cursor-pointer hover:bg-[#4a7285] ${
                                        selectedSkill === skill ? 'bg-[#4a7285]' : ''
                                    } ${
                                        index !== Object.keys(feedback).length - 1 ? 'border-b border-[#4a7285]' : ''
                                    }`}
                                    onClick={() => setSelectedSkill(skill as keyof FeedbackData)}
                                >
                                    {skill.charAt(0).toUpperCase() + skill.slice(1)}
                                </div>
                            ))}
                        </div>

                        <Button className="w-full border border-[#F5F5F5] bg-transparent text-white font-semibold rounded-md mt-5 hover:border-[#9bc960]">
                            View Placement Rank
                        </Button>
                    </div>
                    
                </CardContent>
            </Card>
        </div>
    )
}
