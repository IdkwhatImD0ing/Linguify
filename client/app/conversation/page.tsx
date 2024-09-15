"use client";
import { Feedback } from "@/types/api";
import React, { useEffect, useState, useRef } from "react";
import { RetellWebClient } from "retell-client-js-sdk";
import languageAgentMap from "./agent_mappings.json";
import languageMappings from "./language_mappings.json";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import ActionReportComponent from "@/components/ui/action-graph";
import { useRouter } from "next/navigation";
import { ChevronLeft, PhoneOff } from 'lucide-react';


interface RegisterCallResponse {
  access_token: string;
  call_id: string;
}

const retellWebClient = new RetellWebClient();

const Conversation = () => {
  const { userId } = useAuth();
  const isCalling = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fullTranscript, setFullTranscript] = useState<any>([]);
  const callId = useRef("");
  const [feedback, setFeedback] = useState<Feedback | undefined>();
  const [callFinished, setIsCallFinished] = useState<boolean>(false);

  const router = useRouter();

  const searchParams = useSearchParams();
  const agentId = languageAgentMap[
    searchParams.get("locale") as keyof typeof languageAgentMap
  ] as string;
  const language = languageMappings[
    searchParams.get("locale") as keyof typeof languageMappings
  ] as string;

  // Reference to the end of the transcript for auto-scrolling
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // State to hold the image URL
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  console.log(feedback);

  // Initialize the SDK, set up event listeners, and start the call
  useEffect(() => {
    if (!agentId || !language || !userId) {
      // Wait until all data is available
      return;
    }

    // Retrieve the image from local storage
    const storedImage = localStorage.getItem("latestUploadedImage");
    if (storedImage) {
      setImagePreviewUrl(storedImage);
    }

    retellWebClient.on("call_started", () => {
      console.log("Call started");
      isCalling.current = true;
    });

    retellWebClient.on("agent_start_talking", () => {
      console.log("Agent started talking");
    });

    retellWebClient.on("agent_stop_talking", () => {
      console.log("Agent stopped talking");
    });

    retellWebClient.on("update", (update) => {
      setFullTranscript((prevTranscript: any) => {
        if (update.transcript.length === 0) {
          return prevTranscript;
        }

        const newMessage = update.transcript[update.transcript.length - 1];
        const updatedTranscript = [...prevTranscript];

        if (updatedTranscript.length > 0) {
          const lastMessage = updatedTranscript[updatedTranscript.length - 1];

          if (lastMessage.role === newMessage.role) {
            updatedTranscript[updatedTranscript.length - 1] = newMessage;
          } else {
            updatedTranscript.push(newMessage);
          }
        } else {
          updatedTranscript.push(newMessage);
        }

        return updatedTranscript;
      });
    });

    retellWebClient.on("metadata", (metadata) => {
      // Handle metadata if needed
    });

    retellWebClient.on("call_ended", async (e) => {
      console.log("Call has ended. Logging call id: ");
      console.log(callId.current);
      isCalling.current = false;
      router.push(`/actionReport/${callId.current}`)
      // const convoFeedback = await getFeedback(callId.current);
      // setFeedback(convoFeedback);
      setIsCallFinished(true);
    });

    retellWebClient.on("error", (error) => {
      console.error("An error occurred:", error);
      retellWebClient.stopCall();
      setIsLoading(false);
    });

    // Start the call automatically
    const startConversation = async () => {
      try {
        if (isCalling.current || !userId || !agentId || !language) {
          return;
        }
        isCalling.current = true;
        const registerCallResponse = await registerCall(agentId);

        callId.current = registerCallResponse.call_id;
        console.log("---- FOUND CALL ID ------");

        if (registerCallResponse.access_token) {
          await retellWebClient.startCall({
            accessToken: registerCallResponse.access_token,
          });
          setIsLoading(false); // Call has started, loading is done
        }
      } catch (error) {
        console.error("Failed to start call:", error);
        setIsLoading(false); // Even if it fails, stop loading
      }
    };

    startConversation();

    // Cleanup on unmount
    return () => {
      retellWebClient.off("call_started");
      retellWebClient.off("call_ended");
      retellWebClient.off("agent_start_talking");
      retellWebClient.off("agent_stop_talking");
      retellWebClient.off("audio");
      retellWebClient.off("update");
      retellWebClient.off("metadata");
      retellWebClient.off("error");
    };
  }, [agentId, language, userId]);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [fullTranscript]);

  async function registerCall(agentId: string): Promise<RegisterCallResponse> {
    try {
      const response = await fetch("/api/create-web-call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agent_id: agentId,
          metadata: { language, user_id: userId },
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data: RegisterCallResponse = await response.json();
      return data;
    } catch (err) {
      console.error("Error registering call:", err);
      throw new Error("Failed to register call");
    }
  }

  async function getFeedback(callId: string): Promise<any> {
    try {
      const response = await fetch("/api/feedback/" + callId);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      return data;
    } catch (err) {
      console.error("Error getting call data:", err);
      throw new Error("Failed to get call data");
    }
  }

  const endCall = () => {
    retellWebClient.stopCall();
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className= "p-4 flex items-center">
        <button onClick={() => router.back()} className="mr-4">
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-center text-lg font-semibold text-[#385664] flex-grow">Working with Linguify</h1>
      </header>

      {/* Image Preview */}
      {imagePreviewUrl && (
        <div className="p-4">
          <div className="relative w-auto h-40 rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#5C7939] to-[#A8C776] rounded-xl"></div>
            <div className="absolute inset-[3px] rounded-lg overflow-hidden">
              <img
                src={imagePreviewUrl}
                alt="Uploaded"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* Transcript */}
      <main className="flex-1 px-4 py-2 overflow-y-auto space-y-2">
        <div className="text-center font-bold text-gray-700">
          <span>Transcript</span>
        </div>
        {fullTranscript.map((item, index) => (
          <div
            key={index}
            className={`flex ${item.role === "agent" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                item.role === "agent"
                  ? "bg-gray-700 text-white"
                  : "bg-[#30B8FB] text-white flex items-center space-x-2"
              }`}
            >
              {item.role !== "agent" && (
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <span className="text-[#30B8FB] text-xs">👤</span>
                </div>
              )}
              <span>{item.content}</span>
            </div>
          </div>
        ))}
        <div ref={transcriptEndRef} />
      </main>

      {/* End Call Button */}
      <div className="p-4">
        <button
          onClick={endCall}
          className="w-full bg-red-500 text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-red-600"
        >
          <PhoneOff className="w-5 h-5" />
          <span>End Call</span>
        </button>
      </div>
    </div>
  );
};

export default Conversation;
