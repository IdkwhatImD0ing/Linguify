"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";  
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { Feedback } from "@/types/api";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

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
  feedback: Feedback;
}

export const ActionReportComponent: React.FC<ActionReportProps> = ({
  feedback,
}) => {
  const [selectedSkill, setSelectedSkill] = useState<string>("Grammar");
  const router = useRouter();  // Add this line

  const data = feedback ? JSON.parse(feedback) as Feedback : undefined;

  let chartData = [
    { skill: "Grammar", value: data?.grammarRating, summary: data?.grammarSummary },
    { skill: "Coherence", value: data?.coherenceRating, summary: data?.coherenceSummary },
    { skill: "Fluency", value: data?.fluencyRating, summary: data?.fluencySummary },
    { skill: "Vocabulary", value: data?.vocabularyRating, summary: data?.vocabularySummary },
    { skill: "Engagement", value: data?.engagementRating, summary: data?.engagementSummary },
  ];

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url('/assets/diamond.png')` }}
    >
      <Card className="w-full max-w-4xl border-none">
        <CardHeader className="flex flex-col items-center justify-between">
          <CardTitle className="text-[#355361] text-md w-full text-center">
            Action Report
          </CardTitle>
          <Link href="/dashboard" className="absolute right-2 top-2">
            <Button variant="ghost" size="icon">
              <X className="h-5 w-5 text-[#355361]" />
            </Button>
          </Link>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Radar Chart */}
          <div className="bg-opacity-20 rounded-xl shadow-md width-full">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={chartData}>
                <PolarGrid stroke="#F5F5F5" />
                <PolarAngleAxis
                  dataKey="skill"
                  tick={{ fill: "#F5F5F5", fontSize: 14 }}
                />
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
          <div className="rounded-xl">
            <h3 className="text-lg font-semibold text-[#F5F5F5] mb-4">
              Learn More
            </h3>
            <div className="flex">
              {/* Skills list on the left */}
              <div className="w-1/3 bg-[#355361] rounded-lg overflow-hidden mr-4">
                {chartData.map((skill, index) => (
                  <div
                    key={index}
                    className={`text-center p-3 text-[#F5F5F5] cursor-pointer ${
                      selectedSkill === skill.skill ? "bg-[#4a7285]" : ""
                    }`}
                    onClick={() => setSelectedSkill(skill.skill)}
                  >
                    {skill.skill}
                  </div>
                ))}
              </div>

              {/* Rating and Summary on the right */}
              <div className="w-2/3 flex flex-col gap-2">
                <div className="text-center p-4 bg-[#355361] rounded-lg">
                  <p className="text-md text-left font-semibold text-[#F5F5F5]">
                    Ratings
                  </p>
                  <p className="text-sm text-[#F5F5F5] font">
                    {chartData.find(skill => skill.skill === selectedSkill)?.value || "-"} / 10
                  </p>
                </div>
                <div className="text-center p-4 bg-[#355361] rounded-lg flex-grow">
                  <p className="text-lg text-left font-semibold text-[#F5F5F5]">
                    Summary
                  </p>
                  <p className="text-xs text-[#F5F5F5] text-left">
                    {chartData.find(skill => skill.skill === selectedSkill)?.summary || "-"}
                  </p>
                </div>
              </div>
            </div>

            <HoverBorderGradient
              containerClassName="mt-5 flex justify-center w-full"
              className="w-full"
              as="button"
              from="#9bc960"
              to="#F5F5F5"
              onClick={() => router.push('/rank')}  // Add this onClick handler
            >
              <div className="w-full py-2 rounded-md flex items-center justify-center"> 
                <span className="font-semibold text-white">
                  View Placement Rank
                </span>
              </div>
            </HoverBorderGradient>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
