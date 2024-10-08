"use client";

import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { database } from "@/lib/firebase/config";
import { ref, query, orderByChild, equalTo, get } from "firebase/database";
import { ActionReportComponent } from "@/components/ui/action-graph";
import { Feedback } from "@/types/api";
import { X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import Image from 'next/image';
import { Progress } from "@/components/ui/progress"

export default function History({
  params,
}: {
  params: {
    interactionId: string;
  };
}) {
  const { interactionId } = params;
  const { userId } = useAuth();
  const [history, setHistory] = useState<any>();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const historyRef = ref(
          database,
          `interaction/${userId}/${interactionId}`
        );
        const snapshot = await get(historyRef);

        setHistory(snapshot.val());
      } catch (e) {
        console.log(e);
      }
    };

    fetchHistory();
  }, [userId, setHistory, history]);

  const [selectedSkill, setSelectedSkill] = useState<string>("Grammar");

  const data = history ? history.feedback : null;

  let chartData = [
    {
      skill: "Grammar",
      value: data?.grammarRating,
      summary: data?.grammarSummary,
    },
    {
      skill: "Coherence",
      value: data?.coherenceRating,
      summary: data?.coherenceSummary,
    },
    {
      skill: "Fluency",
      value: data?.fluencyRating,
      summary: data?.fluencySummary,
    },
    {
      skill: "Vocabulary",
      value: data?.vocabularyRating,
      summary: data?.vocabularySummary,
    },
    {
      skill: "Engagement",
      value: data?.engagementRating,
      summary: data?.engagementSummary,
    },
  ];

  return (
    <>
      {history ? (
        <div
          className="min-h-screen bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: `url('/assets/diamond.png')` }}
        >
          <Card className="w-full max-w-4xl border-none">
            <CardHeader className="flex flex-col items-center justify-between">
              <CardTitle className="text-[#355361] text-xl mb-4 w-full text-center">
                {data.title}
              </CardTitle>
              {/* <h1>{data.language}</h1> */}
              <Link href="/dashboard" className="absolute right-2 top-2">
                <Button variant="ghost" size="icon">
                  <X className="h-5 w-5 text-[#355361]" />
                </Button>
              </Link>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Radar Chart */}
              <div className="bg-opacity-20 rounded-xl shadow-md width-full items-center justify-center align-middle">
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
                        {chartData.find(
                          (skill) => skill.skill === selectedSkill
                        )?.value || "-"}{" "}
                        / 10
                      </p>
                    </div>
                    <div className="text-center p-4 bg-[#355361] rounded-lg flex-grow">
                      <p className="text-lg text-left font-semibold text-[#F5F5F5]">
                        Summary
                      </p>
                      <p className="text-xs text-[#F5F5F5] text-left">
                        {chartData.find(
                          (skill) => skill.skill === selectedSkill
                        )?.summary || "-"}
                      </p>
                    </div>
                  </div>
                </div>

     
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="loading-screen flex items-center justify-center h-screen bg-[#f5f5f5]">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <Image
              src="/assets/icon-dark.png"
              alt="Linguify Logo"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <div className="w-48 mx-auto">
            <Progress value={99} className="h-2" />
          </div>
          <p className="text-[#385664] font-semibold mt-2">Loading...</p>
        </div>
      </div>
      )}
    </>
    // <ActionReportComponent />
  );
}
