"use client";
import { Feedback } from "@/types/api";
import React, { useEffect, useState, useRef } from "react";
import { RetellWebClient } from "retell-client-js-sdk";
import languageAgentMap from './agent_mappings.json';
import languageMappings from './language_mappings.json';
import { useSearchParams } from 'next/navigation'
import { useAuth } from "@clerk/nextjs";

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
    const [feedback, setFeedback] = useState<Feedback>();
    const searchParams = useSearchParams()
    const agentId = languageAgentMap[searchParams.get('locale') as keyof typeof languageAgentMap] as string
    const language = languageMappings[searchParams.get('locale') as keyof typeof languageMappings] as string

    // Reference to the end of the transcript for auto-scrolling
    const transcriptEndRef = useRef<HTMLDivElement>(null);

    // State to hold the image URL
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

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

        retellWebClient.on("call_ended", () => {
            console.log("Call ended");
            isCalling.current = false;
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
            console.log("Call has ended. Logging call id: ")
            console.log(callId.current);
            const convoFeedback = await getFeedback(callId.current);
            console.log(convoFeedback)
            // setFeedback(convoFeedback)
        })

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
                console.log(callId.current);
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
            const response = await fetch("http://localhost:8000/feedback/" + callId);

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

    const endCall = () => {
        retellWebClient.stopCall();
    };

    if (isLoading) {
        return (
            <div className="loading-screen" style={styles.loadingScreen}>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="conversation-container" style={styles.container}>
            {imagePreviewUrl && (
                <div className="image-preview" style={styles.imagePreviewContainer}>
                    <img src={imagePreviewUrl} alt="Uploaded" style={styles.imagePreview} />
                </div>
            )}
            <main className="conversation-main" style={styles.main}>
                <h2 style={styles.title}>Transcript</h2>
                <div className="transcript" style={styles.transcript}>
                    {fullTranscript.map((item, index) => (
                        <div
                            key={index}
                            style={{
                                ...styles.message,
                                ...(item.role === "agent" ? styles.agentMessage : styles.userMessage),
                                opacity: item.isComplete ? 1 : 0.6,
                            }}
                        >
                            <strong>{item.role === "agent" ? "Agent" : "You"}:</strong> {item.content}
                        </div>
                    ))}
                    <div ref={transcriptEndRef} />
                </div>
            </main>
            <div style={styles.endCallButtonContainer}>
                <button onClick={endCall} style={styles.endCallButton}>
                    End Call
                </button>
            </div>
        </div>
    );
};

// Basic inline styles for demonstration purposes

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f0f0f0",
    },
    loadingScreen: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "24px",
        backgroundColor: "#f0f0f0",
    },
    imagePreviewContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "10px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #ccc",
    },
    imagePreview: {
        maxWidth: "100%",
        maxHeight: "200px",
        objectFit: "contain",
    },
    main: {
        flex: 1,
        padding: "20px",
        overflowY: "auto",
    },
    title: {
        textAlign: "center",
        marginBottom: "20px",
        color: "#333",
    },
    transcript: {
        maxHeight: "80vh",
        overflowY: "auto",
        padding: "10px",
        backgroundColor: "#ffffff",
        borderRadius: "5px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    },
    message: {
        marginBottom: "10px",
        padding: "10px",
        borderRadius: "5px",
        maxWidth: "80%",
        color: "#000",
    },
    agentMessage: {
        backgroundColor: "#e1f5fe",
        alignSelf: "flex-start",
    },
    userMessage: {
        backgroundColor: "#c8e6c9",
        alignSelf: "flex-end",
        marginLeft: "auto",
    },
    endCallButtonContainer: {
        position: "fixed",
        bottom: 0,
        width: "100%",
        padding: "10px",
        backgroundColor: "#fff",
        borderTop: "1px solid #ccc",
    },
    endCallButton: {
        width: "100%",
        padding: "15px",
        fontSize: "18px",
        cursor: "pointer",
        borderRadius: "5px",
        border: "none",
        backgroundColor: "#ff4d4f",
        color: "#fff",
    },
};

export default Conversation;
