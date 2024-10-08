"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { ActionReportComponent } from "@/components/ui/action-graph";
import { Feedback } from "@/types/api";
import { useAuth } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

async function getFeedback(callId: string, userId: string, language: string): Promise<Feedback> {
  try {
    const response = await fetch("/api/submit/" + callId, {
      method: "POST",
      body: JSON.stringify({
        userId: userId,
        language: language
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error getting call data:", err);
    throw new Error("Failed to get call data");
  }
}

export default function ActionReport({
  params,
}: {
  params: {
    callId: string;
  };
}) {
  const { callId } = params;
  const { userId } = useAuth();
  const [feedback, setFeedback] = useState<any>();

  const searchParams = useSearchParams();
  const language = searchParams.get("locale");

    useEffect(() => {
    const fetchData = async () => {
      try {
        const feedback = await getFeedback(callId, userId as string, language as string);
        setFeedback(feedback);
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  }, [setFeedback, callId]);

  return <ActionReportComponent feedback={feedback as Feedback} />;
}
